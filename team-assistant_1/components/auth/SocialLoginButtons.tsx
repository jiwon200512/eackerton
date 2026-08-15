"use client";

import Image from "next/image";
import { useState } from "react";

type Provider = "google" | "kakao" | "apple" | "naver";

const PROVIDERS: Array<{
  id: Provider;
  name: string;
  label: string;
  icon: { src: string; width: number; height: number; className: string };
  className: string;
}> = [
  {
    id: "google",
    name: "Google",
    label: "Google로 계속하기",
    icon: { src: "/brands/google-g.png", width: 200, height: 204, className: "h-6 w-auto" },
    className: "border border-[#747775] bg-white text-[#1f1f1f] hover:bg-slate-50",
  },
  {
    id: "kakao",
    name: "카카오",
    label: "카카오로 계속하기",
    icon: { src: "/brands/kakao-symbol.png", width: 48, height: 44, className: "h-6 w-auto" },
    className: "bg-[#FEE500] text-[rgba(0,0,0,0.85)] hover:brightness-[.98]",
  },
  {
    id: "apple",
    name: "Apple",
    label: "Apple로 계속하기",
    icon: { src: "/brands/apple-symbol.png", width: 38, height: 44, className: "h-[23px] w-auto" },
    className: "border border-[#1d1d1f] bg-white text-[#1d1d1f] hover:bg-slate-50",
  },
  {
    id: "naver",
    name: "네이버",
    label: "네이버로 계속하기",
    icon: { src: "/brands/naver-symbol.png", width: 80, height: 80, className: "h-6 w-auto" },
    className: "bg-[#03C75A] text-white hover:brightness-[.96]",
  },
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

      <div className="mt-4 grid gap-3">
        {PROVIDERS.map((provider) => (
          <SocialAuthButton
            key={provider.id}
            provider={provider}
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

function SocialAuthButton({
  provider,
  onClick,
}: {
  provider: (typeof PROVIDERS)[number];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid h-14 w-full grid-cols-[40px_minmax(0,1fr)_40px] items-center rounded-xl px-4 text-base font-semibold leading-none ${provider.className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center">
        <Image
          src={provider.icon.src}
          alt=""
          width={provider.icon.width}
          height={provider.icon.height}
          className={provider.icon.className}
        />
      </span>
      <span className="text-center">{provider.label}</span>
      <span aria-hidden="true" />
    </button>
  );
}
