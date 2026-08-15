"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, getContribution, getProject, getTask, listTasks, type Member, type Project } from "@/lib/apiClient";
import type { MemberContribution, TaskDTO } from "@/lib/types";
import ContributionBar from "@/components/ContributionBar";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";
import Avatar from "@/components/Avatar";

export default function ContributionReportPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [contribution, setContribution] = useState<MemberContribution[]>([]);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [evidenceByMember, setEvidenceByMember] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [projectRes, contributionRes, taskRes] = await Promise.all([getProject(projectId), getContribution(projectId), listTasks(projectId)]);
      setProject(projectRes.project);
      setMembers(projectRes.members);
      setContribution(contributionRes.contribution);
      setTasks(taskRes.tasks);
      const details = await Promise.all(taskRes.tasks.map((task) => getTask(projectId, task.id).catch(() => null)));
      const counts: Record<string, number> = {};
      for (const detail of details) {
        if (!detail) continue;
        for (const contributor of detail.task.contributors) {
          counts[contributor.memberId] =
            (counts[contributor.memberId] ?? 0) + detail.evidence.length;
        }
      }
      setEvidenceByMember(counts);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "기여도 리포트를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load();
  }, [load]);

  const taskCounts = useMemo(() => Object.fromEntries(members.map((member) => [member.id, tasks.filter((task) => task.contributors.some((contributor) => contributor.memberId === member.id)).length])), [members, tasks]);
  const rankedContribution = useMemo(() => [...contribution].sort((a, b) => b.percentage - a.percentage), [contribution]);

  if (loading) return <div className="page-container flex min-h-[60vh] items-center justify-center"><Spinner label="기여도 데이터를 불러오는 중..." /></div>;

  return <div className="page-container">
    <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">Contribution Report</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{project?.name} 기여도 리포트</h1><p className="mt-1 text-sm text-slate-500">실제 Task 평가와 Evidence를 기반으로 계산된 팀 기여도입니다.</p></div>
    {error && <p className="mt-5 rounded-xl bg-rose-50/80 px-4 py-3 text-sm text-rose-600">{error}</p>}
    {!error && contribution.length === 0 ? <div className="mt-7"><EmptyState title="아직 계산된 기여도가 없습니다." description="기록을 분석하면 팀원별 기여도가 이곳에 표시됩니다." /></div> : <>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rankedContribution.map((member, index) => <article key={member.memberId} className="glass-card rounded-2xl p-5">
          <div className="flex items-start justify-between"><Avatar emoji={member.avatarEmoji} name={member.name} size="md" /><span className="text-xs font-semibold text-slate-400">#{index + 1}</span></div>
          <h2 className="mt-4 text-sm font-bold text-slate-800">{member.name}</h2><p className="mt-1 text-3xl font-bold tracking-tight text-indigo-600">{member.percentage.toFixed(1)}%</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center"><div className="rounded-xl bg-white/45 px-2 py-2"><p className="text-lg font-bold text-slate-800">{taskCounts[member.memberId] ?? 0}</p><p className="text-[10px] text-slate-400">담당 Task</p></div><div className="rounded-xl bg-white/45 px-2 py-2"><p className="text-lg font-bold text-slate-800">{evidenceByMember[member.memberId] ?? 0}</p><p className="text-[10px] text-slate-400">Evidence</p></div></div>
          {member.deltaPercentage !== null && <p className={`mt-3 text-xs font-semibold ${member.deltaPercentage >= 0 ? "text-emerald-600" : "text-rose-600"}`}>이전 분석 대비 {member.deltaPercentage > 0 ? "+" : ""}{member.deltaPercentage.toFixed(1)}%p</p>}
        </article>)}
      </section>
      <section className="glass-card mt-6 rounded-2xl p-5 sm:p-6"><h2 className="text-base font-bold text-slate-800">기여도 분포</h2><p className="mt-1 text-xs text-slate-500">현재 계산 결과와 직전 분석 대비 변화를 함께 보여줍니다.</p><div className="mt-6 grid gap-5">{rankedContribution.map((member) => <ContributionBar key={member.memberId} member={member} />)}</div></section>
    </>}
  </div>;
}
