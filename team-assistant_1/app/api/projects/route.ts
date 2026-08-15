import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { members, projects, projectUsers } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { AppError, toErrorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth/session";
import { toProjectDTO } from "@/lib/projectDto";

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await db
      .select({ project: projects })
      .from(projectUsers)
      .innerJoin(projects, eq(projectUsers.projectId, projects.id))
      .where(eq(projectUsers.userId, user.id))
      .orderBy(desc(projects.createdAt));
    return NextResponse.json({
      projects: rows.map((row) => toProjectDTO(row.project)),
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      throw new AppError(
        "INVALID_NAME",
        "프로젝트 이름을 입력해주세요.",
        400
      );
    }
    const created = await db.transaction(async (tx) => {
      const [project] = await tx.insert(projects).values({ name }).returning();
      await tx
        .insert(projectUsers)
        .values({ projectId: project.id, userId: user.id, role: "OWNER" });
      await tx.insert(members).values({
        projectId: project.id,
        userId: user.id,
        name: user.name,
      });
      return project;
    });
    return NextResponse.json(
      { project: toProjectDTO(created) },
      { status: 201 }
    );
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
