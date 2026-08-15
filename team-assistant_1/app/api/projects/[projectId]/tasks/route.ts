import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { tasks } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { toErrorResponse } from "@/lib/errors";
import { toTaskDTO } from "@/lib/taskDto";
import type { TaskDTO, TaskStatus } from "@/lib/types";
import { requireUser } from "@/lib/auth/session";
import { requireProjectAccess } from "@/lib/projects/access";
import { loadProjectMembersWithAvatars } from "@/lib/members/query";
import {
  buildContributorDTOsByTask,
  loadTaskContributorRows,
} from "@/services/tasks/contributors";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    await requireProjectAccess(projectId, user.id);
    const [taskRows, memberRows] = await Promise.all([
      db
        .select()
        .from(tasks)
        .where(and(eq(tasks.projectId, projectId), eq(tasks.isDeleted, false))),
      loadProjectMembersWithAvatars(projectId),
    ]);
    const memberById = new Map(
      memberRows.map(({ member, avatarEmoji }) => [
        member.id,
        { name: member.name, avatarEmoji },
      ])
    );
    const contributorRows = await loadTaskContributorRows(
      db,
      taskRows.map((task) => task.id)
    );
    const contributorsByTask = buildContributorDTOsByTask(
      contributorRows,
      memberById
    );

    const dtos: TaskDTO[] = taskRows.map((t) =>
      toTaskDTO(
        t,
        t.assigneeId ? memberById.get(t.assigneeId) ?? null : null,
        contributorsByTask.get(t.id) ?? []
      )
    );

    // Stable, readable ordering for the dashboard: in-progress first, then
    // todo, then done, newest-updated first within each group.
    const statusOrder: Record<TaskStatus, number> = {
      IN_PROGRESS: 0,
      TODO: 1,
      DONE: 2,
    };
    dtos.sort((a, b) => {
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return b.updatedAt - a.updatedAt;
    });

    return NextResponse.json({ tasks: dtos });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
