// Shared domain types used across services, API routes, and UI.

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const RECORD_TYPES = ["KAKAO_TEXT", "MANUAL_TEXT"] as const;
export type RecordType = (typeof RECORD_TYPES)[number];

export const ANALYSIS_STATUSES = [
  "PENDING",
  "ANALYZING",
  "COMPLETED",
  "FAILED",
] as const;
export type AnalysisStatus = (typeof ANALYSIS_STATUSES)[number];

export const EVENT_TYPES = [
  "TASK_CREATE",
  "TASK_STATUS_CHANGE",
  "TASK_ASSIGNEE_CHANGE",
  "TASK_UPDATE",
  "EVIDENCE_ADD",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export interface ParsedMessage {
  timestamp: string | null;
  speaker: string;
  message: string;
}

export interface TaskDTO {
  id: string;
  projectId: string;
  title: string;
  assigneeId: string | null;
  assigneeName: string | null;
  status: TaskStatus;
  importance: number;
  difficulty: number;
  workload: number;
  taskScore: number;
  currentScore: number;
  lastReason: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface MemberDTO {
  id: string;
  projectId: string;
  name: string;
  // Whether some account has claimed this name tag, and whether it's the
  // requesting user specifically - the actual userId is intentionally not
  // exposed to the client.
  claimed: boolean;
  claimedByMe: boolean;
  isLeader: boolean;
  role: ProjectRole | null;
  createdAt: number | string;
}

export type ProjectRole = "OWNER" | "MEMBER";

export interface EvidenceDTO {
  id: string;
  taskId: string;
  recordId: string;
  speaker: string;
  text: string;
  timestamp: string | null;
  createdAt: number | string;
}

export interface MemberContribution {
  memberId: string;
  name: string;
  rawScore: number;
  percentage: number;
  deltaPercentage: number | null;
}

export interface RecentChangeDTO {
  id: string;
  taskId: string | null;
  taskTitle: string;
  changeType: EventType;
  summary: string;
  reason: string | null;
  confidence: number | null;
  createdAt: number;
}
