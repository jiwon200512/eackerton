import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { evidence, manualTaskChanges, members, tasks } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { AppError, Errors, toErrorResponse } from "@/lib/errors";
import { TASK_STATUSES } from "@/lib/types";
import { toTaskDTO } from "@/lib/taskDto";
import { requireUser } from "@/lib/auth/session";
import {
  getProjectOwnerUserId,
  assertProjectIsActive,
  requireProjectAccess,
} from "@/lib/projects/access";
import { toMemberDTO } from "@/lib/memberDto";
import { loadProjectMembersWithAvatars } from "@/lib/members/query";
import {
  buildContributorDTOsByTask,
  loadTaskContributorRows,
  replaceTaskContributors,
  validateExactContributorShares,
  type ContributorShare,
} from "@/services/tasks/contributors";

type Params = { params: Promise<{ projectId: string; taskId: string }> };

const STATUS_LABEL = {
  TODO: "할 일",
  IN_PROGRESS: "진행 중",
  DONE: "완료",
} as const;

function contributorSummary(
  contributors: ContributorShare[],
  memberNameById: Map<string, string>
) {
  return contributors.length > 0
    ? contributors
        .map(
          (contributor) =>
            `${memberNameById.get(contributor.memberId) ?? "알 수 없는 팀원"} ${contributor.share}%`
        )
        .join(" / ")
    : "참여자 없음";
}

async function loadTask(projectId: string, taskId: string) {
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId), eq(tasks.isDeleted, false)));
  return task;
}

async function serializeTask(projectId: string, task: NonNullable<Awaited<ReturnType<typeof loadTask>>>) {
  const [memberProfiles, contributorRows] = await Promise.all([
    loadProjectMembersWithAvatars(projectId),
    loadTaskContributorRows(db, [task.id]),
  ]);
  const memberById = new Map(
    memberProfiles.map(({ member, avatarEmoji }) => [
      member.id,
      { name: member.name, avatarEmoji },
    ])
  );
  const contributorsByTask = buildContributorDTOsByTask(
    contributorRows,
    memberById
  );
  return toTaskDTO(
    task,
    task.assigneeId ? memberById.get(task.assigneeId) ?? null : null,
    contributorsByTask.get(task.id) ?? []
  );
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId, taskId } = await params;
    await requireProjectAccess(projectId, user.id);
    const task = await loadTask(projectId, taskId);
    if (!task) throw Errors.notFound("Task");

    const [evidenceRows, memberProfiles, ownerUserId, contributorRows] = await Promise.all([
      db
        .select()
        .from(evidence)
        .where(eq(evidence.taskId, taskId))
        .orderBy(desc(evidence.createdAt)),
      loadProjectMembersWithAvatars(projectId),
      getProjectOwnerUserId(projectId),
      loadTaskContributorRows(db, [taskId]),
    ]);
    const memberById = new Map(
      memberProfiles.map(({ member, avatarEmoji }) => [
        member.id,
        { name: member.name, avatarEmoji },
      ])
    );
    const contributorsByTask = buildContributorDTOsByTask(
      contributorRows,
      memberById
    );

    return NextResponse.json({
      task: toTaskDTO(
        task,
        task.assigneeId ? memberById.get(task.assigneeId) ?? null : null,
        contributorsByTask.get(task.id) ?? []
      ),
      evidence: evidenceRows,
      members: memberProfiles.map(({ member, avatarEmoji }) =>
        toMemberDTO(member, user.id, ownerUserId, avatarEmoji)
      ),
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

// Manual user edits (spec #14): title / assignee / status. Once a user
// edits a task here, this becomes the authoritative current state - the
// next AI analysis reads it straight from this table, so edits are never
// silently reverted by a later record analysis.
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId, taskId } = await params;
    const project = await requireProjectAccess(projectId, user.id);
    assertProjectIsActive(project);
    const task = await loadTask(projectId, taskId);
    if (!task) throw Errors.notFound("Task");

    const body = await req.json().catch(() => ({}));
    const updates: Partial<typeof tasks.$inferInsert> = {};
    let contributorUpdate: ContributorShare[] | undefined;
    const manualSummaryParts: string[] = [];

    if (body.title !== undefined) {
      const title = typeof body.title === "string" ? body.title.trim() : "";
      if (!title) throw new AppError("INVALID_TITLE", "Task 이름을 입력해주세요.", 400);
      updates.title = title;
      if (title !== task.title) {
        manualSummaryParts.push(`제목: "${task.title}" → "${title}"`);
      }
    }

    if (body.status !== undefined) {
      if (!TASK_STATUSES.includes(body.status)) {
        throw new AppError("INVALID_STATUS", "잘못된 상태 값입니다.", 400);
      }
      updates.status = body.status;
      if (body.status !== task.status) {
        manualSummaryParts.push(
          `상태: ${STATUS_LABEL[task.status as keyof typeof STATUS_LABEL]} → ${STATUS_LABEL[body.status as keyof typeof STATUS_LABEL]}`
        );
      }
    }

    if (body.assigneeId !== undefined && body.contributors !== undefined) {
      throw new AppError(
        "AMBIGUOUS_CONTRIBUTORS",
        "담당자와 참여자 목록을 동시에 수정할 수 없습니다.",
        400
      );
    }

    if (body.contributors !== undefined) {
      if (!Array.isArray(body.contributors)) {
        throw new AppError("INVALID_CONTRIBUTORS", "참여자 목록 형식이 올바르지 않습니다.", 400);
      }
      const parsedContributors: ContributorShare[] = body.contributors.map((item: unknown) => {
        if (!item || typeof item !== "object") {
          throw new AppError("INVALID_CONTRIBUTORS", "참여자 목록 형식이 올바르지 않습니다.", 400);
        }
        const candidate = item as { memberId?: unknown; share?: unknown };
        if (typeof candidate.memberId !== "string" || typeof candidate.share !== "number") {
          throw new AppError("INVALID_CONTRIBUTORS", "참여자와 비율을 확인해주세요.", 400);
        }
        return { memberId: candidate.memberId, share: candidate.share };
      });
      if (!validateExactContributorShares(parsedContributors)) {
        throw new AppError(
          "INVALID_CONTRIBUTOR_SHARES",
          "참여자 비율은 1~100 정수이며 중복 없이 합계가 100이어야 합니다.",
          400
        );
      }
      if (parsedContributors.length > 0) {
        const projectMembers = await db
          .select({ id: members.id })
          .from(members)
          .where(eq(members.projectId, projectId));
        const validMemberIds = new Set(projectMembers.map((member) => member.id));
        if (parsedContributors.some((contributor) => !validMemberIds.has(contributor.memberId))) {
          throw new AppError(
            "INVALID_CONTRIBUTOR",
            "프로젝트에 속한 팀원만 참여자로 지정할 수 있습니다.",
            400
          );
        }
      }
      contributorUpdate = parsedContributors.map((contributor) => ({
        ...contributor,
        source: "MANUAL" as const,
      }));
      updates.assigneeId =
        parsedContributors.length === 1 ? parsedContributors[0].memberId : null;
    } else if (body.assigneeId !== undefined) {
      if (body.assigneeId === null) {
        updates.assigneeId = null;
        contributorUpdate = [];
      } else {
        const [assignee] = await db
          .select()
          .from(members)
          .where(and(eq(members.id, body.assigneeId), eq(members.projectId, projectId)));
        if (!assignee) {
          throw new AppError(
            "INVALID_ASSIGNEE",
            "프로젝트에 속한 팀원만 담당자로 지정할 수 있습니다.",
            400
          );
        }
        updates.assigneeId = assignee.id;
        contributorUpdate = [
          { memberId: assignee.id, share: 100, source: "MANUAL" },
        ];
      }
    }

    if (contributorUpdate !== undefined) {
      const [projectMemberRows, previousContributorRows] = await Promise.all([
        db
          .select({ id: members.id, name: members.name })
          .from(members)
          .where(eq(members.projectId, projectId)),
        loadTaskContributorRows(db, [taskId]),
      ]);
      const memberNameById = new Map(
        projectMemberRows.map((member) => [member.id, member.name])
      );
      const previousContributors: ContributorShare[] =
        previousContributorRows.length > 0
          ? previousContributorRows.map((contributor) => ({
              memberId: contributor.memberId,
              share: contributor.share,
              source:
                contributor.source === "AI" || contributor.source === "MANUAL"
                  ? contributor.source
                  : null,
            }))
          : task.assigneeId
            ? [{ memberId: task.assigneeId, share: 100, source: null }]
            : [];
      manualSummaryParts.push(
        `참여자: ${contributorSummary(previousContributors, memberNameById)} → ${contributorSummary(contributorUpdate, memberNameById)}`
      );
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({
        task: await serializeTask(projectId, task),
      });
    }

    updates.updatedAt = new Date();
    const updated = await db.transaction(async (tx) => {
      const [updatedTask] = await tx
        .update(tasks)
        .set(updates)
        .where(eq(tasks.id, taskId))
        .returning();
      if (contributorUpdate !== undefined) {
        await replaceTaskContributors(tx, taskId, contributorUpdate);
      }
      if (manualSummaryParts.length > 0) {
        await tx
          .insert(manualTaskChanges)
          .values({
            projectId,
            taskId,
            actorUserId: user.id,
            taskTitle: updatedTask.title,
            changeType:
              contributorUpdate !== undefined
                ? "TASK_CONTRIBUTORS_CHANGE"
                : body.status !== undefined
                  ? "TASK_STATUS_CHANGE"
                  : "TASK_UPDATE",
            summary: manualSummaryParts.join(" · "),
          })
          .run();
      }
      return updatedTask;
    });

    return NextResponse.json({
      task: await serializeTask(projectId, updated),
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId, taskId } = await params;
    const project = await requireProjectAccess(projectId, user.id);
    assertProjectIsActive(project);
    const task = await loadTask(projectId, taskId);
    if (!task) throw Errors.notFound("Task");

    await db.transaction(async (tx) => {
      await replaceTaskContributors(tx, taskId, []);
      await tx
        .update(tasks)
        .set({ isDeleted: true, updatedAt: new Date() })
        .where(eq(tasks.id, taskId))
        .run();
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
