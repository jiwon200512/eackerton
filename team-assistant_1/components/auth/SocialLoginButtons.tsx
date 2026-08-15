"use client";

import Image from "next/image";
import { useState } from "react";

type Provider = "google" | "kakao" | "apple" | "naver";

const PROVIDERS: { id: Provider; name: string }[] = [
  { id: "google", name: "Google" },
  { id: "kakao", name: "카카오" },
  { id: "apple", name: "Apple" },
  { id: "naver", name: "네이버" },
];

export default function SocialLoginButtons() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center gap-3 py-1" aria-hidden="true">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">또는</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="mt-4 grid gap-2.5">
        {PROVIDERS.map((provider) => (
          <SocialAuthButton
            key={provider.id}
            provider={provider.id}
            onClick={() => setMessage(`${provider.name} 로그인은 준비 중인 기능입니다.`)}
          />
        ))}
      </div>

      {message && (
        <p role="status" aria-live="polite" className="mt-3 text-center text-sm text-slate-500">
          {message}
        </p>
      )}
    </div>
  );
}

function SocialAuthButton({ provider, onClick }: { provider: Provider; onClick: () => void }) {
  if (provider === "kakao") {
    return (
      <button type="button" onClick={onClick} aria-label="카카오로 계속하기" className="flex h-[50px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#FEE500] hover:bg-[#f5dc00]">
        <Image src="/brands/kakao-login.png" alt="" width={600} height={90} className="h-full w-full object-contain" />
      </button>
    );
  }

  if (provider === "naver") {
    return (
      <button type="button" onClick={onClick} aria-label="네이버로 계속하기" className="flex h-[50px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#03C75A] hover:bg-[#02b651]">
        <Image src="/brands/naver-login.png" alt="" width={1472} height={192} className="h-full w-full object-contain" />
      </button>
    );
  }

  if (provider === "apple") {
    return (
      <button type="button" onClick={onClick} className="relative flex h-[50px] w-full items-center justify-center rounded-xl border border-black bg-white px-12 text-sm font-semibold text-black hover:bg-slate-50">
        <Image src="/brands/apple-logo-white.png" alt="" width={88} height={88} className="absolute left-4 h-5 w-5 object-contain" />
        Apple로 계속하기
      </button>
    );
  }

  return (
    <button type="button" onClick={onClick} className="relative flex h-[50px] w-full items-center justify-center rounded-xl border border-[#747775] bg-white px-12 text-sm font-semibold text-[#1f1f1f] hover:bg-slate-50">
      <Image src="/brands/google-g.png" alt="" width={200} height={204} className="absolute left-4 h-5 w-5 object-contain" />
      Google로 계속하기
    </button>
  );
}
