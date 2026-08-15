export const PROJECT_STATUS = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
} as const;

export type ProjectStatus =
  (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export function isProjectStatus(value: unknown): value is ProjectStatus {
  return Object.values(PROJECT_STATUS).includes(value as ProjectStatus);
}
