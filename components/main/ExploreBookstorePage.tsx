"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReaderBookDetail } from "@/src/lib/readerBookDetails";

const adImages = [
  "/MainPage/Ads/ads.jpg",
  "/MainPage/Ads/book-cover-design-trends.jpg",
  "/MainPage/Ads/681410197858-main.webp",
  "/MainPage/Ads/headline-website-banner-3.png.webp",
];

// Random beautiful gradients for books without covers
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
  "text-[#b8771d]", "text-[#a4538a]", "text-white", "text-[#8f6b37]",
  "text-[#ffe5a8]", "text-[#6f5925]", "text-[#2f2f2f]", "text-[#eef2f6]",
  "text-white", "text-white",
];

function getPalette(index: number) {
  return palettes[index % palettes.length];
}

function getTextClass(index: number) {
  return textClasses[index % textClasses.length];
}

function BookCover({ book, index, compact = false, widthClass }: {
  book: ReaderBookDetail;
  index: number;
  compact?: boolean;
  widthClass?: string;
}) {
  const sizeClass = widthClass ? widthClass
    : compact ? "w-[3.8rem] rounded-[0.32rem]"
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
          <div className={`absolute left-[12%] right-[12%] top-[12%] whitespace-pre-line text-left font-black uppercase ${textClass} ${titleClass}`}>
            {book.title}
          </div>
          <div className={`absolute inset-x-[12%] bottom-[10%] text-left font-semibold uppercase tracking-[0.18em] ${textClass} ${authorClass}`}>
            {book.author}
          </div>
        </div>
      )}
    </Link>
  );
}

function BookRow({ title, books }: { title: string; books: ReaderBookDetail[] }) {
  if (!books.length) return null;

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.96)_52%,rgba(15,23,42,0.075)_100%)] shadow-[0_18px_34px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex w-full flex-col gap-6 px-4 py-7 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        <h2 className="flex items-center gap-2 text-[1.8rem] font-semibold tracking-[-0.05em] text-[#22262f]">
          <span>{title}</span>
          <span aria-hidden="true" className="text-[1.9rem] font-medium leading-none text-[#aeb8c8]">›</span>
        </h2>
        <div className="hide-scrollbar flex snap-x gap-8 overflow-x-auto pb-3 pr-6">
          {books.map((book, i) => (
            <div key={book.id} className="flex-shrink-0 snap-start">
              <BookCover book={book} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopBooksRow({ books }: { books: ReaderBookDetail[] }) {
  if (!books.length) return null;

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(249,250,252,0.97)_56%,rgba(15,23,42,0.07)_100%)] text-[#1f2430] shadow-[0_18px_34px_rgba(15,23,42,0.08)]">
      <div className="mx-auto flex w-full flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <h2 className="flex items-center gap-2 text-[1.95rem] font-semibold tracking-[-0.05em] text-[#22262f]">
          <span>Top Books</span>
          <span aria-hidden="true" className="text-[2rem] font-medium leading-none text-[#aeb8c8]">›</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-5">
          {books.slice(0, 10).map((book, index) => (
            <div key={book.id} className="rounded-[1.6rem] border border-black/6 bg-white/88 p-5 shadow-[0_14px_28px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div className="text-[2rem] font-semibold leading-none tracking-[-0.08em] text-[#2b3342]">{index + 1}</div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#9aa4b4]">Top Pick</div>
              </div>
              <div className="mt-4 flex justify-center">
                <BookCover book={book} index={index} widthClass="w-[8.8rem] sm:w-[9.2rem]" />
              </div>
              <div className="mt-4 min-w-0">
                <div className="text-[1.05rem] font-semibold leading-[1.25] tracking-[-0.04em] text-[#1f2430]">{book.title}</div>
                <div className="mt-1 text-[0.95rem] text-[#7c8798]">{book.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ExploreBookstorePage({ dbBooks = [] }: { dbBooks?: ReaderBookDetail[] }) {
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveAdIndex((current) => (current + 1) % adImages.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  // Group books by category
  const categoryMap = new Map<string, ReaderBookDetail[]>();
  for (const book of dbBooks) {
    const cat = (book as ReaderBookDetail & { category?: string }).category ?? "General";
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat)!.push(book);
  }

  const categories = Array.from(categoryMap.entries());
  const freeBooks = dbBooks.filter((b) => b.access === "free");
  const paidBooks = dbBooks.filter((b) => b.access !== "free");

  return (
    <div id="page-top" className="min-h-screen bg-white text-[#1d2430]">
      {/* Ad banner */}
      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#0f1218] mt-28">
        <div className="relative">
          <div
            className="flex transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translate3d(-${activeAdIndex * 100}%, 0, 0)` }}
          >
            {adImages.map((src, index) => (
              <div key={`${src}-${index}`}
                className="relative h-[16.5rem] w-full flex-shrink-0 overflow-hidden bg-[#171a20] sm:h-[22rem] lg:h-[28rem] xl:h-[33rem]">
                <Image src={src} alt="Bookstore promotion" fill className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,20,28,0.48)_0%,rgba(17,20,28,0.18)_17%,rgba(255,255,255,0.03)_46%,rgba(255,255,255,0)_64%)]" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.96)_100%)] sm:h-28 lg:h-32" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/78 px-3 py-2 shadow-[0_14px_30px_rgba(15,23,42,0.18)] backdrop-blur">
            {adImages.map((_, index) => (
              <button key={`ad-dot-${index}`} type="button" onClick={() => setActiveAdIndex(index)}
                aria-label={`Show ad ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${index === activeAdIndex ? "w-7 bg-[#151922]" : "w-2.5 bg-[#1f2430]/28"}`} />
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full flex-col gap-12 px-4 pb-8 pt-32 sm:px-6 lg:gap-14 lg:px-8 xl:px-10">
        {dbBooks.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-2xl font-semibold text-slate-400">No books available yet</p>
            <p className="mt-2 text-slate-400">Check back soon!</p>
          </div>
        ) : (
          <section className="space-y-12">
            {/* All books */}
            <BookRow title="All Books" books={dbBooks} />

            {/* By category */}
            {categories.map(([cat, books]) => (
              <BookRow key={cat} title={cat} books={books} />
            ))}

            {/* Free books */}
            {freeBooks.length > 0 && <BookRow title="Free Books" books={freeBooks} />}

            {/* Paid books */}
            {paidBooks.length > 0 && <BookRow title="Premium Books" books={paidBooks} />}

            {/* Top books */}
            <TopBooksRow books={dbBooks} />
          </section>
        )}
      </main>

      <style jsx global>{`
        .hide-scrollbar { scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}