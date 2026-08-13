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
  const rawScores = new Map<string, number>();
  for (const m of members) rawScores.set(m.id, 0);

  for (const t of tasks) {
    if (!t.assigneeId) continue;
    if (!rawScores.has(t.assigneeId)) continue; // assignee no longer a member
    rawScores.set(
      t.assigneeId,
      (rawScores.get(t.assigneeId) ?? 0) + computeCurrentTaskScore(t)
    );
  }

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
