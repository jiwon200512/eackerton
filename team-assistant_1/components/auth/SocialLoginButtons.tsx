"use client";

import { useState } from "react";

const PROVIDERS = [
  { name: "Google", mark: "G", color: "text-blue-600" },
  { name: "카카오", mark: "K", color: "text-amber-700" },
  { name: "Apple", mark: "A", color: "text-slate-900" },
  { name: "네이버", mark: "N", color: "text-emerald-600" },
] as const;

export default function SocialLoginButtons() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center gap-3 py-1" aria-hidden="true">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">또는</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="mt-4 grid gap-2">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.name}
            type="button"
            onClick={() => setMessage(`${provider.name} 로그인은 준비 중인 기능입니다.`)}
            className="btn-secondary relative w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            <span className={`absolute left-4 font-bold ${provider.color}`}>{provider.mark}</span>{provider.name}로 계속하기
          </button>
        ))}
      </div>

      {message && (
        <p role="status" className="mt-3 text-center text-sm text-slate-500">
          {message}
        </p>
      )}
    </div>
  );
}
