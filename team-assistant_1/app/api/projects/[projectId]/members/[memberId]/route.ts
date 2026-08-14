import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { members, projectUsers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Errors, toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import { requireProjectOwner } from "@/lib/projects/access";

type Params = { params: Promise<{ projectId: string; memberId: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId, memberId } = await params;
    await requireProjectOwner(projectId, user.id);
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

    await db.transaction(async (tx) => {
      // tasks.assigneeId becomes NULL through the existing FK rule.
      await tx.delete(members).where(eq(members.id, memberId));
      if (existing.userId && linkedMembership?.role === "MEMBER") {
        await tx
          .delete(projectUsers)
          .where(
            and(
              eq(projectUsers.projectId, projectId),
              eq(projectUsers.userId, existing.userId),
              eq(projectUsers.role, "MEMBER")
            )
          );
      }
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
