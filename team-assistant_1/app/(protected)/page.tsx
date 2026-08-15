"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, createProject, joinProjectByCode, listProjects, listTasks, type Project } from "@/lib/apiClient";
import EmptyState from "@/components/EmptyState";
import Spinner from "@/components/Spinner";

type TaskStats = Record<string, { total: number; done: number }>;

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [taskStats, setTaskStats] = useState<TaskStats>({});
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectListError, setProjectListError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setProjects(null);
    setProjectListError(null);
    try {
      const { projects: loadedProjects } = await listProjects();
      setProjects(loadedProjects);
      const entries = await Promise.all(loadedProjects.map(async (project) => {
        try {
          const { tasks } = await listTasks(project.id);
          return [project.id, { total: tasks.length, done: tasks.filter((task) => task.status === "DONE").length }] as const;
        } catch {
          return [project.id, { total: 0, done: 0 }] as const;
        }
      }));
      setTaskStats(Object.fromEntries(entries));
    } catch (caught) {
      setProjects([]);
      setProjectListError(caught instanceof ApiError ? caught.message : "프로젝트를 불러오지 못했습니다.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadProjects();
  }, [loadProjects]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const { project } = await createProject(name.trim());
      router.push(`/projects/${project.id}/members`);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "프로젝트 생성에 실패했습니다.");
    } finally {
      setCreating(false);
    }
  }

  async function handleJoin(event: React.FormEvent) {
    event.preventDefault();
    if (!inviteCode.trim()) return;
    setJoining(true);
    setJoinError(null);
    try {
      const { projectId } = await joinProjectByCode(inviteCode.trim());
      router.push(`/projects/${projectId}`);
    } catch (caught) {
      setJoinError(caught instanceof ApiError ? caught.message : "참가에 실패했습니다.");
    } finally {
      setJoining(false);
    }
  }

  const activeProjects = projects?.filter((project) => project.status === "ACTIVE") ?? [];
  const completedProjects = projects?.filter((project) => project.status === "COMPLETED") ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <section className="max-w-2xl">
        <p className="page-eyebrow">EFFORTLY</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">팀의 진행 상황을 한눈에 확인하세요.</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">대화와 회의 기록을 바탕으로 업무 현황과 팀원별 기여도를 정리합니다.</p>
      </section>

      <section className="mt-10 grid overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-2">
        <form onSubmit={handleCreate} className="p-5 sm:p-7 lg:border-r lg:border-slate-200">
          <h2 className="section-title">새 프로젝트</h2>
          <p className="mt-1.5 text-sm text-slate-500">프로젝트 이름을 입력하고 팀원 등록부터 시작하세요.</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input id="project-name" aria-label="프로젝트 이름" value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 캠퍼스 디자인 프로젝트" className="glass-input min-w-0 flex-1 rounded-xl px-4 py-3 text-sm" />
            <button type="submit" disabled={creating || !name.trim()} className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-50">{creating ? "생성 중..." : "만들기"}</button>
          </div>
          {error && <p role="alert" className="mt-2 text-sm text-rose-600">{error}</p>}
        </form>

        <form onSubmit={handleJoin} className="border-t border-slate-200 p-5 sm:p-7 lg:border-t-0">
          <h2 className="section-title">초대 코드로 참가</h2>
          <p className="mt-1.5 text-sm text-slate-500">팀장이 공유한 코드를 입력하세요.</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input id="invite-code" aria-label="초대 코드" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} placeholder="예: AB12CD34" className="glass-input min-w-0 flex-1 rounded-xl px-4 py-3 text-sm uppercase" />
            <button type="submit" disabled={joining || !inviteCode.trim()} className="btn-secondary rounded-xl px-5 py-3 text-sm font-semibold text-[#6541f3] disabled:opacity-50">{joining ? "참가 중..." : "참가하기"}</button>
          </div>
          {joinError && <p role="alert" className="mt-2 text-sm text-rose-600">{joinError}</p>}
        </form>
      </section>

      <section className="mt-12">
        <SectionTitle title="진행 중인 프로젝트" count={projects ? activeProjects.length : null} />
        {projects === null ? <Spinner label="프로젝트를 불러오는 중..." /> : projectListError ? <LoadError message={projectListError} onRetry={loadProjects} /> : projects.length === 0 ? <EmptyState title="첫 프로젝트를 만들어보세요." description="위에서 프로젝트 이름을 입력하고 시작할 수 있습니다." /> : activeProjects.length === 0 ? <EmptyState title="진행 중인 프로젝트가 없습니다." description="새 프로젝트를 만들거나 종료된 프로젝트를 다시 시작할 수 있습니다." /> : <ProjectList projects={activeProjects} taskStats={taskStats} onOpen={(project) => router.push(`/projects/${project.id}`)} />}
      </section>

      {projects !== null && !projectListError && (
        <section className="mt-12">
          <SectionTitle title="종료된 프로젝트" count={completedProjects.length} muted />
          {completedProjects.length === 0 ? <EmptyState title="아직 종료된 프로젝트가 없습니다." description="프로젝트를 종료하면 최종 결과를 이곳에서 확인할 수 있습니다." /> : <ProjectList projects={completedProjects} taskStats={taskStats} onOpen={(project) => router.push(`/projects/${project.id}/result`)} completed />}
        </section>
      )}
    </main>
  );
}

function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="rounded-xl border border-rose-100 bg-rose-50 p-6 text-center"><p className="text-sm text-rose-600">{message}</p><button type="button" onClick={onRetry} className="btn-secondary mt-3 rounded-xl px-4 py-2 text-sm font-semibold">다시 시도</button></div>;
}

function SectionTitle({ title, count, muted = false }: { title: string; count: number | null; muted?: boolean }) {
  return <div className="mb-4 flex items-end justify-between gap-4"><h2 className={`text-xl font-bold tracking-tight ${muted ? "text-slate-600" : "text-slate-900"}`}>{title}</h2>{count !== null && <span className="text-xs text-slate-400">총 {count}개</span>}</div>;
}

function ProjectList({ projects, taskStats, onOpen, completed = false }: { projects: Project[]; taskStats: TaskStats; onOpen: (project: Project) => void; completed?: boolean }) {
  return (
    <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-200">
      {projects.map((project) => {
        const stats = taskStats[project.id] ?? { total: 0, done: 0 };
        const percentage = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;
        return (
          <li key={project.id}>
            <button type="button" onClick={() => onOpen(project)} className="group w-full p-5 text-left hover:bg-slate-50 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5"><h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-[#6541f3]">{project.name}</h3>{completed && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">종료됨</span>}</div>
                  <p className="mt-1 text-xs text-slate-400">{completed && project.completedAt ? `종료 ${new Date(project.completedAt).toLocaleDateString("ko-KR")}` : `최근 업데이트 ${new Date(project.updatedAt).toLocaleDateString("ko-KR")}`}</p>
                </div>
                <span className="shrink-0 text-sm text-slate-400 group-hover:text-[#6541f3]">열기 →</span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${completed ? "bg-slate-400" : "bg-[#6541f3]"}`} style={{ width: `${percentage}%` }} /></div>
                <span className="shrink-0 text-xs text-slate-500">완료 {stats.done}/{stats.total} · {percentage}%</span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
