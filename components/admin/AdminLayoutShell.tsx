"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayoutShell({
  children,
  plan,
  ownerName,
  ownerAvatarUrl,
}: {
  children: ReactNode;
  plan: string;
  ownerName: string;
  ownerAvatarUrl: string;
}) {
  const pathname = usePathname();
  const isSubscriptionOnboarding = pathname === "/library-owner/subscription";

  if (isSubscriptionOnboarding) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.92),_rgba(255,255,255,0.98)_42%,_rgba(239,246,255,1)_100%)] px-0 py-0 text-slate-900 sm:px-0 sm:py-0">
        <div className="w-full">{children}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.92),_rgba(255,255,255,0.98)_42%,_rgba(239,246,255,1)_100%)] px-3 py-3 text-slate-900 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
      <div className="grid min-h-[calc(100vh-1.5rem)] w-full gap-5 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[370px_minmax(0,1fr)]">
        <AdminSidebar plan={plan} ownerName={ownerName} ownerAvatarUrl={ownerAvatarUrl} />
        <section className="space-y-8">{children}</section>
      </div>
    </main>
  );
}
