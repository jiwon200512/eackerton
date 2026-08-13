"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, createProject, listProjects, type Project } from "@/lib/apiClient";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listProjects()
      .then((res) => setProjects(res.projects))
      .catch((err) => setError(err instanceof ApiError ? err.message : "프로젝트 목록을 불러오지 못했습니다."));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const { project } = await createProject(name.trim());
      router.push(`/projects/${project.id}/members`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "프로젝트 생성에 실패했습니다.");
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Team Project Assistant</h1>
        <p className="mt-1 text-sm text-slate-500">
          카카오톡 대화와 회의 기록을 쌓아가며 하나의 프로젝트 상태를 계속 업데이트하는 AI 팀 어시스턴트입니다.
        </p>
      </div>

      <form onSubmit={handleCreate} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-medium text-slate-700" htmlFor="project-name">
          새 프로젝트 만들기
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 캡스톤 디자인 프로젝트"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {creating ? "생성 중..." : "만들기"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      </form>

      <div>
        <h2 className="mb-3 text-sm font-medium text-slate-500">내 프로젝트</h2>
        {projects === null ? (
          <Spinner label="불러오는 중..." />
        ) : projects.length === 0 ? (
          <EmptyState title="첫 프로젝트를 만들어보세요." description="위에서 프로젝트 이름을 입력하고 시작할 수 있습니다." />
        ) : (
          <ul className="flex flex-col gap-2">
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => router.push(`/projects/${p.id}`)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/50"
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
