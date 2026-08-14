import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { members, projectUsers } from "@/lib/db/schema";
import { Errors, toErrorResponse } from "@/lib/errors";
import { requireProjectOwner } from "@/lib/projects/access";

type Params = { params: Promise<{ projectId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    await requireProjectOwner(projectId, user.id);

    const body = await req.json().catch(() => ({}));
    const memberId = typeof body.memberId === "string" ? body.memberId : "";
    if (!memberId) throw Errors.invalidTransferTarget();

    const [targetMember] = await db
      .select()
      .from(members)
      .where(and(eq(members.id, memberId), eq(members.projectId, projectId)));
    if (!targetMember) throw Errors.notFound("팀원");
    if (!targetMember.userId) {
      throw Errors.invalidTransferTarget(
        "프로젝트 참가를 완료한 팀원에게만 팀장 권한을 양도할 수 있습니다."
      );
    }
    const targetUserId = targetMember.userId;
    if (targetUserId === user.id) {
      throw Errors.invalidTransferTarget("자기 자신에게 팀장 권한을 양도할 수 없습니다.");
    }

    const [targetMembership] = await db
      .select()
      .from(projectUsers)
      .where(
        and(
          eq(projectUsers.projectId, projectId),
          eq(projectUsers.userId, targetUserId)
        )
      );
    if (!targetMembership || targetMembership.role !== "MEMBER") {
      throw Errors.invalidTransferTarget(
        "프로젝트 참가를 완료한 일반 팀원에게만 양도할 수 있습니다."
      );
    }

    await db.transaction(async (tx) => {
      // Normalize any legacy duplicate OWNER rows, then promote exactly one.
      await tx
        .update(projectUsers)
        .set({ role: "MEMBER" })
        .where(
          and(
            eq(projectUsers.projectId, projectId),
            eq(projectUsers.role, "OWNER")
          )
        );
      await tx
        .update(projectUsers)
        .set({ role: "OWNER" })
        .where(
          and(
            eq(projectUsers.projectId, projectId),
            eq(projectUsers.userId, targetUserId)
          )
        );
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
