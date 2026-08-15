"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  completeProject,
  getContribution,
  getProjectActivity,
  getProject,
  getRecentChanges,
  listTasks,
  type Member,
  type Project,
} from "@/lib/apiClient";
import type {
  LowConfidenceChangeDTO,
  MemberContribution,
  ProjectActivityDTO,
  RecentChangeDTO,
  TaskDTO,
  TaskStatus,
} from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import ContributionBar from "@/components/ContributionBar";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";
import TaskContributors from "@/components/TaskContributors";

const CHANGE_TYPE_LABEL: Record<string, string> = {
  TASK_CREATE: "신규 Task 생성",
  TASK_STATUS_CHANGE: "상태 변경",
  TASK_ASSIGNEE_CHANGE: "담당자 변경",
  TASK_CONTRIBUTORS_CHANGE: "참여자 변경",
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
  const [activities, setActivities] = useState<ProjectActivityDTO[]>([]);
  const [lowConfidenceChanges, setLowConfidenceChanges] = useState<LowConfidenceChangeDTO[]>([]);
  const [activityVisibleCount, setActivityVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | TaskStatus>("ALL");
  const [role, setRole] = useState<"OWNER" | "MEMBER">("MEMBER");
  const [completing, setCompleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectRes, taskRes, contribRes, changesRes, activityRes] = await Promise.all([
        getProject(projectId),
        listTasks(projectId),
        getContribution(projectId),
        getRecentChanges(projectId),
        getProjectActivity(projectId, 20),
      ]);
      if (projectRes.project.status === "COMPLETED") {
        router.replace(`/projects/${projectId}/result`);
        return;
      }
      setProject(projectRes.project);
      setRole(projectRes.currentUserRole);
      setMembers(projectRes.members);
      setTasks(taskRes.tasks);
      setContribution(contribRes.contribution);
      setChanges(changesRes.changes);
      setActivities(activityRes.activities);
      setLowConfidenceChanges(activityRes.lowConfidenceChanges);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "대시보드를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  async function handleComplete() {
    if (!window.confirm("프로젝트를 종료하면 모든 기록과 Task가 읽기 전용으로 전환되고 현재 기여도가 최종 결과로 저장됩니다. 종료할까요?")) return;
    setCompleting(true);
    setError(null);
    try {
      await completeProject(projectId);
      router.push(`/projects/${projectId}/result`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "프로젝트 종료에 실패했습니다.");
    } finally {
      setCompleting(false);
    }
  }

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
        <div className="flex gap-3">
          <button onClick={load} className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold">다시 시도</button>
          <button onClick={() => router.push("/")} className="text-sm text-slate-500 underline">프로젝트 목록으로</button>
        </div>
      </div>
    );
  }

  const counts = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "TODO").length,
    progress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    done: tasks.filter((task) => task.status === "DONE").length,
  };
  const visibleTasks = filter === "ALL" ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <div className="page-container">
      <header className="border-b border-slate-200 pb-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /><p className="text-xs font-semibold text-slate-500">진행 중</p></div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{project?.name}</h1>
          <p className="mt-1.5 text-sm text-slate-500">팀의 업무와 최근 변화를 확인하세요.</p>
        </div>
        <div className="flex gap-2">
          {role === "OWNER" && (
            <button
              type="button"
              onClick={handleComplete}
              disabled={completing}
              className="btn-secondary rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {completing ? "종료 중..." : "프로젝트 종료"}
            </button>
          )}
          <button
            onClick={() => router.push(`/projects/${projectId}/members`)}
            className="btn-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            팀원 관리
          </button>
          <button
            onClick={() => router.push(`/projects/${projectId}/records/new`)}
            className="btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            기록 추가
          </button>
        </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:gap-10">
          <SummaryMetric label="전체" value={counts.total} />
          <SummaryMetric label="할 일" value={counts.todo} />
          <SummaryMetric label="진행 중" value={counts.progress} />
          <SummaryMetric label="완료" value={counts.done} />
        </dl>
      </header>

      <section className="mt-9">
        <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-lg font-bold text-slate-900">팀 기여도</h2><p className="mt-1 text-sm text-slate-500">현재 Task를 기준으로 계산한 팀원별 비율입니다.</p></div>{members.length > 0 && <button onClick={() => router.push(`/projects/${projectId}/contribution`)} className="text-sm font-semibold text-[#6541f3] hover:text-[#5632d8]">상세 보기 →</button>}</div>
        {members.length === 0 ? (
          <EmptyState title="아직 팀원이 없습니다." description="대화 속 화자를 연결하려면 먼저 팀원을 등록해주세요." action={<button onClick={() => router.push(`/projects/${projectId}/members`)} className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold">팀원 등록</button>} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="grid gap-5 md:grid-cols-2">{contribution.map((member) => <ContributionBar key={member.memberId} member={member} />)}</div></div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-lg font-bold text-slate-900">현재 Task</h2><p className="mt-1 text-sm text-slate-500">프로젝트 업무 {tasks.length}개</p></div><div className="flex w-fit rounded-xl bg-slate-100 p-1">{([['ALL','전체'],['TODO','할 일'],['IN_PROGRESS','진행 중'],['DONE','완료']] as const).map(([value,label]) => <button key={value} onClick={() => setFilter(value)} aria-pressed={filter === value} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${filter === value ? "bg-white text-[#6541f3] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>)}</div></div>
        {visibleTasks.length === 0 ? (
          <div className="py-10"><EmptyState title={tasks.length ? "이 상태의 Task가 없습니다." : "아직 분석된 업무가 없습니다."} description={tasks.length ? "다른 상태 필터를 선택해보세요." : "첫 번째 회의 기록을 추가해보세요."} action={!tasks.length ? <button onClick={() => router.push(`/projects/${projectId}/records/new`)} className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold">기록 추가하기</button> : undefined} /></div>
        ) : (
          <ul className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-200">
            {visibleTasks.map((t) => <li key={t.id}><button onClick={() => router.push(`/projects/${projectId}/tasks/${t.id}`)} className="group w-full p-4 text-left hover:bg-slate-50 sm:px-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900 group-hover:text-[#6541f3]">{t.title}</p><div className="mt-2"><TaskContributors contributors={t.contributors} compact /></div></div><StatusBadge status={t.status} /></div><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400"><span>중요도 <b className="text-slate-600">{t.importance}</b></span><span>난이도 <b className="text-slate-600">{t.difficulty}</b></span><span>작업량 <b className="text-slate-600">{t.workload}</b></span></div></button></li>)}
          </ul>
        )}
      </section>

      <section className="mt-10 border-t border-slate-200 pt-8">
        <h2 className="text-lg font-bold text-slate-900">최근 변화</h2>
        <p className="mt-1 text-sm text-slate-500">새 기록을 분석하며 반영된 변경 사항입니다.</p>
        {changes.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">아직 분석으로 발생한 변경 사항이 없습니다.</p>
        ) : (
          <ul className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            {changes.map((c) => (
              <li key={c.id} className="flex items-start gap-3 py-4">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6541f3]" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.taskTitle}</p>
                  <p className="text-sm text-slate-600">{c.summary}</p>
                  {c.reason && <p className="mt-0.5 text-xs text-slate-400">{c.reason}</p>}
                  <span className="mt-1 inline-block text-[10px] font-semibold text-[#6541f3]">{CHANGE_TYPE_LABEL[c.changeType] ?? c.changeType}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lowConfidenceChanges.length > 0 && (
        <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-bold text-slate-900">확인이 필요한 판단</h2><p className="mt-1 text-sm text-slate-600">신뢰도가 낮은 항목은 직접 근거를 확인해주세요.</p></div><span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">{lowConfidenceChanges.length}개</span></div>
          <ul className="mt-4 divide-y divide-amber-200">
            {lowConfidenceChanges.slice(0, 4).map((change) => (
              <li key={change.id} className="py-3 first:pt-0 last:pb-0"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{change.taskTitle}</p><p className="mt-1 text-xs leading-5 text-slate-600">{change.reason || "판단 근거를 직접 확인해주세요."}</p></div><strong className="shrink-0 text-xs text-amber-700">{Math.round(change.confidence * 100)}%</strong></div>{change.taskId && <button type="button" onClick={() => router.push(`/projects/${projectId}/tasks/${change.taskId}`)} className="mt-2 text-xs font-semibold text-[#6541f3]">Task 확인 →</button>}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 border-t border-slate-200 pt-8">
        <div className="mb-5"><h2 className="text-lg font-bold text-slate-900">프로젝트 활동</h2><p className="mt-1 text-sm text-slate-500">기록과 Task가 누적된 흐름입니다.</p></div>
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500">아직 프로젝트 활동이 없습니다.</p>
        ) : (
          <ul className="relative ml-1 flex flex-col gap-5 before:absolute before:bottom-3 before:left-[5px] before:top-3 before:w-px before:bg-slate-200">
            {activities.slice(0, activityVisibleCount).map((activity) => (
              <li key={activity.id} className="relative pl-5 before:absolute before:left-0 before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:border-2 before:border-white before:bg-[#6541f3]">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1"><p className="text-sm font-semibold text-slate-800">{activity.title}</p>{activity.source && <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${activity.source === "MANUAL" ? "bg-emerald-50 text-emerald-700" : "bg-violet-50 text-[#6541f3]"}`}>{activity.source === "MANUAL" ? "직접 수정" : "AI 분석"}</span>}</div>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">{activity.description}</p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400"><time>{formatActivityTime(activity.timestamp)}</time>{activity.actor && <span>· {activity.actor}</span>}{activity.taskId && <button type="button" onClick={() => router.push(`/projects/${projectId}/tasks/${activity.taskId}`)} className="font-semibold text-[#6541f3]">Task 보기</button>}</div>
              </li>
            ))}
          </ul>
        )}
        {activities.length > activityVisibleCount && <button type="button" onClick={() => setActivityVisibleCount((count) => Math.min(activities.length, count + 8))} className="mt-4 text-xs font-semibold text-[#6541f3]">더 보기</button>}
      </section>
    </div>
  );
}

function formatActivityTime(timestamp: number) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return <div><dt className="text-xs font-medium text-slate-400">{label}</dt><dd className="mt-1 text-xl font-bold text-slate-900">{value}</dd></div>;
}
