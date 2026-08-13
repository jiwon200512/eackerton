import type { TaskStatus } from "@/lib/types";

const CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  TODO: { label: "할 일", className: "bg-slate-100 text-slate-600 ring-slate-300" },
  IN_PROGRESS: { label: "진행 중", className: "bg-amber-50 text-amber-700 ring-amber-300" },
  DONE: { label: "완료", className: "bg-emerald-50 text-emerald-700 ring-emerald-300" },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}
