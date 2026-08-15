import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

const TEST_DB = path.join(process.cwd(), "data", "test-task-contributors.db");
const authUser = vi.hoisted(() => ({
  id: "contributors-owner",
  username: "contributors-owner",
  name: "박준영",
  email: "contributors-owner@example.com",
  avatarEmoji: "🐼",
}));

vi.mock("@/lib/auth/session", () => ({
  requireUser: vi.fn(async () => authUser),
}));

function cleanTestDb() {
  for (const suffix of ["", "-wal", "-shm", "-journal"]) {
    const file = TEST_DB + suffix;
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

const projectParams = (projectId: string) => ({ params: Promise.resolve({ projectId }) });
const taskParams = (projectId: string, taskId: string) => ({ params: Promise.resolve({ projectId, taskId }) });
const request = (method = "GET", body?: unknown) => new NextRequest("http://localhost/test", {
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

beforeAll(async () => {
  cleanTestDb();
  process.env.TURSO_DATABASE_URL = `file:${TEST_DB}`;
  const { db } = await import("@/lib/db/client");
  const { migrate } = await import("drizzle-orm/libsql/migrator");
  const { users } = await import("@/lib/db/schema");
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  await db.insert(users).values({
    id: authUser.id,
    username: authUser.username,
    name: authUser.name,
    email: authUser.email,
    passwordHash: "test",
    avatarEmoji: authUser.avatarEmoji,
  });
});

afterAll(async () => {
  const { client } = await import("@/lib/db/client");
  client.close();
});

describe("Task contributor storage and API", () => {
  it("supports shared Tasks, legacy fallback, validation, snapshots and cleanup", async () => {
    const { and, eq } = await import("drizzle-orm");
    const { db } = await import("@/lib/db/client");
    const {
      contributionSnapshots,
      members,
      projects,
      records,
      taskContributors,
      tasks,
    } = await import("@/lib/db/schema");
    const projectRoutes = await import("@/app/api/projects/route");
    const memberRoutes = await import("@/app/api/projects/[projectId]/members/route");
    const memberDetail = await import("@/app/api/projects/[projectId]/members/[memberId]/route");
    const taskRoutes = await import("@/app/api/projects/[projectId]/tasks/route");
    const taskDetail = await import("@/app/api/projects/[projectId]/tasks/[taskId]/route");
    const contributionRoute = await import("@/app/api/projects/[projectId]/contribution/route");
    const completeRoute = await import("@/app/api/projects/[projectId]/complete/route");
    const reopenRoute = await import("@/app/api/projects/[projectId]/reopen/route");

    const createResponse = await projectRoutes.POST(request("POST", { name: "공동작업 테스트" }));
    const { project } = await createResponse.json();
    const projectId = project.id as string;
    const [ownerMember] = await db
      .select()
      .from(members)
      .where(and(eq(members.projectId, projectId), eq(members.userId, authUser.id)));

    const partnerResponse = await memberRoutes.POST(
      request("POST", { name: "김민수" }),
      projectParams(projectId)
    );
    const { member: partner } = await partnerResponse.json();
    const [otherProject] = await db.insert(projects).values({ name: "다른 프로젝트" }).returning();
    const [outsider] = await db.insert(members).values({ projectId: otherProject.id, name: "외부 팀원" }).returning();

    const [legacyTask] = await db.insert(tasks).values({
      projectId,
      title: "로그인 기능",
      assigneeId: ownerMember.id,
      status: "DONE",
      importance: 5,
      difficulty: 5,
      workload: 5,
    }).returning();

    const legacyListResponse = await taskRoutes.GET(request(), projectParams(projectId));
    const legacyListBody = await legacyListResponse.json();
    expect(legacyListBody.tasks[0].contributors).toEqual([
      expect.objectContaining({ memberId: ownerMember.id, share: 100 }),
    ]);

    const [aiRecord] = await db.insert(records).values({
      projectId,
      type: "MANUAL_TEXT",
      rawContent: "김민수: DB 연결과 사용자 조회는 제가 구현했습니다.",
    }).returning();
    const { applyTaskEvents } = await import("@/services/tasks/applyEvents");
    const aiChanges = await db.transaction((tx) => applyTaskEvents(
      tx,
      projectId,
      aiRecord.id,
      [{
        type: "TASK_CONTRIBUTORS_CHANGE",
        existingTaskId: legacyTask.id,
        taskTitle: legacyTask.title,
        assigneeName: null,
        previousAssigneeName: "박준영",
        contributors: [
          { memberName: "박준영", share: 60 },
          { memberName: "김민수", share: 40 },
        ],
        status: null,
        previousStatus: null,
        confidence: 0.9,
        evidence: [{ speaker: "김민수", text: "DB 연결과 사용자 조회는 제가 구현했습니다." }],
        evaluation: null,
        reason: "실제 세부 업무 수행 근거가 추가됨",
      }],
      new Map([["박준영", ownerMember.id], ["김민수", partner.id]]),
      new Map([[legacyTask.id, {
        id: legacyTask.id,
        title: legacyTask.title,
        assigneeId: ownerMember.id,
        status: "DONE",
        importance: 5,
        difficulty: 5,
        workload: 5,
        contributors: [{ memberId: ownerMember.id, memberName: "박준영", share: 100 }],
      }]])
    ));
    expect(aiChanges).toEqual([
      expect.objectContaining({
        changeType: "TASK_CONTRIBUTORS_CHANGE",
        summary: expect.stringContaining("김민수 40%"),
      }),
    ]);

    const beforeHelpOnly = await db
      .select()
      .from(taskContributors)
      .where(eq(taskContributors.taskId, legacyTask.id));
    await db.transaction((tx) => applyTaskEvents(
      tx,
      projectId,
      aiRecord.id,
      [],
      new Map([["박준영", ownerMember.id], ["김민수", partner.id]]),
      new Map()
    ));
    expect(await db.select().from(taskContributors).where(eq(taskContributors.taskId, legacyTask.id))).toEqual(beforeHelpOnly);

    const sharedResponse = await taskDetail.PATCH(
      request("PATCH", {
        contributors: [
          { memberId: ownerMember.id, share: 60 },
          { memberId: partner.id, share: 40 },
        ],
      }),
      taskParams(projectId, legacyTask.id)
    );
    expect(sharedResponse.status).toBe(200);
    const sharedBody = await sharedResponse.json();
    expect(sharedBody.task.assigneeId).toBeNull();
    expect(sharedBody.task.contributors).toEqual(expect.arrayContaining([
      expect.objectContaining({ memberId: ownerMember.id, name: "박준영", share: 60 }),
      expect.objectContaining({ memberId: partner.id, name: "김민수", share: 40 }),
    ]));

    const storedContributors = await db
      .select()
      .from(taskContributors)
      .where(eq(taskContributors.taskId, legacyTask.id));
    expect(storedContributors).toHaveLength(2);

    const duplicateResponse = await taskDetail.PATCH(
      request("PATCH", {
        contributors: [
          { memberId: ownerMember.id, share: 60 },
          { memberId: ownerMember.id, share: 40 },
        ],
      }),
      taskParams(projectId, legacyTask.id)
    );
    expect(duplicateResponse.status).toBe(400);

    const invalidTotalResponse = await taskDetail.PATCH(
      request("PATCH", {
        contributors: [
          { memberId: ownerMember.id, share: 60 },
          { memberId: partner.id, share: 30 },
        ],
      }),
      taskParams(projectId, legacyTask.id)
    );
    expect(invalidTotalResponse.status).toBe(400);

    const outsiderResponse = await taskDetail.PATCH(
      request("PATCH", { contributors: [{ memberId: outsider.id, share: 100 }] }),
      taskParams(projectId, legacyTask.id)
    );
    expect(outsiderResponse.status).toBe(400);

    await expect(
      db.insert(taskContributors).values({
        taskId: legacyTask.id,
        memberId: ownerMember.id,
        share: 100,
      })
    ).rejects.toThrow();

    const contributionResponse = await contributionRoute.GET(request(), projectParams(projectId));
    const { contribution } = await contributionResponse.json();
    expect(contribution).toEqual(expect.arrayContaining([
      expect.objectContaining({ memberId: ownerMember.id, rawScore: 3, percentage: 60 }),
      expect.objectContaining({ memberId: partner.id, rawScore: 2, percentage: 40 }),
    ]));

    const completeResponse = await completeRoute.POST(request("POST"), projectParams(projectId));
    expect(completeResponse.status).toBe(200);
    const [finalSnapshot] = await db
      .select()
      .from(contributionSnapshots)
      .where(eq(contributionSnapshots.projectId, projectId));
    expect(JSON.parse(finalSnapshot.scores)).toEqual(expect.arrayContaining([
      expect.objectContaining({ memberId: ownerMember.id, percentage: 60 }),
      expect.objectContaining({ memberId: partner.id, percentage: 40 }),
    ]));
    expect((await reopenRoute.POST(request("POST"), projectParams(projectId))).status).toBe(200);

    expect((await memberDetail.DELETE(
      request("DELETE"),
      { params: Promise.resolve({ projectId, memberId: partner.id }) }
    )).status).toBe(200);
    const rowsAfterMemberDelete = await db
      .select()
      .from(taskContributors)
      .where(eq(taskContributors.taskId, legacyTask.id));
    expect(rowsAfterMemberDelete).toEqual([
      expect.objectContaining({ memberId: ownerMember.id, share: 100 }),
    ]);

    const soloResponse = await taskDetail.PATCH(
      request("PATCH", { contributors: [{ memberId: ownerMember.id, share: 100 }] }),
      taskParams(projectId, legacyTask.id)
    );
    const soloBody = await soloResponse.json();
    expect(soloBody.task.assigneeId).toBe(ownerMember.id);
    expect(soloBody.task.contributors).toEqual([
      expect.objectContaining({ memberId: ownerMember.id, share: 100 }),
    ]);

    expect((await taskDetail.DELETE(request("DELETE"), taskParams(projectId, legacyTask.id))).status).toBe(200);
    expect(
      await db.select().from(taskContributors).where(eq(taskContributors.taskId, legacyTask.id))
    ).toHaveLength(0);
  });
});
