"use client";

import Link from "next/link";
import { useLogout } from "@/src/hooks/useLogout";

const links = [
  { href: "/profile", label: "Profile", description: "Edit your details & avatar" },
  { href: "/settings", label: "Settings", description: "Appearance & preferences" },
  { href: "/transactions", label: "Transactions", description: "Purchase & payment history" },
];

export default function DropdownAccountPanel({ onNavigate }: { onNavigate: () => void }) {
  const { logout, isLoading } = useLogout();

  async function handleLogout() {
    onNavigate();
    await logout();
  }

  return (
    <div className="mt-5 grid gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="rounded-[1.3rem] border border-[#e3e8ef] bg-white px-4 py-3 transition hover:bg-[#fbfcff] hover:shadow-[0_10px_18px_rgba(15,23,42,0.05)]"
        >
          <div className="text-sm font-semibold text-[#556072]">{link.label}</div>
          <div className="text-xs text-[#8790a0]">{link.description}</div>
        </Link>
      ))}

      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={isLoading}
        className="rounded-[1.3rem] border border-[#ffe4e4] bg-[#fff5f5] px-4 py-3 text-left transition hover:bg-[#ffefef] disabled:opacity-50"
      >
        <div className="text-sm font-semibold text-[#c93d3d]">
          {isLoading ? "Logging out…" : "Logout"}
        </div>
        <div className="text-xs text-[#e08080]">Sign out of your account</div>
      </button>
    </div>
  );
}
