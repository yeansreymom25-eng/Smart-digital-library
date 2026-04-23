"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { getReaderSettings, saveReaderSettings, type ReaderSettingsData } from "@/src/lib/readerAccountStorage";
import { getSupabaseBrowserSSR } from "@/src/lib/supabaseBrowserSSR";

function ChangeNameCard() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSave() {
    if (!name.trim()) { setErrorMsg("Name cannot be empty."); setStatus("error"); return; }
    setStatus("loading"); setErrorMsg("");
    try {
      const supabase = getSupabaseBrowserSSR();
      if (!supabase) throw new Error("Connection error");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("profiles").update({ full_name: name.trim() }).eq("id", user.id);
      if (error) throw new Error(error.message);
      setStatus("success");
      setTimeout(() => { setOpen(false); setStatus("idle"); setName(""); }, 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-[#e8edf4] bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[1rem] font-semibold text-[#202532]">Change name</div>
          <div className="mt-1 text-sm text-[#728093]">Keep your reader identity current.</div>
        </div>
        {!open && (
          <button type="button" onClick={() => { setOpen(true); setStatus("idle"); setErrorMsg(""); }}
            className="rounded-full border border-[#dbe2ec] px-4 py-2 text-sm font-semibold text-[#596476] transition hover:bg-[#fbfcff]">
            Edit
          </button>
        )}
      </div>
      {open && (
        <div className="mt-4 grid gap-3">
          {status === "success" ? (
            <div className="rounded-[1rem] border border-[#d8f0d1] bg-[#f6fff3] px-4 py-3 text-sm font-medium text-[#3d7f2f]">✅ Name updated successfully!</div>
          ) : (
            <>
              <input type="text" placeholder="New display name" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[1rem] border border-[#e8edf4] bg-white px-4 py-3 text-sm text-[#202532] outline-none placeholder:text-[#b3bcc9] focus:border-[#c5cfde]" />
              {status === "error" && <div className="rounded-[1rem] border border-[#fecaca] bg-[#fff5f5] px-4 py-3 text-sm text-[#991b1b]">{errorMsg}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setOpen(false); setStatus("idle"); setErrorMsg(""); setName(""); }}
                  className="rounded-full border border-[#dbe2ec] bg-white px-5 py-2.5 text-sm font-semibold text-[#596476] transition hover:bg-[#fbfcff]">Cancel</button>
                <button type="button" onClick={() => void handleSave()} disabled={status === "loading" || !name.trim()}
                  className="rounded-full bg-[#202532] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2e3645] disabled:opacity-50">
                  {status === "loading" ? "Saving…" : "Save name"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ChangeEmailCard() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSave() {
    if (!email.trim()) { setErrorMsg("Email cannot be empty."); setStatus("error"); return; }
    setStatus("loading"); setErrorMsg("");
    try {
      const supabase = getSupabaseBrowserSSR();
      if (!supabase) throw new Error("Connection error");
      const { error } = await supabase.auth.updateUser({ email: email.trim() });
      if (error) throw new Error(error.message);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-[#e8edf4] bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[1rem] font-semibold text-[#202532]">Change email</div>
          <div className="mt-1 text-sm text-[#728093]">Update your email for access and notifications.</div>
        </div>
        {!open && (
          <button type="button" onClick={() => { setOpen(true); setStatus("idle"); setErrorMsg(""); }}
            className="rounded-full border border-[#dbe2ec] px-4 py-2 text-sm font-semibold text-[#596476] transition hover:bg-[#fbfcff]">
            Update
          </button>
        )}
      </div>
      {open && (
        <div className="mt-4 grid gap-3">
          {status === "success" ? (
            <div className="rounded-[1rem] border border-[#d8f0d1] bg-[#f6fff3] px-4 py-3 text-sm font-medium text-[#3d7f2f]">
              ✅ Confirmation sent to <strong>{email}</strong>. Check your inbox to confirm the change.
            </div>
          ) : (
            <>
              <input type="email" placeholder="New email address" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[1rem] border border-[#e8edf4] bg-white px-4 py-3 text-sm text-[#202532] outline-none placeholder:text-[#b3bcc9] focus:border-[#c5cfde]" />
              {status === "error" && <div className="rounded-[1rem] border border-[#fecaca] bg-[#fff5f5] px-4 py-3 text-sm text-[#991b1b]">{errorMsg}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setOpen(false); setStatus("idle"); setErrorMsg(""); setEmail(""); }}
                  className="rounded-full border border-[#dbe2ec] bg-white px-5 py-2.5 text-sm font-semibold text-[#596476] transition hover:bg-[#fbfcff]">Cancel</button>
                <button type="button" onClick={() => void handleSave()} disabled={status === "loading" || !email.trim()}
                  className="rounded-full bg-[#202532] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2e3645] disabled:opacity-50">
                  {status === "loading" ? "Sending…" : "Send confirmation"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function PasswordSection() {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const supabase = getSupabaseBrowserSSR();
      if (!supabase) throw new Error("Connection error");
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      setStatus("success");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => { setOpen(false); setStatus("idle"); }, 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-[#e8edf4] bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[1rem] font-semibold text-[#202532]">Change password</div>
          <div className="mt-1 text-sm text-[#728093]">Update your account password.</div>
        </div>
        {!open && (
          <button
            type="button"
            onClick={() => { setOpen(true); setStatus("idle"); setErrorMsg(""); }}
            className="rounded-full bg-[#202532] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2e3645]"
          >
            Change
          </button>
        )}
      </div>

      {open && (
        <div className="mt-4 grid gap-3">
          {status === "success" ? (
            <div className="rounded-[1rem] border border-[#d8f0d1] bg-[#f6fff3] px-4 py-3 text-sm font-medium text-[#3d7f2f]">
              ✅ Password changed successfully!
            </div>
          ) : (
            <>
              <input type="password" placeholder="New password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-[1rem] border border-[#e8edf4] bg-white px-4 py-3 text-sm text-[#202532] outline-none placeholder:text-[#b3bcc9] focus:border-[#c5cfde]" />
              <input type="password" placeholder="Confirm new password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-[1rem] border border-[#e8edf4] bg-white px-4 py-3 text-sm text-[#202532] outline-none placeholder:text-[#b3bcc9] focus:border-[#c5cfde]" />
              {status === "error" && (
                <div className="rounded-[1rem] border border-[#fecaca] bg-[#fff5f5] px-4 py-3 text-sm text-[#991b1b]">{errorMsg}</div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setOpen(false); setStatus("idle"); setErrorMsg(""); }}
                  className="rounded-full border border-[#dbe2ec] bg-white px-5 py-2.5 text-sm font-semibold text-[#596476] transition hover:bg-[#fbfcff]">
                  Cancel
                </button>
                <button type="button" onClick={() => void handleChangePassword()}
                  disabled={status === "loading" || !newPassword || !confirmPassword}
                  className="rounded-full bg-[#202532] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2e3645] disabled:opacity-50">
                  {status === "loading" ? "Saving…" : "Save password"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

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
              <ChangeNameCard />
              <ChangeEmailCard />
              <PasswordSection />
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
