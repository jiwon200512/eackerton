import type { ParsedMessage } from "@/lib/types";

// --------------------------------------------------------------------------
// KakaoTalk / free-form conversation parser.
//
// Goal: turn raw exported text into structured { timestamp, speaker, message }
// records using plain code (no LLM) wherever the format is recognizable, so
// the AI only has to reason about semantics, not text formatting.
//
// KakaoTalk export formats vary across app versions/platforms. We support the
// common ones and fall back gracefully (never throw) when nothing matches -
// callers can then pass the raw text straight to the AI.
// --------------------------------------------------------------------------

export interface ParseResult {
  messages: ParsedMessage[];
  /** true if line-by-line structured parsing mostly failed and callers
   * should treat `messages` as low-confidence / consider raw-text fallback. */
  usedFallback: boolean;
}

// Lines that are KakaoTalk metadata/system noise, not real messages.
const NOISE_PATTERNS: RegExp[] = [
  /^저장한 날짜\s*[:：]/,
  /님과 카카오톡 대화$/,
  /^카카오톡 대화 ?내용$/,
  /님이 (들어왔습니다|나갔습니다)\.?$/,
  /^-{5,}.*-{5,}$/, // date separator lines like "--------------- 2026년 ... ---------------"
  /^\d{4}년 \d{1,2}월 \d{1,2}일 (일|월|화|수|목|금|토)요일$/, // bare date separator (some exports drop the dashes)
];

// Old desktop-style export: "[김지원] [오후 3:21] 메시지"
const PATTERN_BRACKET =
  /^\[(?<speaker>[^\]]+)\]\s*\[(?<time>[^\]]+)\]\s*(?<message>[\s\S]*)$/;

// Modern mobile export: "2026년 8월 13일 오후 3:21, 김지원 : 메시지"
const PATTERN_DATE_COMMA =
  /^(?<date>\d{4}[.년]\s?\d{1,2}[.월]\s?\d{1,2}[.일]?\s*[가-힣]*요?일?\s*(오전|오후)?\s*\d{1,2}:\d{2}),\s*(?<speaker>[^:]+?)\s*:\s*(?<message>[\s\S]*)$/;

// Alternate mobile export without comma: "2026. 8. 13. 15:21 김지원 : 메시지"
const PATTERN_DATE_DOT =
  /^(?<date>\d{4}\.\s?\d{1,2}\.\s?\d{1,2}\.\s*(오전|오후)?\s*\d{1,2}:\d{2})\s+(?<speaker>[^:]+?)\s*:\s*(?<message>[\s\S]*)$/;

// Plain "speaker: message" - used both as a KakaoTalk fallback and as the
// primary pattern for manually pasted meeting notes / chat transcripts.
const PATTERN_SPEAKER_COLON =
  /^(?<speaker>[^\s:][^:]{0,30})\s*[:：]\s*(?<message>[\s\S]*)$/;

const DATE_SEPARATOR =
  /^-{0,}\s*(?<date>\d{4}년 \d{1,2}월 \d{1,2}일)\s*[가-힣]*요?일?\s*-{0,}$/;

function normalizeTimestamp(dateHint: string | null, timeRaw: string): string | null {
  // Best-effort normalization to "YYYY-MM-DD HH:mm". If we can't confidently
  // parse it, return null rather than guessing.
  const timeMatch = timeRaw.match(/(오전|오후)?\s*(\d{1,2}):(\d{2})/);
  if (!timeMatch) return null;
  let hour = parseInt(timeMatch[2], 10);
  const minute = timeMatch[3];
  const meridiem = timeMatch[1];
  if (meridiem === "오후" && hour < 12) hour += 12;
  if (meridiem === "오전" && hour === 12) hour = 0;
  const hh = String(hour).padStart(2, "0");

  let datePart = dateHint;
  if (!datePart) {
    const dateMatch = timeRaw.match(
      /(\d{4})[.년]\s?(\d{1,2})[.월]\s?(\d{1,2})[.일]?/
    );
    if (dateMatch) {
      datePart = `${dateMatch[1]}-${dateMatch[2].padStart(2, "0")}-${dateMatch[3].padStart(2, "0")}`;
    }
  } else {
    const dateMatch = datePart.match(
      /(\d{4})[.년]\s?(\d{1,2})[.월]\s?(\d{1,2})[.일]?/
    );
    if (dateMatch) {
      datePart = `${dateMatch[1]}-${dateMatch[2].padStart(2, "0")}-${dateMatch[3].padStart(2, "0")}`;
    } else {
      datePart = null;
    }
  }

  if (!datePart) return null;
  return `${datePart} ${hh}:${minute}`;
}

export function parseKakaoTalkTxt(raw: string): ParseResult {
  const lines = raw.split(/\r\n|\r|\n/);
  const messages: ParsedMessage[] = [];
  let currentDateHint: string | null = null;
  let matchedLineCount = 0;
  let candidateLineCount = 0;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;

    // Check date-separator lines before generic noise patterns, since a
    // separator like "--------------- 2026년 8월 13일 목요일 ---------------"
    // would otherwise also match the generic dashed-line noise pattern.
    const dateSep = line.trim().match(DATE_SEPARATOR);
    if (dateSep?.groups?.date) {
      currentDateHint = dateSep.groups.date;
      continue;
    }

    if (NOISE_PATTERNS.some((re) => re.test(line.trim()))) continue;

    candidateLineCount++;

    const bracketMatch = line.match(PATTERN_BRACKET);
    if (bracketMatch?.groups) {
      matchedLineCount++;
      const { speaker, time, message } = bracketMatch.groups;
      messages.push({
        timestamp: normalizeTimestamp(currentDateHint, time),
        speaker: speaker.trim(),
        message: message.trim(),
      });
      continue;
    }

    const dateCommaMatch = line.match(PATTERN_DATE_COMMA);
    if (dateCommaMatch?.groups) {
      matchedLineCount++;
      const { date, speaker, message } = dateCommaMatch.groups;
      messages.push({
        timestamp: normalizeTimestamp(date, date),
        speaker: speaker.trim(),
        message: message.trim(),
      });
      continue;
    }

    const dateDotMatch = line.match(PATTERN_DATE_DOT);
    if (dateDotMatch?.groups) {
      matchedLineCount++;
      const { date, speaker, message } = dateDotMatch.groups;
      messages.push({
        timestamp: normalizeTimestamp(date, date),
        speaker: speaker.trim(),
        message: message.trim(),
      });
      continue;
    }

    const speakerColonMatch = line.match(PATTERN_SPEAKER_COLON);
    if (speakerColonMatch?.groups) {
      matchedLineCount++;
      const { speaker, message } = speakerColonMatch.groups;
      messages.push({
        timestamp: normalizeTimestamp(currentDateHint, ""),
        speaker: speaker.trim(),
        message: message.trim(),
      });
      continue;
    }

    // Continuation of the previous message (multi-line message body), a
    // common occurrence in KakaoTalk exports.
    if (messages.length > 0) {
      messages[messages.length - 1].message += "\n" + line.trim();
    }
  }

  // If we couldn't confidently identify speaker/message structure for most
  // lines, signal fallback so the caller can send raw text to the AI.
  const usedFallback =
    candidateLineCount === 0 || matchedLineCount / candidateLineCount < 0.3;

  return { messages: messages.filter((m) => m.message.length > 0), usedFallback };
}

/** Parses manually pasted text (meeting notes, chat-style transcripts). */
export function parseManualText(raw: string): ParseResult {
  // Manual text is usually already "speaker: message" per line, so we can
  // reuse the same parser - it handles that pattern plus continuation lines.
  return parseKakaoTalkTxt(raw);
}

export function parseConversation(
  raw: string,
  type: "KAKAO_TEXT" | "MANUAL_TEXT"
): ParseResult {
  if (type === "KAKAO_TEXT") return parseKakaoTalkTxt(raw);
  return parseManualText(raw);
}
