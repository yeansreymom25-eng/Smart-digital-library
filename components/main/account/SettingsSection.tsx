"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { getReaderSettings, saveReaderSettings, type ReaderSettingsData } from "@/src/lib/readerAccountStorage";

type SettingsTab = "account" | "notification";

const tabs: Array<{ key: SettingsTab; label: string }> = [
  { key: "account", label: "Account" },
  { key: "notification", label: "Notification" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex h-8 w-14 items-center rounded-full px-1 transition ${checked ? "bg-[#202532]" : "bg-[#d8dee8]"}`}
    >
      <span className={`h-6 w-6 rounded-full bg-white shadow transition ${checked ? "translate-x-6" : "translate-x-0"}`} />
    </button>
  );
}

function SettingCard({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-[#e8edf4] bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[1rem] font-semibold text-[#202532]">{title}</div>
          <div className="mt-1 text-sm leading-6 text-[#728093]">{body}</div>
        </div>
        {action}
      </div>
    </div>
  );
}

export default function SettingsSection() {
  const [settings, setSettings] = useState<ReaderSettingsData>(() => getReaderSettings());
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  function patchSettings(patch: Partial<ReaderSettingsData>) {
    setSettings((current) => {
      const next = { ...current, ...patch };
      saveReaderSettings(next);
      return next;
    });
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="rounded-[2rem] border border-white/80 bg-white/92 p-4 shadow-[0_22px_42px_rgba(15,23,42,0.08)]">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex w-full items-center justify-between rounded-[1.25rem] px-4 py-3.5 text-left text-sm font-semibold transition ${
                  active
                    ? "bg-[#202532] text-white shadow-[0_14px_24px_rgba(32,37,50,0.16)]"
                    : "text-[#697688] hover:bg-[#f7f9fc] hover:text-[#202532]"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs ${active ? "text-white/80" : "text-[#a1aab8]"}`}>›</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_22px_42px_rgba(15,23,42,0.08)] sm:p-7">
        <div className="mb-6 border-b border-[#edf1f6] pb-5">
          <h2 className="text-[1.6rem] font-semibold tracking-[-0.05em] text-[#202532]">{tabs.find((tab) => tab.key === activeTab)?.label}</h2>
          <p className="mt-1 text-sm text-[#758091]">Modern, polished controls inspired by premium reader settings.</p>
        </div>

        <div className="space-y-4">
          {activeTab === "account" ? (
            <>
              <SettingCard title="Change name" body="Keep your reader identity current." action={<button type="button" className="rounded-full border border-[#dbe2ec] px-4 py-2 text-sm font-semibold text-[#596476]">Edit</button>} />
              <SettingCard title="Change email" body="Update your email for access and notifications." action={<button type="button" className="rounded-full border border-[#dbe2ec] px-4 py-2 text-sm font-semibold text-[#596476]">Update</button>} />
              <SettingCard title="Change password" body="Refresh your password for extra security." action={<button type="button" className="rounded-full bg-[#202532] px-4 py-2 text-sm font-semibold text-white">Secure account</button>} />
            </>
          ) : null}

          {activeTab === "notification" ? (
            <>
              <SettingCard title="Email notifications" body="Receive updates about account activity." action={<Toggle checked={settings.emailNotifications} onChange={(value) => patchSettings({ emailNotifications: value })} />} />
              <SettingCard title="Purchase confirmation" body="Get confirmation after each purchase or rental." action={<Toggle checked={settings.purchaseConfirmation} onChange={(value) => patchSettings({ purchaseConfirmation: value })} />} />
              <SettingCard title="New book alerts" body="Be notified when new books arrive." action={<Toggle checked={settings.newBookAlerts} onChange={(value) => patchSettings({ newBookAlerts: value })} />} />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
