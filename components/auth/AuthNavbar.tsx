"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AUTH_ROUTES } from "@/src/lib/authFlow";

const AUTH_NAV_ITEMS = [
  { href: AUTH_ROUTES.welcome, label: "Home" },
  { href: AUTH_ROUTES.login, label: "Log in" },
  { href: AUTH_ROUTES.signup, label: "Sign up" },
  { href: "#", label: "Plan" },
] as const;

function getActiveIndex(pathname: string) {
  const index = AUTH_NAV_ITEMS.findIndex((item) => item.href !== "#" && item.href === pathname);
  return index >= 0 ? index : 0;
}

export default function AuthNavbar() {
  const pathname = usePathname();
  const activeIndex = getActiveIndex(pathname);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 12 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`pointer-events-none fixed right-4 top-4 z-50 transition-transform duration-300 ease-out sm:right-6 sm:top-5 lg:right-10 lg:top-6 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
      }`}
    >
      <nav className="pointer-events-auto relative hidden rounded-[22px] bg-[#efede9]/90 p-1.5 shadow-[0_16px_34px_rgba(15,23,42,0.08)] backdrop-blur md:block">
        <div className="relative grid grid-cols-4 gap-1">
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 top-0 w-[calc(25%-0.1875rem)] rounded-[16px] bg-[#dfddda] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 0.25}rem))` }}
          />

          {AUTH_NAV_ITEMS.map((item) =>
            item.href === "#" ? (
              <span
                key={item.label}
                className="relative z-10 inline-flex min-w-[82px] items-center justify-center rounded-[16px] px-3.5 py-2.5 text-base font-medium text-zinc-500"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`relative z-10 inline-flex min-w-[82px] items-center justify-center rounded-[16px] px-3.5 py-2.5 text-base font-medium transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  pathname === item.href ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
