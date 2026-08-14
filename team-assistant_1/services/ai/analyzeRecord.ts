import OpenAI from "openai";
import { Errors } from "@/lib/errors";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { AI_JSON_SCHEMA } from "./schema";
import type { AIContext } from "./buildContext";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw Errors.aiUnavailable();
  }
  if (!client) {
    client = new OpenAI({ apiKey });
  }
  return client;
}

/**
 * Calls the OpenAI Responses API with the current project state + new
 * messages and returns the raw parsed JSON. Callers must run the result
 * through services/ai/validate.ts (validateAIResult) before touching the
 * database - this function only guarantees "valid JSON was returned", not
 * that its contents are safe/sane.
 */
export async function analyzeWithAI(context: AIContext): Promise<unknown> {
  const ai = getClient();
  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";

  let text: string | undefined;
  try {
    const response = await ai.responses.create({
      model,
      instructions: SYSTEM_PROMPT,
      input:
        "다음은 현재 프로젝트 상태와 새로 입력된 기록이다. 이 JSON을 분석하여 지정된 스키마에 맞는 결과를 반환하라.\n\n" +
        JSON.stringify(context, null, 2),
      text: {
        format: {
          type: "json_schema",
          ...AI_JSON_SCHEMA,
        },
      },
    });
    text = response.output_text;
  } catch (err) {
    console.error("OpenAI API call failed:", err);
    throw Errors.aiUnavailable();
  }

  if (!text) {
    throw Errors.aiParsingFailed();
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI JSON response:", err, text);
    throw Errors.aiParsingFailed();
  }
}
