import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { members } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { AppError, Errors, toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import { requireProjectAccess } from "@/lib/projects/access";
import { toMemberDTO } from "@/lib/memberDto";

type Params = { params: Promise<{ projectId: string; memberId: string }> };

// Links (or unlinks) this member "name tag" to the requesting user's
// account, so a teammate who joins via invite code can take over a name
// someone else already typed in - Tasks/Evidence tied to the member id
// carry over untouched since only member.userId changes.
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId, memberId } = await params;
    await requireProjectAccess(projectId, user.id);
    const [existing] = await db
      .select()
      .from(members)
      .where(and(eq(members.id, memberId), eq(members.projectId, projectId)));
    if (!existing) throw Errors.notFound("팀원");

    const body = await req.json().catch(() => ({}));
    const claim = body.claim === true;

    if (claim) {
      if (existing.userId && existing.userId !== user.id) {
        throw new AppError(
          "MEMBER_ALREADY_CLAIMED",
          "이미 다른 사용자와 연결된 팀원입니다.",
          409
        );
      }
      await db.transaction(async (tx) => {
        // A user can only be linked to one member per project - release
        // any other name tag this user previously claimed here first.
        await tx
          .update(members)
          .set({ userId: null })
          .where(and(eq(members.projectId, projectId), eq(members.userId, user.id)));
        await tx.update(members).set({ userId: user.id }).where(eq(members.id, memberId));
      });
    } else {
      if (existing.userId !== user.id) {
        throw new AppError(
          "NOT_YOUR_MEMBER",
          "본인이 연결한 팀원만 연결 해제할 수 있습니다.",
          403
        );
      }
      await db.update(members).set({ userId: null }).where(eq(members.id, memberId));
    }

    const [updated] = await db.select().from(members).where(eq(members.id, memberId));
    return NextResponse.json({ member: toMemberDTO(updated, user.id) });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId, memberId } = await params;
    await requireProjectAccess(projectId, user.id);
    const [existing] = await db
      .select()
      .from(members)
      .where(and(eq(members.id, memberId), eq(members.projectId, projectId)));
    if (!existing) throw Errors.notFound("팀원");

    // Tasks assigned to this member become unassigned (assigneeId -> NULL)
    // via the ON DELETE SET NULL foreign key defined in the schema.
    await db.delete(members).where(eq(members.id, memberId));
    return NextResponse.json({ ok: true });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
