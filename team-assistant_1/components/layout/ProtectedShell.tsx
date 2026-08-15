"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BrandMark from "@/components/BrandMark";
import Avatar from "@/components/Avatar";
import { getProject } from "@/lib/apiClient";

type UserInfo = { name: string; username: string; avatarEmoji: string };
const NAV_ITEMS = [
  { segment: "", label: "대시보드", icon: "▦" },
  { segment: "/records/new", label: "기록 추가", icon: "＋" },
  { segment: "/members", label: "팀원 관리", icon: "◎" },
  { segment: "/contribution", label: "기여도 리포트", icon: "▥" },
] as const;

export default function ProtectedShell({ user, children }: { user: UserInfo; children: React.ReactNode }) {
  const pathname = usePathname();
  const projectId = useMemo(() => pathname.match(/^\/projects\/([^/]+)/)?.[1] ?? null, [pathname]);
  if (!projectId) return <div className="min-h-screen"><HomeHeader user={user} />{children}</div>;
  return <ProjectShell projectId={projectId} user={user}>{children}</ProjectShell>;
}

function ProjectShell({ projectId, user, children }: { projectId: string; user: UserInfo; children: React.ReactNode }) {
  const pathname = usePathname();
  const [projectName, setProjectName] = useState("프로젝트");
  const [projectStatus, setProjectStatus] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");
  useEffect(() => {
    let active = true;
    getProject(projectId).then(({ project }) => { if (active) { setProjectName(project.name); setProjectStatus(project.status); } }).catch(() => undefined);
    return () => { active = false; };
  }, [projectId]);
  const visibleItems = projectStatus === "COMPLETED"
    ? [
        { segment: "/result", label: "최종 결과", icon: "✓" },
        NAV_ITEMS[2],
        NAV_ITEMS[3],
      ]
    : NAV_ITEMS;
  const nav = visibleItems.map((item) => ({ ...item, href: `/projects/${projectId}${item.segment}` }));
  return (
    <div className="min-h-screen lg:flex">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-white/65 bg-white/48 px-3 py-5 shadow-[10px_0_40px_rgba(67,56,202,0.05)] backdrop-blur-3xl lg:flex">
        <div className="px-2"><BrandMark /></div>
        <div className="mx-2 mt-7 rounded-xl border border-white/75 bg-white/52 px-3 py-3 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-500">Current project</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-800">{projectName}</p>
          {projectStatus === "COMPLETED" && <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">종료됨</span>}
        </div>
        <nav className="mt-5 flex flex-col gap-1" aria-label="프로젝트 메뉴">
          {nav.map((item) => {
            const active = item.segment === "" ? pathname === item.href : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-600 hover:bg-white/60 hover:text-indigo-700"}`}><span className="w-5 text-center text-base" aria-hidden="true">{item.icon}</span>{item.label}</Link>;
          })}
        </nav>
        <div className="mt-auto">
          <Link href="/" className="mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-white/60 hover:text-indigo-700"><span className="w-5 text-center" aria-hidden="true">←</span>모든 프로젝트</Link>
          <UserPanel user={user} compact />
        </div>
      </aside>
      <div className="min-w-0 flex-1 lg:pl-56">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/50 px-4 py-3 backdrop-blur-2xl lg:hidden">
          <div className="flex items-center justify-between gap-3"><BrandMark /><span className="max-w-32 truncate text-xs font-semibold text-slate-600">{projectName}</span><Link href="/profile" aria-label="프로필 설정"><Avatar emoji={user.avatarEmoji} name={user.name} size="sm" /></Link></div>
          <nav className="mt-3 flex gap-1 overflow-x-auto pb-1" aria-label="프로젝트 모바일 메뉴">
            {nav.map((item) => {
              const active = item.segment === "" ? pathname === item.href : pathname.startsWith(item.href);
              return <Link key={item.href} href={item.href} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${active ? "bg-indigo-600 text-white" : "bg-white/55 text-slate-600"}`}>{item.label}</Link>;
            })}
          </nav>
        </header>
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}

function HomeHeader({ user }: { user: UserInfo }) {
  return <header className="sticky top-0 z-20 border-b border-white/60 bg-white/48 backdrop-blur-2xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8"><BrandMark /><UserPanel user={user} /></div></header>;
}

function UserPanel({ user, compact = false }: { user: UserInfo; compact?: boolean }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  async function logout() {
    setLoggingOut(true);
    try { await fetch("/api/auth/logout", { method: "POST" }); }
    finally { router.replace("/login"); router.refresh(); }
  }
  return (
    <div className={`flex items-center ${compact ? "rounded-xl border border-white/70 bg-white/50 p-2" : "gap-3"}`}>
      <Link href="/profile" className="flex min-w-0 items-center gap-2" title="프로필 설정">
        <Avatar emoji={user.avatarEmoji} name={user.name} size="sm" />
        <div className={`${compact ? "min-w-0 flex-1" : "hidden sm:block"}`}>
          <p className="truncate text-xs font-semibold text-slate-800">{user.name}</p>
          <p className="truncate text-[11px] text-slate-400">프로필 설정</p>
        </div>
      </Link>
      <button type="button" onClick={logout} disabled={loggingOut} className={`${compact ? "ml-auto px-2" : "btn-secondary rounded-lg px-3"} py-1.5 text-xs font-semibold text-slate-500 disabled:opacity-50`}>
        {loggingOut ? "처리 중" : "로그아웃"}
      </button>
    </div>
  );
}
