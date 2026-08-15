import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { DEFAULT_AVATAR_EMOJI } from "@/lib/avatar";
import { db } from "@/lib/db/client";
import { tasks } from "@/lib/db/schema";
import { toErrorResponse } from "@/lib/errors";
import { loadProjectMembersWithAvatars } from "@/lib/members/query";
import { requireProjectAccess } from "@/lib/projects/access";
import type { ContributionBreakdownMember, TaskStatus } from "@/lib/types";
import { calculateContributionBreakdown } from "@/services/contribution/calculate";
import {
  groupContributorRowsByTask,
  loadTaskContributorRows,
} from "@/services/tasks/contributors";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    await requireProjectAccess(projectId, user.id);

    const [memberRows, taskRows] = await Promise.all([
      loadProjectMembersWithAvatars(projectId),
      db
        .select()
        .from(tasks)
        .where(and(eq(tasks.projectId, projectId), eq(tasks.isDeleted, false))),
    ]);
    const contributorRows = await loadTaskContributorRows(
      db,
      taskRows.map((task) => task.id)
    );
    const contributorsByTask = groupContributorRowsByTask(contributorRows);
    const avatarByMemberId = new Map(
      memberRows.map(({ member, avatarEmoji }) => [member.id, avatarEmoji])
    );

    const members: ContributionBreakdownMember[] = calculateContributionBreakdown(
      memberRows.map(({ member }) => ({ id: member.id, name: member.name })),
      taskRows.map((task) => ({
        id: task.id,
        title: task.title,
        assigneeId: task.assigneeId,
        contributors: contributorsByTask.get(task.id),
        status: task.status as TaskStatus,
        importance: task.importance,
        difficulty: task.difficulty,
        workload: task.workload,
      }))
    )
      .map((member) => ({
        ...member,
        avatarEmoji:
          avatarByMemberId.get(member.memberId) ?? DEFAULT_AVATAR_EMOJI,
      }))
      .sort(
        (left, right) =>
          right.percentage - left.percentage ||
          left.name.localeCompare(right.name, "ko")
      );

    return NextResponse.json({ members });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
