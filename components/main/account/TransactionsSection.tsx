"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  getReaderTransactions,
  type ReaderTransactionRecord,
  type ReaderTransactionStatus,
} from "@/src/lib/readerAccountStorage";

const statusFilters: Array<ReaderTransactionStatus | "All"> = ["All", "Pending", "Verified", "Rejected"];

function SummaryCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-[1.7rem] border border-white/80 bg-gradient-to-br ${tone} p-5 shadow-[0_16px_30px_rgba(15,23,42,0.06)]`}>
      <div className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[#8f98a8]">{label}</div>
      <div className="mt-3 text-[2rem] font-semibold tracking-[-0.06em] text-[#202532]">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: ReaderTransactionStatus }) {
  const tone =
    status === "Verified"
      ? "bg-[#dff3da] text-[#3d7d31]"
      : status === "Rejected"
      ? "bg-[#ffe4df] text-[#a44535]"
      : "bg-[#fff2d9] text-[#a26f19]";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}

function formatAmount(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export default function TransactionsSection() {
  const [transactions] = useState<ReaderTransactionRecord[]>(() => getReaderTransactions());
  const [statusFilter, setStatusFilter] = useState<ReaderTransactionStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<ReaderTransactionRecord | null>(null);

  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .filter((transaction) => {
        const matchesStatus = statusFilter === "All" || transaction.status === statusFilter;
        const matchesSearch = transaction.bookTitle.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime());
  }, [search, statusFilter, transactions]);

  const totalSpent = useMemo(
    () => transactions.reduce((sum, transaction) => sum + transaction.amountPaid, 0),
    [transactions]
  );
  const lastPayment = transactions.length ? new Date(transactions[0].purchasedAt).toLocaleDateString() : "-";

  return (
    <>
      <section className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <SummaryCard label="Total spent" value={formatAmount(totalSpent)} tone="from-[#ffffff] via-[#f9fbff] to-[#eef5ff]" />
          <SummaryCard label="Total transactions" value={String(transactions.length)} tone="from-[#ffffff] via-[#fffaf3] to-[#fff0dd]" />
          <SummaryCard label="Last payment date" value={lastPayment} tone="from-[#ffffff] via-[#fbfcff] to-[#f0f4ff]" />
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_22px_42px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 border-b border-[#edf1f6] pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[1.6rem] font-semibold tracking-[-0.05em] text-[#202532]">Transaction history</h2>
              <p className="mt-1 text-sm text-[#758091]">Review every QR payment, verify proof, and track what you have spent on reading.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      statusFilter === status ? "bg-[#202532] text-white" : "border border-[#dbe2ec] text-[#5d6879]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by book title"
                className="h-11 rounded-full border border-[#dbe2ec] bg-white px-4 text-sm text-[#314053] outline-none placeholder:text-[#a0a9b8]"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="rounded-[1.6rem] border border-dashed border-[#d6dde8] bg-[#fbfcff] px-6 py-14 text-center">
                <div className="text-[1.1rem] font-semibold text-[#202532]">No transactions yet</div>
                <div className="mt-2 text-sm text-[#748092]">When a book purchase or rent is confirmed, it will appear here with payment proof.</div>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <article key={transaction.id} className="rounded-[1.7rem] border border-[#ebeff5] bg-white p-5 shadow-[0_14px_26px_rgba(15,23,42,0.05)]">
                  <div className="grid gap-5 xl:grid-cols-[5rem_minmax(0,1fr)_auto] xl:items-center">
                    <div className="relative h-[7.5rem] w-[5rem] overflow-hidden rounded-[0.8rem] border border-black/5 shadow-[0_12px_22px_rgba(15,23,42,0.08)]">
                      <Image src={transaction.bookCover} alt={transaction.bookTitle} fill className="object-cover" sizes="80px" />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <div className="text-[1.1rem] font-semibold text-[#202532]">{transaction.bookTitle}</div>
                        <div className="mt-1 text-sm text-[#758091]">{new Date(transaction.purchasedAt).toLocaleDateString()} • {transaction.method}</div>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#5f6a7b]">
                          <span>Amount paid: <strong>{formatAmount(transaction.amountPaid)}</strong></span>
                          <span>Reference: <strong>{transaction.reference}</strong></span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <StatusPill status={transaction.status} />
                        <div className="text-sm text-[#748092]">Type: <span className="font-semibold text-[#202532] capitalize">{transaction.action}</span></div>
                        <div className="text-sm text-[#748092]">Proof: {transaction.proofImageUrl ? <span className="font-semibold text-[#202532]">{transaction.proofFileName ?? "Uploaded"}</span> : <span className="text-[#a4adba]">No proof uploaded</span>}</div>
                      </div>
                    </div>

                    <div className="flex justify-start xl:justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedTransaction(transaction)}
                        className="rounded-full border border-[#dbe2ec] bg-white px-4 py-2.5 text-sm font-semibold text-[#596476] transition hover:bg-[#fbfcff]"
                      >
                        View Proof
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <div className={`fixed inset-0 z-50 transition-all duration-300 ${selectedTransaction ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <button type="button" aria-label="Close proof modal" onClick={() => setSelectedTransaction(null)} className="absolute inset-0 bg-[#101521]/16 backdrop-blur-[4px]" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className={`relative w-full max-w-2xl rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_28px_50px_rgba(15,23,42,0.2)] transition-all duration-300 ${selectedTransaction ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0"}`}>
            {selectedTransaction ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[#98a1af]">Transaction proof</div>
                    <h3 className="mt-2 text-[1.8rem] font-semibold tracking-[-0.05em] text-[#202532]">{selectedTransaction.bookTitle}</h3>
                    <div className="mt-1 text-sm text-[#748092]">{selectedTransaction.reference}</div>
                  </div>
                  <button type="button" onClick={() => setSelectedTransaction(null)} className="rounded-full border border-[#dbe2ec] px-4 py-2 text-sm font-semibold text-[#596476]">Close</button>
                </div>

                <div className="mt-6 rounded-[1.6rem] border border-[#ebeff5] bg-[#fbfcff] p-5">
                  {selectedTransaction.proofImageUrl ? (
                    <div className="overflow-hidden rounded-[1.3rem] border border-black/5 bg-white shadow-[0_12px_22px_rgba(15,23,42,0.06)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedTransaction.proofImageUrl} alt={selectedTransaction.proofFileName ?? "Payment proof"} className="h-auto w-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-[1.3rem] border border-dashed border-[#d6dde8] bg-white px-6 py-16 text-center text-[#7d8797]">
                      No proof uploaded for this transaction yet.
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
