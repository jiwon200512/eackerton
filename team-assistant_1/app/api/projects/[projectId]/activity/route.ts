import {
  and,
  desc,
  eq,
  inArray,
  isNotNull,
  lt,
} from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { LOW_CONFIDENCE_THRESHOLD } from "@/lib/ai/confidence";
import { db } from "@/lib/db/client";
import {
  manualTaskChanges,
  recordChanges,
  records,
  tasks,
  users,
} from "@/lib/db/schema";
import { toErrorResponse } from "@/lib/errors";
import { requireProjectAccess } from "@/lib/projects/access";
import type {
  LowConfidenceChangeDTO,
  ProjectActivityDTO,
} from "@/lib/types";

type Params = { params: Promise<{ projectId: string }> };

function parseLimit(request: NextRequest) {
  const parsed = Number(request.nextUrl.searchParams.get("limit") ?? 20);
  return Number.isInteger(parsed) ? Math.min(100, Math.max(1, parsed)) : 20;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    await requireProjectAccess(projectId, user.id);
    const limit = parseLimit(request);

    const [recordRows, aiChangeRows, manualChangeRows, taskRows, reviewRows] =
      await Promise.all([
        db
          .select({
            id: records.id,
            type: records.type,
            analysisStatus: records.analysisStatus,
            analyzedAt: records.analyzedAt,
            createdAt: records.createdAt,
          })
          .from(records)
          .where(eq(records.projectId, projectId))
          .orderBy(desc(records.createdAt))
          .limit(limit),
        db
          .select()
          .from(recordChanges)
          .where(eq(recordChanges.projectId, projectId))
          .orderBy(desc(recordChanges.createdAt))
          .limit(limit),
        db
          .select()
          .from(manualTaskChanges)
          .where(eq(manualTaskChanges.projectId, projectId))
          .orderBy(desc(manualTaskChanges.createdAt))
          .limit(limit),
        db
          .select({ id: tasks.id })
          .from(tasks)
          .where(and(eq(tasks.projectId, projectId), eq(tasks.isDeleted, false))),
        db
          .select()
          .from(recordChanges)
          .where(
            and(
              eq(recordChanges.projectId, projectId),
              isNotNull(recordChanges.confidence),
              lt(recordChanges.confidence, LOW_CONFIDENCE_THRESHOLD)
            )
          )
          .orderBy(desc(recordChanges.createdAt))
          .limit(20),
      ]);

    const actorIds = [
      ...new Set(
        manualChangeRows
          .map((change) => change.actorUserId)
          .filter((id): id is string => Boolean(id))
      ),
    ];
    const actorRows =
      actorIds.length > 0
        ? await db
            .select({ id: users.id, name: users.name })
            .from(users)
            .where(inArray(users.id, actorIds))
        : [];
    const actorNameById = new Map(actorRows.map((actor) => [actor.id, actor.name]));
    const activeTaskIds = new Set(taskRows.map((task) => task.id));
    const changeCountByRecordId = new Map<string, number>();
    for (const change of aiChangeRows) {
      changeCountByRecordId.set(
        change.recordId,
        (changeCountByRecordId.get(change.recordId) ?? 0) + 1
      );
    }

    const activities: ProjectActivityDTO[] = [
      ...recordRows.flatMap((record): ProjectActivityDTO[] => {
        const recordLabel =
          record.type === "KAKAO_TEXT" ? "카카오톡 기록" : "직접 입력 기록";
        const items: ProjectActivityDTO[] = [
          {
            id: `record:${record.id}`,
            type: "RECORD_CREATED",
            timestamp: record.createdAt.getTime(),
            actor: null,
            title: `${recordLabel} 추가`,
            description: "새 프로젝트 기록이 저장되었습니다.",
            taskId: null,
            recordId: record.id,
            source: null,
          },
        ];
        if (record.analysisStatus === "COMPLETED" && record.analyzedAt) {
          const changeCount = changeCountByRecordId.get(record.id) ?? 0;
          items.push({
            id: `analysis:${record.id}`,
            type: "AI_ANALYZED",
            timestamp: record.analyzedAt.getTime(),
            actor: "AI",
            title: "AI 분석 완료",
            description:
              changeCount > 0
                ? `${changeCount}개의 프로젝트 변경을 반영했습니다.`
                : "새 기록을 분석했으며 적용할 변경은 없었습니다.",
            taskId: null,
            recordId: record.id,
            source: "AI",
          });
        }
        return items;
      }),
      ...aiChangeRows.map(
        (change): ProjectActivityDTO => ({
          id: `ai-change:${change.id}`,
          type: "AI_CHANGE",
          timestamp: change.createdAt.getTime(),
          actor: "AI",
          title: change.taskTitle,
          description: change.summary,
          taskId:
            change.taskId && activeTaskIds.has(change.taskId)
              ? change.taskId
              : null,
          recordId: change.recordId,
          source: "AI",
        })
      ),
      ...manualChangeRows.map(
        (change): ProjectActivityDTO => ({
          id: `manual-change:${change.id}`,
          type: "MANUAL_CHANGE",
          timestamp: change.createdAt.getTime(),
          actor: change.actorUserId
            ? actorNameById.get(change.actorUserId) ?? "사용자"
            : "사용자",
          title: change.taskTitle,
          description: change.summary,
          taskId:
            change.taskId && activeTaskIds.has(change.taskId)
              ? change.taskId
              : null,
          recordId: null,
          source: "MANUAL",
        })
      ),
    ]
      .sort((left, right) => right.timestamp - left.timestamp)
      .slice(0, limit);

    const lowConfidenceChanges: LowConfidenceChangeDTO[] = reviewRows
      .filter(
        (change): change is typeof change & { confidence: number } =>
          change.confidence !== null
      )
      .map((change) => ({
        id: change.id,
        taskId:
          change.taskId && activeTaskIds.has(change.taskId)
            ? change.taskId
            : null,
        taskTitle: change.taskTitle,
        changeType: change.changeType as LowConfidenceChangeDTO["changeType"],
        reason: change.reason,
        confidence: change.confidence,
        createdAt: change.createdAt.getTime(),
      }));

    return NextResponse.json({
      activities,
      lowConfidenceChanges,
      lowConfidenceThreshold: LOW_CONFIDENCE_THRESHOLD,
    });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
