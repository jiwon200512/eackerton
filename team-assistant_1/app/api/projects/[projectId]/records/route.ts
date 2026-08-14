import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { records, projects } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { AppError, Errors, toErrorResponse } from "@/lib/errors";
import { RECORD_TYPES } from "@/lib/types";
import { requireUser } from "@/lib/auth/session";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await requireUser();
    const { projectId } = await params;
    const list = await db
      .select()
      .from(records)
      .where(eq(records.projectId, projectId))
      .orderBy(desc(records.createdAt));
    return NextResponse.json({ records: list });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    await requireUser();
    const { projectId } = await params;
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));
    if (!project) throw Errors.notFound("프로젝트");

    const body = await req.json().catch(() => ({}));
    const type = body.type;
    const rawContent =
      typeof body.rawContent === "string" ? body.rawContent : "";

    if (!RECORD_TYPES.includes(type)) {
      throw new AppError("INVALID_TYPE", "잘못된 기록 유형입니다.", 400);
    }
    if (!rawContent.trim()) {
      throw Errors.emptyInput();
    }

    const [created] = await db
      .insert(records)
      .values({ projectId, type, rawContent, analysisStatus: "PENDING" })
      .returning();
    return NextResponse.json({ record: created }, { status: 201 });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
