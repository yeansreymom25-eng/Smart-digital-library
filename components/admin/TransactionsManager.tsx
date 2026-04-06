"use client";

import { useMemo, useState } from "react";
import {
  readAdminTransactions,
  updateAdminTransactionStatus,
  type AdminTransaction,
} from "@/src/lib/adminTransactions";
import { updateAdminPlanReviewStatus } from "@/src/lib/adminSubscription";

function SummaryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 text-slate-500"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function ApproveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="h-4 w-4 text-[#2ec84d]"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function RejectIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="h-4 w-4 text-[#ff4d4f]"
      aria-hidden="true"
    >
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

function StatusBadge({
  status,
}: {
  status: AdminTransaction["status"];
}) {
  const className =
    status === "Approved"
      ? "bg-[#2ec84d] text-white"
      : status === "Rejected"
        ? "bg-[#ffe4e4] text-[#c93d3d]"
        : "bg-[#e2a01b] text-white";

  return (
    <span
      className={`inline-flex min-w-[88px] justify-center rounded-[4px] px-3 py-1 text-sm font-semibold ${className}`}
    >
      {status}
    </span>
  );
}

export default function TransactionsManager() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>(() =>
    readAdminTransactions()
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<AdminTransaction | null>(null);

  const totalTransactions = transactions.length;
  const approvedTransactions = transactions.filter(
    (item) => item.status === "Approved"
  ).length;
  const rejectedTransactions = transactions.filter(
    (item) => item.status === "Rejected"
  ).length;

  const pendingTransactions = useMemo(
    () => transactions.filter((item) => item.status === "Pending"),
    [transactions]
  );

  function handleStatusChange(
    transaction: AdminTransaction,
    status: AdminTransaction["status"]
  ) {
    const nextTransactions = updateAdminTransactionStatus(transaction.id, status);

    if (transaction.type === "Subscription") {
      updateAdminPlanReviewStatus(status === "Approved" ? "active" : "rejected");
    }

    setTransactions(nextTransactions);
    setSelectedTransaction(
      nextTransactions.find((item) => item.id === transaction.id) ?? null
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-[2.5rem] font-bold leading-none text-[#173b73]">
          Transactions
        </h1>
        <p className="mt-2 text-base text-[#4d6691]">
          Verify and manage all payments
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[8px] bg-[#4d98f0] p-4 text-white shadow-[0_8px_20px_rgba(77,152,240,0.18)]">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium text-[#eaf3ff]">
              Total Transactions
            </p>
            <SummaryIcon />
          </div>
          <p className="mt-8 text-5xl font-bold leading-none">
            {totalTransactions}
          </p>
        </article>

        <article className="rounded-[8px] bg-[#4d98f0] p-4 text-white shadow-[0_8px_20px_rgba(77,152,240,0.18)]">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium text-[#eaf3ff]">Approved</p>
            <SummaryIcon />
          </div>
          <p className="mt-8 text-5xl font-bold leading-none">
            {approvedTransactions}
          </p>
        </article>

        <article className="rounded-[8px] bg-[#4d98f0] p-4 text-white shadow-[0_8px_20px_rgba(77,152,240,0.18)]">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium text-[#eaf3ff]">Rejected</p>
            <SummaryIcon />
          </div>
          <p className="mt-8 text-5xl font-bold leading-none">
            {rejectedTransactions}
          </p>
        </article>
      </section>

      <section className="rounded-[10px] border border-[#cfcfcf] bg-white px-6 py-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <h2 className="text-2xl font-bold text-slate-950">All Transactions</h2>
      </section>

      <section className="overflow-hidden rounded-[10px] border border-[#cfcfcf] bg-white shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-base text-[#2456b6]">
                <th className="px-6 py-5 font-medium">User</th>
                <th className="px-4 py-5 font-medium">Book</th>
                <th className="px-4 py-5 font-medium">Type</th>
                <th className="px-4 py-5 font-medium">Amount</th>
                <th className="px-4 py-5 font-medium">Date</th>
                <th className="px-4 py-5 font-medium">Status</th>
                <th className="px-4 py-5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="text-[1.05rem] text-slate-900">
                  <td className="border-t border-[#cfcfcf] px-6 py-6">
                    {transaction.user}
                  </td>
                  <td className="border-t border-[#cfcfcf] px-4 py-6">
                    {transaction.book}
                  </td>
                  <td className="border-t border-[#cfcfcf] px-4 py-6">
                    {transaction.type}
                  </td>
                  <td className="border-t border-[#cfcfcf] px-4 py-6">
                    {transaction.amount}
                  </td>
                  <td className="border-t border-[#cfcfcf] px-4 py-6">
                    {transaction.date}
                  </td>
                  <td className="border-t border-[#cfcfcf] px-4 py-6">
                    <StatusBadge status={transaction.status} />
                  </td>
                  <td className="border-t border-[#cfcfcf] px-4 py-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedTransaction(transaction)}
                        className="rounded-lg border border-[#d9e7fb] bg-[#f7fbff] p-2 transition hover:bg-[#edf5ff]"
                        aria-label={`View ${transaction.user} transaction`}
                      >
                        <EyeIcon />
                      </button>
                      {transaction.status === "Pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(transaction, "Approved")
                            }
                            className="rounded-lg border border-[#bde8c6] bg-[#f3fff6] p-2 transition hover:bg-[#e7ffec]"
                            aria-label={`Approve ${transaction.user} transaction`}
                          >
                            <ApproveIcon />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(transaction, "Rejected")
                            }
                            className="rounded-lg border border-[#f3c1c1] bg-[#fff7f7] p-2 transition hover:bg-[#ffefef]"
                            aria-label={`Reject ${transaction.user} transaction`}
                          >
                            <RejectIcon />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedTransaction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-[22px] border border-[#d9e7fb] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.24)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
                  Transaction Details
                </p>
                <h2 className="mt-3 text-2xl font-bold text-[#173b73]">
                  {selectedTransaction.user}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5c7297]">
                  Review payment information and verification status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef5ff] text-lg font-semibold text-[#1e3a6d] transition hover:bg-[#dce9ff]"
                aria-label="Close transaction details"
              >
                x
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
                  User
                </p>
                <p className="mt-3 text-base font-semibold text-[#1e3a6d]">
                  {selectedTransaction.user}
                </p>
              </div>
              <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
                  Book
                </p>
                <p className="mt-3 text-base font-semibold text-[#1e3a6d]">
                  {selectedTransaction.book}
                </p>
              </div>
              <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
                  Type
                </p>
                <p className="mt-3 text-base font-semibold text-[#1e3a6d]">
                  {selectedTransaction.type}
                </p>
              </div>
              <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
                  Amount
                </p>
                <p className="mt-3 text-base font-semibold text-[#1e3a6d]">
                  {selectedTransaction.amount}
                </p>
              </div>
              <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
                  Date
                </p>
                <p className="mt-3 text-base font-semibold text-[#1e3a6d]">
                  {selectedTransaction.date}
                </p>
              </div>
              <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
                  Status
                </p>
                <div className="mt-3">
                  <StatusBadge status={selectedTransaction.status} />
                </div>
              </div>
              <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-4 lg:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
                  Proof Reference
                </p>
                <p className="mt-3 text-base font-semibold text-[#1e3a6d]">
                  {selectedTransaction.proofReference}
                </p>
              </div>
            </div>

            {selectedTransaction.status === "Pending" ? (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(selectedTransaction, "Rejected")
                  }
                  className="rounded-xl border border-[#f3c1c1] bg-[#fff7f7] px-5 py-2.5 text-sm font-semibold text-[#c93d3d] transition hover:bg-[#ffefef]"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(selectedTransaction, "Approved")
                  }
                  className="rounded-xl bg-[#2ec84d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#26b543]"
                >
                  Approve
                </button>
              </div>
            ) : (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedTransaction(null)}
                  className="rounded-xl bg-[#4d98f0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3789ea]"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {!transactions.length ? (
        <section className="rounded-[10px] border border-dashed border-[#cfcfcf] bg-white px-6 py-10 text-center shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
          <p className="text-lg font-semibold text-[#1e3a6d]">
            No transactions found
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Payment records will appear here when users rent or buy books.
          </p>
        </section>
      ) : null}

      {!pendingTransactions.length && transactions.length ? (
        <section className="rounded-[10px] border border-[#d8e6fb] bg-[#f8fbff] px-6 py-4 text-sm text-[#5c7297] shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
          All pending payments have been reviewed.
        </section>
      ) : null}
    </section>
  );
}
