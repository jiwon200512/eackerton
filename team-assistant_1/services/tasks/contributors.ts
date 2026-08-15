import { eq, inArray } from "drizzle-orm";
import type { ResultSet } from "@libsql/client";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { taskContributors } from "@/lib/db/schema";
import type * as schema from "@/lib/db/schema";
import type { TaskContributorDTO } from "@/lib/types";

type DB = BaseSQLiteDatabase<"async", ResultSet, typeof schema>;

export interface ContributorShare {
  memberId: string;
  share: number;
}

export function normalizeContributorShares<T extends ContributorShare>(
  contributors: T[]
): T[] {
  if (contributors.length === 0 || contributors.length > 100) return [];
  const total = contributors.reduce((sum, contributor) => sum + contributor.share, 0);
  if (!Number.isFinite(total) || total <= 0) return [];

  const exact = contributors.map((contributor) => (contributor.share / total) * 100);
  const floored = exact.map(Math.floor);
  let remainder = 100 - floored.reduce((sum, share) => sum + share, 0);
  const order = exact
    .map((share, index) => ({ index, fraction: share - Math.floor(share) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  const normalized = [...floored];
  for (let index = 0; remainder > 0; index += 1, remainder -= 1) {
    normalized[order[index % order.length].index] += 1;
  }
  for (let index = 0; index < normalized.length; index += 1) {
    if (normalized[index] > 0) continue;
    const donor = normalized
      .map((share, donorIndex) => ({ share, donorIndex }))
      .filter((candidate) => candidate.share > 1)
      .sort((a, b) => b.share - a.share || a.donorIndex - b.donorIndex)[0];
    if (!donor) return [];
    normalized[donor.donorIndex] -= 1;
    normalized[index] = 1;
  }

  return contributors.map((contributor, index) => ({
    ...contributor,
    share: normalized[index],
  }));
}

export function validateExactContributorShares(
  contributors: ContributorShare[]
): boolean {
  if (contributors.length === 0) return true;
  const memberIds = new Set<string>();
  let total = 0;
  for (const contributor of contributors) {
    if (
      !contributor.memberId ||
      memberIds.has(contributor.memberId) ||
      !Number.isInteger(contributor.share) ||
      contributor.share < 1 ||
      contributor.share > 100
    ) {
      return false;
    }
    memberIds.add(contributor.memberId);
    total += contributor.share;
  }
  return total === 100;
}

export async function loadTaskContributorRows(dbLike: DB, taskIds: string[]) {
  if (taskIds.length === 0) return [];
  return dbLike
    .select()
    .from(taskContributors)
    .where(inArray(taskContributors.taskId, taskIds));
}

export function groupContributorRowsByTask(
  rows: Array<{ taskId: string; memberId: string; share: number }>
) {
  const grouped = new Map<string, ContributorShare[]>();
  for (const row of rows) {
    const list = grouped.get(row.taskId) ?? [];
    list.push({ memberId: row.memberId, share: row.share });
    grouped.set(row.taskId, list);
  }
  return grouped;
}

export function buildContributorDTOsByTask(
  rows: Array<{ taskId: string; memberId: string; share: number }>,
  memberById: Map<string, { name: string; avatarEmoji: string }>
) {
  const grouped = new Map<string, TaskContributorDTO[]>();
  for (const row of rows) {
    const member = memberById.get(row.memberId);
    if (!member) continue;
    const list = grouped.get(row.taskId) ?? [];
    list.push({
      memberId: row.memberId,
      name: member.name,
      avatarEmoji: member.avatarEmoji,
      share: row.share,
    });
    grouped.set(row.taskId, list);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => b.share - a.share || a.name.localeCompare(b.name, "ko"));
  }
  return grouped;
}

export async function replaceTaskContributors(
  tx: DB,
  taskId: string,
  contributors: ContributorShare[]
) {
  if (!validateExactContributorShares(contributors)) {
    throw new Error("Task contributor shares must be unique and sum to 100");
  }
  await tx.delete(taskContributors).where(eq(taskContributors.taskId, taskId)).run();
  if (contributors.length > 0) {
    await tx
      .insert(taskContributors)
      .values(contributors.map((contributor) => ({ taskId, ...contributor })))
      .run();
  }
}
