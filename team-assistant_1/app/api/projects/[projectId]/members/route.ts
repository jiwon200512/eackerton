import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AppError, toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import { requireProjectAccess } from "@/lib/projects/access";
import { toMemberDTO } from "@/lib/memberDto";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    await requireProjectAccess(projectId, user.id);
    const list = await db
      .select()
      .from(members)
      .where(eq(members.projectId, projectId));
    return NextResponse.json({ members: list.map((m) => toMemberDTO(m, user.id)) });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    await requireProjectAccess(projectId, user.id);

    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      throw new AppError("INVALID_NAME", "팀원 이름을 입력해주세요.", 400);
    }

    const existing = await db
      .select()
      .from(members)
      .where(eq(members.projectId, projectId));
    if (existing.some((m) => m.name === name)) {
      throw new AppError(
        "DUPLICATE_MEMBER",
        "이미 등록된 이름입니다.",
        409
      );
    }

    const [created] = await db
      .insert(members)
      .values({ projectId, name })
      .returning();
    return NextResponse.json({ member: toMemberDTO(created, user.id) }, { status: 201 });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
