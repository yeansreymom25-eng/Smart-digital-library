"use client";

import { useMemo, useState } from "react";

type ActivityRange = "Weekly" | "Monthly" | "Yearly";

const summaryCards = [
  {
    title: "Total Revenue",
    value: "$17.98",
    note: "+ 12% from last month",
    icon: "money",
  },
  {
    title: "Total Books",
    value: "5",
    note: "+ 2 from last month",
    icon: "book",
  },
  {
    title: "Total Users",
    value: "3",
    note: "+ 1 from last month",
    icon: "user",
  },
  {
    title: "Avg Rating",
    value: "4.6",
    note: "+ 0.2 from last month",
    icon: "trend",
  },
] as const;

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

const popularBooks = [
  { title: "Fantasy", popularity: 95, color: "#57da5b" },
  { title: "Drama", popularity: 92, color: "#38d9a9" },
  { title: "Cooking", popularity: 86, color: "#65e0b0" },
  { title: "Romance", popularity: 80, color: "#5bd98c" },
  { title: "Horror", popularity: 60, color: "#3bcc70" },
];

const categorySegments = [
  { label: "History", value: 36, color: "#4d98f0" },
  { label: "Cooking", value: 12, color: "#f8e78d" },
  { label: "Romance", value: 16, color: "#a8f0d6" },
  { label: "Science", value: 7, color: "#d29af1" },
  { label: "Technology", value: 9, color: "#e6a41c" },
  { label: "Drama", value: 20, color: "#ffd2a8" },
];

function SummaryIcon({
  kind,
}: {
  kind: "money" | "book" | "user" | "trend";
}) {
  const className = "h-5 w-5";

  if (kind === "book") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19v14H7.5A2.5 2.5 0 0 0 5 20.5V6.5Z" />
        <path d="M5 6h12" />
      </svg>
    );
  }

  if (kind === "user") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    );
  }

  if (kind === "trend") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path d="M4 18h16" />
        <path d="m6 15 4-4 3 2 5-6" />
        <path d="M18 7h2v2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 3v2.1c2.1.3 3.7 1.6 4.1 3.6h-2.8c-.3-.8-1.1-1.3-2.3-1.3-1.4 0-2.3.6-2.3 1.5 0 .8.5 1.2 2.6 1.7 3.2.8 4.7 1.9 4.7 4.4 0 2.2-1.6 3.8-4 4.2V21h-2.2v-1.9c-2.7-.3-4.5-1.8-4.8-4.1h2.8c.3 1.1 1.2 1.7 2.7 1.7s2.5-.6 2.5-1.6c0-.9-.6-1.3-2.7-1.8-3-.7-4.6-1.8-4.6-4.2 0-2.1 1.5-3.6 3.9-4.1V3h2.4Z" />
    </svg>
  );
}

function ActivityChart({
  values,
  labels,
}: {
  values: number[];
  labels: string[];
}) {
  const width = 920;
  const height = 300;
  const paddingX = 48;
  const paddingY = 28;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  const maxValue = Math.max(...values, 900);
  const minValue = 0;

  const points = values
    .map((value, index) => {
      const x =
        paddingX + (index * chartWidth) / Math.max(values.length - 1, 1);
      const y =
        height -
        paddingY -
        ((value - minValue) / (maxValue - minValue)) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="mt-5 overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[300px] w-full">
        {[0, 1, 2, 3, 4].map((tick) => {
          const y = paddingY + (tick * chartHeight) / 4;
          const label = Math.round(maxValue - (tick * maxValue) / 4);

          return (
            <g key={tick}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#edf2fa"
                strokeWidth="1"
              />
              <text
                x={paddingX - 14}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#8da0bf"
              >
                {label}
              </text>
            </g>
          );
        })}

        {labels.map((label, index) => {
          const x =
            paddingX + (index * chartWidth) / Math.max(labels.length - 1, 1);

          return (
            <g key={label}>
              <line
                x1={x}
                y1={paddingY}
                x2={x}
                y2={height - paddingY}
                stroke="#edf2fa"
                strokeWidth="1"
              />
              <text
                x={x}
                y={height - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#8da0bf"
              >
                {label}
              </text>
            </g>
          );
        })}

        <polyline
          fill="url(#activityArea)"
          opacity="0.18"
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

function DonutChart() {
  const rentShare = 5;
  const purchaseShare = 3;
  const total = rentShare + purchaseShare;
  const rentOffset = (rentShare / total) * 100;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="flex justify-center">
        <div className="relative flex h-[230px] w-[230px] items-center justify-center">
          <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,#f8fbff_0%,#edf5ff_70%,transparent_72%)] blur-[2px]" />
          <svg viewBox="0 0 220 220" className="h-[230px] w-[230px] drop-shadow-[0_18px_28px_rgba(77,152,240,0.18)]">
            <circle
              cx="110"
              cy="110"
              r="72"
              fill="none"
              stroke="#eaf1fb"
              strokeWidth="34"
            />
            <circle
              cx="110"
              cy="110"
              r="72"
              fill="none"
              stroke="#4d98f0"
              strokeWidth="34"
              strokeLinecap="round"
              strokeDasharray={`${rentOffset * 4.52} 999`}
              transform="rotate(-90 110 110)"
            />
            <circle
              cx="110"
              cy="110"
              r="72"
              fill="none"
              stroke="#e6a41c"
              strokeWidth="34"
              strokeLinecap="round"
              strokeDasharray={`${(100 - rentOffset) * 4.52} 999`}
              strokeDashoffset={-rentOffset * 4.52}
              transform="rotate(-90 110 110)"
            />
            <circle cx="110" cy="110" r="46" fill="white" />
          </svg>
        </div>
      </div>

      <div className="space-y-4 text-sm text-slate-800 lg:min-w-[120px]">
        <p className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#4d98f0]" />
          Rentals : 5
        </p>
        <p className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e6a41c]" />
          Purchases : 3
        </p>
      </div>
    </div>
  );
}

function CategoryPieChart() {
  const { paths } = categorySegments.reduce<{
    currentAngle: number;
    paths: Array<(typeof categorySegments)[number] & { d: string }>;
  }>(
    (accumulator, segment) => {
      const angle = (segment.value / 100) * 360;
      const startAngle = accumulator.currentAngle;
      const endAngle = startAngle + angle;
      const startRad = (Math.PI / 180) * (startAngle - 90);
      const endRad = (Math.PI / 180) * (endAngle - 90);
      const cx = 90;
      const cy = 90;
      const r = 62;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const largeArc = angle > 180 ? 1 : 0;

      accumulator.paths.push({
        ...segment,
        d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      });
      accumulator.currentAngle = endAngle;
      return accumulator;
    },
    { currentAngle: 0, paths: [] },
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="flex justify-center">
        <div className="relative flex h-[350px] w-[350px] items-center justify-center">
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(77,152,240,0.16)_0%,rgba(77,152,240,0.08)_34%,rgba(255,255,255,0)_68%)] blur-[26px]" />
          <div className="pointer-events-none absolute h-[265px] w-[265px] rounded-full bg-[radial-gradient(circle,rgba(230,164,28,0.12)_0%,rgba(230,164,28,0.05)_42%,rgba(255,255,255,0)_72%)] blur-[22px]" />
          <svg
            viewBox="0 0 180 180"
            className="relative z-10 h-[350px] w-[350px] drop-shadow-[0_18px_34px_rgba(77,152,240,0.12)]"
          >
            {paths.map((segment) => (
              <path key={segment.label} d={segment.d} fill={segment.color} />
            ))}
          </svg>
        </div>
      </div>

      <div className="space-y-3 text-sm text-slate-700 lg:min-w-[150px] lg:self-center">
        {categorySegments.map((segment) => (
          <p key={segment.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: segment.color }}
            />
            {segment.label}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsManager() {
  const [activeRange, setActiveRange] = useState<ActivityRange>("Monthly");

  const chartValues = useMemo(() => activityData[activeRange], [activeRange]);
  const chartLabels = useMemo(() => activityLabels[activeRange], [activeRange]);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-[2.5rem] font-bold leading-none text-[#173b73]">
          Analytics
        </h1>
        <p className="mt-2 text-base text-[#4d6691]">
          Insights and performance metrics
        </p>
      </div>

      <div className="grid gap-3 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[6px] bg-[#4d98f0] px-4 py-3 text-white shadow-[0_10px_20px_rgba(77,152,240,0.14)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm">{card.title}</p>
                <p className="mt-2 text-3xl font-bold leading-none">{card.value}</p>
                <p className="mt-3 text-[11px] text-white/80">{card.note}</p>
              </div>
              <div className="text-white/85">
                <SummaryIcon kind={card.icon} />
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-[8px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-slate-950">Activity</h2>
          </div>

          <div className="grid grid-cols-3 overflow-hidden rounded-[6px] border border-[#d6dbe6] bg-white text-center text-xs text-slate-400">
            {(["Weekly", "Monthly", "Yearly"] as ActivityRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setActiveRange(range)}
                className={`px-4 py-2.5 transition ${
                  activeRange === range
                    ? "bg-[#e6a41c] font-semibold text-white"
                    : "bg-white hover:bg-[#f8fafc]"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <ActivityChart values={chartValues} labels={chartLabels} />
      </section>

      <section className="rounded-[8px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <h2 className="text-base font-semibold text-slate-950">
          Rental vs Purchase
        </h2>
        <div className="mt-6 min-h-[250px]">
          <DonutChart />
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[8px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-slate-950">
              Top 5 Popular Books
            </h2>
            <p className="text-[11px] text-slate-400">Popularity</p>
          </div>

          <div className="mt-6 space-y-5">
            {popularBooks.map((book) => (
              <div key={book.title} className="grid grid-cols-[1fr_auto] items-center gap-4">
                <div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-slate-800">{book.title}</span>
                    <span className="text-slate-400">{book.popularity}%</span>
                  </div>
                  <div className="mt-2 h-2.5 rounded-full bg-[#d7f7e5]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${book.popularity}%`,
                        backgroundColor: book.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[8px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
          <h2 className="text-base font-semibold text-slate-950">
            Books by category
          </h2>
          <div className="mt-6 min-h-[430px]">
            <CategoryPieChart />
          </div>
        </section>
      </div>

      <section className="rounded-[8px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <h2 className="text-base font-semibold text-slate-950">
          Revenue Breakdown
        </h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Rental Revenue</p>
            <p className="mt-2 text-lg font-bold text-[#2563ff]">$7.98</p>
            <p className="mt-1 text-xs text-slate-400">From 5 rentals</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Purchase Revenue</p>
            <p className="mt-2 text-lg font-bold text-[#19b03c]">$11.22</p>
            <p className="mt-1 text-xs text-slate-400">From 3 purchases</p>
          </div>
        </div>
      </section>
    </section>
  );
}
