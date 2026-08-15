import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

const TEST_DB = path.join(process.cwd(), "data", "test-project-insights.db");
const authUser = vi.hoisted(() => ({
  id: "insights-owner",
  username: "insights-owner",
  name: "박준영",
  email: "insights-owner@example.com",
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

const projectParams = (projectId: string) => ({
  params: Promise.resolve({ projectId }),
});
const taskParams = (projectId: string, taskId: string) => ({
  params: Promise.resolve({ projectId, taskId }),
});
const request = (method = "GET", body?: unknown, pathName = "/test") =>
  new NextRequest(`http://localhost${pathName}`, {
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

describe("project explanation and review APIs", () => {
  it("returns matching breakdowns, persists manual source and builds review activity", async () => {
    const { and, eq } = await import("drizzle-orm");
    const { db } = await import("@/lib/db/client");
    const {
      manualTaskChanges,
      members,
      recordChanges,
      records,
      taskContributors,
      tasks,
    } = await import("@/lib/db/schema");
    const projectRoutes = await import("@/app/api/projects/route");
    const memberRoutes = await import("@/app/api/projects/[projectId]/members/route");
    const breakdownRoute = await import(
      "@/app/api/projects/[projectId]/contribution/breakdown/route"
    );
    const contributionRoute = await import(
      "@/app/api/projects/[projectId]/contribution/route"
    );
    const taskRoute = await import(
      "@/app/api/projects/[projectId]/tasks/[taskId]/route"
    );
    const activityRoute = await import(
      "@/app/api/projects/[projectId]/activity/route"
    );

    const createResponse = await projectRoutes.POST(
      request("POST", { name: "설명 가능한 프로젝트" })
    );
    const { project } = await createResponse.json();
    const projectId = project.id as string;
    const [ownerMember] = await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.projectId, projectId),
          eq(members.userId, authUser.id)
        )
      );
    const partnerResponse = await memberRoutes.POST(
      request("POST", { name: "김민수" }),
      projectParams(projectId)
    );
    const { member: partner } = await partnerResponse.json();

    const [sharedTask, soloTask] = await db
      .insert(tasks)
      .values([
        {
          projectId,
          title: "Task A",
          assigneeId: null,
          status: "DONE",
          importance: 5,
          difficulty: 5,
          workload: 5,
        },
        {
          projectId,
          title: "Task B",
          assigneeId: partner.id,
          status: "DONE",
          importance: 3,
          difficulty: 3,
          workload: 3,
        },
      ])
      .returning();
    await db.insert(taskContributors).values([
      {
        taskId: sharedTask.id,
        memberId: ownerMember.id,
        share: 60,
        source: "AI",
      },
      {
        taskId: sharedTask.id,
        memberId: partner.id,
        share: 40,
        source: "AI",
      },
      {
        taskId: soloTask.id,
        memberId: partner.id,
        share: 100,
        source: "AI",
      },
    ]);

    const contributionResponse = await contributionRoute.GET(
      request(),
      projectParams(projectId)
    );
    const breakdownResponse = await breakdownRoute.GET(
      request(),
      projectParams(projectId)
    );
    const { contribution } = await contributionResponse.json();
    const { members: breakdownMembers } = await breakdownResponse.json();
    expect(
      breakdownMembers.map((member: Record<string, unknown>) => ({
        memberId: member.memberId,
        name: member.name,
        rawScore: member.rawScore,
        percentage: member.percentage,
      }))
    ).toEqual(
      contribution.map((member: Record<string, unknown>) => ({
        memberId: member.memberId,
        name: member.name,
        rawScore: member.rawScore,
        percentage: member.percentage,
      }))
    );
    expect(breakdownMembers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          memberId: ownerMember.id,
          rawScore: 3,
          percentage: 37.5,
          tasks: [
            expect.objectContaining({
              taskId: sharedTask.id,
              contributorShare: 60,
              memberTaskScore: 3,
            }),
          ],
        }),
        expect.objectContaining({
          memberId: partner.id,
          rawScore: 5,
          percentage: 62.5,
        }),
      ])
    );

    const manualResponse = await taskRoute.PATCH(
      request("PATCH", {
        contributors: [
          { memberId: ownerMember.id, share: 70 },
          { memberId: partner.id, share: 30 },
        ],
      }),
      taskParams(projectId, sharedTask.id)
    );
    expect(manualResponse.status).toBe(200);
    const manualBody = await manualResponse.json();
    expect(manualBody.task.contributors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ share: 70, source: "MANUAL" }),
        expect.objectContaining({ share: 30, source: "MANUAL" }),
      ])
    );
    expect(
      await db
        .select()
        .from(manualTaskChanges)
        .where(eq(manualTaskChanges.taskId, sharedTask.id))
    ).toEqual([
      expect.objectContaining({
        actorUserId: authUser.id,
        changeType: "TASK_CONTRIBUTORS_CHANGE",
        summary: expect.stringContaining("70%"),
      }),
    ]);

    const [record] = await db
      .insert(records)
      .values({
        projectId,
        type: "MANUAL_TEXT",
        rawContent: "업무 진행 기록",
        analysisStatus: "COMPLETED",
        analyzedAt: new Date("2026-08-15T05:00:00.000Z"),
        createdAt: new Date("2026-08-15T04:59:00.000Z"),
      })
      .returning();
    await db.insert(recordChanges).values([
      {
        id: "low-confidence-change",
        projectId,
        recordId: record.id,
        taskId: sharedTask.id,
        taskTitle: sharedTask.title,
        changeType: "TASK_CONTRIBUTORS_CHANGE",
        summary: "참여자 변경",
        reason: "공동 참여 비율 근거가 충분하지 않습니다.",
        confidence: 0.62,
        createdAt: new Date("2026-08-15T05:00:01.000Z"),
      },
      {
        id: "high-confidence-change",
        projectId,
        recordId: record.id,
        taskId: soloTask.id,
        taskTitle: soloTask.title,
        changeType: "TASK_STATUS_CHANGE",
        summary: "진행 중 → 완료",
        reason: "완료 발언이 명확합니다.",
        confidence: 0.85,
        createdAt: new Date("2026-08-15T05:00:02.000Z"),
      },
      {
        id: "legacy-confidence-change",
        projectId,
        recordId: record.id,
        taskId: soloTask.id,
        taskTitle: soloTask.title,
        changeType: "EVIDENCE_ADD",
        summary: "근거 추가",
        confidence: null,
        createdAt: new Date("2026-08-15T05:00:03.000Z"),
      },
    ]);

    const activityResponse = await activityRoute.GET(
      request("GET", undefined, "/test?limit=20"),
      projectParams(projectId)
    );
    expect(activityResponse.status).toBe(200);
    const activityBody = await activityResponse.json();
    expect(activityBody.lowConfidenceThreshold).toBe(0.7);
    expect(activityBody.lowConfidenceChanges).toEqual([
      expect.objectContaining({ id: "low-confidence-change", confidence: 0.62 }),
    ]);
    expect(activityBody.activities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: "MANUAL", taskId: sharedTask.id }),
        expect.objectContaining({ source: "AI", recordId: record.id }),
      ])
    );
    const timestamps = activityBody.activities.map(
      (activity: { timestamp: number }) => activity.timestamp
    );
    expect(timestamps).toEqual([...timestamps].sort((a, b) => b - a));

    const persistedRows = await db
      .select()
      .from(taskContributors)
      .where(eq(taskContributors.taskId, sharedTask.id));
    expect(persistedRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ share: 70, source: "MANUAL" }),
        expect.objectContaining({ share: 30, source: "MANUAL" }),
      ])
    );
  });
});
