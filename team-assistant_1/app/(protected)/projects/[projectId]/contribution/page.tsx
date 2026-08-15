"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  getContribution,
  getContributionBreakdown,
  getProject,
  type Project,
} from "@/lib/apiClient";
import type {
  ContributionBreakdownMember,
  MemberContribution,
  TaskStatus,
} from "@/lib/types";
import Avatar from "@/components/Avatar";
import ContributionBar from "@/components/ContributionBar";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";
import StatusBadge from "@/components/StatusBadge";

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "할 일",
  IN_PROGRESS: "진행 중",
  DONE: "완료",
};

export default function ContributionReportPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [contribution, setContribution] = useState<MemberContribution[]>([]);
  const [breakdown, setBreakdown] = useState<ContributionBreakdownMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectRes, contributionRes, breakdownRes] = await Promise.all([
        getProject(projectId),
        getContribution(projectId),
        getContributionBreakdown(projectId),
      ]);
      setProject(projectRes.project);
      setContribution(contributionRes.contribution);
      setBreakdown(breakdownRes.members);
      setSelectedMemberId((current) =>
        current && breakdownRes.members.some((member) => member.memberId === current)
          ? current
          : null
      );
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "기여도 리포트를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load();
  }, [load]);

  const rankedContribution = useMemo(
    () => [...contribution].sort((a, b) => b.percentage - a.percentage),
    [contribution]
  );
  const breakdownByMemberId = useMemo(
    () => new Map(breakdown.map((member) => [member.memberId, member])),
    [breakdown]
  );
  const selectedMember = selectedMemberId
    ? breakdownByMemberId.get(selectedMemberId) ?? null
    : null;

  if (loading) {
    return (
      <div className="page-container flex min-h-[60vh] items-center justify-center">
        <Spinner label="기여도 데이터를 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div>
        <p className="page-eyebrow">기여도</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {project?.name} 기여도 리포트
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Task 평가와 참여 비율을 기준으로 계산한 결과입니다.
        </p>
      </div>

      {error ? (
        <div className="mt-7 rounded-2xl border border-rose-100 bg-rose-50/70 p-5 text-center">
          <p className="text-sm text-rose-600">{error}</p>
          <button type="button" onClick={load} className="btn-secondary mt-3 rounded-xl px-4 py-2 text-sm font-semibold">
            다시 시도
          </button>
        </div>
      ) : contribution.length === 0 ? (
        <div className="mt-7">
          <EmptyState title="아직 계산된 기여도가 없습니다." description="기록을 분석하면 팀원별 기여도가 이곳에 표시됩니다." />
        </div>
      ) : (
        <>
          <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-200">
            {rankedContribution.map((member, index) => {
              const detail = breakdownByMemberId.get(member.memberId);
              const selected = selectedMemberId === member.memberId;
              return (
                <button
                  type="button"
                  key={member.memberId}
                  onClick={() => setSelectedMemberId(selected ? null : member.memberId)}
                  aria-expanded={selected}
                  className={`w-full p-5 text-left sm:px-6 ${selected ? "bg-violet-50" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-5 shrink-0 text-center text-sm font-semibold text-slate-400">{index + 1}</span>
                    <Avatar emoji={member.avatarEmoji} name={member.name} size="md" />
                    <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-bold text-slate-900">{member.name}</h2><p className="mt-1 text-xs text-slate-500">참여 Task {detail?.tasks.length ?? 0}개 · 점수 {member.rawScore.toFixed(2)}</p></div>
                    <div className="text-right"><p className="text-xl font-bold tracking-tight text-[#6541f3]">{member.percentage.toFixed(1)}%</p>{member.deltaPercentage !== null && <p className={`mt-1 text-xs font-semibold ${member.deltaPercentage >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{member.deltaPercentage > 0 ? "+" : ""}{member.deltaPercentage.toFixed(1)}%p</p>}</div>
                    <span className="text-xs font-semibold text-[#6541f3]" aria-hidden="true">{selected ? "접기" : "보기"}</span>
                  </div>
                </button>
              );
            })}
          </section>

          {selectedMember && <ContributionBreakdownPanel projectId={projectId} member={selectedMember} />}

          <section className="mt-10 border-t border-slate-200 pt-8">
            <h2 className="text-base font-bold text-slate-800">기여도 분포</h2>
            <p className="mt-1 text-xs text-slate-500">현재 계산 결과와 직전 분석 대비 변화를 함께 보여줍니다.</p>
            <div className="mt-6 grid gap-5">
              {rankedContribution.map((member) => <ContributionBar key={member.memberId} member={member} />)}
            </div>
          </section>

          <details className="mt-8 border-t border-slate-200 pt-6">
            <summary className="cursor-pointer text-sm font-bold text-slate-800">기여도는 어떻게 계산되나요?</summary>
            <div className="mt-4 grid gap-2 text-sm leading-6 text-slate-600">
              <p>Task 점수 = 중요도 30% + 난이도 30% + 작업량 40%</p>
              <p>진행 상태: 할 일 ×0.2 · 진행 중 ×0.6 · 완료 ×1.0</p>
              <p>공동작업은 각 Task 내부 참여 비율만큼 점수를 나눕니다.</p>
              <p>모든 Task 점수를 합산한 뒤 팀 전체 점수 대비 비율로 최종 기여도를 계산합니다. AI가 최종 퍼센트를 직접 정하지 않습니다.</p>
            </div>
          </details>
        </>
      )}
    </div>
  );
}

function ContributionBreakdownPanel({ projectId, member }: { projectId: string; member: ContributionBreakdownMember }) {
  return (
    <section className="mt-6 rounded-2xl border border-violet-200 bg-violet-50/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar emoji={member.avatarEmoji} name={member.name} size="md" />
          <div><h2 className="font-bold text-slate-900">{member.name}</h2><p className="text-xs text-slate-500">Task별 기여도 Breakdown</p></div>
        </div>
        <p className="text-right"><span className="block text-xs text-slate-400">최종 기여도</span><strong className="text-2xl text-[#6541f3]">{member.percentage.toFixed(1)}%</strong></p>
      </div>

      {member.tasks.length === 0 ? (
        <p className="mt-5 rounded-xl bg-white p-4 text-sm text-slate-500">이 팀원에게 배분된 Task 점수가 아직 없습니다.</p>
      ) : (
        <div className="mt-5 grid gap-3">
          {member.tasks.map((task) => (
            <article key={task.taskId} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="font-semibold text-slate-800">{task.title}</h3><p className="mt-1 text-xs text-slate-400">중요도 {task.importance} · 난이도 {task.difficulty} · 작업량 {task.workload}</p></div>
                <StatusBadge status={task.status} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <BreakdownValue label="Task 기본 점수" value={task.taskScore.toFixed(2)} />
                <BreakdownValue label={STATUS_LABEL[task.status]} value={`× ${task.statusMultiplier.toFixed(1)}`} />
                <BreakdownValue label="Task 참여율" value={`${task.contributorShare}%`} />
                <BreakdownValue label="내 점수" value={task.memberTaskScore.toFixed(2)} emphasized />
              </dl>
              <Link href={`/projects/${projectId}/tasks/${task.taskId}`} className="mt-3 inline-block text-xs font-semibold text-[#6541f3] hover:text-[#5632d8]">Task 상세 보기 →</Link>
            </article>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-x-8 gap-y-2 border-t border-violet-200 pt-4 text-sm">
        <p className="text-slate-500">Raw Score 합계 <strong className="ml-2 text-slate-900">{member.rawScore.toFixed(2)}</strong></p>
        <p className="text-slate-500">최종 기여도 <strong className="ml-2 text-[#6541f3]">{member.percentage.toFixed(1)}%</strong></p>
      </div>
    </section>
  );
}

function BreakdownValue({ label, value, emphasized = false }: { label: string; value: string; emphasized?: boolean }) {
  return <div className="rounded-lg bg-slate-50 px-3 py-2"><dt className="text-slate-400">{label}</dt><dd className={`mt-1 font-bold ${emphasized ? "text-[#6541f3]" : "text-slate-700"}`}>{value}</dd></div>;
}
