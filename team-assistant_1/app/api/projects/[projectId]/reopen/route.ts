import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { Errors, toErrorResponse } from "@/lib/errors";
import { toProjectDTO } from "@/lib/projectDto";
import { requireProjectOwner } from "@/lib/projects/access";
import { PROJECT_STATUS } from "@/lib/projects/status";

type Params = { params: Promise<{ projectId: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    await requireProjectOwner(projectId, user.id);

    const [project] = await db
      .update(projects)
      .set({
        status: PROJECT_STATUS.ACTIVE,
        completedAt: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.status, PROJECT_STATUS.COMPLETED)
        )
      )
      .returning();
    if (!project) throw Errors.projectNotCompleted();

    return NextResponse.json({ project: toProjectDTO(project) });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
