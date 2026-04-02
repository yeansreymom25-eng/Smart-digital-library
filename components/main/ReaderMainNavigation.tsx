"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const primaryLinks = [
  { href: "/home", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/my-library", label: "My Library" },
  { href: "/discount", label: "Discount" },
];

const accountLinks = [
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Setting" },
  { href: "/transactions", label: "Transaction" },
];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.75" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4.75 19.25c1.55-3.35 4.08-5.03 7.25-5.03s5.7 1.68 7.25 5.03"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-3 py-2 text-[1.05rem] font-medium tracking-[-0.02em] transition ${
        active ? "text-[#222733]" : "text-[#687283] hover:text-[#222733]"
      }`}
    >
      {label}
      <span
        className={`absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-[#202532] transition-opacity ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
    </Link>
  );
}

export default function ReaderMainNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;

      if (currentScrollY < 24) {
        setNavVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (currentScrollY > previousScrollY + 6) {
        setNavVisible(false);
      } else if (currentScrollY < previousScrollY - 6) {
        setNavVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    }

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-5 transition-all duration-300 sm:px-6 lg:px-8 ${
          menuOpen || navVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-[120%] opacity-0"
        }`}
      >
        <div className="pointer-events-auto mx-auto flex w-full max-w-[96rem] items-center gap-4">
          <div className="flex-1 rounded-[2rem] border border-white/75 bg-white/84 px-4 py-3 shadow-[0_22px_44px_rgba(15,23,42,0.14)] backdrop-blur-[24px]">
            <div className="flex items-center gap-5">
              <Link href="/home" className="flex items-center gap-3">
                <Image
                  src="/MainPage/app_Logo/image.png"
                  alt="Smart Digital Library"
                  width={56}
                  height={56}
                  className="h-[3.15rem] w-[3.15rem] object-contain"
                  priority
                />
              </Link>

              <div className="ml-auto hidden items-center gap-4 md:flex">
                <nav className="flex items-center gap-1 lg:gap-2">
                  {primaryLinks.map((link) => (
                    <NavLink key={link.href} href={link.href} label={link.label} />
                  ))}
                </nav>

                <div className="flex min-w-[16rem] items-center gap-3 rounded-full border border-[#d9dee7] bg-white px-4 py-3 text-[#7f8796] shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] lg:min-w-[20rem]">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-transparent text-[1rem] text-[#3b4350] outline-none placeholder:text-[#9aa3b3]"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Open account menu"
            className="flex h-[4.1rem] w-[4.1rem] items-center justify-center rounded-full border border-white/70 bg-white/78 text-black shadow-[0_16px_28px_rgba(15,23,42,0.16)] transition hover:scale-[1.02]"
          >
            <ProfileIcon />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close account menu"
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-white/12 backdrop-blur-[5px]"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 px-4 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[96rem] justify-end">
            <div
              className={`pointer-events-auto w-full max-w-[24.5rem] rounded-[2.2rem] border border-white/85 bg-white/93 p-6 shadow-[0_26px_50px_rgba(15,23,42,0.18)] backdrop-blur-[12px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                menuOpen
                  ? "translate-y-0 scale-100 opacity-100"
                  : "-translate-y-3 scale-[0.98] opacity-0"
              }`}
            >
              <p className="text-[0.9rem] font-medium tracking-[0.01em] text-[#818a99]">Account</p>

              <div className="mt-4 flex items-center gap-3.5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
                  <ProfileIcon />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[1.15rem] font-semibold tracking-[-0.03em] text-[#1e2430]">
                    Smart Reader
                  </p>
                  <p className="truncate text-sm text-[#657083]">reader@smartlibrary.app</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-[1.1rem] border border-[#e3e8ef] bg-white px-4 py-3.5 text-sm font-medium text-[#556072] transition hover:bg-[#fbfcff] hover:text-[#1f2430]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/Log_in"
                onClick={() => setMenuOpen(false)}
                className="mt-5 flex w-full items-center justify-center rounded-full bg-black px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1f2430]"
              >
                Log out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
