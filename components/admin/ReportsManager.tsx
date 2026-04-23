"use client";

import { useMemo, useState } from "react";

type ReportFrequency = "Monthly" | "Quarterly" | "Yearly";
type ExportFormat = "PDF" | "Excel";

type Props = {
  totalRevenue: number;
  totalUsers: number;
  totalBooks: number;
  totalTransactions: number;
  approvedTransactions: number;
  pendingTransactions: number;
  publishedBooks: number;
  rentals: number;
  purchases: number;
};

type ExportItem = {
  id: string;
  title: string;
  subtitle: string;
  format: ExportFormat;
  filename: string;
  content: string;
};

const years = ["2026", "2025", "2024"];

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M12 4v10" /><path d="m8 10 4 4 4-4" /><path d="M5 19h14" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#4d98f0] text-white shadow-[0_8px_18px_rgba(77,152,240,0.18)]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
        <path d="M7 4h7l3 3v13H7z" /><path d="M14 4v4h4M10 12h4M10 16h4" />
      </svg>
    </div>
  );
}

export default function ReportsManager({
  totalRevenue, totalUsers, totalBooks, totalTransactions,
  approvedTransactions, pendingTransactions, publishedBooks, rentals, purchases,
}: Props) {
  const [frequency, setFrequency] = useState<ReportFrequency>("Monthly");
  const [year, setYear] = useState("2026");
  const [activeFilter, setActiveFilter] = useState({ frequency: "Monthly" as ReportFrequency, year: "2026" });
  const [exportsList, setExportsList] = useState<ExportItem[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  const filterLabel = useMemo(() => `${activeFilter.frequency} ${activeFilter.year}`, [activeFilter]);

  const reportCards = [
    {
      key: "revenue",
      title: "Revenue Report",
      description: "Detailed breakdown of all revenue sources",
      stats: [
        { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}` },
        { label: "Rentals", value: String(rentals) },
        { label: "Purchases", value: String(purchases) },
      ],
    },
    {
      key: "sales",
      title: "Sales Report",
      description: "Summary of book rentals and purchases",
      stats: [
        { label: "Total Transactions", value: String(totalTransactions) },
        { label: "Approved", value: String(approvedTransactions) },
        { label: "Pending", value: String(pendingTransactions) },
      ],
    },
    {
      key: "activity",
      title: "User Activity Report",
      description: "User engagement and activity metrics",
      stats: [
        { label: "Total Users", value: String(totalUsers) },
        { label: "Total Transactions", value: String(totalTransactions) },
        { label: "Approved Transactions", value: String(approvedTransactions) },
      ],
    },
    {
      key: "performance",
      title: "Books Performance Report",
      description: "Analysis of book popularity and performance",
      stats: [
        { label: "Total Books", value: String(totalBooks) },
        { label: "Published Books", value: String(publishedBooks) },
        { label: "Total Purchases", value: String(purchases) },
      ],
    },
  ];

  function triggerDownload(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleExport(report: typeof reportCards[0], format: ExportFormat) {
    const base = `${report.title}-${filterLabel}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const filename = format === "PDF" ? `${base}.pdf.txt` : `${base}.csv`;
    const content = format === "Excel"
      ? `Report,${report.title}\nPeriod,${filterLabel}\n\nMetric,Value\n${report.stats.map((s) => `${s.label},${s.value}`).join("\n")}`
      : `${report.title}\nPeriod: ${filterLabel}\n\n${report.stats.map((s) => `${s.label}: ${s.value}`).join("\n")}`;

    setExportsList((prev) => [{
      id: `${report.key}-${Date.now()}`,
      title: `${report.title} - ${filterLabel}`,
      subtitle: `Exported as ${format} just now`,
      format, filename, content,
    }, ...prev.slice(0, 4)]);
    setStatusMessage(`${report.title} exported as ${format}.`);
    triggerDownload(filename, content);
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-[2.5rem] font-bold leading-none text-[#173b73]">Reports</h1>
        <p className="mt-2 text-base text-[#4d6691]">Generate and export detailed reports</p>
      </div>

      <section className="rounded-[10px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <h2 className="text-2xl font-bold text-slate-950">Report Filters</h2>
        <div className="mt-6 flex flex-col gap-3 xl:flex-row">
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as ReportFrequency)}
            className="h-12 flex-1 rounded-[8px] border border-[#cfcfcf] bg-white px-4 text-base text-slate-900 outline-none">
            <option>Monthly</option><option>Quarterly</option><option>Yearly</option>
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)}
            className="h-12 flex-1 rounded-[8px] border border-[#cfcfcf] bg-white px-4 text-base text-slate-900 outline-none">
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
          <button type="button" onClick={() => { setActiveFilter({ frequency, year }); setStatusMessage(`Showing reports for ${frequency} ${year}.`); }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#4d98f0] px-6 text-base font-semibold text-white transition hover:bg-[#3789ea]">
            <DownloadIcon /> Apply Filters
          </button>
        </div>
        {statusMessage ? <p className="mt-4 text-sm font-medium text-[#5c7297]">{statusMessage}</p> : null}
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {reportCards.map((report) => (
          <section key={report.key} className="rounded-[10px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
            <div className="flex items-start gap-4">
              <ReportIcon />
              <div>
                <h2 className="text-2xl font-bold text-slate-950">{report.title}</h2>
                <p className="mt-1 text-sm text-slate-400">{report.description}</p>
              </div>
            </div>
            <div className="mt-5 rounded-[8px] bg-[#f7f7f7] p-4">
              <h3 className="text-[1.35rem] font-bold text-slate-950">Quick Stats</h3>
              <div className="mt-4 space-y-1.5 text-sm">
                {report.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">{stat.label}</span>
                    <span className="font-semibold text-slate-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-2">
              <button type="button" onClick={() => handleExport(report, "PDF")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-[#b8b8b8] bg-[#e7e7e7] text-sm font-semibold text-slate-800 transition hover:bg-[#dddddd]">
                <DownloadIcon /> Export PDF
              </button>
              <button type="button" onClick={() => handleExport(report, "Excel")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#4d98f0] text-sm font-semibold text-white transition hover:bg-[#3789ea]">
                <DownloadIcon /> Export Excel
              </button>
            </div>
          </section>
        ))}
      </div>

      {exportsList.length > 0 && (
        <section className="rounded-[10px] border border-[#cfcfcf] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
          <h2 className="text-2xl font-bold text-slate-950">Recent Exports</h2>
          <div className="mt-6 space-y-3">
            {exportsList.map((item) => (
              <article key={item.id} className="flex flex-col gap-3 rounded-[14px] border border-[#d7e5fb] bg-[linear-gradient(145deg,#f8fbff,#eef5ff)] px-4 py-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-white p-2 text-[#4d98f0] shadow-[0_8px_16px_rgba(77,152,240,0.16)]"><DownloadIcon /></div>
                  <div>
                    <p className="text-sm font-semibold text-[#173b73]">{item.title}</p>
                    <p className="mt-1 text-xs text-[#5f769b]">{item.subtitle}</p>
                  </div>
                </div>
                <button type="button" onClick={() => triggerDownload(item.filename, item.content)}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-[#c8dcff] bg-white px-4 py-2 text-sm font-semibold text-[#2456b6] transition hover:bg-[#f6faff] md:self-auto">
                  <DownloadIcon /> Download
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}