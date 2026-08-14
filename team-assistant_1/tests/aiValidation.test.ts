import { describe, expect, it } from "vitest";
import { normalizePersonName } from "@/lib/personName";
import { validateAIResult } from "@/services/ai/validate";
import { selectRecordMessages } from "@/services/ai/selectRecordMessages";

const baseEvent = {
  type: "TASK_STATUS_CHANGE" as const,
  existingTaskId: "task-1",
  taskTitle: "로그인 구현",
  assigneeName: "김지원",
  previousAssigneeName: null,
  status: "DONE" as const,
  previousStatus: "IN_PROGRESS" as const,
  confidence: 0.9,
  evidence: [{ speaker: "김지원", text: "로그인 구현 완료했어." }],
  evaluation: null,
  reason: "명시적 완료",
};

describe("person name normalization", () => {
  it("normalizes Unicode width, whitespace and English casing", () => {
    expect(normalizePersonName("  Ｐａｒｋ   MinSu ")).toBe("park minsu");
  });
});

describe("AI result validation", () => {
  const context = {
    memberNames: ["김지원"],
    validTaskIds: new Set(["task-1"]),
    sourceText: "김지원: 로그인 구현 완료했어.",
    allowUnknownSpeaker: false,
  };

  it("drops an update with an invalid existingTaskId instead of creating a task", () => {
    const events = validateAIResult(
      { events: [{ ...baseEvent, existingTaskId: "missing-task" }] },
      context
    );
    expect(events).toEqual([]);
  });

  it("drops fabricated evidence and therefore drops the major change", () => {
    const events = validateAIResult(
      { events: [{ ...baseEvent, evidence: [{ speaker: "김지원", text: "원문에 없는 완료 발언" }] }] },
      context
    );
    expect(events).toEqual([]);
  });
});

describe("record parser fallback selection", () => {
  it("uses the whole raw text whenever the parser reports usedFallback", () => {
    const raw = "부분 파싱되지 않은 첫 줄\n김지원: 확인했어";
    const result = selectRecordMessages(raw, {
      usedFallback: true,
      messages: [{ timestamp: null, speaker: "김지원", message: "확인했어" }],
    });
    expect(result.usedFallback).toBe(true);
    expect(result.messages).toEqual([
      { timestamp: null, speaker: "UNKNOWN", message: raw },
    ]);
  });
});
