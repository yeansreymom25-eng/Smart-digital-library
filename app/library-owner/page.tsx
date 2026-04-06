"use client";

import Link from "next/link";
import AdminPageIntro from "@/components/admin/AdminPageIntro";
import AdminPlaceholderCard from "@/components/admin/AdminPlaceholderCard";
import { adminNavigation } from "@/src/lib/adminNavigation";

export default function AdminOverviewPage() {
  const visibleNavigation = adminNavigation;

  return (
    <>
      <AdminPageIntro
        eyebrow="Admin Structure"
        title="Library owner workspace scaffold"
        description="This route tree is separated from the user and authentication flows. Each page here is reserved for the admin side described in your SRS."
      />

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminPlaceholderCard
          title="Planned admin modules"
          items={visibleNavigation
            .filter((item) => item.title !== "Overview")
            .map(
            (item) => `${item.title}: ${item.description}`
          )}
        />

        <section className="rounded-[28px] border border-[#d8e7ff] bg-white/85 p-6 shadow-[0_18px_45px_rgba(118,156,208,0.12)] sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Quick access</h2>
          <div className="mt-5 grid gap-3">
            {visibleNavigation
              .filter((item) => item.title !== "Overview")
              .slice(0, 5)
              .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl bg-[#f4f8ff] px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-[#eaf2ff]"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
