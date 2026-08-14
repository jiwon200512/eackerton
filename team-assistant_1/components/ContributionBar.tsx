import type { MemberContribution } from "@/lib/types";

export default function ContributionBar({ member }: { member: MemberContribution }) {
  const delta = member.deltaPercentage;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-medium text-slate-800">{member.name}</span>
        <span className="text-sm text-slate-600">
          {member.percentage.toFixed(1)}%
          {delta !== null && delta !== 0 && (
            <span className={`ml-1.5 text-xs font-medium ${delta > 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)}%p
            </span>
          )}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/65 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-sm transition-all"
          style={{ width: `${Math.min(100, Math.max(0, member.percentage))}%` }}
        />
      </div>
    </div>
  );
}
