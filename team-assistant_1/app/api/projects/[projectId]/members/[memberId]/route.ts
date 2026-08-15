import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { members, projectUsers, taskContributors, tasks } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { Errors, toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import {
  assertProjectIsActive,
  requireProjectOwner,
} from "@/lib/projects/access";
import {
  groupContributorRowsByTask,
  normalizeContributorShares,
  replaceTaskContributors,
} from "@/services/tasks/contributors";

type Params = { params: Promise<{ projectId: string; memberId: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId, memberId } = await params;
    const project = await requireProjectOwner(projectId, user.id);
    assertProjectIsActive(project);
    const [existing] = await db
      .select()
      .from(members)
      .where(and(eq(members.id, memberId), eq(members.projectId, projectId)));
    if (!existing) throw Errors.notFound("팀원");

    let linkedMembership: typeof projectUsers.$inferSelect | undefined;
    if (existing.userId) {
      [linkedMembership] = await db
        .select()
        .from(projectUsers)
        .where(
          and(
            eq(projectUsers.projectId, projectId),
            eq(projectUsers.userId, existing.userId)
          )
        );
    }
    if (linkedMembership?.role === "OWNER") throw Errors.cannotDeleteOwner();

    const affectedContributorRows = await db
      .select({ taskId: taskContributors.taskId })
      .from(taskContributors)
      .where(eq(taskContributors.memberId, memberId));
    const affectedTaskIds = [...new Set(affectedContributorRows.map((row) => row.taskId))];

    await db.transaction(async (tx) => {
      // tasks.assigneeId becomes NULL through the existing FK rule.
      await tx.delete(members).where(eq(members.id, memberId)).run();
      if (affectedTaskIds.length > 0) {
        const remainingRows = await tx
          .select()
          .from(taskContributors)
          .where(inArray(taskContributors.taskId, affectedTaskIds))
          .all();
        const remainingByTask = groupContributorRowsByTask(remainingRows);
        for (const taskId of affectedTaskIds) {
          const normalized = normalizeContributorShares(
            remainingByTask.get(taskId) ?? []
          );
          await replaceTaskContributors(tx, taskId, normalized);
          await tx
            .update(tasks)
            .set({
              assigneeId: normalized.length === 1 ? normalized[0].memberId : null,
              updatedAt: new Date(),
            })
            .where(eq(tasks.id, taskId))
            .run();
        }
      }
      if (existing.userId && linkedMembership?.role === "MEMBER") {
        await tx
          .delete(projectUsers)
          .where(
            and(
              eq(projectUsers.projectId, projectId),
              eq(projectUsers.userId, existing.userId),
              eq(projectUsers.role, "MEMBER")
            )
          )
          .run();
      }
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
