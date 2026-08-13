"use client";

import { useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { ApiError, analyzeRecord, createRecord } from "@/lib/apiClient";
import Spinner from "@/components/Spinner";

type InputMode = "MANUAL_TEXT" | "KAKAO_TEXT";

export default function NewRecordPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<InputMode>("MANUAL_TEXT");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError("카카오톡 대화 파일은 .txt 형식만 지원합니다.");
      return;
    }
    setError(null);
    const content = await file.text();
    setText(content);
    setFileName(file.name);
  }

  async function handleSubmit() {
    if (!text.trim()) {
      setError("입력 내용이 비어 있습니다.");
      return;
    }
    setAnalyzing(true);
    setError(null);
    try {
      const { record } = await createRecord(projectId, mode, text);
      await analyzeRecord(projectId, record.id);
      router.push(`/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "분석에 실패했습니다.");
      setAnalyzing(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <button
        onClick={() => router.push(`/projects/${projectId}`)}
        className="self-start text-sm text-slate-500 hover:text-slate-700"
        disabled={analyzing}
      >
        ← Dashboard
      </button>

      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">기록 추가</h1>
        <p className="mt-1 text-sm text-slate-500">
          카카오톡 대화나 회의 내용을 입력하면 AI가 기존 프로젝트 상태와 비교하여 Task를 업데이트합니다.
        </p>
      </div>

      <div className="flex gap-2">
        <ModeButton active={mode === "MANUAL_TEXT"} onClick={() => setMode("MANUAL_TEXT")}>
          텍스트 붙여넣기
        </ModeButton>
        <ModeButton active={mode === "KAKAO_TEXT"} onClick={() => setMode("KAKAO_TEXT")}>
          카카오톡 txt 업로드
        </ModeButton>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {mode === "KAKAO_TEXT" && (
          <div className="mb-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
            >
              {fileName ? `선택된 파일: ${fileName}` : "카카오톡 대화 .txt 파일 선택"}
            </button>
          </div>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            mode === "MANUAL_TEXT"
              ? "예)\n김지원: 로그인 페이지 내가 만들게.\n박민수: 그러면 나는 DB 연결할게.\n이철수: 발표자료는 내가 준비할게."
              : "위에서 파일을 선택하면 내용이 여기에 표시됩니다. 직접 붙여넣어도 됩니다."
          }
          rows={12}
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {analyzing ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-6 shadow-sm">
          <Spinner label="프로젝트 기록을 분석하고 있습니다..." />
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="self-end rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          AI로 분석하기
        </button>
      )}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium ${
        active ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
