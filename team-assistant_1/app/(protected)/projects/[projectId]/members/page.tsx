"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  addMember,
  deleteMember,
  getProject,
  type Member,
  type Project,
} from "@/lib/apiClient";
import Spinner from "@/components/Spinner";

export default function MembersPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await getProject(projectId);
      setProject(res.project);
      setMembers(res.members);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "프로젝트를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await addMember(projectId, name.trim());
      setName("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "팀원 추가에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(memberId: string) {
    setBusy(true);
    setError(null);
    try {
      await deleteMember(projectId, memberId);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "팀원 삭제에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-6 py-16">
        <Spinner label="불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="page-container max-w-4xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">Team Members</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{project?.name} 팀원 관리</h1>
        <p className="mt-1 text-sm text-slate-500">
          대화 속 화자를 실제 팀원과 연결하기 위해 팀원 이름을 등록해주세요.
        </p>
      </div>

      <form onSubmit={handleAdd} className="glass-card mt-7 rounded-2xl p-5 sm:p-6">
        <label className="block text-sm font-medium text-slate-700" htmlFor="member-name">
          팀원 추가
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="member-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 김지원"
            className="glass-input min-w-0 flex-1 rounded-xl px-4 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={busy || !name.trim()}
            className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            추가
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      </form>

      <div className="glass-card mt-6 overflow-hidden rounded-2xl">
        <ul className="divide-y divide-white/70">
          {members.length === 0 && (
            <li className="px-5 py-6 text-center text-sm text-slate-500">
              아직 등록된 팀원이 없습니다.
            </li>
          )}
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 text-sm font-bold text-white">{m.name.charAt(0)}</span><div><span className="text-sm font-semibold text-slate-800">{m.name}</span><p className="text-[11px] text-slate-400">등록 팀원</p></div></div>
              <button
                onClick={() => handleDelete(m.id)}
                disabled={busy}
                className="text-xs font-medium text-rose-500 hover:text-rose-700 disabled:opacity-50"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => router.push(`/projects/${projectId}`)}
        disabled={members.length === 0}
        className="btn-primary mt-6 ml-auto block rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-40"
      >
        Dashboard로 이동 →
      </button>
    </div>
  );
}
