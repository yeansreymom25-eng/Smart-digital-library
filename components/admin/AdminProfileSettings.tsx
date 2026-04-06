import Link from "next/link";

const profileFields = [
  {
    label: "Full Name",
    type: "text",
    placeholder: "Alexa Rawles",
  },
  {
    label: "Nick Name",
    type: "text",
    placeholder: "Alexa",
  },
  {
    label: "Gender",
    type: "select",
    placeholder: "Female",
  },
  {
    label: "Country",
    type: "select",
    placeholder: "United States",
  },
] as const;

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M6.5 16.5h11l-1.2-1.8a3.5 3.5 0 0 1-.6-2V10a3.7 3.7 0 1 0-7.4 0v2.7a3.5 3.5 0 0 1-.6 2l-1.2 1.8Z" />
      <path d="M10 18.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="4" y="6" width="16" height="12" rx="2.5" />
      <path d="m5 8 7 5 7-5" />
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

export default function AdminProfileSettings() {
  return (
    <section className="rounded-[14px] border border-[#d9d9d9] bg-white shadow-[0_10px_30px_rgba(120,140,170,0.08)]">
      <div className="flex flex-col gap-4 border-b border-[#ececec] px-5 py-5 lg:flex-row lg:items-start lg:justify-between lg:px-6">
        <div>
          <h1 className="text-[2.5rem] font-bold leading-none text-[#173b73]">Library Owner Profile</h1>
          <p className="mt-2 text-base text-[#4d6691]">Manage your admin account settings</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex h-11 items-center gap-2 rounded-[10px] border border-[#d8d8d8] bg-white px-3 text-sm text-slate-400 shadow-[0_6px_20px_rgba(148,163,184,0.06)]">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search"
              className="w-full min-w-[180px] bg-transparent text-slate-600 outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white text-slate-500 shadow-[0_6px_20px_rgba(148,163,184,0.06)] transition hover:bg-slate-50"
            aria-label="Notifications"
          >
            <BellIcon />
          </button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#8bb2ff,#5c76ff)] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(92,118,255,0.28)]"
            aria-label="Profile menu"
          >
            AR
          </button>
        </div>
      </div>

      <div className="px-5 py-5 lg:px-6 lg:py-6">
        <div className="h-24 rounded-[10px] bg-[linear-gradient(90deg,rgba(177,214,255,0.95)_0%,rgba(245,241,238,0.95)_55%,rgba(255,243,189,0.95)_100%)]" />

        <div className="mt-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[linear-gradient(145deg,#1f2937,#f1c7b5)] text-2xl font-bold text-white shadow-[0_12px_25px_rgba(148,163,184,0.22)]">
              AR
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-950">Alexa Rawles</h2>
                <span className="rounded-full bg-[#d93eb2] px-3 py-1 text-xs font-semibold text-white">Premium</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">alexarawles@gmail.com</p>
            </div>
          </div>

          <Link
            href="/library-owner/profile/edit"
            className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#4b82f9] px-7 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(75,130,249,0.24)] transition hover:bg-[#3d74ea]"
          >
            Edit
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {profileFields.map((field) => (
            <label key={field.label} className="block">
              <span className="mb-3 block text-sm font-medium text-slate-700">{field.label}</span>
              {field.type === "select" ? (
                <span className="flex h-[52px] items-center justify-between rounded-[10px] border border-[#f0f0f0] bg-[#fafafa] px-4 text-sm text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                  <span>{field.placeholder}</span>
                  <span className="text-slate-300">
                    <ChevronDownIcon />
                  </span>
                </span>
              ) : (
                <input
                  type="text"
                  defaultValue={field.placeholder}
                  className="h-[52px] w-full rounded-[10px] border border-[#f0f0f0] bg-[#fafafa] px-4 text-sm text-slate-500 outline-none"
                />
              )}
            </label>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-base font-semibold text-slate-950">My email Address</h3>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6f0ff] text-[#4b82f9]">
              <MailIcon />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">alexarawles@gmail.com</p>
              <p className="mt-1 text-sm text-slate-400">1 month ago</p>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-[10px] bg-[#edf3ff] px-5 text-sm font-medium text-[#4b82f9] transition hover:bg-[#e1ebff]"
          >
            + Add Email Address
          </button>
        </div>
      </div>
    </section>
  );
}
