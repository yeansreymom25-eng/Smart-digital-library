"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import DropdownAccountPanel from "@/components/main/account/DropdownAccountPanel";
import { useReaderUser } from "@/src/hooks/useReaderUser";

const primaryLinks = [
  { href: "/home", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/my-library", label: "My Library" },
];

type SearchBookResult = {
  id: string;
  title: string;
  author: string;
  imageSrc: string;
  category: string;
  description: string;
};

type SearchCategoryResult = {
  id: string;
  title: string;
  description: string;
  libraryType: string;
};

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.75" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5l8 7-8 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
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

function SearchResultBookRow({
  book,
  onNavigate,
}: {
  book: SearchBookResult;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={`/book/${book.id}`}
      onClick={onNavigate}
      className="flex items-center gap-4 rounded-[1.5rem] border border-transparent bg-white/78 p-3 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e5eaf2] hover:bg-white hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)]"
    >
      <div className="relative h-[5.75rem] w-[4.1rem] shrink-0 overflow-hidden rounded-[1rem] border border-black/6 bg-[#eef2f7]">
        {book.imageSrc ? (
          <Image
            src={book.imageSrc}
            alt={book.title}
            fill
            className="object-cover"
            sizes="66px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#eff4fb_0%,#dfe7f3_100%)] text-[#738198]">
            <SearchIcon />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[1.05rem] font-semibold tracking-[-0.03em] text-[#212733]">
          {book.title}
        </div>
        <div className="mt-1 truncate text-[0.95rem] text-[#6f7b8f]">{book.author}</div>
        <div className="mt-2 inline-flex rounded-full bg-[#f3f6fb] px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#7b8799]">
          {book.category || "General"}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-[#e5ebf4] bg-[#fbfcfe] px-3 py-2 text-[0.82rem] font-semibold text-[#5a6577]">
        <span>Open</span>
        <ArrowIcon />
      </div>
    </Link>
  );
}

function SearchResultCategoryRow({
  category,
  onNavigate,
}: {
  category: SearchCategoryResult;
  onNavigate: () => void;
}) {
  const option = category.libraryType === "khmer" ? "khmer" : "english";

  return (
    <Link
      href={`/explore/${category.id}?option=${option}`}
      onClick={onNavigate}
      className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-transparent bg-white/78 px-4 py-3.5 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e5eaf2] hover:bg-white hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)]"
    >
      <div className="min-w-0">
        <div className="truncate text-[1rem] font-semibold tracking-[-0.03em] text-[#212733]">
          {category.title}
        </div>
        <div className="mt-1 truncate text-[0.92rem] text-[#7d8798]">
          {category.description || "Browse this collection"}
        </div>
      </div>
      <div className="flex items-center gap-2 text-[0.82rem] font-semibold text-[#6a7384]">
        <span>Browse</span>
        <ArrowIcon />
      </div>
    </Link>
  );
}

export default function ReaderMainNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    books: SearchBookResult[];
    categories: SearchCategoryResult[];
  }>({ books: [], categories: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const accountAreaRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const pathname = usePathname();
  const user = useReaderUser();

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key !== "Escape") {
        return;
      }

      if (searchOpen) {
        setSearchOpen(false);
        return;
      }

      setMenuOpen(false);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [searchOpen]);

  useEffect(() => {
    function handleScroll() {
      const cur = window.scrollY;
      const prev = lastScrollYRef.current;
      if (cur < 24) { setNavVisible(true); lastScrollYRef.current = cur; return; }
      if (cur > prev + 6) setNavVisible(false);
      else if (cur < prev - 6) setNavVisible(true);
      lastScrollYRef.current = cur;
    }
    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (accountAreaRef.current?.contains(target)) return;
      setMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 40);

    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const trimmedQuery = deferredSearchQuery.trim();

    if (trimmedQuery.length < 2) {
      setSearchLoading(false);
      setSearchError("");
      setSearchResults({ books: [], categories: [] });
      return;
    }

    const controller = new AbortController();
    const loadResults = async () => {
      try {
        setSearchLoading(true);
        setSearchError("");

        const response = await fetch(`/api/reader/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to search right now.");
        }

        const payload = (await response.json()) as {
          books?: SearchBookResult[];
          categories?: SearchCategoryResult[];
        };

        setSearchResults({
          books: payload.books ?? [],
          categories: payload.categories ?? [],
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setSearchResults({ books: [], categories: [] });
        setSearchError(error instanceof Error ? error.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    };

    void loadResults();

    return () => controller.abort();
  }, [deferredSearchQuery, searchOpen]);

  function openSearch() {
    setMenuOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchLoading(false);
    setSearchError("");
    setSearchResults({ books: [], categories: [] });
  }

  return (
    <>
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 lg:px-8 ${
          menuOpen || navVisible ? "translate-y-0 opacity-100" : "-translate-y-[120%] opacity-0"
        }`}
      >
        <div className="pointer-events-auto mx-auto flex w-full max-w-[108rem] items-start gap-4">
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

                <button
                  type="button"
                  onClick={openSearch}
                  className="flex min-w-[16rem] items-center gap-3 rounded-full border border-[#d9dee7] bg-white px-4 py-3 text-left text-[#7f8796] shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#cfd7e4] hover:bg-[#fcfdff] hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)] lg:min-w-[20rem]"
                >
                  <SearchIcon />
                  <span className="text-[1rem] text-[#9aa3b3]">Search books, authors, categories</span>
                </button>
              </div>
            </div>
          </div>

          <div ref={accountAreaRef} className="relative flex shrink-0 flex-col items-end">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMenuOpen((v) => !v);
              }}
              aria-label="Open account menu"
              aria-expanded={menuOpen}
              className="flex h-[4.1rem] w-[4.1rem] items-center justify-center overflow-hidden rounded-full border border-white/70 bg-white/78 text-black shadow-[0_16px_28px_rgba(15,23,42,0.16)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] hover:shadow-[0_22px_34px_rgba(15,23,42,0.2)]"
            >
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
              ) : user.initials ? (
                <span className="text-sm font-bold text-[#3b4350]">{user.initials}</span>
              ) : (
                <ProfileIcon />
              )}
            </button>

            {menuOpen ? (
              <div className="reader-pop mt-4 w-[24.5rem] max-w-[calc(100vw-2rem)] rounded-[2.2rem] border border-white/85 bg-white/93 p-6 shadow-[0_26px_50px_rgba(15,23,42,0.18)] backdrop-blur-[12px]">
                <p className="text-[0.9rem] font-medium tracking-[0.01em] text-[#818a99]">Account</p>

                <div className="mt-4 flex items-center gap-3.5">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-[#f1f4f8] shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-[#3b4350]">{user.initials}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[1.15rem] font-semibold tracking-[-0.03em] text-[#1e2430]">
                      {user.fullName || "Loading…"}
                    </p>
                    <p className="truncate text-sm text-[#657083]">{user.email}</p>
                  </div>
                </div>

                <DropdownAccountPanel onNavigate={() => setMenuOpen(false)} />
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {searchOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className="reader-overlay-fade absolute inset-0 bg-[rgba(246,249,253,0.58)] backdrop-blur-[14px]"
          />

          <div className="absolute inset-x-0 top-0 px-4 pt-24 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[72rem]">
              <div className="reader-sheet overflow-hidden rounded-[2.3rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,249,253,0.94)_100%)] shadow-[0_32px_70px_rgba(15,23,42,0.18)] backdrop-blur-[18px]">
                <div className="border-b border-[#edf1f6] px-5 py-5 sm:px-6">
                  <div
                    className="reader-fade-up flex items-center gap-3 rounded-[1.55rem] border border-[#d9e1ec] bg-white px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]"
                    style={{ "--motion-delay": "90ms" } as CSSProperties}
                  >
                    <SearchIcon />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search books, authors, or categories"
                      className="w-full bg-transparent text-[1.05rem] text-[#263040] outline-none placeholder:text-[#9aa5b6]"
                    />
                    <button
                      type="button"
                      onClick={closeSearch}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f6fb] text-[#657184] transition hover:bg-[#e9eef6]"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>

                <div className="px-5 py-5 sm:px-6">
                  <div className="space-y-6">
                    <div>
                      <div className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#97a3b6]">
                        Search results
                      </div>

                      {searchQuery.trim().length < 2 ? (
                        <div className="mt-4 rounded-[1.7rem] border border-dashed border-[#d9e1ec] bg-white/65 px-5 py-10 text-center">
                          <div className="text-[1.1rem] font-semibold tracking-[-0.03em] text-[#2a3140]">
                            Start typing to search
                          </div>
                          <div className="mt-2 text-[0.95rem] text-[#7c8798]">
                            Try a book title, author name, or category.
                          </div>
                        </div>
                      ) : searchLoading ? (
                        <div className="mt-4 rounded-[1.7rem] border border-[#e8edf5] bg-white/75 px-5 py-10 text-center text-[#687385]">
                          Searching your library...
                        </div>
                      ) : searchError ? (
                        <div className="mt-4 rounded-[1.7rem] border border-[#ffe2e2] bg-[#fff7f7] px-5 py-10 text-center text-[#cc5c5c]">
                          {searchError}
                        </div>
                      ) : searchResults.books.length === 0 && searchResults.categories.length === 0 ? (
                        <div className="mt-4 rounded-[1.7rem] border border-[#e8edf5] bg-white/75 px-5 py-10 text-center">
                          <div className="text-[1.05rem] font-semibold text-[#283041]">No matches yet</div>
                          <div className="mt-2 text-[0.95rem] text-[#7b8799]">
                            Try another keyword.
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 space-y-6">
                          {searchResults.books.length > 0 ? (
                            <section>
                              <div className="mb-3 text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-[#97a3b6]">
                                Books
                              </div>
                              <div className="space-y-3">
                                {searchResults.books.map((book, index) => (
                                  <div
                                    key={book.id}
                                    className="reader-fade-up"
                                    style={{ "--motion-delay": `${Math.min(index * 40, 180)}ms` } as CSSProperties}
                                  >
                                    <SearchResultBookRow
                                      book={book}
                                      onNavigate={closeSearch}
                                    />
                                  </div>
                                ))}
                              </div>
                            </section>
                          ) : null}

                          {searchResults.categories.length > 0 ? (
                            <section>
                              <div className="mb-3 text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-[#97a3b6]">
                                Categories
                              </div>
                              <div className="space-y-3">
                                {searchResults.categories.map((category, index) => (
                                  <div
                                    key={category.id}
                                    className="reader-fade-up"
                                    style={{ "--motion-delay": `${Math.min(index * 45, 180)}ms` } as CSSProperties}
                                  >
                                    <SearchResultCategoryRow
                                      category={category}
                                      onNavigate={closeSearch}
                                    />
                                  </div>
                                ))}
                              </div>
                            </section>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
