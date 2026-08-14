"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  deleteTask,
  getTask,
  updateTask,
  type Member,
} from "@/lib/apiClient";
import type { EvidenceDTO, TaskDTO, TaskStatus } from "@/lib/types";
import { TASK_STATUSES } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import Spinner from "@/components/Spinner";

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

  const [titleDraft, setTitleDraft] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await getTask(projectId, taskId);
      setTask(res.task);
      setEvidence(res.evidence);
      setMembers(res.members);
      setTitleDraft(res.task.title);
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

  async function saveUpdate(updates: Partial<{ title: string; status: TaskStatus; assigneeId: string | null }>) {
    setSaving(true);
    setError(null);
    try {
      const res = await updateTask(projectId, taskId, updates);
      setTask(res.task);
      setTitleDraft(res.task.title);
      setEditingTitle(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
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

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
      <div className="glass-card rounded-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          {editingTitle ? (
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
                저장
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
              onClick={() => setEditingTitle(true)}
              className="text-left text-lg font-semibold text-slate-900 hover:underline"
              title="클릭하여 이름 수정"
            >
              {task.title}
            </button>
          )}
          <StatusBadge status={task.status} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500">담당자</label>
            <select
              value={task.assigneeId ?? ""}
              onChange={(e) => saveUpdate({ assigneeId: e.target.value || null })}
              disabled={saving}
              className="glass-input mt-1 w-full rounded-xl px-3 py-2.5 text-sm"
            >
              <option value="">미배정</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">상태</label>
            <select
              value={task.status}
              onChange={(e) => saveUpdate({ status: e.target.value as TaskStatus })}
              disabled={saving}
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

        <button
          onClick={handleDelete}
          disabled={saving}
          className="mt-5 text-xs font-medium text-rose-500 hover:text-rose-700 disabled:opacity-50"
        >
          Task 삭제
        </button>
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

function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/48 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-indigo-600">{value}<span className="text-xs font-medium text-slate-400">/5</span></p>
    </div>
  );
}
