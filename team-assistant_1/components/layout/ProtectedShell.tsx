"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BrandMark from "@/components/BrandMark";
import Avatar from "@/components/Avatar";
import { getProject } from "@/lib/apiClient";

type UserInfo = { name: string; username: string; avatarEmoji: string };
const NAV_ITEMS = [
  { segment: "", label: "대시보드" },
  { segment: "/records/new", label: "기록 추가" },
  { segment: "/members", label: "팀원 관리" },
  { segment: "/contribution", label: "기여도 리포트" },
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
        { segment: "/result", label: "최종 결과" },
        NAV_ITEMS[2],
        NAV_ITEMS[3],
      ]
    : NAV_ITEMS;
  const nav = visibleItems.map((item) => ({ ...item, href: `/projects/${projectId}${item.segment}` }));
  return (
    <div className="min-h-screen lg:flex">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
        <div className="px-2"><BrandMark /></div>
        <div className="mx-2 mt-9 border-b border-slate-200 pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">현재 프로젝트</p>
          <p className="mt-1.5 truncate text-sm font-semibold text-slate-900">{projectName}</p>
          {projectStatus === "COMPLETED" && <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">종료됨</span>}
        </div>
        <nav className="mt-5 flex flex-col gap-1.5" aria-label="프로젝트 메뉴">
          {nav.map((item) => {
            const active = item.segment === "" ? pathname === item.href : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`rounded-lg px-3 py-2.5 text-sm font-medium ${active ? "bg-violet-50 text-[#6541f3]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>{item.label}</Link>;
          })}
        </nav>
        <div className="mt-auto border-t border-slate-200 pt-4">
          <Link href="/" className="mb-3 block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900">← 모든 프로젝트</Link>
          <UserPanel user={user} compact />
        </div>
      </aside>
      <div className="min-w-0 flex-1 lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between gap-3"><BrandMark /><span className="max-w-32 truncate text-xs font-semibold text-slate-600">{projectName}</span><Link href="/profile" aria-label="프로필 설정"><Avatar emoji={user.avatarEmoji} name={user.name} size="sm" /></Link></div>
          <nav className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label="프로젝트 모바일 메뉴">
            {nav.map((item) => {
              const active = item.segment === "" ? pathname === item.href : pathname.startsWith(item.href);
              return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${active ? "bg-violet-50 text-[#6541f3]" : "text-slate-600 hover:bg-slate-50"}`}>{item.label}</Link>;
            })}
          </nav>
        </header>
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}

function HomeHeader({ user }: { user: UserInfo }) {
  return <header className="sticky top-0 z-20 border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8"><BrandMark /><UserPanel user={user} /></div></header>;
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
    <div className={`flex items-center ${compact ? "px-2 py-1" : "gap-3"}`}>
      <Link href="/profile" className="flex min-w-0 items-center gap-2" title="프로필 설정">
        <Avatar emoji={user.avatarEmoji} name={user.name} size="sm" />
        <div className={`${compact ? "min-w-0 flex-1" : "hidden sm:block"}`}>
          <p className="truncate text-xs font-semibold text-slate-800">{user.name}</p>
          <p className="truncate text-[11px] text-slate-400">프로필 설정</p>
        </div>
      </Link>
      <button type="button" onClick={logout} disabled={loggingOut} className={`${compact ? "ml-auto px-2 hover:text-slate-900" : "btn-secondary rounded-lg px-3"} py-1.5 text-xs font-semibold text-slate-500 disabled:opacity-50`}>
        {loggingOut ? "처리 중" : "로그아웃"}
      </button>
    </div>
  );
}
