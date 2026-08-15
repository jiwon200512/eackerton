import type { TaskStatus } from "@/lib/types";

const CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  TODO: { label: "할 일", className: "bg-slate-100 text-slate-600 ring-slate-200" },
  IN_PROGRESS: { label: "진행 중", className: "bg-violet-50 text-[#6541f3] ring-violet-200" },
  DONE: { label: "완료", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}
