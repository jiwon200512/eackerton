import type { ParsedMessage, TaskStatus } from "@/lib/types";

export interface ContextTask {
  id: string;
  title: string;
  assignee: string | null;
  status: TaskStatus;
  importance: number;
  difficulty: number;
  workload: number;
  contributors: {
    memberName: string;
    share: number;
    source: "AI" | "MANUAL" | null;
  }[];
  recentEvidence: string[];
}

export interface AIContext {
  members: string[];
  currentTasks: ContextTask[];
  newMessages: { speaker: string; message: string; timestamp: string | null }[];
}

/**
 * Builds the exact context object handed to the AI: current authoritative
 * project state (members + tasks + a sample of evidence) plus the new
 * record's messages. This is what lets the AI compare against existing
 * state instead of re-deriving everything from scratch every time.
 */
export function buildAIContext(
  memberNames: string[],
  currentTasks: ContextTask[],
  newMessages: ParsedMessage[]
): AIContext {
  return {
    members: memberNames,
    currentTasks,
    newMessages: newMessages.map((m) => ({
      speaker: m.speaker,
      message: m.message,
      timestamp: m.timestamp,
    })),
  };
}
