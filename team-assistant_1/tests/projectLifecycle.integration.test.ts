import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

const TEST_DB = path.join(process.cwd(), "data", "test-project-lifecycle.db");
const authState = vi.hoisted(() => ({
  user: {
    id: "lifecycle-owner",
    username: "lifecycle-owner",
    name: "팀장",
    email: "owner-lifecycle@example.com",
    avatarEmoji: "🧭",
  },
}));

vi.mock("@/lib/auth/session", () => ({
  requireUser: vi.fn(async () => authState.user),
}));

function cleanTestDb() {
  for (const suffix of ["", "-wal", "-shm", "-journal"]) {
    const file = TEST_DB + suffix;
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

const routeParams = (projectId: string) => ({ params: Promise.resolve({ projectId }) });
const taskParams = (projectId: string, taskId: string) => ({ params: Promise.resolve({ projectId, taskId }) });
const memberParams = (projectId: string, memberId: string) => ({ params: Promise.resolve({ projectId, memberId }) });
const recordParams = (projectId: string, recordId: string) => ({ params: Promise.resolve({ projectId, recordId }) });
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
  await db.insert(users).values([
    { id: "lifecycle-owner", username: "lifecycle-owner", name: "팀장", email: "owner-lifecycle@example.com", passwordHash: "test", avatarEmoji: "🐼" },
    { id: "lifecycle-member", username: "lifecycle-member", name: "팀원", email: "member-lifecycle@example.com", passwordHash: "test", avatarEmoji: "🐶" },
    { id: "lifecycle-joiner", username: "lifecycle-joiner", name: "참가자", email: "joiner-lifecycle@example.com", passwordHash: "test", avatarEmoji: "🐶" },
  ]);
});

afterAll(async () => {
  const { client } = await import("@/lib/db/client");
  client.close();
});

describe("project completion lifecycle", () => {
  it("freezes a project with one final snapshot and restores writes only after an owner reopens it", async () => {
    const { and, asc, eq } = await import("drizzle-orm");
    const { db } = await import("@/lib/db/client");
    const {
      contributionSnapshots,
      members,
      projectUsers,
      projects,
      records,
      tasks,
    } = await import("@/lib/db/schema");
    const projectRoutes = await import("@/app/api/projects/route");
    const projectDetail = await import("@/app/api/projects/[projectId]/route");
    const completeRoute = await import("@/app/api/projects/[projectId]/complete/route");
    const reopenRoute = await import("@/app/api/projects/[projectId]/reopen/route");
    const historyRoute = await import("@/app/api/projects/[projectId]/contribution/history/route");
    const contributionRoute = await import("@/app/api/projects/[projectId]/contribution/route");
    const recordRoutes = await import("@/app/api/projects/[projectId]/records/route");
    const analyzeRoute = await import("@/app/api/projects/[projectId]/records/[recordId]/analyze/route");
    const taskRoutes = await import("@/app/api/projects/[projectId]/tasks/route");
    const taskDetail = await import("@/app/api/projects/[projectId]/tasks/[taskId]/route");
    const memberRoutes = await import("@/app/api/projects/[projectId]/members/route");
    const memberDetail = await import("@/app/api/projects/[projectId]/members/[memberId]/route");
    const inviteRoutes = await import("@/app/api/projects/[projectId]/invite-code/route");
    const transferRoute = await import("@/app/api/projects/[projectId]/transfer-owner/route");
    const joinRoute = await import("@/app/api/projects/join/route");

    const createdResponse = await projectRoutes.POST(request("POST", { name: "종료 테스트" }));
    expect(createdResponse.status).toBe(201);
    const { project: createdProject } = await createdResponse.json();
    const projectId = createdProject.id as string;
    expect(createdProject.status).toBe("ACTIVE");
    expect(createdProject.completedAt).toBeNull();

    const [ownerMember] = await db.select().from(members).where(and(eq(members.projectId, projectId), eq(members.userId, "lifecycle-owner")));
    const [member, waitingMember] = await db.insert(members).values([
      { projectId, userId: "lifecycle-member", name: "팀원" },
      { projectId, name: "참가자" },
    ]).returning();
    await db.insert(projectUsers).values({ projectId, userId: "lifecycle-member", role: "MEMBER" });

    const inviteResponse = await inviteRoutes.GET(request(), routeParams(projectId));
    expect(inviteResponse.status).toBe(200);
    const { code } = await inviteResponse.json();

    const [record] = await db.insert(records).values({ projectId, type: "MANUAL_TEXT", rawContent: "종료 전에 저장한 기록" }).returning();
    const [ownerTask, memberTask] = await db.insert(tasks).values([
      { projectId, title: "팀장 업무", assigneeId: ownerMember.id, status: "TODO", importance: 5, difficulty: 5, workload: 5 },
      { projectId, title: "팀원 업무", assigneeId: member.id, status: "DONE", importance: 3, difficulty: 3, workload: 3 },
    ]).returning();
    await db.insert(contributionSnapshots).values({
      projectId,
      recordId: record.id,
      scores: JSON.stringify([
        { memberId: ownerMember.id, name: ownerMember.name, rawScore: 1, percentage: 50 },
        { memberId: member.id, name: member.name, rawScore: 1, percentage: 50 },
      ]),
      createdAt: new Date(Date.now() - 60_000),
    });

    authState.user = { id: "lifecycle-member", username: "lifecycle-member", name: "팀원", email: "member-lifecycle@example.com", avatarEmoji: "🌱" };
    expect((await completeRoute.POST(request("POST"), routeParams(projectId))).status).toBe(403);

    authState.user = { id: "lifecycle-owner", username: "lifecycle-owner", name: "팀장", email: "owner-lifecycle@example.com", avatarEmoji: "🧭" };
    const completeResponse = await completeRoute.POST(request("POST"), routeParams(projectId));
    expect(completeResponse.status).toBe(200);
    const completedBody = await completeResponse.json();
    expect(completedBody.project.status).toBe("COMPLETED");
    expect(completedBody.project.completedAt).toEqual(expect.any(Number));
    expect(completedBody.contribution).toEqual(expect.arrayContaining([
      expect.objectContaining({ memberId: ownerMember.id, percentage: 25 }),
      expect.objectContaining({ memberId: member.id, percentage: 75 }),
    ]));

    const snapshotsAfterComplete = await db.select().from(contributionSnapshots).where(eq(contributionSnapshots.projectId, projectId));
    expect(snapshotsAfterComplete).toHaveLength(2);
    expect((await completeRoute.POST(request("POST"), routeParams(projectId))).status).toBe(409);
    expect(await db.select().from(contributionSnapshots).where(eq(contributionSnapshots.projectId, projectId))).toHaveLength(2);

    authState.user = { id: "lifecycle-member", username: "lifecycle-member", name: "팀원", email: "member-lifecycle@example.com", avatarEmoji: "🌱" };
    const historyResponse = await historyRoute.GET(request(), routeParams(projectId));
    expect(historyResponse.status).toBe(200);
    const { snapshots: history } = await historyResponse.json();
    expect(history).toHaveLength(2);
    expect(history[0].sequence).toBe(1);
    expect(history[0].createdAt).toBeLessThanOrEqual(history[1].createdAt);
    expect(history[1].members).toEqual(expect.arrayContaining([
      expect.objectContaining({ memberId: ownerMember.id, percentage: 25, avatarEmoji: "🐼" }),
      expect.objectContaining({ memberId: member.id, percentage: 75, avatarEmoji: "🐶" }),
    ]));

    expect((await projectDetail.GET(request(), routeParams(projectId))).status).toBe(200);
    expect((await taskRoutes.GET(request(), routeParams(projectId))).status).toBe(200);
    expect((await recordRoutes.GET(request(), routeParams(projectId))).status).toBe(200);
    expect((await contributionRoute.GET(request(), routeParams(projectId))).status).toBe(200);

    authState.user = { id: "lifecycle-owner", username: "lifecycle-owner", name: "팀장", email: "owner-lifecycle@example.com", avatarEmoji: "🧭" };
    const blockedResponses = await Promise.all([
      recordRoutes.POST(request("POST", { type: "MANUAL_TEXT", rawContent: "차단" }), routeParams(projectId)),
      analyzeRoute.POST(request("POST", {}), recordParams(projectId, record.id)),
      taskDetail.PATCH(request("PATCH", { title: "차단" }), taskParams(projectId, ownerTask.id)),
      taskDetail.DELETE(request("DELETE"), taskParams(projectId, ownerTask.id)),
      memberRoutes.POST(request("POST", { name: "차단" }), routeParams(projectId)),
      memberDetail.DELETE(request("DELETE"), memberParams(projectId, waitingMember.id)),
      inviteRoutes.GET(request(), routeParams(projectId)),
      inviteRoutes.POST(request("POST"), routeParams(projectId)),
      transferRoute.POST(request("POST", { memberId: member.id }), routeParams(projectId)),
    ]);
    for (const response of blockedResponses) {
      expect(response.status).toBe(409);
      await expect(response.json()).resolves.toMatchObject({ code: "PROJECT_COMPLETED" });
    }

    authState.user = { id: "lifecycle-joiner", username: "lifecycle-joiner", name: "참가자", email: "joiner-lifecycle@example.com", avatarEmoji: "✨" };
    const blockedJoin = await joinRoute.POST(request("POST", { code }));
    expect(blockedJoin.status).toBe(409);
    await expect(blockedJoin.json()).resolves.toMatchObject({ code: "PROJECT_COMPLETED" });

    authState.user = { id: "lifecycle-member", username: "lifecycle-member", name: "팀원", email: "member-lifecycle@example.com", avatarEmoji: "🌱" };
    expect((await reopenRoute.POST(request("POST"), routeParams(projectId))).status).toBe(403);

    authState.user = { id: "lifecycle-owner", username: "lifecycle-owner", name: "팀장", email: "owner-lifecycle@example.com", avatarEmoji: "🧭" };
    const reopenResponse = await reopenRoute.POST(request("POST"), routeParams(projectId));
    expect(reopenResponse.status).toBe(200);
    const { project: reopenedProject } = await reopenResponse.json();
    expect(reopenedProject.status).toBe("ACTIVE");
    expect(reopenedProject.completedAt).toBeNull();
    expect(await db.select().from(contributionSnapshots).where(eq(contributionSnapshots.projectId, projectId)).orderBy(asc(contributionSnapshots.createdAt))).toHaveLength(2);

    expect((await recordRoutes.POST(request("POST", { type: "MANUAL_TEXT", rawContent: "재시작 후 기록" }), routeParams(projectId))).status).toBe(201);
    expect((await taskDetail.PATCH(request("PATCH", { title: "재시작된 업무" }), taskParams(projectId, memberTask.id))).status).toBe(200);
    const [storedProject] = await db.select().from(projects).where(eq(projects.id, projectId));
    expect(storedProject.status).toBe("ACTIVE");
    expect(storedProject.completedAt).toBeNull();

    const concurrentCompletions = await Promise.all([
      completeRoute.POST(request("POST"), routeParams(projectId)),
      completeRoute.POST(request("POST"), routeParams(projectId)),
    ]);
    expect(concurrentCompletions.map((response) => response.status).sort()).toEqual([200, 409]);
    expect(await db.select().from(contributionSnapshots).where(eq(contributionSnapshots.projectId, projectId))).toHaveLength(3);
  });
});
