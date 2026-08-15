"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  completeProject,
  getContribution,
  getProject,
  getRecentChanges,
  listTasks,
  type Member,
  type Project,
} from "@/lib/apiClient";
import type { MemberContribution, RecentChangeDTO, TaskDTO, TaskStatus } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import ContributionBar from "@/components/ContributionBar";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";
import Avatar from "@/components/Avatar";

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
  const [filter, setFilter] = useState<"ALL" | TaskStatus>("ALL");
  const [role, setRole] = useState<"OWNER" | "MEMBER">("MEMBER");
  const [completing, setCompleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [projectRes, taskRes, contribRes, changesRes] = await Promise.all([
        getProject(projectId),
        listTasks(projectId),
        getContribution(projectId),
        getRecentChanges(projectId),
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
        <button onClick={() => router.push("/")} className="text-sm text-slate-500 underline">
          프로젝트 목록으로
        </button>
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
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{project?.name}</h1>
          <p className="mt-1 text-sm text-slate-500">팀의 업무와 최신 변화를 한눈에 확인하세요.</p>
        </div>
        <div className="flex gap-2">
          {role === "OWNER" && (
            <button
              type="button"
              onClick={handleComplete}
              disabled={completing}
              className="rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-50"
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
            + 기록 추가
          </button>
        </div>
      </div>

      <section className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard label="전체 Task" value={counts.total} tone="indigo" icon="▦" />
        <SummaryCard label="할 일" value={counts.todo} tone="slate" icon="○" />
        <SummaryCard label="진행 중" value={counts.progress} tone="amber" icon="◐" />
        <SummaryCard label="완료" value={counts.done} tone="emerald" icon="✓" />
      </section>

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

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.85fr)]">
      {/* Task list */}
      <section className="glass-card rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-3 border-b border-white/70 pb-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-base font-bold text-slate-800">Task</h2><p className="mt-0.5 text-xs text-slate-500">실제 프로젝트 업무 {tasks.length}개</p></div><div className="flex w-fit rounded-xl border border-white/70 bg-white/45 p-1">{([['ALL','전체'],['TODO','할 일'],['IN_PROGRESS','진행 중'],['DONE','완료']] as const).map(([value,label]) => <button key={value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${filter === value ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-white/70"}`}>{label}</button>)}</div></div>
        {visibleTasks.length === 0 ? (
          <div className="py-10"><EmptyState title={tasks.length ? "이 상태의 Task가 없습니다." : "아직 분석된 업무가 없습니다."} description={tasks.length ? "다른 상태 필터를 선택해보세요." : "첫 번째 회의 기록을 추가해보세요."} action={!tasks.length ? <button onClick={() => router.push(`/projects/${projectId}/records/new`)} className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold">기록 추가하기</button> : undefined} /></div>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {visibleTasks.map((t) => <li key={t.id}><button onClick={() => router.push(`/projects/${projectId}/tasks/${t.id}`)} className="group w-full rounded-xl border border-white/70 bg-white/48 p-4 text-left hover:border-indigo-200 hover:bg-white/75"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800 group-hover:text-indigo-700">{t.title}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Avatar emoji={t.assigneeAvatarEmoji} name={t.assigneeName} size="sm" />{t.assigneeName ?? "미배정"}</p></div><StatusBadge status={t.status} /></div><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400"><span>중요도 <b className="text-slate-600">{t.importance}</b></span><span>난이도 <b className="text-slate-600">{t.difficulty}</b></span><span>작업량 <b className="text-slate-600">{t.workload}</b></span></div></button></li>)}
          </ul>
        )}
      </section>

      <div className="grid gap-6">
      {members.length > 0 && <section className="glass-card rounded-2xl p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold text-slate-800">팀원별 기여도</h2><button onClick={() => router.push(`/projects/${projectId}/contribution`)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">자세히 →</button></div><div className="flex flex-col gap-4">{contribution.map((m) => <ContributionBar key={m.memberId} member={m} />)}</div></section>}

      {/* Recent changes */}
      <section className="glass-card rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-800">Recent Changes</h2>
        {changes.length === 0 ? (
          <p className="text-sm text-slate-500">아직 AI 분석으로 발생한 변경사항이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {changes.map((c) => (
              <li key={c.id} className="flex items-start gap-3 rounded-xl border border-white/60 bg-white/45 px-3 py-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,.12)]" />
                <div>
                  <p className="text-sm font-medium text-slate-800">{c.taskTitle}</p>
                  <p className="text-sm text-slate-600">{c.summary}</p>
                  {c.reason && <p className="mt-0.5 text-xs text-slate-400">{c.reason}</p>}
                  <span className="mt-1 inline-block text-[10px] font-semibold text-indigo-500">{CHANGE_TYPE_LABEL[c.changeType] ?? c.changeType}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      </div></div>
    </div>
  );
}

function SummaryCard({ label, value, tone, icon }: { label: string; value: number; tone: "indigo" | "slate" | "amber" | "emerald"; icon: string }) {
  const tones = { indigo: "bg-indigo-500/10 text-indigo-600", slate: "bg-slate-500/10 text-slate-600", amber: "bg-amber-500/10 text-amber-600", emerald: "bg-emerald-500/10 text-emerald-600" };
  return <div className="glass-card rounded-2xl p-4 sm:p-5"><div className="flex items-center justify-between"><span className={`flex h-9 w-9 items-center justify-center rounded-xl text-base font-bold ${tones[tone]}`}>{icon}</span><span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span></div><p className="mt-4 text-xs font-semibold text-slate-500">{label}</p></div>;
}
