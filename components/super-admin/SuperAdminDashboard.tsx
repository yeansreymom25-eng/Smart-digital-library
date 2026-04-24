"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/src/hooks/useLogout";

type LibraryOwner = {
  id: string;
  name: string;
  email: string;
  plan: string | null;
  status: string;
  proofUrl: string;
  submittedAt: string;
};

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "active" ? "bg-[#2ec84d]" :
    status === "pending" ? "bg-[#e6a41c]" :
    status === "rejected" ? "bg-red-500" :
    "bg-slate-400";
  return (
    <span className={`inline-flex min-w-[100px] justify-center rounded-[4px] px-3 py-1 text-xs font-medium capitalize text-white ${color}`}>
      {status === "not_selected" ? "No Plan" : status}
    </span>
  );
}

export default function SuperAdminDashboard({ libraryOwners }: { libraryOwners: LibraryOwner[] }) {
  const router = useRouter();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const [owners, setOwners] = useState(libraryOwners);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const totalOwners = owners.length;
  const activeOwners = owners.filter((o) => o.status === "active").length;
  const pendingOwners = owners.filter((o) => o.status === "pending").length;

  async function handleAction(ownerId: string, action: "approve" | "reject") {
    setIsProcessing(ownerId);
    try {
      const res = await fetch("/api/super-admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: ownerId, action }),
      });

      if (res.ok) {
        setOwners((prev) =>
          prev.map((o) =>
            o.id === ownerId
              ? { ...o, status: action === "approve" ? "active" : "rejected" }
              : o
          )
        );
        router.refresh();
      }
    } finally {
      setIsProcessing(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7fc] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[2rem] font-bold text-[#173b73]">Super Admin Panel</h1>
          <p className="mt-1 text-sm text-[#4d6691]">Manage library owner subscriptions</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          disabled={isLoggingOut}
          className="flex items-center gap-2 rounded-[8px] border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Library Owners", value: totalOwners },
          { label: "Active Subscriptions", value: activeOwners },
          { label: "Pending Approval", value: pendingOwners },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[10px] bg-[#4d98f0] px-5 py-4 text-white shadow-[0_10px_20px_rgba(77,152,240,0.14)]">
            <p className="text-sm text-white/90">{stat.label}</p>
            <p className="mt-2 text-4xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[10px] border border-[#cfcfcf] bg-white shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <div className="border-b border-[#cfcfcf] px-6 py-4">
          <h2 className="text-lg font-bold text-slate-950">Library Owners</h2>
        </div>
        <div className="overflow-x-auto">
          {owners.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-400">No library owners yet.</p>
          ) : (
            <table className="w-full min-w-[860px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-sm text-[#2456b6]">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-4 py-4 font-medium">Email</th>
                  <th className="px-4 py-4 font-medium">Plan</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Submitted</th>
                  <th className="px-4 py-4 font-medium">Proof</th>
                  <th className="px-4 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((owner) => (
                  <tr key={owner.id} className="text-sm text-slate-900">
                    <td className="border-t border-[#cfcfcf] px-6 py-4 font-medium">{owner.name}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-4 text-slate-500">{owner.email}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-4">{owner.plan ?? "—"}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-4">
                      <StatusBadge status={owner.status} />
                    </td>
                    <td className="border-t border-[#cfcfcf] px-4 py-4 text-slate-500">{owner.submittedAt}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-4">
                      {owner.proofUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewUrl(owner.proofUrl)}
                          className="text-[#4d98f0] underline text-xs hover:text-[#3789ea]"
                        >
                          View Proof
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">No proof</span>
                      )}
                    </td>
                    <td className="border-t border-[#cfcfcf] px-4 py-4">
                      {owner.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void handleAction(owner.id, "approve")}
                            disabled={isProcessing === owner.id}
                            className="rounded-[4px] bg-[#2ec84d] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#25b040] disabled:opacity-50"
                          >
                            {isProcessing === owner.id ? "..." : "Approve"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleAction(owner.id, "reject")}
                            disabled={isProcessing === owner.id}
                            className="rounded-[4px] bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                          >
                            {isProcessing === owner.id ? "..." : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 capitalize">{owner.status === "active" ? "✅ Approved" : owner.status === "rejected" ? "❌ Rejected" : "—"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Proof preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg rounded-[20px] bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.24)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-950">Payment Proof</h2>
              <button type="button" onClick={() => setPreviewUrl(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
                ✕
              </button>
            </div>
            <img src={previewUrl} alt="Payment proof" className="w-full rounded-[10px] object-contain max-h-[500px]" />
          </div>
        </div>
      )}
    </div>
  );
}