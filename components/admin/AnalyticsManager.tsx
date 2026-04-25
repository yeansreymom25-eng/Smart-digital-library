"use client";

import { useMemo, useState } from "react";

type ActivityRange = "Weekly" | "Monthly" | "Yearly";

type Props = {
  totalRevenue: number;
  totalBooks: number;
  totalUsers: number;
  rentals: number;
  purchases: number;
  categorySegments: { label: string; value: number; color: string }[];
  activitySeries: Record<ActivityRange, { labels: string[]; values: number[] }>;
};

function ActivityChart({ values, labels }: { values: number[]; labels: string[] }) {
  if (!values.length || values.every((value) => value === 0)) {
    return (
      <div className="mt-5 flex h-[300px] items-center justify-center rounded-[18px] border border-dashed border-[#d8e2f2] bg-[radial-gradient(circle_at_top,_rgba(77,152,240,0.08),_rgba(255,255,255,0.95)_55%)]">
        <div className="text-center">
          <p className="text-base font-semibold text-[#173b73]">No activity yet</p>
          <p className="mt-2 text-sm text-[#6980a6]">
            Transactions will appear here once readers start renting or buying your books.
          </p>
        </div>
      </div>
    );
  }

  const width = 920;
  const height = 300;
  const paddingX = 48;
  const paddingY = 28;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  const maxValue = Math.max(...values, 4);

  const points = values
    .map((value, index) => {
      const x = paddingX + (index * chartWidth) / Math.max(values.length - 1, 1);
      const y = height - paddingY - (value / maxValue) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="mt-5 overflow-hidden rounded-[18px] border border-[#dce8fb] bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[300px] w-full">
        {[0, 1, 2, 3, 4].map((tick) => {
          const y = paddingY + (tick * chartHeight) / 4;
          return (
            <g key={tick}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#edf2fa" strokeWidth="1" />
              <text x={paddingX - 14} y={y + 4} textAnchor="end" fontSize="11" fill="#8da0bf">
                {Math.round(maxValue - (tick * maxValue) / 4)}
              </text>
            </g>
          );
        })}
        {labels.map((label, index) => {
          const x = paddingX + (index * chartWidth) / Math.max(labels.length - 1, 1);
          return (
            <g key={`${label}-${index}`}>
              <line x1={x} y1={paddingY} x2={x} y2={height - paddingY} stroke="#edf2fa" strokeWidth="1" />
              <text x={x} y={height - 8} textAnchor="middle" fontSize="11" fill="#8da0bf">
                {label}
              </text>
            </g>
          );
        })}
        <polyline
          fill="url(#activityArea)"
          opacity="0.24"
          points={`${paddingX},${height - paddingY} ${points} ${width - paddingX},${height - paddingY}`}
        />
        <polyline
          fill="none"
          stroke="#2563ff"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
        {values.map((value, index) => {
          const x = paddingX + (index * chartWidth) / Math.max(values.length - 1, 1);
          const y = height - paddingY - (value / maxValue) * chartHeight;
          return (
            <circle
              key={`dot-${index}`}
              cx={x}
              cy={y}
              r="5.5"
              fill="#ffffff"
              stroke="#2563ff"
              strokeWidth="3"
            />
          );
        })}
        <defs>
          <linearGradient id="activityArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4d98f0" />
            <stop offset="100%" stopColor="#4d98f0" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function CategoryPieChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  if (total === 0) {
    return (
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-center">
        <div className="mx-auto flex h-[280px] w-[280px] items-center justify-center rounded-full border border-dashed border-[#d8e2f2] bg-[radial-gradient(circle_at_top,_rgba(77,152,240,0.1),_rgba(255,255,255,0.96)_58%)]">
          <div className="text-center">
            <p className="text-base font-semibold text-[#173b73]">No books yet</p>
            <p className="mt-2 max-w-[180px] text-sm text-[#6980a6]">
              Add your first books to see category distribution.
            </p>
          </div>
        </div>
        <div className="rounded-[18px] border border-[#e1e8f5] bg-[#f8fbff] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b82a8]">Category Snapshot</p>
          <p className="mt-3 text-sm leading-7 text-[#6980a6]">
            When your library grows, this area will show which categories are leading and how your catalog is balanced.
          </p>
        </div>
      </div>
    );
  }

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let runningOffset = 0;

  const ringSegments = segments.map((segment) => {
    const fraction = segment.value / total;
    const strokeLength = circumference * fraction;
    const result = {
      ...segment,
      fraction,
      strokeDasharray: `${strokeLength} ${circumference - strokeLength}`,
      strokeDashoffset: -runningOffset,
    };
    runningOffset += strokeLength;
    return result;
  });

  return (
    <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-center">
      <div className="flex justify-center">
        <div className="relative flex h-[280px] w-[280px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_rgba(77,152,240,0.12),_rgba(255,255,255,0.98)_56%)]">
          <svg viewBox="0 0 140 140" className="h-[220px] w-[220px] -rotate-90">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#e8eef8" strokeWidth="18" />
            {ringSegments.map((segment) => (
              <circle
                key={segment.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={segment.strokeDashoffset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b8fb1]">Categories</p>
            <p className="mt-2 text-[2.4rem] font-bold leading-none text-[#173b73]">{total}</p>
            <p className="mt-2 text-sm text-[#6980a6]">Books tracked</p>
          </div>
        </div>
      </div>
      <div className="grid gap-3 2xl:grid-cols-2">
        {ringSegments
          .sort((a, b) => b.value - a.value)
          .map((segment) => (
            <article
              key={segment.label}
              className="rounded-[18px] border border-[#dce8fb] bg-[linear-gradient(145deg,#ffffff,#f6faff)] p-4 shadow-[0_12px_24px_rgba(77,152,240,0.08)]"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-1 h-3.5 w-3.5 rounded-full" style={{ backgroundColor: segment.color }} />
                  <p className="min-w-0 text-sm font-semibold leading-5 text-[#173b73] [overflow-wrap:break-word]">
                    {segment.label}
                  </p>
                </div>
                <p className="shrink-0 text-right text-sm font-semibold leading-5 text-[#2456b6]">{Math.round(segment.fraction * 100)}%</p>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e9eef6]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${segment.fraction * 100}%`, backgroundColor: segment.color }}
                />
              </div>
              <p className="mt-3 text-sm text-[#6980a6]">
                {segment.value} {segment.value === 1 ? "book" : "books"}
              </p>
            </article>
          ))}
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  value,
  note,
  accent,
}: {
  title: string;
  value: string;
  note: string;
  accent: string;
}) {
  return (
    <article className="rounded-[18px] border border-[#dce8fb] bg-[linear-gradient(160deg,#ffffff_0%,#f6faff_100%)] p-5 shadow-[0_12px_28px_rgba(77,152,240,0.08)]">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#6e84a8]">{title}</p>
      </div>
      <p className="mt-5 text-[2rem] font-bold leading-none text-[#173b73]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[#6980a6]">{note}</p>
    </article>
  );
}

export default function AnalyticsManager({
  totalRevenue,
  totalBooks,
  totalUsers,
  rentals,
  purchases,
  categorySegments,
  activitySeries,
}: Props) {
  const [activeRange, setActiveRange] = useState<ActivityRange>("Monthly");
  const chartValues = useMemo(() => activitySeries[activeRange]?.values ?? [], [activeRange, activitySeries]);
  const chartLabels = useMemo(() => activitySeries[activeRange]?.labels ?? [], [activeRange, activitySeries]);

  const summaryCards = [
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, note: "Approved book earnings", accent: "#4d98f0" },
    { title: "Books in Catalog", value: String(totalBooks), note: "Titles you currently manage", accent: "#1db86f" },
    { title: "Paying Readers", value: String(totalUsers), note: "Unique readers who purchased or rented", accent: "#e6a41c" },
    { title: "Rentals vs Purchases", value: `${rentals} / ${purchases}`, note: "Approved access mix", accent: "#7b61ff" },
  ];

  const totalApprovedTransactions = rentals + purchases;
  const rentalShare = totalApprovedTransactions > 0 ? Math.round((rentals / totalApprovedTransactions) * 100) : 0;
  const purchaseShare = totalApprovedTransactions > 0 ? Math.round((purchases / totalApprovedTransactions) * 100) : 0;

  return (
    <section className="space-y-5">
      <div className="rounded-[22px] border border-[#dce8fb] bg-[linear-gradient(135deg,rgba(77,152,240,0.12)_0%,rgba(255,255,255,0.98)_42%,rgba(232,244,255,0.96)_100%)] p-6 shadow-[0_18px_40px_rgba(77,152,240,0.12)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f79a8]">Library Intelligence</p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[2.5rem] font-bold leading-none text-[#173b73]">Analytics</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#4d6691]">
              A cleaner view of how your catalog is growing, which categories are strongest, and how readers are choosing to access your books.
            </p>
          </div>
          <div className="rounded-full border border-white/80 bg-white/90 px-4 py-2 text-sm font-medium text-[#5f79a8] shadow-[0_10px_24px_rgba(77,152,240,0.08)]">
            Owner-scoped live metrics
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <BreakdownCard
            key={card.title}
            title={card.title}
            value={card.value}
            note={card.note}
            accent={card.accent}
          />
        ))}
      </div>

      <section className="rounded-[20px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_rgba(77,152,240,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[1.2rem] font-semibold text-slate-950">Activity Trend</h2>
            <p className="mt-1 text-sm text-[#6980a6]">Tracks how often readers interact with your catalog over time.</p>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-full border border-[#d6dbe6] bg-white text-center text-xs text-slate-400">
            {(["Weekly", "Monthly", "Yearly"] as ActivityRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setActiveRange(range)}
                className={`px-4 py-2.5 transition ${
                  activeRange === range
                    ? "bg-[#173b73] font-semibold text-white"
                    : "bg-white text-[#6f84a8] hover:bg-[#f8fafc]"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <ActivityChart values={chartValues} labels={chartLabels} />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="rounded-[20px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_rgba(77,152,240,0.08)]">
          <h2 className="text-[1.2rem] font-semibold text-slate-950">Books by Category</h2>
          <p className="mt-1 text-sm text-[#6980a6]">See how your catalog is distributed across categories.</p>
          <div className="mt-6 min-h-[320px]">
            <CategoryPieChart segments={categorySegments} />
          </div>
        </section>

        <div className="grid gap-4">
          <section className="rounded-[20px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_rgba(77,152,240,0.08)]">
            <h2 className="text-[1.2rem] font-semibold text-slate-950">Access Mix</h2>
            <p className="mt-1 text-sm text-[#6980a6]">How readers prefer to unlock your books.</p>
            <div className="mt-6 space-y-5">
              <div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-[#173b73]">Rentals</span>
                  <span className="text-[#4d6691]">{rentals} ({rentalShare}%)</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e8eef7]">
                  <div className="h-full rounded-full bg-[#4d98f0]" style={{ width: `${rentalShare}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-[#173b73]">Purchases</span>
                  <span className="text-[#4d6691]">{purchases} ({purchaseShare}%)</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#f4ead3]">
                  <div className="h-full rounded-full bg-[#e6a41c]" style={{ width: `${purchaseShare}%` }} />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[20px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_rgba(77,152,240,0.08)]">
            <h2 className="text-[1.2rem] font-semibold text-slate-950">Revenue Breakdown</h2>
            <p className="mt-1 text-sm text-[#6980a6]">A quick read on monetization performance.</p>
            <div className="mt-6 grid gap-4">
              <BreakdownCard
                title="Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                note="Approved earnings from all reader transactions."
                accent="#4d98f0"
              />
              <BreakdownCard
                title="Approved Transactions"
                value={String(totalApprovedTransactions)}
                note="Total approved rentals and purchases combined."
                accent="#1db86f"
              />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
