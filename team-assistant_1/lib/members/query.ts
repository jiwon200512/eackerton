import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { members, users } from "@/lib/db/schema";
import { normalizeAvatarEmoji } from "@/lib/avatar";

export async function loadProjectMembersWithAvatars(projectId: string) {
  const rows = await db
    .select({
      member: members,
      linkedAvatarEmoji: users.avatarEmoji,
    })
    .from(members)
    .leftJoin(users, eq(members.userId, users.id))
    .where(eq(members.projectId, projectId));

  return rows.map((row) => ({
    member: row.member,
    avatarEmoji: normalizeAvatarEmoji(row.linkedAvatarEmoji),
  }));
}
