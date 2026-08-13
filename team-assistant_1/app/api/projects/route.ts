import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { AppError, toErrorResponse } from "@/lib/errors";

export async function GET() {
  try {
    const all = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));
    return NextResponse.json({ projects: all });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      throw new AppError(
        "INVALID_NAME",
        "프로젝트 이름을 입력해주세요.",
        400
      );
    }
    const [created] = await db
      .insert(projects)
      .values({ name })
      .returning();
    return NextResponse.json({ project: created }, { status: 201 });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
