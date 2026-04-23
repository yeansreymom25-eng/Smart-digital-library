"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string;
};

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="4" y="6" width="16" height="12" rx="2.5" /><path d="m5 8 7 5 7-5" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function AdminProfileSettings({ fullName, email, role, avatarUrl }: Props) {
  const [name, setName] = useState(fullName);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const initials = fullName
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AD";

  async function handleSave() {
    setIsSaving(true);
    try {
      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silently fail
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-[14px] border border-[#d9d9d9] bg-white shadow-[0_10px_30px_rgba(120,140,170,0.08)]">
      <div className="flex flex-col gap-4 border-b border-[#ececec] px-5 py-5 lg:flex-row lg:items-start lg:justify-between lg:px-6">
        <div>
          <h1 className="text-[2.5rem] font-bold leading-none text-[#173b73]">Library Owner Profile</h1>
          <p className="mt-2 text-base text-[#4d6691]">Manage your admin account settings</p>
        </div>
      </div>

      <div className="px-5 py-5 lg:px-6 lg:py-6">
        <div className="h-24 rounded-[10px] bg-[linear-gradient(90deg,rgba(177,214,255,0.95)_0%,rgba(245,241,238,0.95)_55%,rgba(255,243,189,0.95)_100%)]" />

        <div className="mt-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[linear-gradient(145deg,#1f2937,#f1c7b5)] text-2xl font-bold text-white shadow-[0_12px_25px_rgba(148,163,184,0.22)]">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="h-full w-full rounded-full object-cover" />
              ) : initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-950">{fullName || "Admin"}</h2>
                <span className="rounded-full bg-[#d93eb2] px-3 py-1 text-xs font-semibold text-white capitalize">{role}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{email}</p>
            </div>
          </div>

          <button type="button" onClick={() => void handleSave()} disabled={isSaving}
            className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#4b82f9] px-7 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(75,130,249,0.24)] transition hover:bg-[#3d74ea] disabled:opacity-50">
            {isSaving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="mb-3 block text-sm font-medium text-slate-700">Full Name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="h-[52px] w-full rounded-[10px] border border-[#f0f0f0] bg-[#fafafa] px-4 text-sm text-slate-700 outline-none focus:border-[#4b82f9]" />
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-medium text-slate-700">Role</span>
            <span className="flex h-[52px] items-center justify-between rounded-[10px] border border-[#f0f0f0] bg-[#fafafa] px-4 text-sm text-slate-400 capitalize">
              <span>{role}</span>
              <ChevronDownIcon />
            </span>
          </label>
        </div>

        <div className="mt-8">
          <h3 className="text-base font-semibold text-slate-950">Email Address</h3>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6f0ff] text-[#4b82f9]">
              <MailIcon />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">{email}</p>
              <p className="mt-1 text-sm text-slate-400">Admin account</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}