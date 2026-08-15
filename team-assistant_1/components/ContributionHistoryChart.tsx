"use client";

import type { ContributionHistorySnapshot } from "@/lib/apiClient";
import Avatar from "@/components/Avatar";

const COLORS = [
  "#6541f3",
  "#059669",
  "#d97706",
  "#e11d48",
  "#8b73ec",
  "#0891b2",
];

export default function ContributionHistoryChart({
  snapshots,
}: {
  snapshots: ContributionHistorySnapshot[];
}) {
  if (snapshots.length === 0) {
    return (
      <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        아직 저장된 기여도 이력이 없습니다.
      </p>
    );
  }

  const members = Array.from(
    new Map(
      snapshots.flatMap((snapshot) =>
        snapshot.members.map((member) => [member.memberId, member] as const)
      )
    ).values()
  );
  const width = 760;
  const height = 300;
  const margin = { top: 20, right: 24, bottom: 48, left: 44 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (index: number) =>
    margin.left +
    (snapshots.length === 1
      ? plotWidth / 2
      : (index / (snapshots.length - 1)) * plotWidth);
  const y = (percentage: number) =>
    margin.top + (1 - Math.max(0, Math.min(100, percentage)) / 100) * plotHeight;

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="분석 회차별 팀원 기여도 변화 그래프"
          className="min-w-[620px]"
        >
          {[0, 25, 50, 75, 100].map((tick) => (
            <g key={tick}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke="#cbd5e1"
                strokeDasharray="4 5"
                strokeOpacity="0.7"
              />
              <text
                x={margin.left - 9}
                y={y(tick) + 4}
                textAnchor="end"
                className="fill-slate-400 text-[10px]"
              >
                {tick}%
              </text>
            </g>
          ))}

          {snapshots.map((snapshot, index) => (
            <text
              key={snapshot.id}
              x={x(index)}
              y={height - 20}
              textAnchor="middle"
              className="fill-slate-500 text-[10px]"
            >
              {index === snapshots.length - 1 ? "최종" : `${snapshot.sequence}회`}
            </text>
          ))}

          {members.map((member, memberIndex) => {
            const points = snapshots
              .map((snapshot, snapshotIndex) => {
                const score = snapshot.members.find(
                  (item) => item.memberId === member.memberId
                );
                return score
                  ? { x: x(snapshotIndex), y: y(score.percentage), snapshot, score }
                  : null;
              })
              .filter((point): point is NonNullable<typeof point> => point !== null);
            const color = COLORS[memberIndex % COLORS.length];

            return (
              <g key={member.memberId}>
                {points.length > 1 && (
                  <polyline
                    points={points.map((point) => `${point.x},${point.y}`).join(" ")}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}
                {points.map((point) => (
                  <circle
                    key={`${member.memberId}-${point.snapshot.id}`}
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                  >
                    <title>{`${member.name}: ${point.score.percentage.toFixed(1)}% · ${new Date(point.snapshot.createdAt).toLocaleString("ko-KR")}`}</title>
                  </circle>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
        {members.map((member, index) => (
          <div key={member.memberId} className="flex items-center gap-2 text-xs text-slate-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <Avatar emoji={member.avatarEmoji} name={member.name} size="sm" />
            <span>{member.name}</span>
          </div>
        ))}
      </div>

      {snapshots.length === 1 && (
        <p className="mt-4 text-xs text-slate-400">
          분석 이력이 2회 이상 쌓이면 기여도 변화선이 표시됩니다.
        </p>
      )}
    </div>
  );
}
