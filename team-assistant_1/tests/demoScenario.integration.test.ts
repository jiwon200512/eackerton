import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import path from "path";
import fs from "fs";
import { NextRequest } from "next/server";

// --------------------------------------------------------------------------
// Full pipeline integration test for the spec's "가장 중요한 데모 시나리오"
// (section 20/41): create project -> add 3 members -> analyze record 1 ->
// verify 3 tasks -> analyze record 2 -> verify existing tasks update +
// a new task is created + evidence accumulates + contribution changes.
//
// The only thing mocked is the network call to the LLM (services/ai/
// analyzeRecord.ts) - everything else (parsing, validation, DB writes,
// transactions, contribution math, API routes) runs for real against a
// throwaway SQLite file, so this is a true integration test of the pipeline
// described in the spec, not a unit test with fakes standing in for logic.
// --------------------------------------------------------------------------

const TEST_DB = path.join(process.cwd(), "data", "test-demo-scenario.db");

function cleanupDbFiles() {
  for (const suffix of ["", "-wal", "-shm", "-journal"]) {
    const p = TEST_DB + suffix;
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
}

vi.mock("@/services/ai/analyzeRecord", () => ({
  analyzeWithAI: vi.fn(async (context: unknown) => {
    const ctx = context as {
      currentTasks: { id: string; title: string }[];
      newMessages: { speaker: string; message: string }[];
    };
    const findId = (title: string) =>
      ctx.currentTasks.find((t) => t.title === title)?.id ?? null;

    const joined = ctx.newMessages.map((m) => m.message).join(" ");

    // Record 1: three brand new tasks, one per member.
    if (joined.includes("로그인 페이지 내가 만들게")) {
      return {
        events: [
          {
            type: "TASK_CREATE",
            existingTaskId: null,
            taskTitle: "로그인 페이지 구현",
            assigneeName: "김지원",
            previousAssigneeName: null,
            status: "TODO",
            previousStatus: null,
            confidence: 0.95,
            evidence: [{ speaker: "김지원", text: "로그인 페이지 내가 만들게." }],
            evaluation: { importance: 4, difficulty: 3, workload: 3 },
            reason: "김지원이 로그인 페이지 구현을 맡겠다고 명시함",
          },
          {
            type: "TASK_CREATE",
            existingTaskId: null,
            taskTitle: "DB 연결",
            assigneeName: "박민수",
            previousAssigneeName: null,
            status: "TODO",
            previousStatus: null,
            confidence: 0.95,
            evidence: [{ speaker: "박민수", text: "그러면 나는 DB 연결할게." }],
            evaluation: { importance: 3, difficulty: 3, workload: 3 },
            reason: "박민수가 DB 연결을 맡겠다고 명시함",
          },
          {
            type: "TASK_CREATE",
            existingTaskId: null,
            taskTitle: "발표자료 제작",
            assigneeName: "이철수",
            previousAssigneeName: null,
            status: "TODO",
            previousStatus: null,
            confidence: 0.95,
            evidence: [{ speaker: "이철수", text: "발표자료는 내가 준비할게." }],
            evaluation: { importance: 3, difficulty: 2, workload: 3 },
            reason: "이철수가 발표자료 준비를 맡겠다고 명시함",
          },
        ],
      };
    }

    // Record 2: login -> IN_PROGRESS, db -> DONE, new API integration task.
    if (joined.includes("로그인 페이지 거의 다 만들었어")) {
      return {
        events: [
          {
            type: "TASK_STATUS_CHANGE",
            existingTaskId: findId("로그인 페이지 구현"),
            taskTitle: "로그인 페이지 구현",
            assigneeName: "김지원",
            previousAssigneeName: null,
            status: "IN_PROGRESS",
            previousStatus: "TODO",
            confidence: 0.9,
            evidence: [{ speaker: "김지원", text: "로그인 페이지 거의 다 만들었어." }],
            evaluation: null,
            reason: "거의 다 했다는 표현은 완료가 아닌 진행중을 의미함",
          },
          {
            type: "TASK_STATUS_CHANGE",
            existingTaskId: findId("DB 연결"),
            taskTitle: "DB 연결",
            assigneeName: "박민수",
            previousAssigneeName: null,
            status: "DONE",
            previousStatus: "TODO",
            confidence: 0.97,
            evidence: [{ speaker: "박민수", text: "DB 연결 완료했음." }],
            evaluation: null,
            reason: "완료했음은 명시적 완료 표현",
          },
          {
            type: "TASK_CREATE",
            existingTaskId: null,
            taskTitle: "API 연동",
            assigneeName: "김지원",
            previousAssigneeName: null,
            status: "TODO",
            previousStatus: null,
            confidence: 0.92,
            evidence: [{ speaker: "김지원", text: "API 연동도 내가 할게." }],
            evaluation: { importance: 3, difficulty: 3, workload: 3 },
            reason: "김지원이 API 연동을 새로 맡겠다고 명시함",
          },
        ],
      };
    }

    return { events: [] };
  }),
}));

beforeAll(async () => {
  cleanupDbFiles();
  process.env.DATABASE_PATH = TEST_DB;
  const { db } = await import("@/lib/db/client");
  const { migrate } = await import("drizzle-orm/better-sqlite3/migrator");
  migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
});

afterAll(() => {
  cleanupDbFiles();
});

describe("demo scenario: two-round record analysis updates existing project state", () => {
  it("runs the full flow through the real API route handlers", async () => {
    const { POST: createProject } = await import("@/app/api/projects/route");
    const { POST: addMember } = await import("@/app/api/projects/[projectId]/members/route");
    const { POST: createRecord } = await import("@/app/api/projects/[projectId]/records/route");
    const { POST: analyzeRecordRoute } = await import(
      "@/app/api/projects/[projectId]/records/[recordId]/analyze/route"
    );
    const { GET: getTasks } = await import("@/app/api/projects/[projectId]/tasks/route");
    const { GET: getContribution } = await import("@/app/api/projects/[projectId]/contribution/route");
    const { GET: getRecentChanges } = await import("@/app/api/projects/[projectId]/recent-changes/route");

    // 1. Create project
    const projectRes = await createProject(
      new NextRequest("http://localhost/api/projects", {
        method: "POST",
        body: JSON.stringify({ name: "캡스톤 디자인 프로젝트" }),
      })
    );
    expect(projectRes.status).toBe(201);
    const { project } = await projectRes.json();
    const projectId = project.id as string;

    // 2. Add 3 members
    for (const name of ["김지원", "박민수", "이철수"]) {
      const res = await addMember(
        new NextRequest(`http://localhost/api/projects/${projectId}/members`, {
          method: "POST",
          body: JSON.stringify({ name }),
        }),
        { params: Promise.resolve({ projectId }) }
      );
      expect(res.status).toBe(201);
    }

    // 3. First record
    const record1Text = [
      "김지원: 로그인 페이지 내가 만들게.",
      "박민수: 그러면 나는 DB 연결할게.",
      "이철수: 발표자료는 내가 준비할게.",
    ].join("\n");
    const record1Res = await createRecord(
      new NextRequest(`http://localhost/api/projects/${projectId}/records`, {
        method: "POST",
        body: JSON.stringify({ type: "MANUAL_TEXT", rawContent: record1Text }),
      }),
      { params: Promise.resolve({ projectId }) }
    );
    expect(record1Res.status).toBe(201);
    const { record: record1 } = await record1Res.json();

    // 4. Analyze record 1
    const analyze1Res = await analyzeRecordRoute(
      new NextRequest(`http://localhost/api/projects/${projectId}/records/${record1.id}/analyze`, {
        method: "POST",
        body: JSON.stringify({}),
      }),
      { params: Promise.resolve({ projectId, recordId: record1.id }) }
    );
    const analyze1Body = await analyze1Res.json();
    expect(analyze1Res.status, JSON.stringify(analyze1Body)).toBe(200);
    expect(analyze1Body.eventCount).toBe(3);

    // 5. Verify 3 tasks were created with expected assignees/status
    const tasksRes1 = await getTasks(new Request("http://localhost") as unknown as NextRequest, {
      params: Promise.resolve({ projectId }),
    });
    const { tasks: tasksAfter1 } = await tasksRes1.json();
    expect(tasksAfter1).toHaveLength(3);

    const byTitle1 = Object.fromEntries(tasksAfter1.map((t: { title: string }) => [t.title, t]));
    expect(byTitle1["로그인 페이지 구현"].assigneeName).toBe("김지원");
    expect(byTitle1["로그인 페이지 구현"].status).toBe("TODO");
    expect(byTitle1["DB 연결"].assigneeName).toBe("박민수");
    expect(byTitle1["DB 연결"].status).toBe("TODO");
    expect(byTitle1["발표자료 제작"].assigneeName).toBe("이철수");
    expect(byTitle1["발표자료 제작"].status).toBe("TODO");

    // 6. Second record
    const record2Text = [
      "김지원: 로그인 페이지 거의 다 만들었어.",
      "박민수: DB 연결 완료했음.",
      "김지원: API 연동도 내가 할게.",
    ].join("\n");
    const record2Res = await createRecord(
      new NextRequest(`http://localhost/api/projects/${projectId}/records`, {
        method: "POST",
        body: JSON.stringify({ type: "MANUAL_TEXT", rawContent: record2Text }),
      }),
      { params: Promise.resolve({ projectId }) }
    );
    const { record: record2 } = await record2Res.json();

    const analyze2Res = await analyzeRecordRoute(
      new NextRequest(`http://localhost/api/projects/${projectId}/records/${record2.id}/analyze`, {
        method: "POST",
        body: JSON.stringify({}),
      }),
      { params: Promise.resolve({ projectId, recordId: record2.id }) }
    );
    const analyze2Body = await analyze2Res.json();
    expect(analyze2Res.status, JSON.stringify(analyze2Body)).toBe(200);

    // 7. Verify existing tasks updated, presentation task untouched, and a
    // new "API 연동" task was created - NOT a duplicate "로그인/DB" task.
    const tasksRes2 = await getTasks(new Request("http://localhost") as unknown as NextRequest, {
      params: Promise.resolve({ projectId }),
    });
    const { tasks: tasksAfter2 } = await tasksRes2.json();
    expect(tasksAfter2).toHaveLength(4);

    const byTitle2 = Object.fromEntries(tasksAfter2.map((t: { title: string }) => [t.title, t]));
    expect(byTitle2["로그인 페이지 구현"].status).toBe("IN_PROGRESS");
    expect(byTitle2["DB 연결"].status).toBe("DONE");
    expect(byTitle2["발표자료 제작"].status).toBe("TODO"); // untouched
    expect(byTitle2["API 연동"]).toBeTruthy();
    expect(byTitle2["API 연동"].status).toBe("TODO");
    expect(byTitle2["API 연동"].assigneeName).toBe("김지원");

    // Same task IDs before/after (proves it was an update, not a recreate).
    expect(byTitle2["로그인 페이지 구현"].id).toBe(byTitle1["로그인 페이지 구현"].id);
    expect(byTitle2["DB 연결"].id).toBe(byTitle1["DB 연결"].id);

    // 8. Recent changes reflect the 3 changes from record 2 specifically.
    const recentRes = await getRecentChanges(new Request("http://localhost") as unknown as NextRequest, {
      params: Promise.resolve({ projectId }),
    });
    const recentBody = await recentRes.json();
    expect(recentBody.recordId).toBe(record2.id);
    expect(recentBody.changes).toHaveLength(3);
    const changeTypes = recentBody.changes.map((c: { changeType: string }) => c.changeType).sort();
    expect(changeTypes).toEqual(["TASK_CREATE", "TASK_STATUS_CHANGE", "TASK_STATUS_CHANGE"]);

    // 9. Contribution was recalculated (DONE db-connection task should give
    // 박민수 a non-zero, and delta vs the record-1 snapshot should be shown).
    const contribRes = await getContribution(new Request("http://localhost") as unknown as NextRequest, {
      params: Promise.resolve({ projectId }),
    });
    const contribBody = await contribRes.json();
    const sum = contribBody.contribution.reduce((a: number, b: { percentage: number }) => a + b.percentage, 0);
    expect(Math.round(sum * 10) / 10).toBe(100);
    const byMember = Object.fromEntries(
      contribBody.contribution.map((c: { name: string; percentage: number; deltaPercentage: number | null }) => [
        c.name,
        c,
      ])
    );
    expect(byMember["박민수"].percentage).toBeGreaterThan(0);
    expect(byMember["박민수"].deltaPercentage).not.toBeNull();
  });
});
