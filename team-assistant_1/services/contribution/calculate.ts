import type { TaskStatus } from "@/lib/types";

// --------------------------------------------------------------------------
// Deterministic contribution scoring. The AI never decides percentages -
// this pure, unit-testable module is the single source of truth for the
// formulas described in the spec:
//
//   TaskScore        = importance*0.3 + difficulty*0.3 + workload*0.4
//   CurrentTaskScore  = TaskScore * StatusMultiplier
//   MemberScore       = sum(CurrentTaskScore) over that member's tasks
//   ContributionRate  = MemberScore / sum(all MemberScore) * 100
// --------------------------------------------------------------------------

export const STATUS_MULTIPLIER: Record<TaskStatus, number> = {
  TODO: 0.2,
  IN_PROGRESS: 0.6,
  DONE: 1.0,
};

export interface ScorableTask {
  assigneeId: string | null;
  contributors?: { memberId: string; share: number }[];
  status: TaskStatus;
  importance: number;
  difficulty: number;
  workload: number;
}

export interface ContributionMember {
  id: string;
  name: string;
}

export interface ContributionResult {
  memberId: string;
  name: string;
  rawScore: number;
  percentage: number;
}

export interface BreakdownScorableTask extends ScorableTask {
  id: string;
  title: string;
}

export interface ContributionBreakdownResult extends ContributionResult {
  tasks: Array<{
    taskId: string;
    title: string;
    status: TaskStatus;
    importance: number;
    difficulty: number;
    workload: number;
    taskScore: number;
    statusMultiplier: number;
    contributorShare: number;
    memberTaskScore: number;
  }>;
}

export function computeTaskScore(t: {
  importance: number;
  difficulty: number;
  workload: number;
}): number {
  return t.importance * 0.3 + t.difficulty * 0.3 + t.workload * 0.4;
}

export function computeCurrentTaskScore(t: ScorableTask): number {
  return computeTaskScore(t) * STATUS_MULTIPLIER[t.status];
}

/**
 * Distributes rounded-to-1-decimal percentages using the largest-remainder
 * method so they sum to exactly the rounded total (normally 100.0) instead
 * of drifting due to independent per-item rounding.
 */
function roundPercentagesTo1Decimal(
  percentages: number[]
): number[] {
  if (percentages.length === 0) return [];
  const totalPct = percentages.reduce((a, b) => a + b, 0);
  const targetTenths = Math.round(totalPct * 10);

  const tenths = percentages.map((p) => p * 10);
  const floored = tenths.map(Math.floor);
  const flooredSum = floored.reduce((a, b) => a + b, 0);
  let remainder = targetTenths - flooredSum;

  const order = tenths
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);

  const result = [...floored];
  for (let k = 0; k < order.length && remainder > 0; k++) {
    result[order[k].i] += 1;
    remainder--;
  }
  // In the unlikely case of negative remainder (over-allocated due to fp
  // noise), pull back from the smallest-fraction items.
  for (let k = order.length - 1; k >= 0 && remainder < 0; k--) {
    result[order[k].i] -= 1;
    remainder++;
  }

  return result.map((v) => Math.round(v) / 10);
}

export function calculateContribution(
  members: ContributionMember[],
  tasks: ScorableTask[]
): ContributionResult[] {
  const { rawScores } = calculateContributionState(members, tasks);
  return buildContributionResults(members, rawScores);
}

/**
 * Returns the same deterministic contribution result plus the exact Task
 * allocations that produced each member's raw score. Both public calculators
 * share calculateContributionState(), so the report and breakdown cannot
 * drift onto different formulas.
 */
export function calculateContributionBreakdown(
  members: ContributionMember[],
  tasks: BreakdownScorableTask[]
): ContributionBreakdownResult[] {
  const { rawScores, allocations } = calculateContributionState(members, tasks);
  const results = buildContributionResults(members, rawScores);

  return results.map((result) => ({
    ...result,
    tasks: allocations
      .filter((allocation) => allocation.memberId === result.memberId)
      .map((allocation) => ({
        taskId: allocation.taskId,
        title: allocation.title,
        status: allocation.status,
        importance: allocation.importance,
        difficulty: allocation.difficulty,
        workload: allocation.workload,
        taskScore: allocation.taskScore,
        statusMultiplier: allocation.statusMultiplier,
        contributorShare: allocation.contributorShare,
        memberTaskScore: allocation.memberTaskScore,
      }))
      .sort(
        (left, right) =>
          right.memberTaskScore - left.memberTaskScore ||
          left.title.localeCompare(right.title, "ko")
      ),
  }));
}

interface TaskAllocation {
  memberId: string;
  taskId: string;
  title: string;
  status: TaskStatus;
  importance: number;
  difficulty: number;
  workload: number;
  taskScore: number;
  statusMultiplier: number;
  contributorShare: number;
  memberTaskScore: number;
}

function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

function calculateContributionState(
  members: ContributionMember[],
  tasks: ScorableTask[]
): { rawScores: Map<string, number>; allocations: TaskAllocation[] } {
  const rawScores = new Map<string, number>();
  for (const m of members) rawScores.set(m.id, 0);
  const allocations: TaskAllocation[] = [];

  for (const t of tasks) {
    const baseTaskScore = computeTaskScore(t);
    const statusMultiplier = STATUS_MULTIPLIER[t.status];
    const currentTaskScore = baseTaskScore * statusMultiplier;
    const breakdownTask = t as Partial<BreakdownScorableTask>;
    if (t.contributors && t.contributors.length > 0) {
      const validContributors = t.contributors.filter(
        (contributor) =>
          rawScores.has(contributor.memberId) &&
          Number.isFinite(contributor.share) &&
          contributor.share > 0
      );
      const shareTotal = validContributors.reduce(
        (sum, contributor) => sum + contributor.share,
        0
      );
      if (shareTotal <= 0) continue;
      for (const contributor of validContributors) {
        const normalizedShare = (contributor.share / shareTotal) * 100;
        const memberTaskScore = currentTaskScore * (normalizedShare / 100);
        rawScores.set(
          contributor.memberId,
          (rawScores.get(contributor.memberId) ?? 0) +
            memberTaskScore
        );
        if (breakdownTask.id && breakdownTask.title) {
          allocations.push({
            memberId: contributor.memberId,
            taskId: breakdownTask.id,
            title: breakdownTask.title,
            status: t.status,
            importance: t.importance,
            difficulty: t.difficulty,
            workload: t.workload,
            taskScore: roundTo2(baseTaskScore),
            statusMultiplier,
            contributorShare: roundTo2(normalizedShare),
            memberTaskScore: roundTo2(memberTaskScore),
          });
        }
      }
      continue;
    }

    // Backwards compatibility: production Tasks created before the
    // task_contributors migration still award 100% to their assignee.
    if (!t.assigneeId || !rawScores.has(t.assigneeId)) continue;
    rawScores.set(
      t.assigneeId,
      (rawScores.get(t.assigneeId) ?? 0) + currentTaskScore
    );
    if (breakdownTask.id && breakdownTask.title) {
      allocations.push({
        memberId: t.assigneeId,
        taskId: breakdownTask.id,
        title: breakdownTask.title,
        status: t.status,
        importance: t.importance,
        difficulty: t.difficulty,
        workload: t.workload,
        taskScore: roundTo2(baseTaskScore),
        statusMultiplier,
        contributorShare: 100,
        memberTaskScore: roundTo2(currentTaskScore),
      });
    }
  }

  return { rawScores, allocations };
}

function buildContributionResults(
  members: ContributionMember[],
  rawScores: Map<string, number>
): ContributionResult[] {
  const total = [...rawScores.values()].reduce((a, b) => a + b, 0);

  const rawPercentages = members.map((m) =>
    total > 0 ? ((rawScores.get(m.id) ?? 0) / total) * 100 : 0
  );
  const roundedPercentages = roundPercentagesTo1Decimal(rawPercentages);

  return members.map((m, i) => ({
    memberId: m.id,
    name: m.name,
    rawScore: Math.round((rawScores.get(m.id) ?? 0) * 100) / 100,
    percentage: roundedPercentages[i],
  }));
}
