import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { contributionSnapshots, tasks } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { toErrorResponse } from "@/lib/errors";
import { calculateContribution, type ContributionResult } from "@/services/contribution/calculate";
import type { MemberContribution, TaskStatus } from "@/lib/types";
import { requireUser } from "@/lib/auth/session";
import { requireProjectAccess } from "@/lib/projects/access";
import { loadProjectMembersWithAvatars } from "@/lib/members/query";
import { DEFAULT_AVATAR_EMOJI } from "@/lib/avatar";
import {
  groupContributorRowsByTask,
  loadTaskContributorRows,
} from "@/services/tasks/contributors";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    await requireProjectAccess(projectId, user.id);

    const [memberRows, taskRows, snapshots] = await Promise.all([
      loadProjectMembersWithAvatars(projectId),
      db
        .select()
        .from(tasks)
        .where(and(eq(tasks.projectId, projectId), eq(tasks.isDeleted, false))),
      db
        .select()
        .from(contributionSnapshots)
        .where(eq(contributionSnapshots.projectId, projectId))
        .orderBy(desc(contributionSnapshots.createdAt))
        .limit(2),
    ]);
    const contributorRows = await loadTaskContributorRows(
      db,
      taskRows.map((task) => task.id)
    );
    const contributorsByTask = groupContributorRowsByTask(contributorRows);

    const current = calculateContribution(
      memberRows.map(({ member }) => ({ id: member.id, name: member.name })),
      taskRows.map((t) => ({
        assigneeId: t.assigneeId,
        contributors: contributorsByTask.get(t.id),
        status: t.status as TaskStatus,
        importance: t.importance,
        difficulty: t.difficulty,
        workload: t.workload,
      }))
    );

    let latestByMember: Map<string, number> | null = null;
    let previousByMember: Map<string, number> | null = null;
    if (snapshots.length >= 2) {
      try {
        const latest = JSON.parse(snapshots[0].scores) as ContributionResult[];
        const previous = JSON.parse(snapshots[1].scores) as ContributionResult[];
        latestByMember = new Map(latest.map((p) => [p.memberId, p.percentage]));
        previousByMember = new Map(previous.map((p) => [p.memberId, p.percentage]));
      } catch {
        latestByMember = null;
        previousByMember = null;
      }
    }

    const avatarByMemberId = new Map(
      memberRows.map(({ member, avatarEmoji }) => [member.id, avatarEmoji])
    );
    const result: MemberContribution[] = current.map((c) => ({
      memberId: c.memberId,
      name: c.name,
      rawScore: c.rawScore,
      percentage: c.percentage,
      deltaPercentage:
        latestByMember?.has(c.memberId) && previousByMember?.has(c.memberId)
        ? Math.round(
            (latestByMember.get(c.memberId)! - previousByMember.get(c.memberId)!) * 10
          ) / 10
        : null,
      avatarEmoji: avatarByMemberId.get(c.memberId) ?? DEFAULT_AVATAR_EMOJI,
    }));

    return NextResponse.json({
      contribution: result,
      lastSnapshotAt: snapshots[0]?.createdAt.getTime() ?? null,
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
