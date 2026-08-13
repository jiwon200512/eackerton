import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { evidence, members, tasks } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { AppError, Errors, toErrorResponse } from "@/lib/errors";
import { TASK_STATUSES } from "@/lib/types";
import { toTaskDTO } from "@/lib/taskDto";

type Params = { params: Promise<{ projectId: string; taskId: string }> };

async function loadTask(projectId: string, taskId: string) {
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId), eq(tasks.isDeleted, false)));
  return task;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { projectId, taskId } = await params;
    const task = await loadTask(projectId, taskId);
    if (!task) throw Errors.notFound("Task");

    const [evidenceRows, memberRows] = await Promise.all([
      db
        .select()
        .from(evidence)
        .where(eq(evidence.taskId, taskId))
        .orderBy(desc(evidence.createdAt)),
      db.select().from(members).where(eq(members.projectId, projectId)),
    ]);
    const memberById = new Map(memberRows.map((m) => [m.id, m.name]));

    return NextResponse.json({
      task: toTaskDTO(task, task.assigneeId ? memberById.get(task.assigneeId) ?? null : null),
      evidence: evidenceRows,
      members: memberRows,
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

// Manual user edits (spec #14): title / assignee / status. Once a user
// edits a task here, this becomes the authoritative current state - the
// next AI analysis reads it straight from this table, so edits are never
// silently reverted by a later record analysis.
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { projectId, taskId } = await params;
    const task = await loadTask(projectId, taskId);
    if (!task) throw Errors.notFound("Task");

    const body = await req.json().catch(() => ({}));
    const updates: Partial<typeof tasks.$inferInsert> = {};

    if (body.title !== undefined) {
      const title = typeof body.title === "string" ? body.title.trim() : "";
      if (!title) throw new AppError("INVALID_TITLE", "Task 이름을 입력해주세요.", 400);
      updates.title = title;
    }

    if (body.status !== undefined) {
      if (!TASK_STATUSES.includes(body.status)) {
        throw new AppError("INVALID_STATUS", "잘못된 상태 값입니다.", 400);
      }
      updates.status = body.status;
    }

    let assigneeName: string | null | undefined = undefined;
    if (body.assigneeId !== undefined) {
      if (body.assigneeId === null) {
        updates.assigneeId = null;
        assigneeName = null;
      } else {
        const [assignee] = await db
          .select()
          .from(members)
          .where(and(eq(members.id, body.assigneeId), eq(members.projectId, projectId)));
        if (!assignee) {
          throw new AppError(
            "INVALID_ASSIGNEE",
            "프로젝트에 속한 팀원만 담당자로 지정할 수 있습니다.",
            400
          );
        }
        updates.assigneeId = assignee.id;
        assigneeName = assignee.name;
      }
    }

    if (Object.keys(updates).length === 0) {
      const memberRows = await db.select().from(members).where(eq(members.projectId, projectId));
      const memberById = new Map(memberRows.map((m) => [m.id, m.name]));
      return NextResponse.json({
        task: toTaskDTO(task, task.assigneeId ? memberById.get(task.assigneeId) ?? null : null),
      });
    }

    updates.updatedAt = new Date();
    const [updated] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, taskId))
      .returning();

    if (assigneeName === undefined) {
      const memberRows = await db.select().from(members).where(eq(members.projectId, projectId));
      const memberById = new Map(memberRows.map((m) => [m.id, m.name]));
      assigneeName = updated.assigneeId ? memberById.get(updated.assigneeId) ?? null : null;
    }

    return NextResponse.json({ task: toTaskDTO(updated, assigneeName) });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { projectId, taskId } = await params;
    const task = await loadTask(projectId, taskId);
    if (!task) throw Errors.notFound("Task");

    await db
      .update(tasks)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(tasks.id, taskId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
