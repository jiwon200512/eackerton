import { eq } from "drizzle-orm";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import type { ResultSet } from "@libsql/client";
import { evidence, tasks } from "@/lib/db/schema";
import type * as schema from "@/lib/db/schema";
import type { EventType, TaskStatus } from "@/lib/types";
import type { ValidatedEvent } from "@/services/ai/validate";

// Shared base type of both the plain db handle and a transaction (tx)
// handle, so applyTaskEvents can be called with either. Turso/libSQL
// transactions are async (network round trips), unlike better-sqlite3's
// synchronous ones.
type DB = BaseSQLiteDatabase<"async", ResultSet, typeof schema>;

export interface ExistingTaskRow {
  id: string;
  title: string;
  assigneeId: string | null;
  status: TaskStatus;
  importance: number;
  difficulty: number;
  workload: number;
}

export interface AppliedChange {
  taskId: string;
  taskTitle: string;
  changeType: EventType;
  summary: string;
  reason: string | null;
  confidence: number | null;
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "할 일",
  IN_PROGRESS: "진행 중",
  DONE: "완료",
};

async function insertEvidence(
  tx: DB,
  taskId: string,
  recordId: string,
  items: { speaker: string; text: string }[]
) {
  for (const ev of items) {
    // NOTE: drizzle query builders are lazy - `.run()` is required to
    // actually execute them (and, for the async libsql driver, must be
    // awaited) inside the db.transaction() callback.
    await tx
      .insert(evidence)
      .values({
        taskId,
        recordId,
        speaker: ev.speaker,
        text: ev.text,
        timestamp: null,
      })
      .run();
  }
}

/**
 * Applies a batch of validated AI events to the database. Must be called
 * (and awaited) inside a db.transaction() callback so a partial failure
 * (e.g. one bad event) doesn't leave tasks/evidence half-updated.
 */
export async function applyTaskEvents(
  tx: DB,
  projectId: string,
  recordId: string,
  events: ValidatedEvent[],
  memberByName: Map<string, string>,
  existingTasksById: Map<string, ExistingTaskRow>
): Promise<AppliedChange[]> {
  const changes: AppliedChange[] = [];

  for (const event of events) {
    const assigneeId = event.assigneeName
      ? memberByName.get(event.assigneeName) ?? null
      : null;

    if (event.type === "TASK_CREATE") {
      const status = event.status ?? "TODO";
      const evalScore = event.evaluation ?? {
        importance: 3,
        difficulty: 3,
        workload: 3,
      };
      const created = await tx
        .insert(tasks)
        .values({
          projectId,
          title: event.taskTitle,
          assigneeId,
          status,
          importance: evalScore.importance,
          difficulty: evalScore.difficulty,
          workload: evalScore.workload,
          lastReason: event.reason || null,
        })
        .returning()
        .get();

      await insertEvidence(tx, created.id, recordId, event.evidence);

      // Keep existingTasksById in sync in case a later event in the same
      // batch references this brand-new task by matching title semantics
      // (the AI should use existingTaskId, but this keeps state consistent).
      existingTasksById.set(created.id, {
        id: created.id,
        title: created.title,
        assigneeId: created.assigneeId,
        status: created.status as TaskStatus,
        importance: created.importance,
        difficulty: created.difficulty,
        workload: created.workload,
      });

      changes.push({
        taskId: created.id,
        taskTitle: created.title,
        changeType: "TASK_CREATE",
        summary: `신규 Task 생성 (${STATUS_LABEL[status]})`,
        reason: event.reason || null,
        confidence: event.confidence,
      });
      continue;
    }

    // All other event types require a valid existing task (guaranteed by
    // validateAIResult).
    const existing = existingTasksById.get(event.existingTaskId!);
    if (!existing) continue;

    if (event.type === "TASK_STATUS_CHANGE" && event.status) {
      const prevStatus = existing.status;
      if (prevStatus !== event.status) {
        await tx
          .update(tasks)
          .set({ status: event.status, lastReason: event.reason || null, updatedAt: new Date() })
          .where(eq(tasks.id, existing.id))
          .run();
        existing.status = event.status;
        changes.push({
          taskId: existing.id,
          taskTitle: existing.title,
          changeType: "TASK_STATUS_CHANGE",
          summary: `${STATUS_LABEL[prevStatus]} → ${STATUS_LABEL[event.status]}`,
          reason: event.reason || null,
          confidence: event.confidence,
        });
      }
      await insertEvidence(tx, existing.id, recordId, event.evidence);
      continue;
    }

    if (event.type === "TASK_ASSIGNEE_CHANGE") {
      const prevAssigneeId = existing.assigneeId;
      if (assigneeId && assigneeId !== prevAssigneeId) {
        await tx
          .update(tasks)
          .set({ assigneeId, lastReason: event.reason || null, updatedAt: new Date() })
          .where(eq(tasks.id, existing.id))
          .run();
        existing.assigneeId = assigneeId;
        changes.push({
          taskId: existing.id,
          taskTitle: existing.title,
          changeType: "TASK_ASSIGNEE_CHANGE",
          summary: `담당자 변경: ${event.previousAssigneeName ?? "미배정"} → ${event.assigneeName ?? "미배정"}`,
          reason: event.reason || null,
          confidence: event.confidence,
        });
      }
      await insertEvidence(tx, existing.id, recordId, event.evidence);
      continue;
    }

    if (event.type === "TASK_UPDATE") {
      const updates: Partial<typeof tasks.$inferInsert> = {};
      const summaryParts: string[] = [];

      if (event.evaluation) {
        if (
          event.evaluation.importance !== existing.importance ||
          event.evaluation.difficulty !== existing.difficulty ||
          event.evaluation.workload !== existing.workload
        ) {
          updates.importance = event.evaluation.importance;
          updates.difficulty = event.evaluation.difficulty;
          updates.workload = event.evaluation.workload;
          summaryParts.push("중요도/난이도/작업량 재평가");
        }
      }
      // Only allow a title refinement when the AI is quite confident, so we
      // don't thrash task names on shaky signal.
      if (
        event.confidence >= 0.7 &&
        event.taskTitle &&
        event.taskTitle !== existing.title
      ) {
        updates.title = event.taskTitle;
        summaryParts.push(`제목 수정: "${existing.title}" → "${event.taskTitle}"`);
      }

      if (Object.keys(updates).length > 0) {
        updates.lastReason = event.reason || null;
        updates.updatedAt = new Date();
        await tx.update(tasks).set(updates).where(eq(tasks.id, existing.id)).run();
        if (updates.importance !== undefined) existing.importance = updates.importance;
        if (updates.difficulty !== undefined) existing.difficulty = updates.difficulty;
        if (updates.workload !== undefined) existing.workload = updates.workload;
        if (updates.title !== undefined) existing.title = updates.title;

        changes.push({
          taskId: existing.id,
          taskTitle: existing.title,
          changeType: "TASK_UPDATE",
          summary: summaryParts.join(", ") || "Task 정보 업데이트",
          reason: event.reason || null,
          confidence: event.confidence,
        });
      }
      await insertEvidence(tx, existing.id, recordId, event.evidence);
      continue;
    }

    if (event.type === "EVIDENCE_ADD") {
      if (event.evidence.length === 0) continue;
      await insertEvidence(tx, existing.id, recordId, event.evidence);
      changes.push({
        taskId: existing.id,
        taskTitle: existing.title,
        changeType: "EVIDENCE_ADD",
        summary: "새로운 근거 추가",
        reason: event.reason || null,
        confidence: event.confidence,
      });
    }
  }

  return changes;
}
