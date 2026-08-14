import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

const TEST_DB = path.join(process.cwd(), "data", "test-project-ownership.db");
const authState = vi.hoisted(() => ({
  user: { id: "owner-a", username: "owner", name: "김지원", email: "owner@example.com" },
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

beforeAll(async () => {
  cleanTestDb();
  process.env.TURSO_DATABASE_URL = `file:${TEST_DB}`;
  const { db } = await import("@/lib/db/client");
  const { migrate } = await import("drizzle-orm/libsql/migrator");
  const { users } = await import("@/lib/db/schema");
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  await db.insert(users).values([
    { id: "owner-a", username: "owner", name: "김지원", email: "owner@example.com", passwordHash: "test" },
    { id: "member-b", username: "member", name: "park minsu", email: "member@example.com", passwordHash: "test" },
    { id: "member-c", username: "other", name: "이철수", email: "other@example.com", passwordHash: "test" },
  ]);
});

afterAll(async () => {
  const { client } = await import("@/lib/db/client");
  client.close();
});

describe("project owner permissions and real-name invitation", () => {
  it("keeps one owner through create, join, transfer and deletion", async () => {
    const { db } = await import("@/lib/db/client");
    const { and, eq } = await import("drizzle-orm");
    const { members, projectUsers, tasks } = await import("@/lib/db/schema");
    const { POST: createProject } = await import("@/app/api/projects/route");
    const memberRoutes = await import("@/app/api/projects/[projectId]/members/route");
    const memberDetail = await import("@/app/api/projects/[projectId]/members/[memberId]/route");
    const inviteRoutes = await import("@/app/api/projects/[projectId]/invite-code/route");
    const { POST: joinProject } = await import("@/app/api/projects/join/route");
    const { POST: transferOwner } = await import("@/app/api/projects/[projectId]/transfer-owner/route");
    const { POST: createRecord } = await import("@/app/api/projects/[projectId]/records/route");

    const createResponse = await createProject(new NextRequest("http://localhost/api/projects", { method: "POST", body: JSON.stringify({ name: "권한 테스트" }) }));
    expect(createResponse.status).toBe(201);
    const { project } = await createResponse.json();
    const projectId = project.id as string;

    const [ownerMember] = await db.select().from(members).where(and(eq(members.projectId, projectId), eq(members.userId, "owner-a")));
    expect(ownerMember?.name).toBe("김지원");
    const [ownerAccess] = await db.select().from(projectUsers).where(and(eq(projectUsers.projectId, projectId), eq(projectUsers.userId, "owner-a")));
    expect(ownerAccess?.role).toBe("OWNER");

    const addMemberResponse = await memberRoutes.POST(new NextRequest("http://localhost", { method: "POST", body: JSON.stringify({ name: "Ｐａｒｋ   MinSu" }) }), { params: Promise.resolve({ projectId }) });
    expect(addMemberResponse.status).toBe(201);
    const { member: targetMember } = await addMemberResponse.json();
    const duplicateMember = await memberRoutes.POST(new NextRequest("http://localhost", { method: "POST", body: JSON.stringify({ name: " park minsu " }) }), { params: Promise.resolve({ projectId }) });
    expect(duplicateMember.status).toBe(409);
    const addWaitingResponse = await memberRoutes.POST(new NextRequest("http://localhost", { method: "POST", body: JSON.stringify({ name: "이철수" }) }), { params: Promise.resolve({ projectId }) });
    const { member: waitingMember } = await addWaitingResponse.json();

    const inviteResponse = await inviteRoutes.GET(new NextRequest("http://localhost"), { params: Promise.resolve({ projectId }) });
    const { code } = await inviteResponse.json();

    const transferWaiting = await transferOwner(new NextRequest("http://localhost", { method: "POST", body: JSON.stringify({ memberId: waitingMember.id }) }), { params: Promise.resolve({ projectId }) });
    expect(transferWaiting.status).toBe(400);

    authState.user = { id: "member-b", username: "member", name: "park minsu", email: "member@example.com" };
    const joinResponse = await joinProject(new NextRequest("http://localhost/api/projects/join", { method: "POST", body: JSON.stringify({ code }) }));
    expect(joinResponse.status).toBe(200);
    const repeatedJoinResponse = await joinProject(new NextRequest("http://localhost/api/projects/join", { method: "POST", body: JSON.stringify({ code }) }));
    expect(repeatedJoinResponse.status).toBe(200);
    const [linkedMember] = await db.select().from(members).where(eq(members.id, targetMember.id));
    expect(linkedMember.userId).toBe("member-b");
    const linkedRows = await db.select().from(members).where(and(eq(members.projectId, projectId), eq(members.userId, "member-b")));
    expect(linkedRows).toHaveLength(1);

    const forbiddenAdd = await memberRoutes.POST(new NextRequest("http://localhost", { method: "POST", body: JSON.stringify({ name: "권한 없음" }) }), { params: Promise.resolve({ projectId }) });
    expect(forbiddenAdd.status).toBe(403);
    const forbiddenDelete = await memberDetail.DELETE(new NextRequest("http://localhost"), { params: Promise.resolve({ projectId, memberId: waitingMember.id }) });
    expect(forbiddenDelete.status).toBe(403);
    const forbiddenInvite = await inviteRoutes.POST(new NextRequest("http://localhost", { method: "POST" }), { params: Promise.resolve({ projectId }) });
    expect(forbiddenInvite.status).toBe(403);
    const forbiddenInviteView = await inviteRoutes.GET(new NextRequest("http://localhost"), { params: Promise.resolve({ projectId }) });
    expect(forbiddenInviteView.status).toBe(403);

    authState.user = { id: "member-c", username: "other", name: "이철수 아님", email: "other@example.com" };
    const mismatchJoin = await joinProject(new NextRequest("http://localhost/api/projects/join", { method: "POST", body: JSON.stringify({ code }) }));
    expect(mismatchJoin.status).toBe(409);
    const [unexpectedAccess] = await db.select().from(projectUsers).where(and(eq(projectUsers.projectId, projectId), eq(projectUsers.userId, "member-c")));
    expect(unexpectedAccess).toBeUndefined();

    authState.user = { id: "owner-a", username: "owner", name: "김지원", email: "owner@example.com" };
    const transferResponse = await transferOwner(new NextRequest("http://localhost", { method: "POST", body: JSON.stringify({ memberId: targetMember.id }) }), { params: Promise.resolve({ projectId }) });
    expect(transferResponse.status).toBe(200);

    const roles = await db.select().from(projectUsers).where(eq(projectUsers.projectId, projectId));
    expect(roles.filter((row) => row.role === "OWNER")).toHaveLength(1);
    expect(roles.find((row) => row.userId === "owner-a")?.role).toBe("MEMBER");
    expect(roles.find((row) => row.userId === "member-b")?.role).toBe("OWNER");

    const formerOwnerAdd = await memberRoutes.POST(new NextRequest("http://localhost", { method: "POST", body: JSON.stringify({ name: "실패" }) }), { params: Promise.resolve({ projectId }) });
    expect(formerOwnerAdd.status).toBe(403);

    authState.user = { id: "member-b", username: "member", name: "park minsu", email: "member@example.com" };
    const currentOwnerDelete = await memberDetail.DELETE(new NextRequest("http://localhost"), { params: Promise.resolve({ projectId, memberId: targetMember.id }) });
    expect(currentOwnerDelete.status).toBe(409);

    const [assignedTask] = await db.insert(tasks).values({ projectId, title: "기존 담당 업무", assigneeId: ownerMember.id }).returning();
    const deleteFormerOwner = await memberDetail.DELETE(new NextRequest("http://localhost"), { params: Promise.resolve({ projectId, memberId: ownerMember.id }) });
    expect(deleteFormerOwner.status).toBe(200);
    const [removedAccess] = await db.select().from(projectUsers).where(and(eq(projectUsers.projectId, projectId), eq(projectUsers.userId, "owner-a")));
    expect(removedAccess).toBeUndefined();
    const [unassignedTask] = await db.select().from(tasks).where(eq(tasks.id, assignedTask.id));
    expect(unassignedTask.assigneeId).toBeNull();

    const tooLarge = await createRecord(new NextRequest("http://localhost", { method: "POST", body: JSON.stringify({ type: "MANUAL_TEXT", rawContent: "x".repeat(50_001) }) }), { params: Promise.resolve({ projectId }) });
    expect(tooLarge.status).toBe(413);
  });
});
