"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  getContributionHistory,
  getProjectActivity,
  getProject,
  listRecords,
  listTasks,
  reopenProject,
  type ContributionHistorySnapshot,
  type Member,
  type Project,
  type RecordItem,
} from "@/lib/apiClient";
import type { ProjectActivityDTO, TaskDTO } from "@/lib/types";
import Avatar from "@/components/Avatar";
import ContributionHistoryChart from "@/components/ContributionHistoryChart";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";
import StatusBadge from "@/components/StatusBadge";
import TaskContributors from "@/components/TaskContributors";

export default function ProjectResultPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [role, setRole] = useState<"OWNER" | "MEMBER">("MEMBER");
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [snapshots, setSnapshots] = useState<ContributionHistorySnapshot[]>([]);
  const [activities, setActivities] = useState<ProjectActivityDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectRes, taskRes, recordRes, historyRes, activityRes] = await Promise.all([
        getProject(projectId),
        listTasks(projectId),
        listRecords(projectId),
        getContributionHistory(projectId),
        getProjectActivity(projectId, 20),
      ]);
      if (projectRes.project.status === "ACTIVE") {
        router.replace(`/projects/${projectId}`);
        return;
      }
      setProject(projectRes.project);
      setRole(projectRes.currentUserRole);
      setMembers(projectRes.members);
      setTasks(taskRes.tasks);
      setRecords(recordRes.records);
      setSnapshots(historyRes.snapshots);
      setActivities(activityRes.activities);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "최종 결과를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load();
  }, [load]);

  const finalSnapshot = snapshots.at(-1);
  const finalContribution = useMemo(
    () => [...(finalSnapshot?.members ?? [])].sort((a, b) => b.percentage - a.percentage),
    [finalSnapshot]
  );
  const doneCount = tasks.filter((task) => task.status === "DONE").length;

  async function handleReopen() {
    if (!window.confirm("프로젝트를 다시 활성화하면 기록과 Task를 수정할 수 있습니다. 다시 시작할까요?")) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await reopenProject(projectId);
      router.push(`/projects/${projectId}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "프로젝트를 다시 시작하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || (!project && !error)) {
    return <div className="page-container flex min-h-[60vh] items-center justify-center"><Spinner label="최종 결과를 불러오는 중..." /></div>;
  }

  if (error && !project) {
    return <div className="page-container"><div className="rounded-xl bg-rose-50 px-4 py-4 text-center"><p className="text-sm text-rose-600">{error}</p><button type="button" onClick={load} className="btn-secondary mt-3 rounded-xl px-4 py-2 text-sm font-semibold">다시 시도</button></div></div>;
  }

  const startedAt = new Date(project!.createdAt);
  const completedAt = project!.completedAt ? new Date(project!.completedAt) : null;
  const durationDays = completedAt
    ? Math.max(1, Math.ceil((completedAt.getTime() - startedAt.getTime()) / 86_400_000))
    : null;

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">Final Result</p>
            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white">종료됨</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{project!.name} 최종 결과</h1>
          <p className="mt-1 text-sm text-slate-500">
            {startedAt.toLocaleDateString("ko-KR")} – {completedAt?.toLocaleDateString("ko-KR")}
            {durationDays ? ` · ${durationDays}일` : ""}
          </p>
        </div>
        {role === "OWNER" && (
          <button type="button" onClick={handleReopen} disabled={busy} className="btn-secondary rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
            {busy ? "처리 중..." : "프로젝트 다시 시작"}
          </button>
        )}
      </div>

      {error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

      <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="팀원" value={members.length} />
        <SummaryCard label="분석 기록" value={records.length} />
        <SummaryCard label="전체 Task" value={tasks.length} />
        <SummaryCard label="완료 Task" value={`${doneCount}/${tasks.length}`} />
      </section>

      <section className="glass-card mt-6 rounded-2xl p-5 sm:p-6">
        <h2 className="text-base font-bold text-slate-800">최종 기여도</h2>
        <p className="mt-1 text-xs text-slate-500">프로젝트 종료 시점에 확정하여 저장한 결과입니다.</p>
        {finalContribution.length === 0 ? (
          <div className="mt-5"><EmptyState title="저장된 최종 기여도가 없습니다." description="업무나 담당자가 없었던 프로젝트일 수 있습니다." /></div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {finalContribution.map((member, index) => (
              <article key={member.memberId} className="rounded-2xl border border-white/70 bg-white/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><Avatar emoji={member.avatarEmoji} name={member.name} size="md" /><span className="text-sm font-bold text-slate-800">{member.name}</span></div>
                  <span className="text-xs font-semibold text-slate-400">#{index + 1}</span>
                </div>
                <p className="mt-4 text-3xl font-bold tracking-tight text-indigo-600">{member.percentage.toFixed(1)}%</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="glass-card mt-6 rounded-2xl p-5 sm:p-6">
        <h2 className="text-base font-bold text-slate-800">기여도 변화</h2>
        <p className="mt-1 text-xs text-slate-500">각 AI 분석 결과와 최종 확정 시점의 변화입니다. 점에 마우스를 올리면 세부 값을 볼 수 있습니다.</p>
        <div className="mt-5"><ContributionHistoryChart snapshots={snapshots} /></div>
      </section>

      <section className="glass-card mt-6 rounded-2xl p-5 sm:p-6">
        <h2 className="text-base font-bold text-slate-800">프로젝트 활동</h2>
        <p className="mt-1 text-xs text-slate-500">종료된 프로젝트의 기록과 변경 과정입니다.</p>
        {activities.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">아직 프로젝트 활동이 없습니다.</p>
        ) : (
          <ul className="relative mt-5 grid gap-4 before:absolute before:bottom-3 before:left-[5px] before:top-3 before:w-px before:bg-indigo-100">
            {activities.map((activity) => (
              <li key={activity.id} className="relative pl-5 before:absolute before:left-0 before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:border-2 before:border-white before:bg-indigo-500">
                <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-slate-800">{activity.title}</p>{activity.source && <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${activity.source === "MANUAL" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-600"}`}>{activity.source === "MANUAL" ? "직접 수정" : "AI"}</span>}</div>
                <p className="mt-0.5 text-xs text-slate-500">{activity.description}</p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400"><time>{new Date(activity.timestamp).toLocaleString("ko-KR")}</time>{activity.actor && <span>· {activity.actor}</span>}{activity.taskId && <button type="button" onClick={() => router.push(`/projects/${projectId}/tasks/${activity.taskId}`)} className="font-semibold text-indigo-500">Task 보기</button>}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="glass-card mt-6 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between"><h2 className="text-base font-bold text-slate-800">최종 Task</h2><span className="text-xs text-slate-400">총 {tasks.length}개</span></div>
        {tasks.length === 0 ? (
          <div className="mt-5"><EmptyState title="등록된 Task가 없습니다." description="이 프로젝트에는 분석된 업무가 없습니다." /></div>
        ) : (
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {tasks.map((task) => (
              <li key={task.id}>
                <button type="button" onClick={() => router.push(`/projects/${projectId}/tasks/${task.id}`)} className="w-full rounded-xl border border-white/70 bg-white/50 p-4 text-left hover:border-indigo-200 hover:bg-white/75">
                  <div className="flex items-start justify-between gap-3"><span className="min-w-0 truncate text-sm font-semibold text-slate-800">{task.title}</span><StatusBadge status={task.status} /></div>
                  <div className="mt-3"><TaskContributors contributors={task.contributors} compact /></div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number | string }) {
  return <div className="glass-card rounded-2xl p-4 sm:p-5"><p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p><p className="mt-2 text-xs font-semibold text-slate-500">{label}</p></div>;
}
