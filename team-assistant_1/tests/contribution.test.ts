import { describe, it, expect } from "vitest";
import {
  calculateContribution,
  calculateContributionBreakdown,
  computeTaskScore,
  computeCurrentTaskScore,
} from "@/services/contribution/calculate";

describe("computeTaskScore", () => {
  it("weights importance 0.3, difficulty 0.3, workload 0.4", () => {
    expect(computeTaskScore({ importance: 5, difficulty: 5, workload: 5 })).toBeCloseTo(5);
    expect(computeTaskScore({ importance: 4, difficulty: 2, workload: 3 })).toBeCloseTo(
      4 * 0.3 + 2 * 0.3 + 3 * 0.4
    );
  });
});

describe("computeCurrentTaskScore", () => {
  it("applies the status multiplier", () => {
    const task = { assigneeId: "m1", importance: 3, difficulty: 3, workload: 3 } as const;
    const base = computeTaskScore(task);
    expect(computeCurrentTaskScore({ ...task, status: "TODO" })).toBeCloseTo(base * 0.2);
    expect(computeCurrentTaskScore({ ...task, status: "IN_PROGRESS" })).toBeCloseTo(base * 0.6);
    expect(computeCurrentTaskScore({ ...task, status: "DONE" })).toBeCloseTo(base * 1.0);
  });
});

describe("calculateContribution", () => {
  const members = [
    { id: "m1", name: "김지원" },
    { id: "m2", name: "박민수" },
    { id: "m3", name: "이철수" },
  ];

  it("splits raw score by assignee and normalizes percentages to sum to 100", () => {
    const tasks = [
      { assigneeId: "m1", status: "DONE", importance: 4, difficulty: 4, workload: 4 },
      { assigneeId: "m2", status: "IN_PROGRESS", importance: 3, difficulty: 3, workload: 3 },
      { assigneeId: "m3", status: "TODO", importance: 2, difficulty: 2, workload: 2 },
    ] as const;

    const result = calculateContribution(members, [...tasks]);
    const sum = result.reduce((a, b) => a + b.percentage, 0);
    expect(Math.round(sum * 10) / 10).toBeCloseTo(100, 1);

    // Member with DONE + higher scores should have the highest share.
    const byId = Object.fromEntries(result.map((r) => [r.memberId, r]));
    expect(byId.m1.percentage).toBeGreaterThan(byId.m2.percentage);
    expect(byId.m2.percentage).toBeGreaterThan(byId.m3.percentage);
  });

  it("gives every member 0% when there are no tasks", () => {
    const result = calculateContribution(members, []);
    for (const r of result) expect(r.percentage).toBe(0);
  });

  it("ignores tasks assigned to a member no longer on the project", () => {
    const tasks = [
      { assigneeId: "ghost", status: "DONE", importance: 5, difficulty: 5, workload: 5 },
      { assigneeId: "m1", status: "DONE", importance: 1, difficulty: 1, workload: 1 },
    ] as const;
    const result = calculateContribution(members, [...tasks]);
    const byId = Object.fromEntries(result.map((r) => [r.memberId, r]));
    expect(byId.m1.percentage).toBe(100);
  });

  it("rounds percentages to 1 decimal and keeps the sum exact across many members", () => {
    const manyMembers = Array.from({ length: 7 }, (_, i) => ({
      id: `m${i}`,
      name: `member${i}`,
    }));
    const tasks = manyMembers.map((m, i) => ({
      assigneeId: m.id,
      status: "DONE" as const,
      importance: 1,
      difficulty: 1,
      workload: (i % 5) + 1,
    }));
    const result = calculateContribution(manyMembers, tasks);
    const sum = result.reduce((a, b) => a + b.percentage, 0);
    expect(Math.round(sum * 10) / 10).toBe(100);
  });

  it("matches the demo scenario's expected task-status transition", () => {
    // login page TODO -> IN_PROGRESS, DB connection TODO -> DONE,
    // presentation stays TODO, API integration is a new TODO task.
    const tasks = [
      { assigneeId: "m1", status: "IN_PROGRESS", importance: 3, difficulty: 3, workload: 3 }, // login (지원)
      { assigneeId: "m2", status: "DONE", importance: 3, difficulty: 3, workload: 3 }, // db (민수)
      { assigneeId: "m3", status: "TODO", importance: 3, difficulty: 3, workload: 3 }, // slides (철수)
      { assigneeId: "m1", status: "TODO", importance: 3, difficulty: 3, workload: 3 }, // API integration (지원)
    ] as const;
    const result = calculateContribution(members, [...tasks]);
    const byId = Object.fromEntries(result.map((r) => [r.memberId, r]));
    // DB connection is DONE (multiplier 1.0) with a single task, should be
    // the highest contributor despite login+API split across two tasks for m1.
    expect(byId.m2.percentage).toBeGreaterThan(byId.m3.percentage);
  });

  it("splits one completed Task score by contributor share", () => {
    const result = calculateContribution(members, [{
      assigneeId: null,
      contributors: [
        { memberId: "m1", share: 60 },
        { memberId: "m2", share: 40 },
      ],
      status: "DONE",
      importance: 5,
      difficulty: 5,
      workload: 5,
    }]);
    const byId = Object.fromEntries(result.map((item) => [item.memberId, item]));
    expect(byId.m1.rawScore).toBe(3);
    expect(byId.m2.rawScore).toBe(2);
    expect(byId.m1.percentage).toBe(60);
    expect(byId.m2.percentage).toBe(40);
  });

  it("combines shared and solo Tasks before calculating final percentages", () => {
    const result = calculateContribution(members, [
      {
        assigneeId: null,
        contributors: [
          { memberId: "m1", share: 60 },
          { memberId: "m2", share: 40 },
        ],
        status: "DONE",
        importance: 5,
        difficulty: 5,
        workload: 5,
      },
      {
        assigneeId: "m2",
        contributors: [{ memberId: "m2", share: 100 }],
        status: "DONE",
        importance: 3,
        difficulty: 3,
        workload: 3,
      },
    ]);
    const byId = Object.fromEntries(result.map((item) => [item.memberId, item]));
    expect(byId.m1.rawScore).toBe(3);
    expect(byId.m2.rawScore).toBe(5);
    expect(byId.m1.percentage).toBe(37.5);
    expect(byId.m2.percentage).toBe(62.5);
  });

  it("keeps legacy assignee-only Tasks as a 100% assignment", () => {
    const result = calculateContribution(members, [{
      assigneeId: "m1",
      status: "DONE",
      importance: 5,
      difficulty: 5,
      workload: 5,
    }]);
    expect(result.find((item) => item.memberId === "m1")?.rawScore).toBe(5);
    expect(result.find((item) => item.memberId === "m1")?.percentage).toBe(100);
  });

  it("excludes Tasks that have neither contributors nor a legacy assignee", () => {
    const result = calculateContribution(members, [{
      assigneeId: null,
      contributors: [],
      status: "DONE",
      importance: 5,
      difficulty: 5,
      workload: 5,
    }]);
    expect(result.every((item) => item.rawScore === 0 && item.percentage === 0)).toBe(true);
  });
});

describe("calculateContributionBreakdown", () => {
  it("uses the same raw scores and percentages as the main calculator", () => {
    const members = [
      { id: "m1", name: "준영" },
      { id: "m2", name: "민수" },
    ];
    const tasks = [
      {
        id: "task-a",
        title: "Task A",
        assigneeId: null,
        contributors: [
          { memberId: "m1", share: 60 },
          { memberId: "m2", share: 40 },
        ],
        status: "DONE" as const,
        importance: 5,
        difficulty: 5,
        workload: 5,
      },
      {
        id: "task-b",
        title: "Task B",
        assigneeId: "m2",
        contributors: [{ memberId: "m2", share: 100 }],
        status: "DONE" as const,
        importance: 3,
        difficulty: 3,
        workload: 3,
      },
    ];

    const summary = calculateContribution(members, tasks);
    const breakdown = calculateContributionBreakdown(members, tasks);
    expect(
      breakdown.map((member) => ({
        memberId: member.memberId,
        name: member.name,
        rawScore: member.rawScore,
        percentage: member.percentage,
      }))
    ).toEqual(summary);

    const byId = Object.fromEntries(
      breakdown.map((member) => [member.memberId, member])
    );
    expect(byId.m1).toMatchObject({ rawScore: 3, percentage: 37.5 });
    expect(byId.m1.tasks).toEqual([
      expect.objectContaining({
        taskId: "task-a",
        taskScore: 5,
        statusMultiplier: 1,
        contributorShare: 60,
        memberTaskScore: 3,
      }),
    ]);
    expect(byId.m2).toMatchObject({ rawScore: 5, percentage: 62.5 });
    expect(byId.m2.tasks.map((task) => task.memberTaskScore)).toEqual([3, 2]);
  });
});
