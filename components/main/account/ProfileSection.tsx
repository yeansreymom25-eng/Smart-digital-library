"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReaderProfileData } from "@/src/lib/readerAccountStorage";

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[#ebeff5] bg-white/90 px-4 py-4 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
      <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#97a0af]">{label}</div>
      <div className="mt-2 text-[1rem] font-medium text-[#253041]">{value || "Not added yet"}</div>
    </div>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="rounded-[1.4rem] border border-[#ebeff5] bg-white/90 px-4 py-4 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
      <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#97a0af]">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full bg-transparent text-[1rem] font-medium text-[#253041] outline-none placeholder:text-[#b3bcc9]"
      />
    </label>
  );
}

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function ProfileSection({ initialProfile, userId }: { initialProfile: ReaderProfileData; userId: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState<ReaderProfileData>(initialProfile);
  const [draft, setDraft] = useState<ReaderProfileData>(initialProfile);
  const [editing, setEditing] = useState(false);

  const initials = useMemo(() => {
    return profile.fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile.fullName]);

  async function handleAvatarChange(file: File | undefined) {
    if (!file) {
      return;
    }

    const avatarDataUrl = await fileToDataUrl(file);
    setDraft((current) => ({ ...current, avatarDataUrl }));
  }

  async function handleSave() {
    try {
      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: draft.fullName,
          avatarDataUrl: draft.avatarDataUrl,
          phone: draft.phone,
          gender: draft.gender,
          dateOfBirth: draft.dateOfBirth,
          country: draft.country,
          bio: draft.bio,
        }),
      });
      setProfile(draft);
      setEditing(false);
      router.refresh();
    } catch {
      setProfile(draft);
      setEditing(false);
    }
  }

  function handleCancel() {
    setDraft(profile);
    setEditing(false);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <aside className="rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_22px_42px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[#e6ebf2] bg-[linear-gradient(135deg,#f1f5ff_0%,#ffffff_45%,#edf6ff_100%)] text-[2rem] font-semibold text-[#445066] shadow-[0_18px_34px_rgba(15,23,42,0.08)]">
            {draft.avatarDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.avatarDataUrl} alt={draft.fullName} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>

          <div className="mt-5 text-[1.45rem] font-semibold tracking-[-0.04em] text-[#202532]">{profile.fullName}</div>
          <p className="mt-1 text-sm text-[#738093]">{profile.email}</p>

          <label className="mt-5 inline-flex cursor-pointer rounded-full border border-[#dbe2ec] bg-white px-4 py-2.5 text-sm font-semibold text-[#465367] transition hover:border-[#cbd5e2] hover:bg-[#fbfcff]">
            Change photo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => void handleAvatarChange(e.target.files?.[0])} />
          </label>
        </div>
      </aside>

      <div className="rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_22px_42px_rgba(15,23,42,0.08)] sm:p-7">
        <div className="flex flex-col gap-4 border-b border-[#edf1f6] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[1.6rem] font-semibold tracking-[-0.05em] text-[#202532]">Profile details</h2>
          </div>

          {editing ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full border border-[#dbe2ec] bg-white px-5 py-2.5 text-sm font-semibold text-[#596476] transition hover:bg-[#fbfcff]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-[#202532] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(32,37,50,0.16)] transition hover:bg-[#2e3645]"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-full bg-[#202532] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(32,37,50,0.16)] transition hover:bg-[#2e3645]"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {editing ? (
            <>
              <ProfileInput label="Full name" value={draft.fullName} onChange={(value) => setDraft((current) => ({ ...current, fullName: value }))} />
              <ProfileInput label="Email" value={draft.email} onChange={(value) => setDraft((current) => ({ ...current, email: value }))} type="email" />
              <ProfileInput label="Phone number" value={draft.phone} onChange={(value) => setDraft((current) => ({ ...current, phone: value }))} />
              <ProfileInput label="Gender" value={draft.gender} onChange={(value) => setDraft((current) => ({ ...current, gender: value }))} />
              <ProfileInput label="Date of birth" value={draft.dateOfBirth} onChange={(value) => setDraft((current) => ({ ...current, dateOfBirth: value }))} type="date" />
              <ProfileInput label="Country / location" value={draft.country} onChange={(value) => setDraft((current) => ({ ...current, country: value }))} />
              <label className="md:col-span-2 rounded-[1.4rem] border border-[#ebeff5] bg-white/90 px-4 py-4 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
                <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#97a0af]">Reading preference / bio</div>
                <textarea
                  value={draft.bio}
                  onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
                  rows={5}
                  className="mt-2 w-full resize-none bg-transparent text-[1rem] leading-7 text-[#253041] outline-none"
                />
              </label>
            </>
          ) : (
            <>
              <ProfileRow label="Full name" value={profile.fullName} />
              <ProfileRow label="Email" value={profile.email} />
              <ProfileRow label="Phone number" value={profile.phone} />
              <ProfileRow label="Gender" value={profile.gender} />
              <ProfileRow label="Date of birth" value={profile.dateOfBirth} />
              <ProfileRow label="Country / location" value={profile.country} />
              <div className="rounded-[1.4rem] border border-[#ebeff5] bg-white/90 px-4 py-4 shadow-[0_10px_20px_rgba(15,23,42,0.04)] md:col-span-2">
                <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#97a0af]">Password</div>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[1rem] font-medium text-[#253041]">{profile.passwordLabel}</div>
                  <button type="button" className="rounded-full border border-[#dbe2ec] bg-white px-4 py-2 text-sm font-semibold text-[#596476] transition hover:bg-[#fbfcff]">
                    Change password
                  </button>
                </div>
              </div>
              <div className="rounded-[1.4rem] border border-[#ebeff5] bg-white/90 px-4 py-4 shadow-[0_10px_20px_rgba(15,23,42,0.04)] md:col-span-2">
                <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#97a0af]">Reading preference / bio</div>
                <p className="mt-2 text-[1rem] leading-7 text-[#677282]">{profile.bio || "No reading preference added yet."}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}