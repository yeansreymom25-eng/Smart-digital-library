"use client";

import Link from "next/link";
import { useState } from "react";

const countryOptions = ["United States", "Cambodia", "Canada", "United Kingdom", "Australia"];

export default function AdminEditProfileForm() {
  const [fullName, setFullName] = useState("Alexa Rawles");
  const [nickName, setNickName] = useState("Alexa");
  const [email, setEmail] = useState("alexarawles@gmail.com");
  const [phone, setPhone] = useState("+1 555 010 234");
  const [gender, setGender] = useState("Female");
  const [country, setCountry] = useState("United States");
  const [bio, setBio] = useState("Library owner focused on digital catalog growth and reader engagement.");
  const [isSaved, setIsSaved] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaved(true);
  }

  return (
    <section className="rounded-[14px] border border-[#d9d9d9] bg-white shadow-[0_10px_30px_rgba(120,140,170,0.08)]">
      <div className="flex flex-col gap-4 border-b border-[#ececec] px-5 py-5 lg:flex-row lg:items-start lg:justify-between lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#648ab6]">Profile</p>
          <h1 className="mt-2 text-[2.5rem] font-bold leading-none text-[#173b73]">Edit Profile</h1>
          <p className="mt-2 text-base text-[#4d6691]">Update your account details, contact info, and preferences.</p>
        </div>

        <Link
          href="/library-owner/profile"
          className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back to Profile
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="px-5 py-5 lg:px-6 lg:py-6">
        <div className="rounded-[12px] bg-[linear-gradient(90deg,rgba(177,214,255,0.95)_0%,rgba(245,241,238,0.95)_55%,rgba(255,243,189,0.95)_100%)] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(145deg,#1f2937,#f1c7b5)] text-2xl font-bold text-white shadow-[0_12px_25px_rgba(148,163,184,0.22)]">
              AR
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-950">Profile Photo</h2>
              <p className="mt-1 text-sm text-slate-600">Upload a new image or keep the current avatar for your admin workspace.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-[10px] bg-white px-5 py-3 text-sm font-medium text-[#4b82f9] shadow-[0_8px_22px_rgba(75,130,249,0.12)] transition hover:bg-[#f8fbff]">
              Change Photo
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="mb-3 block text-sm font-medium text-slate-700">Full Name</span>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="h-[52px] w-full rounded-[10px] border border-[#dfe7f2] bg-white px-4 text-sm text-slate-700 outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-medium text-slate-700">Nick Name</span>
            <input
              type="text"
              value={nickName}
              onChange={(event) => setNickName(event.target.value)}
              className="h-[52px] w-full rounded-[10px] border border-[#dfe7f2] bg-white px-4 text-sm text-slate-700 outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-medium text-slate-700">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-[52px] w-full rounded-[10px] border border-[#dfe7f2] bg-white px-4 text-sm text-slate-700 outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-medium text-slate-700">Phone Number</span>
            <input
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-[52px] w-full rounded-[10px] border border-[#dfe7f2] bg-white px-4 text-sm text-slate-700 outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-medium text-slate-700">Gender</span>
            <select
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              className="h-[52px] w-full rounded-[10px] border border-[#dfe7f2] bg-white px-4 text-sm text-slate-700 outline-none"
            >
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-medium text-slate-700">Country</span>
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="h-[52px] w-full rounded-[10px] border border-[#dfe7f2] bg-white px-4 text-sm text-slate-700 outline-none"
            >
              {countryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-3 block text-sm font-medium text-slate-700">Bio</span>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={5}
              className="w-full rounded-[10px] border border-[#dfe7f2] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            />
          </label>
        </div>

        {isSaved ? (
          <div className="mt-6 rounded-[10px] border border-[#b8e3c2] bg-[#edf9f0] px-4 py-3 text-sm font-medium text-[#2f7d42]">
            Profile changes saved successfully.
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/library-owner/profile"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#4b82f9] px-6 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(75,130,249,0.24)] transition hover:bg-[#3d74ea]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}
