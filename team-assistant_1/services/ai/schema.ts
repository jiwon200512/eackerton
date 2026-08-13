import { z } from "zod";
import { EVENT_TYPES, TASK_STATUSES } from "@/lib/types";

// --------------------------------------------------------------------------
// Structured shape of what the AI must return. Kept deliberately close to
// the JSON schema sent to the Gemini API (see analyzeRecord.ts) so the
// contract between prompt / API / validation stays obvious.
// --------------------------------------------------------------------------

export const AIEvidenceItemSchema = z.object({
  speaker: z.string(),
  text: z.string(),
});

export const AIEvaluationSchema = z.object({
  importance: z.number(),
  difficulty: z.number(),
  workload: z.number(),
});

export const AIEventSchema = z.object({
  type: z.enum(EVENT_TYPES),
  existingTaskId: z.string().nullable(),
  taskTitle: z.string(),
  assigneeName: z.string().nullable(),
  previousAssigneeName: z.string().nullable(),
  status: z.enum(TASK_STATUSES).nullable(),
  previousStatus: z.enum(TASK_STATUSES).nullable(),
  confidence: z.number(),
  evidence: z.array(AIEvidenceItemSchema),
  evaluation: AIEvaluationSchema.nullable(),
  reason: z.string(),
});

export const AIAnalysisResultSchema = z.object({
  events: z.array(AIEventSchema),
});

export type AIEvidenceItem = z.infer<typeof AIEvidenceItemSchema>;
export type AIEvaluation = z.infer<typeof AIEvaluationSchema>;
export type AIEventRaw = z.infer<typeof AIEventSchema>;
export type AIAnalysisResultRaw = z.infer<typeof AIAnalysisResultSchema>;

// The JSON Schema handed to the LLM's structured-output API (Gemini's
// `responseJsonSchema`, see analyzeRecord.ts - only the `schema` field below
// is used). Every field is "required" and optionality is instead expressed
// with a nullable type, which keeps the contract unambiguous regardless of
// which provider's structured-output dialect ends up consuming it.
export const AI_JSON_SCHEMA = {
  name: "project_record_analysis",
  strict: true,
  schema: {
    type: "object",
    properties: {
      events: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { type: "string", enum: [...EVENT_TYPES] },
            existingTaskId: { type: ["string", "null"] },
            taskTitle: { type: "string" },
            assigneeName: { type: ["string", "null"] },
            previousAssigneeName: { type: ["string", "null"] },
            status: { type: ["string", "null"], enum: [...TASK_STATUSES, null] },
            previousStatus: {
              type: ["string", "null"],
              enum: [...TASK_STATUSES, null],
            },
            confidence: { type: "number" },
            evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  speaker: { type: "string" },
                  text: { type: "string" },
                },
                required: ["speaker", "text"],
                additionalProperties: false,
              },
            },
            evaluation: {
              type: ["object", "null"],
              properties: {
                importance: { type: "integer" },
                difficulty: { type: "integer" },
                workload: { type: "integer" },
              },
              required: ["importance", "difficulty", "workload"],
              additionalProperties: false,
            },
            reason: { type: "string" },
          },
          required: [
            "type",
            "existingTaskId",
            "taskTitle",
            "assigneeName",
            "previousAssigneeName",
            "status",
            "previousStatus",
            "confidence",
            "evidence",
            "evaluation",
            "reason",
          ],
          additionalProperties: false,
        },
      },
    },
    required: ["events"],
    additionalProperties: false,
  },
} as const;
