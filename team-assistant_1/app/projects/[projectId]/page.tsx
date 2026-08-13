"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  getContribution,
  getProject,
  getRecentChanges,
  listTasks,
  type Member,
  type Project,
} from "@/lib/apiClient";
import type { MemberContribution, RecentChangeDTO, TaskDTO } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import ContributionBar from "@/components/ContributionBar";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";

const CHANGE_TYPE_LABEL: Record<string, string> = {
  TASK_CREATE: "신규 Task 생성",
  TASK_STATUS_CHANGE: "상태 변경",
  TASK_ASSIGNEE_CHANGE: "담당자 변경",
  TASK_UPDATE: "정보 업데이트",
  EVIDENCE_ADD: "근거 추가",
};

export default function DashboardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [contribution, setContribution] = useState<MemberContribution[]>([]);
  const [changes, setChanges] = useState<RecentChangeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [projectRes, taskRes, contribRes, changesRes] = await Promise.all([
        getProject(projectId),
        listTasks(projectId),
        getContribution(projectId),
        getRecentChanges(projectId),
      ]);
      setProject(projectRes.project);
      setMembers(projectRes.members);
      setTasks(taskRes.tasks);
      setContribution(contribRes.contribution);
      setChanges(changesRes.changes);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "대시보드를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-6 py-16">
        <Spinner label="불러오는 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-3 px-6 py-16">
        <p className="text-sm text-rose-600">{error}</p>
        <button onClick={() => router.push("/")} className="text-sm text-slate-500 underline">
          프로젝트 목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button onClick={() => router.push("/")} className="text-sm text-slate-500 hover:text-slate-700">
            ← 프로젝트 목록
          </button>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{project?.name}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/projects/${projectId}/members`)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            팀원 관리
          </button>
          <button
            onClick={() => router.push(`/projects/${projectId}/records/new`)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + 기록 추가
          </button>
        </div>
      </div>

      {members.length === 0 && (
        <EmptyState
          title="아직 팀원이 없습니다."
          description="AI가 대화 속 화자를 인식하려면 먼저 팀원을 등록해주세요."
          action={
            <button
              onClick={() => router.push(`/projects/${projectId}/members`)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              팀원 등록하러 가기
            </button>
          }
        />
      )}

      {/* Member contribution */}
      {members.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">팀원별 기여도</h2>
          <div className="flex flex-col gap-4">
            {contribution.map((m) => (
              <ContributionBar key={m.memberId} member={m} />
            ))}
          </div>
        </section>
      )}

      {/* Recent changes */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">최근 변경사항</h2>
        {changes.length === 0 ? (
          <p className="text-sm text-slate-500">아직 AI 분석으로 발생한 변경사항이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {changes.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-800">{c.taskTitle}</p>
                  <p className="text-sm text-slate-600">{c.summary}</p>
                  {c.reason && <p className="mt-0.5 text-xs text-slate-400">{c.reason}</p>}
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-400">
                  {CHANGE_TYPE_LABEL[c.changeType] ?? c.changeType}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Task list */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Task 목록</h2>
        {tasks.length === 0 ? (
          <EmptyState
            title="아직 분석된 업무가 없습니다."
            description="첫 번째 회의 기록을 추가해보세요."
            action={
              <button
                onClick={() => router.push(`/projects/${projectId}/records/new`)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                기록 추가하기
              </button>
            }
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => router.push(`/projects/${projectId}/tasks/${t.id}`)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm hover:border-indigo-300 hover:bg-indigo-50/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{t.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {t.assigneeName ?? "미배정"} · 중요도 {t.importance} · 난이도 {t.difficulty} · 작업량{" "}
                      {t.workload}
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
