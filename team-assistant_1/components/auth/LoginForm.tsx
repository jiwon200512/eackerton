"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(body?.error ?? "로그인에 실패했습니다.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("로그인 요청을 처리하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="로그인"
      description="팀 프로젝트 현황을 이어서 확인하세요."
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field label="아이디" htmlFor="username">
          <input
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
            className={inputClassName}
          />
        </Field>

        <Field label="비밀번호" htmlFor="password">
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className={inputClassName}
          />
        </Field>

        {error && (
          <p role="alert" className="text-sm text-rose-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-1 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {submitting ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="mt-6">
        <SocialLoginButtons />
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        계정이 없나요?{" "}
        <Link href="/signup" className="font-semibold text-[#6541f3] hover:text-[#5632d8]">
          회원가입
        </Link>
      </p>
    </AuthCard>
  );
}

export const inputClassName =
  "glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm";

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  );
}

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-5 py-10 sm:py-14">
      <section className="glass-card-strong w-full max-w-[460px] rounded-2xl p-6 sm:p-9">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-6 flex w-fit items-center gap-2.5"><Image src="/logo.png" alt="" width={42} height={42} className="h-10 w-10 rounded-xl" priority /><span className="text-xl font-bold tracking-tight text-slate-900">Effortly</span></div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
