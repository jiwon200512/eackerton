import { computeCurrentTaskScore, computeTaskScore } from "@/services/contribution/calculate";
import type { TaskStatus, TaskDTO } from "@/lib/types";
import { DEFAULT_AVATAR_EMOJI, normalizeAvatarEmoji } from "@/lib/avatar";

interface TaskRow {
  id: string;
  projectId: string;
  title: string;
  assigneeId: string | null;
  status: string;
  importance: number;
  difficulty: number;
  workload: number;
  lastReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toTaskDTO(
  task: TaskRow,
  assignee: { name: string; avatarEmoji: string } | null
): TaskDTO {
  const status = task.status as TaskStatus;
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    assigneeId: task.assigneeId,
    assigneeName: assignee?.name ?? null,
    assigneeAvatarEmoji: normalizeAvatarEmoji(
      assignee?.avatarEmoji ?? DEFAULT_AVATAR_EMOJI
    ),
    status,
    importance: task.importance,
    difficulty: task.difficulty,
    workload: task.workload,
    taskScore: Math.round(computeTaskScore(task) * 100) / 100,
    currentScore: Math.round(computeCurrentTaskScore({ ...task, status }) * 100) / 100,
    lastReason: task.lastReason,
    createdAt: task.createdAt.getTime(),
    updatedAt: task.updatedAt.getTime(),
  };
}
