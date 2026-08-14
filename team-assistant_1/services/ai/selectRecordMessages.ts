import type { ParsedMessage } from "@/lib/types";
import type { ParseResult } from "@/services/parser/kakaoParser";

export function selectRecordMessages(
  rawContent: string,
  parsed: ParseResult
): { messages: ParsedMessage[]; usedFallback: boolean } {
  const usedFallback = parsed.usedFallback || parsed.messages.length === 0;
  return {
    usedFallback,
    messages: usedFallback
      ? [{ timestamp: null, speaker: "UNKNOWN", message: rawContent.trim() }]
      : parsed.messages,
  };
}
