import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { projects, projectUsers } from "@/lib/db/schema";
import { Errors } from "@/lib/errors";

// Returns the project only if the given user has been granted access to it
// (owner or joined via invite code). Throws a 404 - not 403 - for both a
// nonexistent project and one the user isn't a member of, so unauthorized
// requests can't be used to probe which project IDs exist.
export async function requireProjectAccess(projectId: string, userId: string) {
  const [row] = await db
    .select({ project: projects })
    .from(projectUsers)
    .innerJoin(projects, eq(projectUsers.projectId, projects.id))
    .where(and(eq(projectUsers.projectId, projectId), eq(projectUsers.userId, userId)));
  if (!row) throw Errors.notFound("프로젝트");
  return row.project;
}
