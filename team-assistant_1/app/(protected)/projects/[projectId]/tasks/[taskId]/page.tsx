"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  deleteTask,
  getProject,
  getTask,
  updateTask,
  type Member,
} from "@/lib/apiClient";
import type { EvidenceDTO, TaskDTO, TaskStatus } from "@/lib/types";
import { TASK_STATUSES } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import Spinner from "@/components/Spinner";
import TaskContributors from "@/components/TaskContributors";

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "할 일",
  IN_PROGRESS: "진행 중",
  DONE: "완료",
};

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; taskId: string }>;
}) {
  const { projectId, taskId } = use(params);
  const router = useRouter();

  const [task, setTask] = useState<TaskDTO | null>(null);
  const [evidence, setEvidence] = useState<EvidenceDTO[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [titleDraft, setTitleDraft] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [contributorDrafts, setContributorDrafts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, projectRes] = await Promise.all([
        getTask(projectId, taskId),
        getProject(projectId),
      ]);
      setTask(res.task);
      setEvidence(res.evidence);
      setMembers(res.members);
      setTitleDraft(res.task.title);
      setContributorDrafts(
        Object.fromEntries(
          res.task.contributors.map((contributor) => [
            contributor.memberId,
            String(contributor.share),
          ])
        )
      );
      setIsCompleted(projectRes.project.status === "COMPLETED");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Task를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [projectId, taskId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load();
  }, [load]);

  async function saveUpdate(updates: Partial<{
    title: string;
    status: TaskStatus;
    assigneeId: string | null;
    contributors: { memberId: string; share: number }[];
  }>) {
    setSaving(true);
    setError(null);
    try {
      const res = await updateTask(projectId, taskId, updates);
      setTask(res.task);
      setTitleDraft(res.task.title);
      setContributorDrafts(
        Object.fromEntries(
          res.task.contributors.map((contributor) => [
            contributor.memberId,
            String(contributor.share),
          ])
        )
      );
      setEditingTitle(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("이 Task를 삭제할까요?")) return;
    setSaving(true);
    setError(null);
    try {
      await deleteTask(projectId, taskId);
      router.push(`/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "삭제에 실패했습니다.");
      setSaving(false);
    }
  }

  function toggleContributor(memberId: string) {
    setContributorDrafts((current) => {
      const selected = Object.keys(current).filter((id) => id !== memberId);
      if (!(memberId in current)) selected.push(memberId);
      return distributeEqually(selected);
    });
  }

  function applyEqualDistribution() {
    setContributorDrafts((current) => distributeEqually(Object.keys(current)));
  }

  async function saveContributors() {
    const contributors = Object.entries(contributorDrafts).map(([memberId, share]) => ({
      memberId,
      share: Number(share),
    }));
    const valid = contributors.every(
      (contributor) =>
        Number.isInteger(contributor.share) &&
        contributor.share >= 1 &&
        contributor.share <= 100
    );
    const total = contributors.reduce((sum, contributor) => sum + contributor.share, 0);
    if (!valid || (contributors.length > 0 && total !== 100)) {
      setError("참여자 비율은 1~100 정수이며 합계가 100이어야 합니다.");
      return;
    }
    await saveUpdate({ contributors });
  }

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-6 py-16">
        <Spinner label="불러오는 중..." />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 px-6 py-16">
        <p className="text-sm text-rose-600">{error ?? "Task를 찾을 수 없습니다."}</p>
        <button type="button" onClick={load} className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold">다시 시도</button>
        <button onClick={() => router.push(`/projects/${projectId}`)} className="text-sm text-slate-500 underline">
          Dashboard로
        </button>
      </div>
    );
  }

  return (
    <div className="page-container max-w-5xl">
      <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">Task Detail</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">업무 상세</h1><p className="mt-1 text-sm text-slate-500">Task 정보와 AI 평가, 분석 근거를 확인하고 수정하세요.</p></div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {isCompleted && <p className="mb-5 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">종료된 프로젝트의 Task입니다. 업무 정보와 분석 근거는 읽기 전용입니다.</p>}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
      <div className="glass-card rounded-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          {editingTitle && !isCompleted ? (
            <div className="flex flex-1 gap-2">
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                className="glass-input min-w-0 flex-1 rounded-xl px-3 py-2 text-lg font-semibold"
                autoFocus
              />
              <button
                onClick={() => titleDraft.trim() && saveUpdate({ title: titleDraft.trim() })}
                disabled={saving || !titleDraft.trim()}
                className="btn-primary rounded-xl px-3 py-2 text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={() => {
                  setEditingTitle(false);
                  setTitleDraft(task.title);
                }}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              onClick={() => !isCompleted && setEditingTitle(true)}
              disabled={isCompleted}
              className="text-left text-lg font-semibold text-slate-900 enabled:hover:underline"
              title={isCompleted ? undefined : "클릭하여 이름 수정"}
            >
              {task.title}
            </button>
          )}
          <StatusBadge status={task.status} />
        </div>

        <div className="mt-5 max-w-xs">
          <div>
            <label className="text-xs font-medium text-slate-500">상태</label>
            <select
              value={task.status}
              onChange={(e) => saveUpdate({ status: e.target.value as TaskStatus })}
              disabled={saving || isCompleted}
              className="glass-input mt-1 w-full rounded-xl px-3 py-2.5 text-sm"
            >
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section className="mt-6 border-t border-white/70 pt-5">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">참여자</p><p className="mt-1 text-xs text-slate-500">Task 내부 업무 비율이며 전체 프로젝트 기여도가 아닙니다.</p></div>
            <span className={`text-xs font-bold ${Object.values(contributorDrafts).reduce((sum, share) => sum + Number(share || 0), 0) === 100 || Object.keys(contributorDrafts).length === 0 ? "text-emerald-600" : "text-rose-600"}`}>합계 {Object.values(contributorDrafts).reduce((sum, share) => sum + Number(share || 0), 0)}%</span>
          </div>
          <div className="mt-4"><TaskContributors contributors={task.contributors} /></div>

          {!isCompleted && (
            <div className="mt-5 rounded-xl border border-white/70 bg-white/45 p-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {members.map((member) => {
                  const selected = member.id in contributorDrafts;
                  return <label key={member.id} className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${selected ? "border-indigo-200 bg-indigo-50/50" : "border-slate-200/70 bg-white/45"}`}><input type="checkbox" checked={selected} onChange={() => toggleContributor(member.id)} disabled={saving} className="accent-indigo-600" /><span className="min-w-0 flex-1 truncate text-sm text-slate-700">{member.avatarEmoji} {member.name}</span>{selected && <input type="number" min={1} max={100} step={1} value={contributorDrafts[member.id]} onChange={(event) => setContributorDrafts((current) => ({ ...current, [member.id]: event.target.value }))} onClick={(event) => event.stopPropagation()} disabled={saving} aria-label={`${member.name} 참여 비율`} className="glass-input w-16 rounded-lg px-2 py-1 text-right text-sm" />}{selected && <span className="text-xs text-slate-400">%</span>}</label>;
                })}
              </div>
              <div className="mt-3 flex flex-wrap justify-end gap-2"><button type="button" onClick={applyEqualDistribution} disabled={saving || Object.keys(contributorDrafts).length === 0} className="btn-secondary rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50">균등 분배</button><button type="button" onClick={saveContributors} disabled={saving} className="btn-primary rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50">{saving ? "저장 중..." : "참여자 저장"}</button></div>
            </div>
          )}
        </section>

        <div className="mt-6"><p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">AI 업무 평가</p><div className="grid grid-cols-3 gap-3 text-center">
          <ScoreBox label="중요도" value={task.importance} />
          <ScoreBox label="난이도" value={task.difficulty} />
          <ScoreBox label="작업량" value={task.workload} />
        </div></div>

        {task.lastReason && (
          <p className="mt-4 rounded-xl border border-indigo-100/60 bg-indigo-50/35 px-3 py-3 text-xs leading-5 text-slate-500">
            AI 판단 근거: {task.lastReason}
          </p>
        )}

        {!isCompleted && <button
          onClick={handleDelete}
          disabled={saving}
          className="mt-5 text-xs font-medium text-rose-500 hover:text-rose-700 disabled:opacity-50"
        >
          Task 삭제
        </button>}
      </div>

      <div className="glass-card rounded-2xl p-5 sm:p-6">
        <div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-500">Evidence</p><h2 className="mt-1 text-base font-bold text-slate-800">분석 근거 <span className="text-indigo-500">{evidence.length}</span></h2></div>
        {evidence.length === 0 ? (
          <p className="text-sm text-slate-500">아직 근거가 없습니다.</p>
        ) : (
          <ul className="relative flex flex-col gap-3 before:absolute before:bottom-4 before:left-[7px] before:top-4 before:w-px before:bg-indigo-200">
            {evidence.map((ev) => (
              <li key={ev.id} className="relative ml-5 rounded-xl border border-white/70 bg-white/50 px-3 py-3 text-sm text-slate-700 before:absolute before:-left-[21px] before:top-4 before:h-3 before:w-3 before:rounded-full before:border-2 before:border-white before:bg-indigo-500 before:shadow-sm">
                <span className="font-medium text-slate-800">{ev.speaker}</span>
                {ev.timestamp && <span className="ml-1.5 text-xs text-slate-400">{ev.timestamp}</span>}
                <p className="mt-0.5 text-slate-600">{ev.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div></div>
    </div>
  );
}

function distributeEqually(memberIds: string[]) {
  if (memberIds.length === 0) return {};
  const base = Math.floor(100 / memberIds.length);
  const remainder = 100 - base * memberIds.length;
  return Object.fromEntries(
    memberIds.map((memberId, index) => [
      memberId,
      String(base + (index < remainder ? 1 : 0)),
    ])
  );
}

function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/48 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-indigo-600">{value}<span className="text-xs font-medium text-slate-400">/5</span></p>
    </div>
  );
}
