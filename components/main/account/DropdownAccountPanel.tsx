"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLogout } from "@/src/hooks/useLogout";

type PanelLink = {
  href: string;
  label: string;
  description: string;
  icon: ReactNode;
};

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-6 w-6">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-6 w-6">
      <path d="M12 3.75v2.5" />
      <path d="M12 17.75v2.5" />
      <path d="m5.46 5.46 1.77 1.77" />
      <path d="m16.77 16.77 1.77 1.77" />
      <path d="M3.75 12h2.5" />
      <path d="M17.75 12h2.5" />
      <path d="m5.46 18.54 1.77-1.77" />
      <path d="m16.77 7.23 1.77-1.77" />
      <circle cx="12" cy="12" r="3.25" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-6 w-6">
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M7 14h3" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-6 w-6">
      <path d="M10 5H7.75A2.75 2.75 0 0 0 5 7.75v8.5A2.75 2.75 0 0 0 7.75 19H10" />
      <path d="m14 8 4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  );
}

const links: PanelLink[] = [
  {
    href: "/profile",
    label: "Profile",
    description: "Edit your details & avatar",
    icon: <ProfileIcon />,
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Appearance & preferences",
    icon: <SettingsIcon />,
  },
  {
    href: "/transactions",
    label: "Transactions",
    description: "Purchase & payment history",
    icon: <CardIcon />,
  },
];

function PanelItem({
  icon,
  label,
  description,
  danger = false,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  danger?: boolean;
}) {
  return (
    <>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.05rem] border ${
          danger
            ? "border-[#ffc8c8] bg-[#fff1f1] text-[#d74444]"
            : "border-[#e6ebf2] bg-[linear-gradient(180deg,#ffffff_0%,#f6f8fb_100%)] text-[#2f3848]"
        } shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className={`text-[1.08rem] font-semibold tracking-[-0.03em] ${danger ? "text-[#cc4545]" : "text-[#2a3140]"}`}>
          {label}
        </div>
        <div className={`mt-0.5 text-[0.92rem] ${danger ? "text-[#e07b7b]" : "text-[#8a94a5]"}`}>
          {description}
        </div>
      </div>

      <div className={`text-[1.2rem] ${danger ? "text-[#df8f8f]" : "text-[#99a4b5]"}`}>›</div>
    </>
  );
}

export default function DropdownAccountPanel({ onNavigate }: { onNavigate: () => void }) {
  const { logout, isLoading } = useLogout();

  async function handleLogout() {
    onNavigate();
    await logout();
  }

  return (
    <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(246,248,252,0.9)_100%)] p-3 shadow-[0_28px_70px_rgba(15,23,42,0.16)] backdrop-blur-xl">
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="flex items-center gap-4 rounded-[1.5rem] border border-transparent bg-white/72 px-4 py-3.5 transition hover:border-[#e8edf5] hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.07)]"
          >
            <PanelItem icon={link.icon} label={link.label} description={link.description} />
          </Link>
        ))}

        <button
          type="button"
          onClick={() => void handleLogout()}
          disabled={isLoading}
          className="flex w-full items-center gap-4 rounded-[1.5rem] border border-[#ffe3e3] bg-[linear-gradient(180deg,#fff7f7_0%,#fff1f1_100%)] px-4 py-3.5 text-left transition hover:bg-[linear-gradient(180deg,#fff3f3_0%,#ffeaea_100%)] hover:shadow-[0_10px_24px_rgba(201,61,61,0.08)] disabled:opacity-50"
        >
          <PanelItem
            icon={<LogoutIcon />}
            label={isLoading ? "Logging out…" : "Logout"}
            description="Sign out of your account"
            danger
          />
        </button>
      </div>
    </div>
  );
}
