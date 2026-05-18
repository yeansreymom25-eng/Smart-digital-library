"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, RefObject } from "react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import type { ReaderBookDetail } from "@/src/lib/readerBookDetails";

type HomeBook = ReaderBookDetail & {
  category?: string;
};

type CategoryShelf = {
  id: string;
  label: string;
  books: HomeBook[];
  heroBook?: HomeBook;
};

const adImages = [
  "/MainPage/Ads/ads.jpg",
  "/MainPage/Ads/book-cover-design-trends.jpg",
  "/MainPage/Ads/681410197858-main.webp",
  "/MainPage/Ads/headline-website-banner-3.png.webp",
];

const palettes = [
  "from-[#f8f0df] via-[#fff8ef] to-[#eed7af]",
  "from-[#f4deef] via-[#fff7fc] to-[#d7caf0]",
  "from-[#1f5ec9] via-[#4ca7f8] to-[#fee667]",
  "from-[#f9edd5] via-[#fffaf1] to-[#d7b57f]",
  "from-[#7c0f1f] via-[#b51d2b] to-[#d48c43]",
  "from-[#f7e8aa] via-[#ffe8aa] to-[#5c8fd3]",
  "from-[#ffeb7d] via-[#ffe45c] to-[#f8b1b6]",
  "from-[#6f849b] via-[#4e6579] to-[#213042]",
  "from-[#8cc4ff] via-[#6ea4f1] to-[#4968d4]",
  "from-[#5f8be5] via-[#7d9df0] to-[#c9d8ff]",
];

const textClasses = [
  "text-[#b8771d]",
  "text-[#a4538a]",
  "text-white",
  "text-[#8f6b37]",
  "text-[#ffe5a8]",
  "text-[#6f5925]",
  "text-[#2f2f2f]",
  "text-[#eef2f6]",
  "text-white",
  "text-white",
];

function getPalette(index: number) {
  return palettes[index % palettes.length];
}

function getTextClass(index: number) {
  return textClasses[index % textClasses.length];
}

function normalizeCategoryKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatCategoryLabel(value: string) {
  if (value.toLowerCase() === "self-help") {
    return "Personal Development";
  }

  if (value.toLowerCase() === "finance") {
    return "Business / Finance";
  }

  return value;
}

function dedupeBooks(books: HomeBook[]) {
  const seen = new Set<string>();

  return books.filter((book) => {
    if (seen.has(book.id)) {
      return false;
    }

    seen.add(book.id);
    return true;
  });
}

function BookCover({
  book,
  index,
  compact = false,
  widthClass,
}: {
  book: HomeBook;
  index: number;
  compact?: boolean;
  widthClass?: string;
}) {
  const sizeClass = widthClass
    ? widthClass
    : compact
      ? "w-[3.8rem] rounded-[0.32rem]"
      : "w-[10rem] rounded-[0.45rem] sm:w-[10.8rem] lg:w-[11.2rem]";
  const titleClass = compact
    ? "text-[0.62rem] leading-[0.9] tracking-[-0.03em]"
    : "text-[1.08rem] leading-[0.92] tracking-[-0.045em]";
  const authorClass = compact ? "text-[0.42rem]" : "text-[0.6rem]";
  const palette = getPalette(index);
  const textClass = getTextClass(index);

  return (
    <Link
      href={`/book/${book.id}`}
      className={`relative block aspect-[2/3] overflow-hidden border border-black/5 shadow-[0_16px_32px_rgba(15,23,42,0.12)] ${sizeClass}`}
    >
      {book.imageSrc ? (
        <Image
          src={book.imageSrc}
          alt={book.title}
          fill
          className="object-cover"
          sizes={compact ? "64px" : "150px"}
        />
      ) : (
        <div className={`relative h-full w-full bg-gradient-to-br ${palette}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_44%),linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.08)_100%)]" />
          <div
            className={`absolute left-[12%] right-[12%] top-[12%] whitespace-pre-line text-left font-black uppercase ${textClass} ${titleClass}`}
          >
            {book.title}
          </div>
          <div
            className={`absolute inset-x-[12%] bottom-[10%] text-left font-semibold uppercase tracking-[0.18em] ${textClass} ${authorClass}`}
          >
            {book.author}
          </div>
        </div>
      )}
    </Link>
  );
}

function BookRow({
  title,
  books,
  sectionRef,
}: {
  title: string;
  books: HomeBook[];
  sectionRef?: RefObject<HTMLElement | null>;
}) {
  if (!books.length) return null;

  return (
    <section
      ref={sectionRef}
      className="reader-fade-up relative left-1/2 w-screen -translate-x-1/2 scroll-mt-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.96)_52%,rgba(15,23,42,0.075)_100%)] shadow-[0_18px_34px_rgba(15,23,42,0.06)]"
    >
      <div className="mx-auto flex w-full flex-col gap-6 px-4 py-7 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        <h2 className="flex items-center gap-2 text-[1.8rem] font-semibold tracking-[-0.05em] text-[#22262f]">
          <span>{title}</span>
          <span aria-hidden="true" className="text-[1.9rem] font-medium leading-none text-[#aeb8c8]">
            ›
          </span>
        </h2>
        <div className="hide-scrollbar flex snap-x gap-8 overflow-x-auto pb-3 pr-6">
          {books.map((book, i) => (
            <div
              key={book.id}
              className="reader-fade-up flex-shrink-0 snap-start"
              style={{ "--motion-delay": `${Math.min(i * 45, 220)}ms` } as CSSProperties}
            >
              <BookCover book={book} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopBooksRow({ books }: { books: HomeBook[] }) {
  if (!books.length) return null;

  return (
    <section className="reader-fade-up relative left-1/2 w-screen -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(249,250,252,0.97)_56%,rgba(15,23,42,0.07)_100%)] text-[#1f2430] shadow-[0_18px_34px_rgba(15,23,42,0.08)]">
      <div className="mx-auto flex w-full flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <h2 className="flex items-center gap-2 text-[1.95rem] font-semibold tracking-[-0.05em] text-[#22262f]">
          <span>Top Books</span>
          <span aria-hidden="true" className="text-[2rem] font-medium leading-none text-[#aeb8c8]">
            ›
          </span>
        </h2>
        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-5">
          {books.slice(0, 10).map((book, index) => (
            <div
              key={book.id}
              className="reader-fade-up rounded-[1.6rem] border border-black/6 bg-white/88 p-5 shadow-[0_14px_28px_rgba(15,23,42,0.05)]"
              style={{ "--motion-delay": `${Math.min(index * 55, 260)}ms` } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-[2rem] font-semibold leading-none tracking-[-0.08em] text-[#2b3342]">
                  {index + 1}
                </div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#9aa4b4]">
                  Top Pick
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <BookCover book={book} index={index} widthClass="w-[8.8rem] sm:w-[9.2rem]" />
              </div>
              <div className="mt-4 min-w-0">
                <div className="text-[1.05rem] font-semibold leading-[1.25] tracking-[-0.04em] text-[#1f2430]">
                  {book.title}
                </div>
                <div className="mt-1 text-[0.95rem] text-[#7c8798]">{book.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCategoryButton({
  shelf,
  active,
  onClick,
}: {
  shelf: CategoryShelf;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative block w-full overflow-hidden rounded-[2rem] text-left shadow-[0_18px_36px_rgba(15,23,42,0.12)] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        active
          ? "scale-[1.015] ring-2 ring-[#202532] ring-offset-4 ring-offset-white"
          : "hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_24px_42px_rgba(15,23,42,0.16)]"
      }`}
    >
      <div className="relative h-[15rem] w-full bg-[linear-gradient(135deg,#f8efe3_0%,#f3ddcf_45%,#edd0c3_100%)]">
        {shelf.heroBook?.imageSrc ? (
          <Image
            src={shelf.heroBook.imageSrc}
            alt={shelf.label}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(min-width: 1280px) 30vw, 100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,18,34,0.03)_0%,rgba(12,18,34,0.1)_40%,rgba(12,18,34,0.52)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="inline-flex rounded-full bg-white/82 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#3a4354] backdrop-blur">
            {shelf.books.length} books
          </div>
          <h3 className="mt-3 text-[1.7rem] font-semibold tracking-[-0.05em] text-white">
            {shelf.label}
          </h3>
        </div>
      </div>
    </button>
  );
}

export default function ExploreBookstorePage({ dbBooks = [] }: { dbBooks?: HomeBook[] }) {
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const categoryRailRef = useRef<HTMLDivElement>(null);
  const picksRowRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveAdIndex((current) => (current + 1) % adImages.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  const categoryShelves = useMemo(() => {
    const categoryMap = new Map<string, HomeBook[]>();

    for (const book of dbBooks) {
      const categoryName = (book.category ?? "General").trim() || "General";
      const current = categoryMap.get(categoryName) ?? [];
      current.push(book);
      categoryMap.set(categoryName, current);
    }

    return Array.from(categoryMap.entries())
      .map(([label, books]) => ({
        id: normalizeCategoryKey(label),
        label: formatCategoryLabel(label),
        books,
        heroBook: books[0],
      }))
      .sort((left, right) => right.books.length - left.books.length);
  }, [dbBooks]);

  const [activeCategoryId, setActiveCategoryId] = useState("");
  const activeShelf = useMemo(() => {
    if (!categoryShelves.length) {
      return undefined;
    }

    return categoryShelves.find((shelf) => shelf.id === activeCategoryId) ?? categoryShelves[0];
  }, [activeCategoryId, categoryShelves]);
  const selectedShelfBooks = useMemo(() => activeShelf?.books ?? [], [activeShelf]);
  const latestBooks = dbBooks.slice(0, 10);
  const discoveryBooks = useMemo(() => {
    const outsideShelfBooks = dbBooks.filter((book) => {
      return activeShelf ? normalizeCategoryKey(book.category ?? "General") !== activeShelf.id : true;
    });

    return dedupeBooks([
      ...outsideShelfBooks.slice(0, 6),
      ...selectedShelfBooks.slice(0, 4),
    ]).slice(0, 10);
  }, [activeShelf, dbBooks, selectedShelfBooks]);

  useEffect(() => {
    if (!activeShelf || !categoryRailRef.current) {
      return;
    }

    const activeCard = categoryRailRef.current.querySelector<HTMLElement>(
      `[data-shelf-id="${activeShelf.id}"]`
    );

    activeCard?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeShelf]);

  function scrollCategoryRail(direction: "left" | "right") {
    if (!categoryRailRef.current) {
      return;
    }

    const amount = direction === "left" ? -420 : 420;
    categoryRailRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  }

  function handleShelfSelect(shelfId: string) {
    startTransition(() => {
      setActiveCategoryId(shelfId);
    });

    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        picksRowRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    });
  }

  return (
    <div id="page-top" className="min-h-screen bg-white text-[#1d2430]">
      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#0f1218]">
        <div className="relative">
          <div
            className="flex transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translate3d(-${activeAdIndex * 100}%, 0, 0)` }}
          >
            {adImages.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative h-[16.5rem] w-full flex-shrink-0 overflow-hidden bg-[#171a20] sm:h-[22rem] lg:h-[28rem] xl:h-[33rem]"
              >
                <Image src={src} alt="Bookstore promotion" fill className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,20,28,0.48)_0%,rgba(17,20,28,0.18)_17%,rgba(255,255,255,0.03)_46%,rgba(255,255,255,0)_64%)]" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.96)_100%)] sm:h-28 lg:h-32" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/78 px-3 py-2 shadow-[0_14px_30px_rgba(15,23,42,0.18)] backdrop-blur">
            {adImages.map((_, index) => (
              <button
                key={`ad-dot-${index}`}
                type="button"
                onClick={() => setActiveAdIndex(index)}
                aria-label={`Show ad ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeAdIndex ? "w-7 bg-[#151922]" : "w-2.5 bg-[#1f2430]/28"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-[108rem] flex-col gap-12 px-5 pb-8 pt-10 sm:px-6 lg:gap-14 lg:px-7 xl:px-8">
        {dbBooks.length === 0 ? (
          <div className="reader-fade-up py-20 text-center">
            <p className="text-2xl font-semibold text-slate-400">No books available yet</p>
            <p className="mt-2 text-slate-400">Check back soon!</p>
          </div>
        ) : (
          <>
            {categoryShelves.length > 0 ? (
              <section className="reader-fade-up space-y-6">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[#94a0b3]">
                      Explore by category
                    </p>
                    <h2 className="mt-2 text-[2.2rem] font-semibold tracking-[-0.06em] text-[#202532]">
                      Pick a shelf and browse it below
                    </h2>
                  </div>

                  <div className="hidden items-center gap-3 md:flex">
                    <button
                      type="button"
                      onClick={() => scrollCategoryRail("left")}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe3ee] bg-white text-[#5c6677] shadow-[0_10px_22px_rgba(15,23,42,0.07)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#c7d2e1] hover:text-[#1f2430]"
                      aria-label="Scroll categories left"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCategoryRail("right")}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dbe3ee] bg-white text-[#5c6677] shadow-[0_10px_22px_rgba(15,23,42,0.07)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#c7d2e1] hover:text-[#1f2430]"
                      aria-label="Scroll categories right"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div ref={categoryRailRef} className="hide-scrollbar flex snap-x gap-5 overflow-x-auto pb-3 pr-6">
                  {categoryShelves.map((shelf, index) => (
                    <div
                      key={shelf.id}
                      data-shelf-id={shelf.id}
                      className="reader-pop w-[22rem] min-w-[22rem] flex-shrink-0 snap-start sm:w-[24rem] sm:min-w-[24rem]"
                      style={{ "--motion-delay": `${Math.min(index * 55, 280)}ms` } as CSSProperties}
                    >
                      <FeaturedCategoryButton
                        shelf={shelf}
                        active={shelf.id === activeShelf?.id}
                        onClick={() => handleShelfSelect(shelf.id)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="space-y-12">
              <BookRow
                key={activeShelf?.id ?? "recommended"}
                sectionRef={picksRowRef}
                title={activeShelf ? `${activeShelf.label} Picks` : "Recommended"}
                books={selectedShelfBooks.length > 0 ? selectedShelfBooks : latestBooks}
              />
              <BookRow title="Just Came Out" books={latestBooks} />
              <BookRow title="Readers Are Loving" books={discoveryBooks} />
              <TopBooksRow books={dbBooks} />
            </section>
          </>
        )}
      </main>

      <style jsx global>{`
        .hide-scrollbar {
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
