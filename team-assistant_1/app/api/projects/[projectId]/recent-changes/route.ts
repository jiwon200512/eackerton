import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { recordChanges, records } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { toErrorResponse } from "@/lib/errors";
import type { RecentChangeDTO } from "@/lib/types";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;

    const [lastRecord] = await db
      .select()
      .from(records)
      .where(and(eq(records.projectId, projectId), eq(records.analysisStatus, "COMPLETED")))
      .orderBy(desc(records.analyzedAt));

    if (!lastRecord) {
      return NextResponse.json({ recordId: null, analyzedAt: null, changes: [] });
    }

    const changeRows = await db
      .select()
      .from(recordChanges)
      .where(eq(recordChanges.recordId, lastRecord.id))
      .orderBy(desc(recordChanges.createdAt));

    const changes: RecentChangeDTO[] = changeRows.map((c) => ({
      id: c.id,
      taskId: c.taskId,
      taskTitle: c.taskTitle,
      changeType: c.changeType as RecentChangeDTO["changeType"],
      summary: c.summary,
      reason: c.reason,
      confidence: c.confidence,
      createdAt: c.createdAt.getTime(),
    }));

    return NextResponse.json({
      recordId: lastRecord.id,
      analyzedAt: lastRecord.analyzedAt?.getTime() ?? null,
      changes,
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
