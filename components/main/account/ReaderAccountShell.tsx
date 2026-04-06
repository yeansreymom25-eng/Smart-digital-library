"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { ReaderAccountSection } from "@/src/lib/readerAccountStorage";

const sectionLinks: Array<{ href: string; label: string; key: ReaderAccountSection }> = [
  { href: "/profile", label: "Profile", key: "profile" },
  { href: "/settings", label: "Setting", key: "settings" },
  { href: "/transactions", label: "Transaction", key: "transactions" },
];

export default function ReaderAccountShell({
  activeSection,
  eyebrow,
  title,
  children,
}: {
  activeSection: ReaderAccountSection;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fc_100%)] px-4 pb-16 pt-36 sm:px-6 sm:pt-40 lg:px-8">
      <div className="mx-auto max-w-[96rem]">
        <section className="rounded-[2.5rem] border border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.97)_0%,rgba(244,247,252,0.93)_100%)] px-7 py-8 shadow-[0_24px_50px_rgba(15,23,42,0.1)] sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.26em] text-[#8b95a6]">{eyebrow}</p>
              <h1 className="mt-4 text-[2.4rem] font-semibold tracking-[-0.06em] text-[#1f2430] sm:text-[3.4rem]">
                {title}
              </h1>
            </div>

            <div className="relative z-30 inline-flex self-start rounded-[1.5rem] border border-[#e3e8ef] bg-white/95 p-2 shadow-[0_16px_30px_rgba(15,23,42,0.06)]">
              {sectionLinks.map((section) => {
                const active =
                  activeSection === section.key ||
                  pathname === section.href ||
                  pathname.startsWith(`${section.href}/`);
                return (
                  <button
                    key={section.href}
                    type="button"
                    onClick={() => {
                      if (!active) {
                        router.push(section.href);
                      }
                    }}
                    className={`rounded-[1rem] px-5 py-3 text-sm font-semibold tracking-[-0.01em] transition sm:px-6 ${
                      active
                        ? "bg-[#202532] text-white shadow-[0_12px_24px_rgba(32,37,50,0.18)]"
                        : "text-[#6b7586] hover:bg-[#f7f9fc] hover:text-[#202532]"
                    }`}
                    aria-pressed={active}
                  >
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
