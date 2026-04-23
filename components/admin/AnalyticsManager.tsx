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
};

const activityData: Record<ActivityRange, number[]> = {
  Weekly: [320, 380, 420, 390, 450, 410, 470],
  Monthly: [540, 610, 690, 820, 610, 520, 470, 540, 570, 620, 440],
  Yearly: [420, 460, 510, 580, 640, 620, 710, 760, 690, 720, 810, 860],
};

const activityLabels: Record<ActivityRange, string[]> = {
  Weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  Monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  Yearly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

function ActivityChart({ values, labels }: { values: number[]; labels: string[] }) {
  const width = 920;
  const height = 300;
  const paddingX = 48;
  const paddingY = 28;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  const maxValue = Math.max(...values, 900);

  const points = values.map((value, index) => {
    const x = paddingX + (index * chartWidth) / Math.max(values.length - 1, 1);
    const y = height - paddingY - ((value / maxValue) * chartHeight);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="mt-5 overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
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
            <g key={label}>
              <line x1={x} y1={paddingY} x2={x} y2={height - paddingY} stroke="#edf2fa" strokeWidth="1" />
              <text x={x} y={height - 8} textAnchor="middle" fontSize="11" fill="#8da0bf">{label}</text>
            </g>
          );
        })}
        <polyline fill="url(#activityArea)" opacity="0.18"
          points={`${paddingX},${height - paddingY} ${points} ${width - paddingX},${height - paddingY}`} />
        <polyline fill="none" stroke="#2563ff" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" points={points} />
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
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return <p className="text-sm text-slate-400 mt-4">No category data yet.</p>;

  const { paths } = segments.reduce<{ currentAngle: number; paths: Array<{ label: string; color: string; d: string }> }>(
    (acc, seg) => {
      const angle = (seg.value / total) * 360;
      const startRad = (Math.PI / 180) * (acc.currentAngle - 90);
      const endRad = (Math.PI / 180) * (acc.currentAngle + angle - 90);
      const cx = 90; const cy = 90; const r = 62;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      acc.paths.push({ label: seg.label, color: seg.color, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z` });
      acc.currentAngle += angle;
      return acc;
    },
    { currentAngle: 0, paths: [] }
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="flex justify-center">
        <svg viewBox="0 0 180 180" className="h-[280px] w-[280px]">
          {paths.map((seg) => <path key={seg.label} d={seg.d} fill={seg.color} />)}
        </svg>
      </div>
      <div className="space-y-3 text-sm text-slate-700 lg:min-w-[150px]">
        {segments.map((seg) => (
          <p key={seg.label} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: seg.color }} />
            {seg.label} ({seg.value})
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsManager({ totalRevenue, totalBooks, totalUsers, rentals, purchases, categorySegments }: Props) {
  const [activeRange, setActiveRange] = useState<ActivityRange>("Monthly");
  const chartValues = useMemo(() => activityData[activeRange], [activeRange]);
  const chartLabels = useMemo(() => activityLabels[activeRange], [activeRange]);

  const summaryCards = [
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, note: "From approved transactions" },
    { title: "Total Books", value: String(totalBooks), note: "In the library" },
    { title: "Total Users", value: String(totalUsers), note: "Registered accounts" },
    { title: "Rentals / Purchases", value: `${rentals} / ${purchases}`, note: "Approved transactions" },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-[2.5rem] font-bold leading-none text-[#173b73]">Analytics</h1>
        <p className="mt-2 text-base text-[#4d6691]">Insights and performance metrics</p>
      </div>

      <div className="grid gap-3 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article key={card.title} className="rounded-[6px] bg-[#4d98f0] px-4 py-3 text-white shadow-[0_10px_20px_rgba(77,152,240,0.14)]">
            <p className="text-sm">{card.title}</p>
            <p className="mt-2 text-3xl font-bold leading-none">{card.value}</p>
            <p className="mt-3 text-[11px] text-white/80">{card.note}</p>
          </article>
        ))}
      </div>

      <section className="rounded-[8px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-slate-950">Activity</h2>
        </div>
        <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-[6px] border border-[#d6dbe6] bg-white text-center text-xs text-slate-400">
          {(["Weekly", "Monthly", "Yearly"] as ActivityRange[]).map((range) => (
            <button key={range} type="button" onClick={() => setActiveRange(range)}
              className={`px-4 py-2.5 transition ${activeRange === range ? "bg-[#e6a41c] font-semibold text-white" : "bg-white hover:bg-[#f8fafc]"}`}>
              {range}
            </button>
          ))}
        </div>
        <ActivityChart values={chartValues} labels={chartLabels} />
      </section>

      <section className="rounded-[8px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <h2 className="text-base font-semibold text-slate-950">Rental vs Purchase</h2>
        <div className="mt-6 flex items-center gap-8">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <span className="h-3 w-3 rounded-full bg-[#4d98f0]" /> Rentals: {rentals}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <span className="h-3 w-3 rounded-full bg-[#e6a41c]" /> Purchases: {purchases}
          </div>
        </div>
      </section>

      <section className="rounded-[8px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <h2 className="text-base font-semibold text-slate-950">Books by Category</h2>
        <div className="mt-6 min-h-[300px]">
          <CategoryPieChart segments={categorySegments} />
        </div>
      </section>

      <section className="rounded-[8px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <h2 className="text-base font-semibold text-slate-950">Revenue Breakdown</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Total Revenue</p>
            <p className="mt-2 text-lg font-bold text-[#2563ff]">${totalRevenue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Transactions</p>
            <p className="mt-2 text-lg font-bold text-[#19b03c]">{rentals + purchases} approved</p>
          </div>
        </div>
      </section>
    </section>
  );
}