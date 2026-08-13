import { EVENT_TYPES, TASK_STATUSES, type EventType, type TaskStatus } from "@/lib/types";
import { Errors } from "@/lib/errors";
import type { AIEvaluation, AIEventRaw, AIEvidenceItem } from "./schema";

export interface ValidatedEvent {
  type: EventType;
  existingTaskId: string | null;
  taskTitle: string;
  assigneeName: string | null;
  previousAssigneeName: string | null;
  status: TaskStatus | null;
  previousStatus: TaskStatus | null;
  confidence: number;
  evidence: AIEvidenceItem[];
  evaluation: AIEvaluation | null;
  reason: string;
}

const MIN_CONFIDENCE_TO_APPLY = 0.5;

function clampInt(n: unknown, min: number, max: number, fallback: number): number {
  const num = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : fallback;
  return Math.min(max, Math.max(min, num));
}

function clampConfidence(n: unknown): number {
  const num = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return Math.min(1, Math.max(0, num));
}

/**
 * Runtime validation / sanitization of the AI's JSON response. Never trusts
 * the model blindly: unknown enum values, out-of-range scores, or malformed
 * shapes are corrected to safe defaults or the event is dropped, rather than
 * ever writing garbage into the database.
 */
export function validateAIResult(
  raw: unknown,
  ctx: { memberNames: string[]; validTaskIds: Set<string> }
): ValidatedEvent[] {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as { events?: unknown }).events)) {
    throw Errors.aiParsingFailed();
  }

  const events = (raw as { events: unknown[] }).events;
  const memberSet = new Set(ctx.memberNames);
  const out: ValidatedEvent[] = [];

  for (const item of events) {
    if (!item || typeof item !== "object") continue;
    const e = item as Partial<AIEventRaw> & Record<string, unknown>;

    if (typeof e.type !== "string" || !EVENT_TYPES.includes(e.type as EventType)) {
      continue; // unknown event type: drop rather than guess
    }
    const taskTitle = typeof e.taskTitle === "string" ? e.taskTitle.trim() : "";
    if (!taskTitle) continue; // every event must be about a named task

    let existingTaskId =
      typeof e.existingTaskId === "string" && e.existingTaskId.trim()
        ? e.existingTaskId.trim()
        : null;
    // Rule #2 style safety: if the model references a task id that doesn't
    // exist in the current project, don't let it silently mutate nothing -
    // fall back to treating it as a new-task candidate.
    let type = e.type as EventType;
    if (existingTaskId && !ctx.validTaskIds.has(existingTaskId)) {
      existingTaskId = null;
      if (type !== "TASK_CREATE") type = "TASK_CREATE";
    }
    if (type !== "TASK_CREATE" && !existingTaskId) {
      // status/assignee change/update/evidence without a valid target task
      // is meaningless - skip it instead of guessing which task it means.
      continue;
    }

    const assigneeNameRaw =
      typeof e.assigneeName === "string" ? e.assigneeName.trim() : null;
    const assigneeName =
      assigneeNameRaw && memberSet.has(assigneeNameRaw) ? assigneeNameRaw : null;
    // Rule #2: never invent a team member. If the model names someone not
    // in the project, we drop the assignment rather than creating them.

    const previousAssigneeNameRaw =
      typeof e.previousAssigneeName === "string"
        ? e.previousAssigneeName.trim()
        : null;
    const previousAssigneeName =
      previousAssigneeNameRaw && memberSet.has(previousAssigneeNameRaw)
        ? previousAssigneeNameRaw
        : null;

    const status =
      typeof e.status === "string" && TASK_STATUSES.includes(e.status as TaskStatus)
        ? (e.status as TaskStatus)
        : null;
    const previousStatus =
      typeof e.previousStatus === "string" &&
      TASK_STATUSES.includes(e.previousStatus as TaskStatus)
        ? (e.previousStatus as TaskStatus)
        : null;

    const confidence = clampConfidence(e.confidence);

    const evidence: AIEvidenceItem[] = Array.isArray(e.evidence)
      ? e.evidence
          .filter(
            (ev): ev is AIEvidenceItem =>
              !!ev &&
              typeof ev === "object" &&
              typeof (ev as AIEvidenceItem).speaker === "string" &&
              typeof (ev as AIEvidenceItem).text === "string" &&
              (ev as AIEvidenceItem).text.trim().length > 0
          )
          .map((ev) => ({ speaker: ev.speaker.trim(), text: ev.text.trim() }))
      : [];

    // Rule #6: major changes require evidence. Without it, we don't apply
    // the change (safer to skip than to silently mutate state on nothing).
    const majorChange =
      type === "TASK_CREATE" ||
      type === "TASK_STATUS_CHANGE" ||
      type === "TASK_ASSIGNEE_CHANGE";
    if (majorChange && evidence.length === 0) continue;

    // Rule #5: low-confidence changes are not applied; the safer choice
    // (keep existing state) wins. Pure EVIDENCE_ADD/TASK_UPDATE on an
    // existing task is lower-risk, so we allow a lower bar there, but still
    // filter out near-zero-confidence noise entirely.
    const requiredConfidence = majorChange
      ? type === "TASK_ASSIGNEE_CHANGE"
        ? 0.6
        : MIN_CONFIDENCE_TO_APPLY
      : 0.3;
    if (confidence < requiredConfidence) continue;

    let evaluation: AIEvaluation | null = null;
    if (e.evaluation && typeof e.evaluation === "object") {
      const raw = e.evaluation as Partial<AIEvaluation>;
      evaluation = {
        importance: clampInt(raw.importance, 1, 5, 3),
        difficulty: clampInt(raw.difficulty, 1, 5, 3),
        workload: clampInt(raw.workload, 1, 5, 3),
      };
    } else if (type === "TASK_CREATE") {
      // A brand-new task always needs a score; default to a neutral 3/3/3
      // rather than rejecting the whole task.
      evaluation = { importance: 3, difficulty: 3, workload: 3 };
    }

    const reason = typeof e.reason === "string" ? e.reason.trim() : "";

    out.push({
      type,
      existingTaskId,
      taskTitle,
      assigneeName,
      previousAssigneeName,
      status,
      previousStatus,
      confidence,
      evidence,
      evaluation,
      reason,
    });
  }

  return out;
}
