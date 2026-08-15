"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { ApiError, analyzeRecord, createRecord, getProject, listRecords } from "@/lib/apiClient";
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
  const [failedRecordId, setFailedRecordId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<"ACTIVE" | "COMPLETED" | null>(null);

  useEffect(() => {
    Promise.all([getProject(projectId), listRecords(projectId)])
      .then(([{ project }, { records }]) => {
        setProjectStatus(project.status);
        setFailedRecordId(
          records.find((record) => record.analysisStatus === "FAILED")?.id ?? null
        );
      })
      .catch((caught) => setError(caught instanceof ApiError ? caught.message : "프로젝트를 불러오지 못했습니다."));
  }, [projectId]);

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError("카카오톡 대화 파일은 .txt 형식만 지원합니다.");
      return;
    }
    setError(null);
    try {
      const content = await file.text();
      if (content.length > MAX_RECORD_CHARS) {
        setError(`기록이 너무 깁니다. ${MAX_RECORD_CHARS.toLocaleString()}자 이하로 입력해주세요.`);
        return;
      }
      setText(content);
      setFileName(file.name);
      setFailedRecordId(null);
    } catch {
      setError("파일을 읽지 못했습니다. 다른 txt 파일을 선택해주세요.");
    }
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
    setFailedRecordId(null);
    let createdRecordId: string | null = null;
    try {
      const { record } = await createRecord(projectId, mode, text);
      createdRecordId = record.id;
      await analyzeRecord(projectId, record.id);
      router.push(`/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "분석에 실패했습니다.");
      setFailedRecordId(createdRecordId);
    } finally {
      setAnalyzing(false);
    }
  }

  async function retryAnalysis() {
    if (!failedRecordId) return;
    setAnalyzing(true);
    setError(null);
    try {
      await analyzeRecord(projectId, failedRecordId, true);
      setFailedRecordId(null);
      router.push(`/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "AI 분석 중 문제가 발생했습니다.");
    } finally {
      setAnalyzing(false);
    }
  }

  if (projectStatus === null && !error) {
    return <div className="page-container flex min-h-[60vh] items-center justify-center"><Spinner label="프로젝트를 확인하는 중..." /></div>;
  }

  if (projectStatus === "COMPLETED") {
    return (
      <div className="page-container max-w-4xl">
        <div className="glass-card rounded-2xl p-6 text-center">
          <h1 className="text-xl font-bold text-slate-900">종료된 프로젝트입니다.</h1>
          <p className="mt-2 text-sm text-slate-500">종료된 프로젝트에는 새 기록을 추가하거나 AI 분석을 실행할 수 없습니다.</p>
          <button type="button" onClick={() => router.push(`/projects/${projectId}/result`)} className="btn-primary mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold">최종 결과 보기</button>
        </div>
      </div>
    );
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
          onChange={(e) => {
            setText(e.target.value);
            setFailedRecordId(null);
          }}
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

      {failedRecordId && !analyzing && (
        <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
          <p className="text-sm font-bold text-rose-700">분석 실패</p>
          <p className="mt-1 text-xs leading-5 text-rose-600">기록은 안전하게 저장되었습니다. 같은 기록을 다시 분석할 수 있습니다.</p>
          <button type="button" onClick={retryAnalysis} className="btn-secondary mt-3 rounded-xl px-4 py-2 text-sm font-semibold">다시 분석</button>
        </div>
      )}

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
