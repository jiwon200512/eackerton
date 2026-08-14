import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { inviteCodes, projectUsers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { AppError, Errors, toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import { normalizeInviteCode } from "@/lib/projects/inviteCode";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => ({}));
    const rawCode = typeof body.code === "string" ? body.code : "";
    const code = normalizeInviteCode(rawCode);
    if (!code) {
      throw new AppError("EMPTY_CODE", "초대 코드를 입력해주세요.", 400);
    }

    const [invite] = await db
      .select()
      .from(inviteCodes)
      .where(eq(inviteCodes.code, code));
    if (!invite) throw Errors.invalidInviteCode();

    const [existingMembership] = await db
      .select()
      .from(projectUsers)
      .where(
        and(
          eq(projectUsers.projectId, invite.projectId),
          eq(projectUsers.userId, user.id)
        )
      );
    if (!existingMembership) {
      await db
        .insert(projectUsers)
        .values({ projectId: invite.projectId, userId: user.id, role: "MEMBER" });
    }

    return NextResponse.json({ projectId: invite.projectId }, { status: 200 });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
