"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/src/lib/adminNavigation";
import { useLogout } from "@/src/hooks/useLogout";

function NavIcon({ title }: { title: string }) {
  const common = "h-5 w-5";

  switch (title) {
    case "Dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <rect x="4" y="4" width="6" height="6" rx="1.2" />
          <rect x="14" y="4" width="6" height="6" rx="1.2" />
          <rect x="4" y="14" width="6" height="6" rx="1.2" />
          <rect x="14" y="14" width="6" height="6" rx="1.2" />
        </svg>
      );
    case "Books":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19v14H7.5A2.5 2.5 0 0 0 5 20.5V6.5Z" />
          <path d="M5 6h12" />
        </svg>
      );
    case "Categories":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M7 7h4v4H7zM13 13h4v4h-4zM13 7h4v4h-4zM7 13h4v4H7z" />
        </svg>
      );
    case "Users":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );
    case "Transactions":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M4 10h16" />
        </svg>
      );
    case "Analytics":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M5 19V9M12 19V5M19 19v-7" />
          <path d="M4 19h16" />
        </svg>
      );
    case "Reports":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <path d="M7 4h7l3 3v13H7z" />
          <path d="M14 4v4h4M10 12h4M10 16h4" />
        </svg>
      );
    case "Subscription":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 12h8M8 9h5" />
        </svg>
      );
    case "Profile":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export default function AdminSidebar({ plan = "No Plan" }: { plan?: string }) {
  const pathname = usePathname();
  const { logout, isLoading } = useLogout();

  const navItems = adminNavigation.filter(
    (item) => item.title !== "Overview" && item.title !== "Subscription"
  );

  return (
    <aside className="flex min-h-[calc(100vh-2.5rem)] flex-col overflow-hidden rounded-[14px] border border-[#d9d9d9] bg-white shadow-[0_10px_30px_rgba(120,140,170,0.08)]">
      <div className="border-b border-[#d9d9d9] px-6 py-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          </div>
          <div>
            <h2 className="text-[1.45rem] font-bold leading-none text-slate-950">
              Library Owner
            </h2>
            <p className="mt-1 text-base text-slate-500">{plan}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-[10px] px-4 py-3.5 text-lg transition ${
                isActive
                  ? "bg-[linear-gradient(90deg,#5aa0f6,_#f6fbff)] font-medium text-white"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              <span className={isActive ? "text-white" : "text-slate-600"}>
                <NavIcon title={item.title} />
              </span>
              <span className={isActive ? "text-white" : "text-slate-800"}>
                {item.title}
              </span>
            </Link>
          );
        })}

        <Link
          href="/library-owner/subscription"
          className={`flex items-center gap-4 rounded-[10px] border border-dashed border-[#cdddf6] px-4 py-3.5 text-lg transition ${
            pathname === "/library-owner/subscription"
              ? "bg-[linear-gradient(90deg,#5aa0f6,_#f6fbff)] font-medium text-white"
              : "text-slate-800 hover:bg-slate-50"
          }`}
        >
          <span className={pathname === "/library-owner/subscription" ? "text-white" : "text-slate-600"}>
            <NavIcon title="Subscription" />
          </span>
          <span className={pathname === "/library-owner/subscription" ? "text-white" : "text-slate-800"}>
            Subscription
          </span>
        </Link>
      </nav>

      <div className="border-t border-[#d9d9d9] px-5 py-5">
        <button
          type="button"
          onClick={() => void logout()}
          disabled={isLoading}
          className="flex items-center gap-3 text-lg font-medium text-[#ff3b30] transition hover:opacity-80 disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <path d="M14 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3" />
            <path d="M10 12h10M17 7l5 5-5 5" />
          </svg>
          {isLoading ? "Logging out…" : "Logout"}
        </button>
      </div>
    </aside>
  );
}