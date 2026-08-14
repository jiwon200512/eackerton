import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

const TEST_DB = path.join(process.cwd(), "data", "test-analysis-failure.db");

vi.mock("@/lib/auth/session", () => ({
  requireUser: vi.fn(async () => ({
    id: "failure-user",
    username: "failure-user",
    name: "테스트 사용자",
    email: "failure@example.com",
  })),
}));

vi.mock("@/services/ai/analyzeRecord", () => ({
  analyzeWithAI: vi.fn(async () => ({ events: [] })),
}));

vi.mock("@/services/tasks/applyEvents", () => ({
  applyTaskEvents: vi.fn(async () => {
    throw new Error("forced transaction failure");
  }),
}));

function cleanTestDb() {
  for (const suffix of ["", "-wal", "-shm", "-journal"]) {
    const file = TEST_DB + suffix;
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

let projectId: string;
let recordId: string;

beforeAll(async () => {
  cleanTestDb();
  process.env.TURSO_DATABASE_URL = `file:${TEST_DB}`;
  const { db } = await import("@/lib/db/client");
  const { migrate } = await import("drizzle-orm/libsql/migrator");
  const { members, projects, projectUsers, records, users } = await import(
    "@/lib/db/schema"
  );
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  await db.insert(users).values({
    id: "failure-user",
    username: "failure-user",
    name: "테스트 사용자",
    email: "failure@example.com",
    passwordHash: "test",
  });
  const [project] = await db.insert(projects).values({ name: "실패 복구 테스트" }).returning();
  projectId = project.id;
  await db.insert(projectUsers).values({
    projectId,
    userId: "failure-user",
    role: "OWNER",
  });
  await db.insert(members).values({
    projectId,
    userId: "failure-user",
    name: "테스트 사용자",
  });
  const [record] = await db
    .insert(records)
    .values({
      projectId,
      type: "MANUAL_TEXT",
      rawContent: "테스트 사용자가 작업을 시작했습니다.",
    })
    .returning();
  recordId = record.id;
});

afterAll(async () => {
  const { client } = await import("@/lib/db/client");
  client.close();
});

describe("analysis failure recovery", () => {
  it("marks the record FAILED when the apply transaction throws", async () => {
    const { POST: analyze } = await import(
      "@/app/api/projects/[projectId]/records/[recordId]/analyze/route"
    );
    const response = await analyze(
      new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify({}),
      }),
      { params: Promise.resolve({ projectId, recordId }) }
    );
    expect(response.status).toBe(500);

    const { db } = await import("@/lib/db/client");
    const { records } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");
    const [stored] = await db.select().from(records).where(eq(records.id, recordId));
    expect(stored.analysisStatus).toBe("FAILED");
    expect(stored.analysisError).toBeTruthy();
  });
});
