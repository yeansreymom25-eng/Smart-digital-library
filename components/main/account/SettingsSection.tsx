"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { getReaderSettings, saveReaderSettings, type ReaderSettingsData } from "@/src/lib/readerAccountStorage";

type SettingsTab = "account" | "appearance" | "notification" | "privacy" | "reading" | "language" | "payments";

const tabs: Array<{ key: SettingsTab; label: string }> = [
  { key: "account", label: "Account" },
  { key: "appearance", label: "Appearance" },
  { key: "notification", label: "Notification" },
  { key: "privacy", label: "Privacy & Security" },
  { key: "reading", label: "Reading Preferences" },
  { key: "language", label: "Language" },
  { key: "payments", label: "Payment Methods" },
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

  const previewTheme = useMemo(() => {
    if (settings.readerTheme === "night") {
      return "from-[#111827] via-[#20293b] to-[#2b3c5a]";
    }
    if (settings.readerTheme === "mist") {
      return "from-[#edf4ff] via-[#f5f8fc] to-[#dde8ff]";
    }
    return "from-[#fff6e7] via-[#fffef9] to-[#f2ead8]";
  }, [settings.readerTheme]);

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

        <div className="space-y-4 transition-all duration-300">
          {activeTab === "account" ? (
            <>
              <SettingCard title="Change name" body="Keep your reader identity current across your account." action={<button type="button" className="rounded-full border border-[#dbe2ec] px-4 py-2 text-sm font-semibold text-[#596476]">Edit</button>} />
              <SettingCard title="Change email" body="Update the email used for reading access and notifications." action={<button type="button" className="rounded-full border border-[#dbe2ec] px-4 py-2 text-sm font-semibold text-[#596476]">Update</button>} />
              <SettingCard title="Change password" body="Refresh your password for extra peace of mind." action={<button type="button" className="rounded-full bg-[#202532] px-4 py-2 text-sm font-semibold text-white">Secure account</button>} />
            </>
          ) : null}

          {activeTab === "appearance" ? (
            <>
              <SettingCard
                title="Appearance mode"
                body="Choose how Smart Digital Library looks across your devices."
                action={
                  <div className="flex gap-2">
                    {(["light", "dark", "system"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => patchSettings({ appearance: mode })}
                        className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                          settings.appearance === mode ? "bg-[#202532] text-white" : "border border-[#dbe2ec] text-[#596476]"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                }
              />
              <SettingCard
                title="Reader theme preview"
                body="A quick preview of your reading atmosphere."
                action={
                  <div className={`h-24 w-40 rounded-[1.25rem] bg-gradient-to-br ${previewTheme} p-3 text-xs font-semibold text-[#556072] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]`}>
                    <div className="rounded-xl bg-white/70 px-3 py-2 backdrop-blur">Chapter preview</div>
                  </div>
                }
              />
            </>
          ) : null}

          {activeTab === "notification" ? (
            <>
              <SettingCard title="Email notifications" body="Receive updates about account activity and reader news." action={<Toggle checked={settings.emailNotifications} onChange={(value) => patchSettings({ emailNotifications: value })} />} />
              <SettingCard title="Purchase confirmation" body="Get confirmation after each verified purchase or rental." action={<Toggle checked={settings.purchaseConfirmation} onChange={(value) => patchSettings({ purchaseConfirmation: value })} />} />
              <SettingCard title="New book alerts" body="Be notified when new books arrive in your favorite categories." action={<Toggle checked={settings.newBookAlerts} onChange={(value) => patchSettings({ newBookAlerts: value })} />} />
            </>
          ) : null}

          {activeTab === "privacy" ? (
            <>
              <SettingCard title="Change password" body="Keep your account protected with a strong password refresh." action={<button type="button" className="rounded-full bg-[#202532] px-4 py-2 text-sm font-semibold text-white">Update password</button>} />
              <div className="rounded-[1.5rem] border border-[#e8edf4] bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                <div className="text-[1rem] font-semibold text-[#202532]">Session / device list</div>
                <div className="mt-4 space-y-3">
                  {settings.sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between rounded-[1.15rem] bg-[#f8fafc] px-4 py-3">
                      <div>
                        <div className="text-sm font-semibold text-[#243041]">{session.device}</div>
                        <div className="text-xs text-[#7b8698]">{session.location} • {session.lastActive}</div>
                      </div>
                      {session.current ? <span className="rounded-full bg-[#dff3da] px-3 py-1 text-xs font-semibold text-[#3f7c32]">Current</span> : null}
                    </div>
                  ))}
                </div>
                <button type="button" className="mt-4 rounded-full border border-[#dbe2ec] px-4 py-2 text-sm font-semibold text-[#596476]">Logout from all devices</button>
              </div>
            </>
          ) : null}

          {activeTab === "reading" ? (
            <>
              <SettingCard
                title="Default reading mode"
                body="Choose how pages open by default."
                action={
                  <div className="flex gap-2">
                    {(["scroll", "paged"] as const).map((mode) => (
                      <button key={mode} type="button" onClick={() => patchSettings({ readingMode: mode })} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${settings.readingMode === mode ? "bg-[#202532] text-white" : "border border-[#dbe2ec] text-[#596476]"}`}>{mode}</button>
                    ))}
                  </div>
                }
              />
              <SettingCard title="Font size" body="Adjust comfort for long reading sessions." action={<div className="flex gap-2">{(["small", "medium", "large"] as const).map((value) => <button key={value} type="button" onClick={() => patchSettings({ fontSize: value })} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${settings.fontSize === value ? "bg-[#202532] text-white" : "border border-[#dbe2ec] text-[#596476]"}`}>{value}</button>)}</div>} />
              <SettingCard title="Line spacing" body="Control how airy the reading text feels." action={<div className="flex gap-2">{(["compact", "comfortable", "relaxed"] as const).map((value) => <button key={value} type="button" onClick={() => patchSettings({ lineSpacing: value })} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${settings.lineSpacing === value ? "bg-[#202532] text-white" : "border border-[#dbe2ec] text-[#596476]"}`}>{value}</button>)}</div>} />
              <SettingCard title="Page transition style" body="Select how the reader changes pages." action={<div className="flex gap-2">{(["slide", "fade", "curl"] as const).map((value) => <button key={value} type="button" onClick={() => patchSettings({ pageTransition: value })} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${settings.pageTransition === value ? "bg-[#202532] text-white" : "border border-[#dbe2ec] text-[#596476]"}`}>{value}</button>)}</div>} />
            </>
          ) : null}

          {activeTab === "language" ? (
            <SettingCard
              title="App language"
              body="Choose the language used by the reader interface."
              action={
                <select
                  value={settings.language}
                  onChange={(event) => patchSettings({ language: event.target.value })}
                  className="rounded-full border border-[#dbe2ec] bg-white px-4 py-2 text-sm font-semibold text-[#596476] outline-none"
                >
                  <option>English</option>
                  <option>Khmer</option>
                </select>
              }
            />
          ) : null}

          {activeTab === "payments" ? (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                {settings.paymentMethods.map((method) => (
                  <div key={method.id} className="rounded-[1.5rem] border border-[#e8edf4] bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
                    <div className="text-[1rem] font-semibold text-[#202532]">{method.label}</div>
                    <div className="mt-1 text-sm leading-6 text-[#728093]">{method.detail}</div>
                    <button type="button" className="mt-4 rounded-full border border-[#dbe2ec] px-4 py-2 text-sm font-semibold text-[#596476]">Remove</button>
                  </div>
                ))}
              </div>
              <SettingCard title="Add payment method" body="Prepare another payment option for future purchases." action={<button type="button" className="rounded-full bg-[#202532] px-4 py-2 text-sm font-semibold text-white">Add method</button>} />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
