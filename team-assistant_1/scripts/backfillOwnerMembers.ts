/**
 * Idempotently links every project OWNER to a contribution member row.
 * Run manually after deploying this feature; it is never executed at boot.
 *
 * Usage: npm run backfill:owner-members
 */
import { and, eq, isNull } from "drizzle-orm";
import { client, db } from "../lib/db/client";
import { members, projectUsers, users } from "../lib/db/schema";
import { normalizePersonName } from "../lib/personName";

async function main() {
  const owners = await db
    .select({ projectId: projectUsers.projectId, user: users })
    .from(projectUsers)
    .innerJoin(users, eq(projectUsers.userId, users.id))
    .where(eq(projectUsers.role, "OWNER"));

  let created = 0;
  let linked = 0;
  for (const owner of owners) {
    const projectMembers = await db
      .select()
      .from(members)
      .where(eq(members.projectId, owner.projectId));
    if (projectMembers.some((member) => member.userId === owner.user.id)) continue;

    const normalizedOwnerName = normalizePersonName(owner.user.name);
    const unclaimedMatches = projectMembers.filter(
      (member) =>
        member.userId === null &&
        normalizePersonName(member.name) === normalizedOwnerName
    );
    if (unclaimedMatches.length === 1) {
      await db
        .update(members)
        .set({ userId: owner.user.id })
        .where(
          and(
            eq(members.id, unclaimedMatches[0].id),
            isNull(members.userId)
          )
        );
      linked++;
      continue;
    }

    await db.insert(members).values({
      projectId: owner.projectId,
      userId: owner.user.id,
      name: owner.user.name,
    });
    created++;
  }

  console.log(
    `Owner member backfill complete: ${linked} existing row(s) linked, ${created} row(s) created.`
  );
}

main()
  .then(() => client.close())
  .catch((error) => {
    console.error("Owner member backfill failed:", error instanceof Error ? error.message : "unknown error");
    client.close();
    process.exitCode = 1;
  });
