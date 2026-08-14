import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { contributionSnapshots, members, tasks } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { toErrorResponse } from "@/lib/errors";
import { calculateContribution, type ContributionResult } from "@/services/contribution/calculate";
import type { MemberContribution, TaskStatus } from "@/lib/types";
import { requireUser } from "@/lib/auth/session";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await requireUser();
    const { projectId } = await params;

    const [memberRows, taskRows, lastSnapshot] = await Promise.all([
      db.select().from(members).where(eq(members.projectId, projectId)),
      db
        .select()
        .from(tasks)
        .where(and(eq(tasks.projectId, projectId), eq(tasks.isDeleted, false))),
      db
        .select()
        .from(contributionSnapshots)
        .where(eq(contributionSnapshots.projectId, projectId))
        .orderBy(desc(contributionSnapshots.createdAt))
        .limit(1),
    ]);

    const current = calculateContribution(
      memberRows.map((m) => ({ id: m.id, name: m.name })),
      taskRows.map((t) => ({
        assigneeId: t.assigneeId,
        status: t.status as TaskStatus,
        importance: t.importance,
        difficulty: t.difficulty,
        workload: t.workload,
      }))
    );

    let previousByMember: Map<string, number> | null = null;
    if (lastSnapshot[0]) {
      try {
        const parsed = JSON.parse(lastSnapshot[0].scores) as ContributionResult[];
        previousByMember = new Map(parsed.map((p) => [p.memberId, p.percentage]));
      } catch {
        previousByMember = null;
      }
    }

    const result: MemberContribution[] = current.map((c) => ({
      memberId: c.memberId,
      name: c.name,
      rawScore: c.rawScore,
      percentage: c.percentage,
      deltaPercentage: previousByMember?.has(c.memberId)
        ? Math.round((c.percentage - previousByMember.get(c.memberId)!) * 10) / 10
        : null,
    }));

    return NextResponse.json({
      contribution: result,
      lastSnapshotAt: lastSnapshot[0]?.createdAt.getTime() ?? null,
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
