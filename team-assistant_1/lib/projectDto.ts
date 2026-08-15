import type { ProjectStatus } from "@/lib/projects/status";

interface ProjectRow {
  id: string;
  name: string;
  status: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toProjectDTO(project: ProjectRow) {
  return {
    id: project.id,
    name: project.name,
    status: project.status as ProjectStatus,
    completedAt: project.completedAt?.getTime() ?? null,
    createdAt: project.createdAt.getTime(),
    updatedAt: project.updatedAt.getTime(),
  };
}
