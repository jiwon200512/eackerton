"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, createProject, listProjects, listTasks, type Project } from "@/lib/apiClient";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [taskStats, setTaskStats] = useState<Record<string, { total: number; done: number }>>({});
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listProjects()
      .then(async (res) => {
        setProjects(res.projects);
        const entries = await Promise.all(res.projects.map(async (project) => {
          try {
            const { tasks } = await listTasks(project.id);
            return [project.id, { total: tasks.length, done: tasks.filter((task) => task.status === "DONE").length }] as const;
          } catch { return [project.id, { total: 0, done: 0 }] as const; }
        }));
        setTaskStats(Object.fromEntries(entries));
      })
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
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-indigo-200/60 bg-white/55 px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm backdrop-blur-xl">✦ AI Project Assistant</span>
        <h1 className="mt-5 text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl">팀의 노력을, <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">명확한 성과로.</span></h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">대화와 회의 기록을 AI가 분석해 업무 현황과 팀원별 기여도를 한곳에서 정리합니다.</p>
      </section>

      <section className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
        {[['✦','AI 업무 분석','기록에서 Task와 변경사항을 추출해요.'],['▦','한눈에 보는 현황','진행 상태와 최근 변화를 모아봐요.'],['◎','투명한 기여도','실제 업무 근거로 기여도를 계산해요.']].map(([icon,title,desc]) => <div key={title} className="glass-card rounded-2xl p-5 text-left"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 font-bold text-indigo-600">{icon}</span><h2 className="mt-4 text-sm font-bold text-slate-800">{title}</h2><p className="mt-1.5 text-xs leading-5 text-slate-500">{desc}</p></div>)}
      </section>

      <form onSubmit={handleCreate} className="glass-card-strong mx-auto mt-10 max-w-4xl rounded-2xl p-5 sm:p-6">
        <label className="block text-sm font-bold text-slate-800" htmlFor="project-name">새 프로젝트 만들기</label>
        <p className="mt-1 text-xs text-slate-500">프로젝트 이름만 입력하면 바로 시작할 수 있어요.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 캡스톤 디자인 프로젝트"
            className="glass-input min-w-0 flex-1 rounded-xl px-4 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {creating ? "생성 중..." : "만들기"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      </form>

      <section className="mx-auto mt-12 max-w-4xl">
        <div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">Workspace</p><h2 className="mt-1 text-xl font-bold text-slate-900">내 프로젝트</h2></div>{projects && <span className="text-xs text-slate-400">총 {projects.length}개</span>}</div>
        {projects === null ? (
          <Spinner label="불러오는 중..." />
        ) : projects.length === 0 ? (
          <EmptyState title="첫 프로젝트를 만들어보세요." description="위에서 프로젝트 이름을 입력하고 시작할 수 있습니다." />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => router.push(`/projects/${p.id}`)}
                  className="glass-card group w-full rounded-2xl p-5 text-left hover:-translate-y-0.5 hover:border-indigo-200"
                >
                  <div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 font-bold text-white">{p.name.charAt(0).toUpperCase()}</span><span className="text-lg text-slate-300 group-hover:translate-x-1 group-hover:text-indigo-500">→</span></div>
                  <p className="mt-4 truncate text-sm font-bold text-slate-800">{p.name}</p>
                  <p className="mt-1 text-xs text-slate-400">최근 업데이트 {new Date(p.updatedAt).toLocaleDateString("ko-KR")}</p>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500"><span>완료 {taskStats[p.id]?.done ?? 0} / {taskStats[p.id]?.total ?? 0}</span><span>{taskStats[p.id]?.total ? Math.round((taskStats[p.id].done / taskStats[p.id].total) * 100) : 0}%</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/70"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${taskStats[p.id]?.total ? (taskStats[p.id].done / taskStats[p.id].total) * 100 : 0}%` }} /></div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
