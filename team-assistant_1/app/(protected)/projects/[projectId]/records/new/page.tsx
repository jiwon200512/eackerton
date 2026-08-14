"use client";

import { useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { ApiError, analyzeRecord, createRecord } from "@/lib/apiClient";
import Spinner from "@/components/Spinner";
import { MAX_RECORD_CHARS } from "@/lib/records/constants";

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
    if (content.length > MAX_RECORD_CHARS) {
      setError(`기록이 너무 깁니다. ${MAX_RECORD_CHARS.toLocaleString()}자 이하로 입력해주세요.`);
      return;
    }
    setText(content);
    setFileName(file.name);
  }

  async function handleSubmit() {
    if (!text.trim()) {
      setError("입력 내용이 비어 있습니다.");
      return;
    }
    if (text.length > MAX_RECORD_CHARS) {
      setError(`기록이 너무 깁니다. ${MAX_RECORD_CHARS.toLocaleString()}자 이하로 입력해주세요.`);
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
    <div className="page-container max-w-4xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">Add Record</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">새 기록 분석하기</h1>
        <p className="mt-1 text-sm text-slate-500">
          카카오톡 대화나 회의 내용을 입력하면 AI가 기존 프로젝트 상태와 비교하여 Task를 업데이트합니다.
        </p>
        <p className="mt-1 text-xs text-slate-400">최대 {MAX_RECORD_CHARS.toLocaleString()}자까지 분석할 수 있습니다.</p>
      </div>

      <div className="mt-7 flex w-fit rounded-xl border border-white/70 bg-white/45 p-1 shadow-sm backdrop-blur-xl">
        <ModeButton active={mode === "MANUAL_TEXT"} onClick={() => setMode("MANUAL_TEXT")}>
          텍스트 붙여넣기
        </ModeButton>
        <ModeButton active={mode === "KAKAO_TEXT"} onClick={() => setMode("KAKAO_TEXT")}>
          카카오톡 txt 업로드
        </ModeButton>
      </div>

      <div className="glass-card mt-4 rounded-2xl p-5 sm:p-6">
        {mode === "KAKAO_TEXT" && (
          <div className="mb-5 rounded-2xl border-2 border-dashed border-indigo-200/80 bg-indigo-50/25 p-7 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
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
          maxLength={MAX_RECORD_CHARS}
          className="glass-input w-full resize-none rounded-xl px-4 py-3 text-sm leading-6"
        />
      </div>

      <p className="mt-2 text-right text-xs text-slate-400">{text.length.toLocaleString()} / {MAX_RECORD_CHARS.toLocaleString()}자</p>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {analyzing ? (
        <div className="glass-card mt-5 flex items-center justify-center gap-2 rounded-2xl px-4 py-7">
          <Spinner label="프로젝트 기록을 분석하고 있습니다..." />
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="btn-primary mt-5 ml-auto block rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50"
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
      className={`rounded-lg px-4 py-2 text-sm font-semibold ${
        active ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-white/70"
      }`}
    >
      {children}
    </button>
  );
}
