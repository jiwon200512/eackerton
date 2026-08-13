import { GoogleGenAI } from "@google/genai";
import { Errors } from "@/lib/errors";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { AI_JSON_SCHEMA } from "./schema";
import type { AIContext } from "./buildContext";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw Errors.aiUnavailable();
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

/**
 * Calls the LLM (Google Gemini) with the current project state + new
 * messages and returns the raw parsed JSON. Callers must run the result
 * through services/ai/validate.ts (validateAIResult) before touching the
 * database - this function only guarantees "valid JSON was returned", not
 * that its contents are safe/sane.
 */
export async function analyzeWithAI(context: AIContext): Promise<unknown> {
  const ai = getClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  let text: string | undefined;
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "다음은 현재 프로젝트 상태와 새로 입력된 기록이다. 이 JSON을 분석하여 지정된 스키마에 맞는 결과를 반환하라.\n\n" +
                JSON.stringify(context, null, 2),
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
        responseMimeType: "application/json",
        // Gemini accepts a standard JSON Schema via responseJsonSchema
        // (as opposed to its own restricted OpenAPI-subset `responseSchema`
        // type), so we can reuse a single shared schema definition instead
        // of maintaining a separate OpenAPI-subset schema dialect.
        responseJsonSchema: AI_JSON_SCHEMA.schema,
      },
    });
    text = response.text;
  } catch (err) {
    console.error("Gemini API call failed:", err);
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
