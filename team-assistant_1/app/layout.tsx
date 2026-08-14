import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Effortly",
  description: "팀의 기록을 업무와 기여도로 연결하는 AI 프로젝트 어시스턴트",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}
