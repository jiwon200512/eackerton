/**
 * One-time backfill for the invite-code / project-access feature.
 *
 * Before this feature, every logged-in user could see every project (no
 * access control existed). Projects created before this migration have no
 * `project_users` rows, which would make them invisible to everyone once
 * access checks go live. This grants every existing user access to any
 * project that currently has none, preserving pre-migration behavior for
 * old data. New projects created after this point only grant access to
 * their creator (and whoever joins via invite code).
 *
 * Usage: npx tsx scripts/backfillProjectAccess.ts
 */
import { db } from "../lib/db/client";
import { projects, users, projectUsers } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const allProjects = await db.select().from(projects);
  const allUsers = await db.select().from(users);

  if (allUsers.length === 0) {
    console.log("No users exist yet - nothing to backfill.");
    return;
  }

  for (const project of allProjects) {
    const existing = await db
      .select()
      .from(projectUsers)
      .where(eq(projectUsers.projectId, project.id));
    if (existing.length > 0) {
      console.log(`Skipping "${project.name}" - already has ${existing.length} member(s).`);
      continue;
    }

    for (const user of allUsers) {
      await db.insert(projectUsers).values({
        projectId: project.id,
        userId: user.id,
        role: "MEMBER",
      });
    }
    console.log(`Backfilled ${allUsers.length} user(s) into "${project.name}".`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
