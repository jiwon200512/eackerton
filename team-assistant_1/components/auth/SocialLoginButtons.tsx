"use client";

import { useState } from "react";

const PROVIDERS = ["Google", "카카오", "Apple", "네이버"] as const;

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
            key={provider}
            type="button"
            onClick={() => setMessage(`${provider} 로그인은 준비 중인 기능입니다.`)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {provider}로 계속하기
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
