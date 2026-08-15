import Avatar from "@/components/Avatar";
import type { TaskContributorDTO } from "@/lib/types";

export default function TaskContributors({
  contributors,
  compact = false,
}: {
  contributors: TaskContributorDTO[];
  compact?: boolean;
}) {
  if (contributors.length === 0) {
    return <span className="text-xs text-slate-400">참여자 미지정</span>;
  }

  if (compact) {
    const visible = contributors.slice(0, 3);
    return (
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        {visible.map((contributor) => (
          <span key={contributor.memberId} className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Avatar emoji={contributor.avatarEmoji} name={contributor.name} size="sm" />
            <span>{contributor.name}</span>
            <b className="font-semibold text-slate-700">{contributor.share}%</b>
          </span>
        ))}
        {contributors.length > visible.length && (
          <span className="text-[11px] font-semibold text-indigo-500">+{contributors.length - visible.length}명</span>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {contributors.map((contributor) => (
        <div key={contributor.memberId}>
          <div className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-700">
              <Avatar emoji={contributor.avatarEmoji} name={contributor.name} size="sm" />
              <span className="truncate">{contributor.name}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {contributor.source && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    contributor.source === "MANUAL"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  {contributor.source === "MANUAL" ? "직접 수정" : "AI 분석"}
                </span>
              )}
              <strong className="text-sm text-indigo-600">{contributor.share}%</strong>
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/70">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${contributor.share}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
