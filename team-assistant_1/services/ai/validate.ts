import { EVENT_TYPES, TASK_STATUSES, type EventType, type TaskStatus } from "@/lib/types";
import { Errors } from "@/lib/errors";
import type { AIEvaluation, AIEventRaw, AIEvidenceItem } from "./schema";
import { normalizeContributorShares } from "@/services/tasks/contributors";

export interface ValidatedContributor {
  memberName: string;
  share: number;
}

export interface ValidatedEvent {
  type: EventType;
  existingTaskId: string | null;
  taskTitle: string;
  assigneeName: string | null;
  previousAssigneeName: string | null;
  contributors: ValidatedContributor[];
  status: TaskStatus | null;
  previousStatus: TaskStatus | null;
  confidence: number;
  evidence: AIEvidenceItem[];
  evaluation: AIEvaluation | null;
  reason: string;
}

const MIN_CONFIDENCE_TO_APPLY = 0.5;
const MAX_EVENTS = 50;
const MAX_EVIDENCE_PER_EVENT = 10;

function normalizeEvidenceText(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ");
}

function clampInt(n: unknown, min: number, max: number, fallback: number): number {
  const num = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : fallback;
  return Math.min(max, Math.max(min, num));
}

function clampConfidence(n: unknown): number {
  const num = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return Math.min(1, Math.max(0, num));
}

export function normalizeAIContributors(
  raw: unknown,
  memberNames: Set<string>
): ValidatedContributor[] | null {
  if (raw === undefined || (Array.isArray(raw) && raw.length === 0)) return [];
  if (!Array.isArray(raw)) return null;

  const valid: Array<ValidatedContributor & { memberId: string }> = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as { memberName?: unknown; share?: unknown };
    const memberName =
      typeof candidate.memberName === "string" ? candidate.memberName.trim() : "";
    if (!memberName || !memberNames.has(memberName)) continue;
    if (seen.has(memberName)) return null;
    if (
      typeof candidate.share !== "number" ||
      !Number.isInteger(candidate.share) ||
      candidate.share < 1 ||
      candidate.share > 100
    ) {
      continue;
    }
    seen.add(memberName);
    valid.push({ memberId: memberName, memberName, share: candidate.share });
  }
  if (raw.length > 0 && valid.length === 0) return null;
  const normalized = normalizeContributorShares(valid);
  if (valid.length > 0 && normalized.length === 0) return null;
  return normalized.map(({ memberName, share }) => ({
    memberName,
    share,
  }));
}

/**
 * Runtime validation / sanitization of the AI's JSON response. Never trusts
 * the model blindly: unknown enum values, out-of-range scores, or malformed
 * shapes are corrected to safe defaults or the event is dropped, rather than
 * ever writing garbage into the database.
 */
export function validateAIResult(
  raw: unknown,
  ctx: {
    memberNames: string[];
    validTaskIds: Set<string>;
    sourceText: string;
    allowUnknownSpeaker: boolean;
  }
): ValidatedEvent[] {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as { events?: unknown }).events)) {
    throw Errors.aiParsingFailed();
  }

  const events = (raw as { events: unknown[] }).events.slice(0, MAX_EVENTS);
  const memberSet = new Set(ctx.memberNames);
  const normalizedSource = normalizeEvidenceText(ctx.sourceText);
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
    const type = e.type as EventType;
    if (type === "TASK_CREATE") {
      existingTaskId = null;
    } else if (!existingTaskId || !ctx.validTaskIds.has(existingTaskId)) {
      // status/assignee change/update/evidence without a valid target task
      // is dropped. Never turn a bad reference into a duplicate CREATE.
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

    let contributors = normalizeAIContributors(e.contributors, memberSet);
    if (contributors === null) continue;
    if (
      contributors.length === 0 &&
      assigneeName &&
      (type === "TASK_CREATE" || type === "TASK_ASSIGNEE_CHANGE")
    ) {
      contributors = [{ memberName: assigneeName, share: 100 }];
    }

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
          .filter((ev) => {
            const speakerAllowed =
              memberSet.has(ev.speaker) ||
              (ctx.allowUnknownSpeaker && ev.speaker === "UNKNOWN");
            return (
              speakerAllowed &&
              normalizedSource.includes(normalizeEvidenceText(ev.text))
            );
          })
          .slice(0, MAX_EVIDENCE_PER_EVENT)
      : [];

    // Rule #6: major changes require evidence. Without it, we don't apply
    // the change (safer to skip than to silently mutate state on nothing).
    const majorChange =
      type === "TASK_CREATE" ||
      type === "TASK_STATUS_CHANGE" ||
      type === "TASK_ASSIGNEE_CHANGE" ||
      type === "TASK_CONTRIBUTORS_CHANGE";
    if (majorChange && evidence.length === 0) continue;

    // Rule #5: low-confidence changes are not applied; the safer choice
    // (keep existing state) wins. Pure EVIDENCE_ADD/TASK_UPDATE on an
    // existing task is lower-risk, so we allow a lower bar there, but still
    // filter out near-zero-confidence noise entirely.
    const requiredConfidence = majorChange
      ? type === "TASK_ASSIGNEE_CHANGE" || type === "TASK_CONTRIBUTORS_CHANGE"
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
      contributors,
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
