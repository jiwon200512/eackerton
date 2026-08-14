"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard, Field, inputClassName } from "./LoginForm";
import SocialLoginButtons from "./SocialLoginButtons";

const DOMAIN_OPTIONS = [
  "gmail.com",
  "naver.com",
  "daum.net",
  "hanmail.net",
  "kakao.com",
  "outlook.com",
] as const;
const CUSTOM_DOMAIN = "custom";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailLocal, setEmailLocal] = useState("");
  const [domainOption, setDomainOption] = useState<string>(DOMAIN_OPTIONS[0]);
  const [customDomain, setCustomDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const domain = domainOption === CUSTOM_DOMAIN ? customDomain.trim() : domainOption;
    if (!emailLocal.trim() || !domain) {
      setError("이메일 주소를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          password,
          passwordConfirm,
          email: `${emailLocal.trim()}@${domain}`,
        }),
      });
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(body?.error ?? "회원가입에 실패했습니다.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("회원가입 요청을 처리하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Effortly 시작하기"
      description="계정을 만들고 팀의 노력을 더 선명하게 관리하세요."
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field label="이름(실명)" htmlFor="name">
          <input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
            className={inputClassName}
          />
          <span className="mt-1 block text-xs font-normal text-slate-400">
            팀 프로젝트 초대 시 등록된 팀원과 자동으로 연결하는 데 사용됩니다.
          </span>
        </Field>

        <Field label="아이디" htmlFor="username">
          <input
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            minLength={3}
            maxLength={30}
            required
            className={inputClassName}
          />
          <span className="mt-1 block text-xs font-normal text-slate-400">
            이메일이 아닌 로그인용 아이디입니다.
          </span>
        </Field>

        <Field label="비밀번호" htmlFor="password">
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            className={inputClassName}
          />
        </Field>

        <Field label="비밀번호 확인" htmlFor="password-confirm">
          <input
            id="password-confirm"
            name="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            className={inputClassName}
          />
        </Field>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700">이메일</legend>
          <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1.15fr)] items-center gap-2">
            <input
              aria-label="이메일 아이디"
              value={emailLocal}
              onChange={(event) => setEmailLocal(event.target.value)}
              autoComplete="email"
              required
              className="glass-input min-w-0 rounded-xl px-3 py-2.5 text-sm"
            />
            <span className="text-sm text-slate-500">@</span>
            <select
              aria-label="이메일 도메인"
              value={domainOption}
              onChange={(event) => setDomainOption(event.target.value)}
              className="glass-input min-w-0 rounded-xl px-3 py-2.5 text-sm"
            >
              {DOMAIN_OPTIONS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
              <option value={CUSTOM_DOMAIN}>직접 입력</option>
            </select>
          </div>
          {domainOption === CUSTOM_DOMAIN && (
            <input
              aria-label="직접 입력 이메일 도메인"
              value={customDomain}
              onChange={(event) => setCustomDomain(event.target.value)}
              placeholder="예: company.co.kr"
              required
              className={inputClassName}
            />
          )}
        </fieldset>

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
          {submitting ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <div className="mt-6">
        <SocialLoginButtons />
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        이미 계정이 있나요?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
          로그인
        </Link>
      </p>
    </AuthCard>
  );
}
