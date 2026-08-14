"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  addMember,
  deleteMember,
  getInviteCode,
  getProject,
  regenerateInviteCode,
  transferProjectOwner,
  type Member,
  type Project,
} from "@/lib/apiClient";
import Spinner from "@/components/Spinner";

export default function MembersPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [role, setRole] = useState<"OWNER" | "MEMBER">("MEMBER");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteBusy, setInviteBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function load() {
    try {
      const res = await getProject(projectId);
      setProject(res.project);
      setMembers(res.members);
      setRole(res.currentUserRole);
      if (res.currentUserRole === "OWNER") {
        const { code } = await getInviteCode(projectId);
        setInviteCode(code);
      } else {
        setInviteCode(null);
      }
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

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
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

  async function handleDelete(member: Member) {
    const warning = member.claimed
      ? `${member.name}님을 삭제하면 프로젝트 접근 권한도 함께 제거되며 담당 Task는 미배정 처리됩니다. 계속하시겠습니까?`
      : `${member.name} 팀원을 삭제하시겠습니까?`;
    if (!window.confirm(warning)) return;
    setBusy(true);
    setError(null);
    try {
      await deleteMember(projectId, member.id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "팀원 삭제에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function handleTransfer(member: Member) {
    if (!window.confirm(`${member.name}님에게 팀장 권한을 양도하시겠습니까?\n양도 후 팀원 관리 및 초대 권한은 새 팀장에게 넘어갑니다.`)) return;
    setBusy(true);
    setError(null);
    try {
      await transferProjectOwner(projectId, member.id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "팀장 양도에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function regenerateCode() {
    setInviteBusy(true);
    setCopied(false);
    try {
      const { code } = await regenerateInviteCode(projectId);
      setInviteCode(code);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "초대 코드를 재발급하지 못했습니다.");
    } finally {
      setInviteBusy(false);
    }
  }

  async function copyCode() {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Code remains visible for manual copying.
    }
  }

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Spinner label="불러오는 중..." /></div>;
  const isOwner = role === "OWNER";

  return (
    <div className="page-container max-w-4xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">Team Members</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{project?.name} 팀원 관리</h1>
        <p className="mt-1 text-sm text-slate-500">팀장이 등록한 실명과 회원가입 실명이 일치하면 초대 참가 시 자동으로 연결됩니다.</p>
      </div>

      {!isOwner && <p className="mt-6 rounded-xl border border-indigo-100 bg-white/55 px-4 py-3 text-sm text-slate-600">일반 팀원은 팀원 현황을 조회할 수 있습니다. 추가·삭제·초대 관리는 팀장만 가능합니다.</p>}
      {error && <p role="alert" className="mt-4 text-sm text-rose-600">{error}</p>}

      {isOwner && <>
        <section className="glass-card mt-7 rounded-2xl p-5 sm:p-6">
          <p className="text-sm font-bold text-slate-800">초대 코드</p>
          <p className="mt-1 text-xs text-slate-500">팀원이 회원가입 실명으로 자동 연결될 수 있도록 이 코드를 공유하세요.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="min-w-0 flex-1 rounded-xl border border-indigo-200/60 bg-white/70 px-4 py-3 text-center font-mono text-lg font-bold tracking-[0.3em] text-indigo-700">{inviteCode ?? "……"}</span>
            <div className="flex gap-2">
              <button type="button" onClick={copyCode} disabled={!inviteCode} className="rounded-xl border border-indigo-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-indigo-600 disabled:opacity-50">{copied ? "복사됨!" : "복사"}</button>
              <button type="button" onClick={regenerateCode} disabled={inviteBusy} className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50">{inviteBusy ? "재발급 중..." : "재발급"}</button>
            </div>
          </div>
        </section>

        <form onSubmit={handleAdd} className="glass-card mt-4 rounded-2xl p-5 sm:p-6">
          <label className="block text-sm font-medium text-slate-700" htmlFor="member-name">팀원 실명 추가</label>
          <div className="mt-2 flex gap-2"><input id="member-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 박민수" className="glass-input min-w-0 flex-1 rounded-xl px-4 py-2.5 text-sm" /><button type="submit" disabled={busy || !name.trim()} className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50">추가</button></div>
        </form>
      </>}

      <section className="glass-card mt-6 overflow-hidden rounded-2xl">
        <ul className="divide-y divide-white/70">
          {members.map((member) => <li key={member.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 text-sm font-bold text-white">{member.name.charAt(0)}</span><div><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold text-slate-800">{member.name}</span>{member.isLeader && <Badge tone="indigo">팀장</Badge>}<Badge tone={member.claimed ? "green" : "slate"}>{member.claimed ? "참여 완료" : "초대 대기"}</Badge></div>{member.claimedByMe && <p className="mt-1 text-[11px] text-indigo-500">내 계정</p>}</div></div>
            {isOwner && !member.isLeader && <div className="flex items-center gap-3">{member.claimed && <button type="button" onClick={() => handleTransfer(member)} disabled={busy} className="text-xs font-semibold text-indigo-600 disabled:opacity-50">팀장 양도</button>}<button type="button" onClick={() => handleDelete(member)} disabled={busy} className="text-xs font-medium text-rose-500 disabled:opacity-50">삭제</button></div>}
          </li>)}
        </ul>
      </section>

      <button onClick={() => router.push(`/projects/${projectId}`)} className="btn-primary mt-6 ml-auto block rounded-xl px-5 py-2.5 text-sm font-semibold">Dashboard로 이동 →</button>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "indigo" | "green" | "slate" }) {
  const styles = { indigo: "bg-indigo-50 text-indigo-700", green: "bg-emerald-50 text-emerald-700", slate: "bg-slate-100 text-slate-500" };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles[tone]}`}>{children}</span>;
}
