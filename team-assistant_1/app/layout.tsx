import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Project Assistant",
  description: "카카오톡 대화로 프로젝트 상태를 지속적으로 갱신하는 AI 팀 어시스턴트",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
