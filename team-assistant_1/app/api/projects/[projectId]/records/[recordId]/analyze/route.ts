import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import {
  members,
  records,
  tasks,
  recordChanges,
  contributionSnapshots,
  evidence as evidenceTable,
} from "@/lib/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { AppError, Errors, toErrorResponse } from "@/lib/errors";
import { parseConversation } from "@/services/parser/kakaoParser";
import { buildAIContext, type ContextTask } from "@/services/ai/buildContext";
import { analyzeWithAI } from "@/services/ai/analyzeRecord";
import { validateAIResult } from "@/services/ai/validate";
import { applyTaskEvents, type ExistingTaskRow } from "@/services/tasks/applyEvents";
import { calculateContribution } from "@/services/contribution/calculate";
import type { ParsedMessage, TaskStatus } from "@/lib/types";
import { requireUser } from "@/lib/auth/session";
import { requireProjectAccess } from "@/lib/projects/access";

type Params = { params: Promise<{ projectId: string; recordId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId, recordId } = await params;
    await requireProjectAccess(projectId, user.id);
    const body = await req.json().catch(() => ({}));
    const force = body?.force === true;

    const [record] = await db
      .select()
      .from(records)
      .where(and(eq(records.id, recordId), eq(records.projectId, projectId)));
    if (!record) throw Errors.notFound("기록");

    // Prevent silent duplicate analysis of the same record (spec #26):
    // re-analysis requires an explicit `force` flag from the caller.
    if (record.analysisStatus === "COMPLETED" && !force) {
      throw Errors.alreadyAnalyzed();
    }
    if (record.analysisStatus === "ANALYZING") {
      throw new AppError(
        "ALREADY_ANALYZING",
        "이미 분석이 진행 중입니다.",
        409
      );
    }

    const projectMembers = await db
      .select()
      .from(members)
      .where(eq(members.projectId, projectId));
    if (projectMembers.length === 0) throw Errors.noMembers();

    if (!record.rawContent.trim()) throw Errors.emptyInput();

    // 1. parseInput()
    const parsed = parseConversation(record.rawContent, record.type as "KAKAO_TEXT" | "MANUAL_TEXT");
    let newMessages: ParsedMessage[] = parsed.messages;
    if (newMessages.length === 0) {
      // Full fallback: hand the raw text to the AI as a single unattributed
      // message rather than failing the whole request (spec #3).
      newMessages = [
        { timestamp: null, speaker: "UNKNOWN", message: record.rawContent.trim() },
      ];
    }

    // 2. buildAIContext(): current authoritative project state
    const activeTasks = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.isDeleted, false)));

    const memberById = new Map(projectMembers.map((m) => [m.id, m.name]));
    const memberByName = new Map(projectMembers.map((m) => [m.name, m.id]));

    // Pull a small sample of recent evidence per task so the AI has enough
    // continuity signal to recognize "this is the same task as before".
    const recentEvidenceByTask = new Map<string, string[]>();
    if (activeTasks.length > 0) {
      const evidenceRows = await db
        .select()
        .from(evidenceTable)
        .where(inArray(evidenceTable.taskId, activeTasks.map((t) => t.id)))
        .orderBy(desc(evidenceTable.createdAt));
      for (const ev of evidenceRows) {
        const list = recentEvidenceByTask.get(ev.taskId) ?? [];
        if (list.length < 2) {
          list.push(`${ev.speaker}: ${ev.text}`);
          recentEvidenceByTask.set(ev.taskId, list);
        }
      }
    }

    const contextTasks: ContextTask[] = [];
    const existingTasksById = new Map<string, ExistingTaskRow>();
    for (const t of activeTasks) {
      existingTasksById.set(t.id, {
        id: t.id,
        title: t.title,
        assigneeId: t.assigneeId,
        status: t.status as TaskStatus,
        importance: t.importance,
        difficulty: t.difficulty,
        workload: t.workload,
      });
      contextTasks.push({
        id: t.id,
        title: t.title,
        assignee: t.assigneeId ? memberById.get(t.assigneeId) ?? null : null,
        status: t.status as TaskStatus,
        recentEvidence: recentEvidenceByTask.get(t.id) ?? [],
      });
    }

    const context = buildAIContext(
      projectMembers.map((m) => m.name),
      contextTasks,
      newMessages
    );

    // Mark as analyzing (best-effort guard against double submission).
    await db
      .update(records)
      .set({ analysisStatus: "ANALYZING" })
      .where(eq(records.id, recordId));

    // 3. analyzeWithAI()
    let rawResult: unknown;
    try {
      rawResult = await analyzeWithAI(context);
    } catch (err) {
      await db
        .update(records)
        .set({
          analysisStatus: "FAILED",
          analysisError: err instanceof AppError ? err.message : "AI 분석 실패",
        })
        .where(eq(records.id, recordId));
      throw err;
    }

    // 4. validateAIResult()
    let events;
    try {
      events = validateAIResult(rawResult, {
        memberNames: projectMembers.map((m) => m.name),
        validTaskIds: new Set(existingTasksById.keys()),
      });
    } catch (err) {
      await db
        .update(records)
        .set({
          analysisStatus: "FAILED",
          analysisError: err instanceof AppError ? err.message : "AI 응답 검증 실패",
        })
        .where(eq(records.id, recordId));
      throw err;
    }

    // 5-8. applyTaskEvents() + calculateContribution() + saveSnapshot(),
    // all inside one transaction so a mid-way failure never leaves
    // tasks/evidence/snapshot partially written. Turso/libSQL transactions
    // are async (network round trips), unlike better-sqlite3's synchronous
    // ones, so every query inside must be awaited.
    const result = await db.transaction(async (tx) => {
      const changes = await applyTaskEvents(
        tx,
        projectId,
        recordId,
        events,
        memberByName,
        existingTasksById
      );

      for (const change of changes) {
        await tx
          .insert(recordChanges)
          .values({
            projectId,
            recordId,
            taskId: change.taskId,
            taskTitle: change.taskTitle,
            changeType: change.changeType,
            summary: change.summary,
            reason: change.reason,
            confidence: change.confidence,
          })
          .run();
      }

      const freshTasks = await tx
        .select()
        .from(tasks)
        .where(and(eq(tasks.projectId, projectId), eq(tasks.isDeleted, false)))
        .all();

      const contribution = calculateContribution(
        projectMembers.map((m) => ({ id: m.id, name: m.name })),
        freshTasks.map((t) => ({
          assigneeId: t.assigneeId,
          status: t.status as TaskStatus,
          importance: t.importance,
          difficulty: t.difficulty,
          workload: t.workload,
        }))
      );

      await tx
        .insert(contributionSnapshots)
        .values({
          projectId,
          recordId,
          scores: JSON.stringify(contribution),
        })
        .run();

      await tx
        .update(records)
        .set({
          analysisStatus: "COMPLETED",
          analyzedAt: new Date(),
          analysisError: null,
        })
        .where(eq(records.id, recordId))
        .run();

      return { changes, contribution };
    });

    return NextResponse.json({
      changes: result.changes,
      contribution: result.contribution,
      usedFallback: parsed.usedFallback,
      eventCount: events.length,
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
