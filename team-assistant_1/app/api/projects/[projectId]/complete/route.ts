import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import {
  contributionSnapshots,
  members,
  projects,
  tasks,
} from "@/lib/db/schema";
import { Errors, toErrorResponse } from "@/lib/errors";
import { toProjectDTO } from "@/lib/projectDto";
import { requireProjectOwner } from "@/lib/projects/access";
import { PROJECT_STATUS } from "@/lib/projects/status";
import { calculateContribution } from "@/services/contribution/calculate";
import type { TaskStatus } from "@/lib/types";

type Params = { params: Promise<{ projectId: string }> };

function isDatabaseBusy(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String(error.code) : "";
  const message = "message" in error ? String(error.message) : "";
  return code.startsWith("SQLITE_BUSY") || message.includes("SQLITE_BUSY");
}

async function withWriteConflictRetry<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isDatabaseBusy(error) || attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 20 * (attempt + 1)));
    }
  }
  throw new Error("Unreachable write retry state");
}

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    await requireProjectOwner(projectId, user.id);

    const result = await withWriteConflictRetry(() => db.transaction(async (tx) => {
      const [currentProject] = await tx
        .select()
        .from(projects)
        .where(eq(projects.id, projectId));
      if (!currentProject) throw Errors.notFound("프로젝트");
      if (currentProject.status !== PROJECT_STATUS.ACTIVE) {
        throw Errors.projectAlreadyCompleted();
      }

      const completedAt = new Date();
      const transitioned = await tx
        .update(projects)
        .set({
          status: PROJECT_STATUS.COMPLETED,
          completedAt,
          updatedAt: completedAt,
        })
        .where(
          and(
            eq(projects.id, projectId),
            eq(projects.status, PROJECT_STATUS.ACTIVE)
          )
        )
        .returning();
      if (transitioned.length !== 1) throw Errors.projectAlreadyCompleted();

      const memberRows = await tx
        .select()
        .from(members)
        .where(eq(members.projectId, projectId));
      const taskRows = await tx
        .select()
        .from(tasks)
        .where(
          and(eq(tasks.projectId, projectId), eq(tasks.isDeleted, false))
        );
      const contribution = calculateContribution(
        memberRows.map((member) => ({ id: member.id, name: member.name })),
        taskRows.map((task) => ({
          assigneeId: task.assigneeId,
          status: task.status as TaskStatus,
          importance: task.importance,
          difficulty: task.difficulty,
          workload: task.workload,
        }))
      );

      const [snapshot] = await tx
        .insert(contributionSnapshots)
        .values({
          projectId,
          recordId: null,
          scores: JSON.stringify(contribution),
        })
        .returning({ id: contributionSnapshots.id });

      return {
        project: toProjectDTO(transitioned[0]),
        contribution,
        snapshotId: snapshot.id,
      };
    }));

    return NextResponse.json(result);
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
