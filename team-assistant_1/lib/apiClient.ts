"use client";

import type {
  EvidenceDTO,
  MemberContribution,
  RecentChangeDTO,
  TaskDTO,
  TaskStatus,
} from "@/lib/types";

export interface Project {
  id: string;
  name: string;
  status: "ACTIVE" | "COMPLETED";
  completedAt: number | null;
  createdAt: number | string;
  updatedAt: number | string;
}

export interface Member {
  id: string;
  projectId: string;
  name: string;
  claimed: boolean;
  claimedByMe: boolean;
  isLeader: boolean;
  role: "OWNER" | "MEMBER" | null;
  avatarEmoji: string;
  createdAt: number | string;
}

export interface RecordItem {
  id: string;
  projectId: string;
  type: "KAKAO_TEXT" | "MANUAL_TEXT";
  rawContent: string;
  analysisStatus: "PENDING" | "ANALYZING" | "COMPLETED" | "FAILED";
  analysisError: string | null;
  analyzedAt: number | string | null;
  createdAt: number | string;
}

export interface ProfileUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarEmoji: string;
}

export interface ContributionHistoryMember {
  memberId: string;
  name: string;
  avatarEmoji: string;
  percentage: number;
}

export interface ContributionHistorySnapshot {
  id: string;
  createdAt: number;
  sequence: number;
  members: ContributionHistoryMember[];
}

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // no body
  }
  if (!res.ok) {
    const message =
      body && typeof body === "object" && "error" in body
        ? String((body as { error: unknown }).error)
        : "요청 처리 중 오류가 발생했습니다.";
    throw new ApiError(message);
  }
  return body as T;
}

// Projects
export const listProjects = () => request<{ projects: Project[] }>("/api/projects");
export const createProject = (name: string) =>
  request<{ project: Project }>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
export const getProject = (projectId: string) =>
  request<{
    project: Project;
    members: Member[];
    currentUserRole: "OWNER" | "MEMBER";
  }>(`/api/projects/${projectId}`);
export const joinProjectByCode = (code: string) =>
  request<{ projectId: string }>("/api/projects/join", {
    method: "POST",
    body: JSON.stringify({ code }),
  });

// Invite code
export const getInviteCode = (projectId: string) =>
  request<{ code: string }>(`/api/projects/${projectId}/invite-code`);
export const regenerateInviteCode = (projectId: string) =>
  request<{ code: string }>(`/api/projects/${projectId}/invite-code`, {
    method: "POST",
  });

// Members
export const listMembers = (projectId: string) =>
  request<{ members: Member[] }>(`/api/projects/${projectId}/members`);
export const addMember = (projectId: string, name: string) =>
  request<{ member: Member }>(`/api/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
export const deleteMember = (projectId: string, memberId: string) =>
  request<{ ok: true }>(`/api/projects/${projectId}/members/${memberId}`, {
    method: "DELETE",
  });
export const transferProjectOwner = (projectId: string, memberId: string) =>
  request<{ ok: true }>(`/api/projects/${projectId}/transfer-owner`, {
    method: "POST",
    body: JSON.stringify({ memberId }),
  });
export const completeProject = (projectId: string) =>
  request<{ project: Project; snapshotId: string }>(
    `/api/projects/${projectId}/complete`,
    { method: "POST" }
  );
export const reopenProject = (projectId: string) =>
  request<{ project: Project }>(`/api/projects/${projectId}/reopen`, {
    method: "POST",
  });

// Profile
export const getProfile = () =>
  request<{ user: ProfileUser }>("/api/profile");
export const updateProfileAvatar = (avatarEmoji: string) =>
  request<{ avatarEmoji: string }>("/api/profile/avatar", {
    method: "PATCH",
    body: JSON.stringify({ avatarEmoji }),
  });
export const changePassword = (
  currentPassword: string,
  newPassword: string
) =>
  request<{ ok: true; message: string }>("/api/profile/password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

// Records
export const listRecords = (projectId: string) =>
  request<{ records: RecordItem[] }>(`/api/projects/${projectId}/records`);
export const createRecord = (
  projectId: string,
  type: "KAKAO_TEXT" | "MANUAL_TEXT",
  rawContent: string
) =>
  request<{ record: RecordItem }>(`/api/projects/${projectId}/records`, {
    method: "POST",
    body: JSON.stringify({ type, rawContent }),
  });
export const analyzeRecord = (
  projectId: string,
  recordId: string,
  force = false
) =>
  request<{
    changes: RecentChangeDTO[];
    contribution: MemberContribution[];
    usedFallback: boolean;
    eventCount: number;
  }>(`/api/projects/${projectId}/records/${recordId}/analyze`, {
    method: "POST",
    body: JSON.stringify({ force }),
  });

// Tasks
export const listTasks = (projectId: string) =>
  request<{ tasks: TaskDTO[] }>(`/api/projects/${projectId}/tasks`);
export const getTask = (projectId: string, taskId: string) =>
  request<{ task: TaskDTO; evidence: EvidenceDTO[]; members: Member[] }>(
    `/api/projects/${projectId}/tasks/${taskId}`
  );
export const updateTask = (
  projectId: string,
  taskId: string,
  updates: Partial<{
    title: string;
    status: TaskStatus;
    assigneeId: string | null;
    contributors: { memberId: string; share: number }[];
  }>
) =>
  request<{ task: TaskDTO }>(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
export const deleteTask = (projectId: string, taskId: string) =>
  request<{ ok: true }>(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
  });

// Contribution / recent changes
export const getContribution = (projectId: string) =>
  request<{ contribution: MemberContribution[]; lastSnapshotAt: number | null }>(
    `/api/projects/${projectId}/contribution`
  );
export const getContributionHistory = (projectId: string) =>
  request<{ snapshots: ContributionHistorySnapshot[] }>(
    `/api/projects/${projectId}/contribution/history`
  );
export const getRecentChanges = (projectId: string) =>
  request<{ recordId: string | null; analyzedAt: number | null; changes: RecentChangeDTO[] }>(
    `/api/projects/${projectId}/recent-changes`
  );

export { ApiError };
