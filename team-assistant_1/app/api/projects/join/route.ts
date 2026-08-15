import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { inviteCodes, members, projects, projectUsers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { AppError, Errors, toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import { normalizeInviteCode } from "@/lib/projects/inviteCode";
import { normalizePersonName } from "@/lib/personName";
import { assertProjectIsActive } from "@/lib/projects/access";

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

    const [project] = await db
      .select({ status: projects.status })
      .from(projects)
      .where(eq(projects.id, invite.projectId));
    if (!project) throw Errors.notFound("프로젝트");
    assertProjectIsActive(project);

    const [existingMembership, projectMembers] = await Promise.all([
      db
        .select()
        .from(projectUsers)
        .where(
          and(
            eq(projectUsers.projectId, invite.projectId),
            eq(projectUsers.userId, user.id)
          )
        )
        .then((rows) => rows[0]),
      db.select().from(members).where(eq(members.projectId, invite.projectId)),
    ]);

    const alreadyLinked = projectMembers.find((member) => member.userId === user.id);
    if (alreadyLinked) {
      if (!existingMembership) {
        await db.insert(projectUsers).values({
          projectId: invite.projectId,
          userId: user.id,
          role: "MEMBER",
        });
      }
      return NextResponse.json({ projectId: invite.projectId }, { status: 200 });
    }

    const normalizedUserName = normalizePersonName(user.name);
    const matches = projectMembers.filter(
      (member) => normalizePersonName(member.name) === normalizedUserName
    );

    if (matches.length > 1) throw Errors.ambiguousMemberName();
    if (matches.length === 0) {
      // Legacy rows may already have project access from the older join flow.
      // Preserve that access, but never grant new access without a name match.
      if (existingMembership) {
        return NextResponse.json(
          { projectId: invite.projectId, linked: false, legacyAccess: true },
          { status: 200 }
        );
      }
      throw Errors.memberNotRegistered();
    }

    const matchedMember = matches[0];
    if (matchedMember.userId && matchedMember.userId !== user.id) {
      throw Errors.memberAlreadyClaimed();
    }

    await db.transaction(async (tx) => {
      if (!matchedMember.userId) {
        await tx
          .update(members)
          .set({ userId: user.id })
          .where(eq(members.id, matchedMember.id));
      }
      if (!existingMembership) {
        await tx.insert(projectUsers).values({
          projectId: invite.projectId,
          userId: user.id,
          role: "MEMBER",
        });
      }
    });

    return NextResponse.json({ projectId: invite.projectId }, { status: 200 });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
