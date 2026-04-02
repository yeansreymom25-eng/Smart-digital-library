"use client";

import Image from "next/image";
import { startTransition, useEffect, useState } from "react";

type Book = {
  id: string;
  title: string;
  author: string;
  imageSrc?: string;
  palette: string;
  textClass: string;
  shelfTint: string;
};

type Category = {
  id: string;
  title: string;
  subtitle: string;
  books: string[];
};

const adImages = [
  "/MainPage/Ads/ads.jpg",
  "/MainPage/Ads/book-cover-design-trends.jpg",
  "/MainPage/Ads/681410197858-main.webp",
  "/MainPage/Ads/headline-website-banner-3.png.webp",
];

const books: Book[] = [
  {
    id: "atomic-habits",
    title: "Atomic\nHabits",
    author: "James Clear",
    imageSrc: "/MainPage/Books/Atomic_habits.jpg",
    palette: "from-[#f8f0df] via-[#fff8ef] to-[#eed7af]",
    textClass: "text-[#b8771d]",
    shelfTint: "bg-[#f7ecda]",
  },
  {
    id: "it-ends-with-us",
    title: "It Ends\nWith Us",
    author: "Colleen Hoover",
    palette: "from-[#f4deef] via-[#fff7fc] to-[#d7caf0]",
    textClass: "text-[#a4538a]",
    shelfTint: "bg-[#f6e9f3]",
  },
  {
    id: "life-impossible",
    title: "The Life\nImpossible",
    author: "Matt Haig",
    palette: "from-[#1f5ec9] via-[#4ca7f8] to-[#fee667]",
    textClass: "text-white",
    shelfTint: "bg-[#dcecff]",
  },
  {
    id: "verity",
    title: "Verity",
    author: "Colleen Hoover",
    palette: "from-[#f9edd5] via-[#fffaf1] to-[#d7b57f]",
    textClass: "text-[#8f6b37]",
    shelfTint: "bg-[#f8f0e1]",
  },
  {
    id: "thorns-and-roses",
    title: "A Court\nof Thorns\nand Roses",
    author: "Sarah J. Maas",
    palette: "from-[#7c0f1f] via-[#b51d2b] to-[#d48c43]",
    textClass: "text-[#ffe5a8]",
    shelfTint: "bg-[#f6e5df]",
  },
  {
    id: "song-of-achilles",
    title: "Song of\nAchilles",
    author: "Madeline Miller",
    palette: "from-[#f7e8aa] via-[#ffe8aa] to-[#5c8fd3]",
    textClass: "text-[#6f5925]",
    shelfTint: "bg-[#f7f0d9]",
  },
  {
    id: "listen-for-the-lie",
    title: "Listen\nfor the\nLie",
    author: "Amy Tintera",
    palette: "from-[#ffeb7d] via-[#ffe45c] to-[#f8b1b6]",
    textClass: "text-[#2f2f2f]",
    shelfTint: "bg-[#fff2bf]",
  },
  {
    id: "wild-dark-shore",
    title: "Wild\nDark\nShore",
    author: "Charlotte McConaghy",
    palette: "from-[#6f849b] via-[#4e6579] to-[#213042]",
    textClass: "text-[#eef2f6]",
    shelfTint: "bg-[#dee7ef]",
  },
  {
    id: "favorites",
    title: "The\nFavorites",
    author: "Layne Fargo",
    palette: "from-[#8cc4ff] via-[#6ea4f1] to-[#4968d4]",
    textClass: "text-white",
    shelfTint: "bg-[#deebff]",
  },
  {
    id: "three-days-in-june",
    title: "Three\nDays in\nJune",
    author: "Anne Tyler",
    palette: "from-[#5f8be5] via-[#7d9df0] to-[#c9d8ff]",
    textClass: "text-white",
    shelfTint: "bg-[#e2ebff]",
  },
  {
    id: "dirt",
    title: "Dirt",
    author: "Charmaine Wilkerson",
    palette: "from-[#f89caa] via-[#ffd8e0] to-[#f77f69]",
    textClass: "text-[#6b2031]",
    shelfTint: "bg-[#ffe7ec]",
  },
  {
    id: "elf-shack",
    title: "Elif\nShafak",
    author: "Novel Picks",
    palette: "from-[#b3d8ff] via-[#c8d9f8] to-[#84a8db]",
    textClass: "text-[#33507b]",
    shelfTint: "bg-[#e5f0ff]",
  },
];

const bookMap = Object.fromEntries(books.map((book) => [book.id, book]));

const categories: Category[] = [
  {
    id: "personal-development",
    title: "Personal Development",
    subtitle: "Build better habits and read practical books that help you grow.",
    books: ["atomic-habits", "verity", "life-impossible", "song-of-achilles", "three-days-in-june"],
  },
  {
    id: "business-finance",
    title: "Business / Finance",
    subtitle: "Money, business thinking, and smart decision-making in one shelf.",
    books: ["atomic-habits", "life-impossible", "listen-for-the-lie", "wild-dark-shore", "favorites"],
  },
  {
    id: "fantasy",
    title: "Fantasy",
    subtitle: "Escape into magical worlds, epic adventures, and beautiful stories.",
    books: ["thorns-and-roses", "song-of-achilles", "favorites", "wild-dark-shore", "dirt"],
  },
];

const recommendationIds = [
  "atomic-habits",
  "it-ends-with-us",
  "life-impossible",
  "verity",
  "thorns-and-roses",
  "song-of-achilles",
  "favorites",
];

const justCameOutIds = [
  "it-ends-with-us",
  "atomic-habits",
  "song-of-achilles",
  "thorns-and-roses",
  "verity",
  "life-impossible",
  "listen-for-the-lie",
];

const topBookIds = [
  "atomic-habits",
  "it-ends-with-us",
  "life-impossible",
  "verity",
  "thorns-and-roses",
  "song-of-achilles",
  "favorites",
  "listen-for-the-lie",
  "wild-dark-shore",
  "three-days-in-june",
];

function BookCover({
  book,
  compact = false,
}: {
  book: Book;
  compact?: boolean;
}) {
  const sizeClass = compact
    ? "w-[3.8rem] rounded-[0.32rem]"
    : "w-[8.7rem] rounded-[0.45rem] sm:w-[9.1rem]";
  const titleClass = compact
    ? "text-[0.62rem] leading-[0.9] tracking-[-0.03em]"
    : "text-[1rem] leading-[0.92] tracking-[-0.045em]";
  const authorClass = compact ? "text-[0.42rem]" : "text-[0.56rem]";

  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden border border-black/5 shadow-[0_16px_32px_rgba(15,23,42,0.12)] ${sizeClass}`}
    >
      {book.imageSrc ? (
        <Image
          src={book.imageSrc}
          alt={book.title.replaceAll("\n", " ")}
          fill
          className="object-cover"
          sizes={compact ? "64px" : "150px"}
        />
      ) : (
        <div className={`relative h-full w-full bg-gradient-to-br ${book.palette}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_44%),linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.08)_100%)]" />
          <div className={`absolute left-[12%] right-[12%] top-[12%] whitespace-pre-line text-left font-black uppercase ${book.textClass} ${titleClass}`}>
            {book.title}
          </div>
          <div className={`absolute inset-x-[12%] bottom-[10%] text-left font-semibold uppercase tracking-[0.18em] ${book.textClass} ${authorClass}`}>
            {book.author}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryArtwork({ id }: { id: string }) {
  if (id === "personal-development") {
    return (
      <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#d6e7ff_0%,#edf6ff_40%,#eff6ec_100%)]">
        <div className="absolute inset-x-[-10%] bottom-[20%] h-[34%] rounded-[50%] bg-[#6f9f61]" />
        <div className="absolute inset-x-[-4%] bottom-[13%] h-[28%] rounded-[50%] bg-[#4f7746]" />
        <div className="absolute left-[58%] bottom-[24%] h-[32%] w-[5%] rounded-full bg-[#3a2d25]" />
        <div className="absolute left-[55%] bottom-[30%] h-[6%] w-[10%] rounded-full bg-[#b12d2d]" />
        <div className="absolute left-[49%] bottom-[29%] h-[4%] w-[18%] -rotate-[18deg] rounded-full bg-[#dfe7f2]" />
        <div className="absolute left-[53%] bottom-[27%] h-[3%] w-[10%] rotate-[12deg] rounded-full bg-[#1f2530]" />
      </div>
    );
  }

  if (id === "business-finance") {
    return (
      <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_48%,#f0f5fb_100%)]">
        <div className="absolute inset-[8%] rounded-[1.3rem] border border-[#deebf8] bg-white/88" />
        <div className="absolute left-[10%] top-[14%] text-[1.8rem] font-black tracking-[-0.08em] text-[#1f2b44]">
          FINANCE
        </div>
        <div className="absolute left-[12%] top-[40%] grid grid-cols-4 gap-3 text-[#7695c9]">
          <span className="rounded-full bg-[#eef5ff] px-2 py-1 text-xs font-semibold">$</span>
          <span className="rounded-full bg-[#eef5ff] px-2 py-1 text-xs font-semibold">%</span>
          <span className="rounded-full bg-[#eef5ff] px-2 py-1 text-xs font-semibold">BTC</span>
          <span className="rounded-full bg-[#eef5ff] px-2 py-1 text-xs font-semibold">Tax</span>
        </div>
        <div className="absolute left-[12%] bottom-[16%] right-[12%] h-[16%] rounded-[1rem] bg-[linear-gradient(90deg,#f3f8ff,#fff6eb)]" />
        <div className="absolute left-[15%] bottom-[21%] h-[5%] w-[8%] rounded-full bg-[#75a5ff]" />
        <div className="absolute left-[26%] bottom-[18%] h-[8%] w-[8%] rounded-full bg-[#ffc46d]" />
        <div className="absolute left-[37%] bottom-[16%] h-[10%] w-[8%] rounded-full bg-[#8bd293]" />
        <div className="absolute left-[48%] bottom-[19%] h-[7%] w-[8%] rounded-full bg-[#f18ba0]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#101d43_0%,#243b78_38%,#0e162a_100%)]">
      <div className="absolute left-[10%] top-[14%] h-5 w-5 rounded-full bg-white/80 blur-[1px]" />
      <div className="absolute left-[20%] top-[24%] h-2 w-2 rounded-full bg-[#a4c6ff]" />
      <div className="absolute right-[16%] top-[18%] h-4 w-4 rounded-full bg-[#ffd377]/80 blur-[1px]" />
      <div className="absolute inset-x-[14%] bottom-[16%] h-[30%] rounded-t-[80%] bg-[radial-gradient(circle_at_center,#ffdc7e_0%,#d26b53_50%,#161f4b_100%)]" />
      <div className="absolute inset-x-[18%] bottom-[14%] h-[10%] rounded-[999px] bg-[#f8e8c8]" />
      <div className="absolute left-[25%] bottom-[18%] h-[6%] w-[22%] rounded-full bg-[#101321]" />
      <div className="absolute right-[24%] bottom-[18%] h-[6%] w-[24%] rounded-full bg-[#101321]" />
    </div>
  );
}

function CategoryCard({
  category,
  active,
  onSelect,
}: {
  category: Category;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative h-[14.5rem] overflow-hidden rounded-[1.9rem] border text-left transition duration-300 ${
        active
          ? "border-[#98afe1] shadow-[0_22px_44px_rgba(86,118,186,0.2)]"
          : "border-white/80 shadow-[0_16px_30px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_24px_42px_rgba(15,23,42,0.12)]"
      }`}
    >
      <CategoryArtwork id={category.id} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.02)_42%,rgba(15,23,42,0.62)_100%)]" />
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-left text-[1.22rem] font-semibold tracking-[-0.04em] text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]">
          {category.title}
        </div>
      </div>
    </button>
  );
}

function BookRow({
  id,
  title,
  booksToShow,
}: {
  id: string;
  title: string;
  booksToShow: Book[];
}) {
  return (
    <section
      id={id}
      className="relative left-1/2 w-screen -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.96)_52%,rgba(15,23,42,0.075)_100%)] shadow-[0_18px_34px_rgba(15,23,42,0.06)]"
    >
      <div className="mx-auto flex w-full flex-col gap-6 px-4 py-7 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        <h2 className="text-[1.45rem] font-semibold tracking-[-0.04em] text-[#22262f]">{title}</h2>

        <div className="hide-scrollbar flex snap-x gap-8 overflow-x-auto pb-3 pr-6">
          {booksToShow.map((book) => (
            <div key={book.id} className="flex-shrink-0 snap-start">
              <BookCover book={book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopBooksRow({ booksToShow }: { booksToShow: Book[] }) {
  return (
    <section
      id="transactions"
      className="relative left-1/2 w-screen -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(249,250,252,0.97)_56%,rgba(15,23,42,0.07)_100%)] text-[#1f2430] shadow-[0_18px_34px_rgba(15,23,42,0.08)]"
    >
      <div className="mx-auto flex w-full flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <h2 className="text-[1.75rem] font-semibold tracking-[-0.04em] text-[#22262f]">Top Books</h2>

        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-5">
          {booksToShow.map((book, index) => (
            <div
              key={book.id}
              className="rounded-[1.6rem] border border-black/6 bg-white/88 p-5 shadow-[0_14px_28px_rgba(15,23,42,0.05)]"
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
                <BookCover book={book} widthClass="w-[8.8rem] sm:w-[9.2rem]" />
              </div>

              <div className="mt-4 min-w-0">
                <div className="text-[1.05rem] font-semibold leading-[1.25] tracking-[-0.04em] text-[#1f2430]">
                  {book.title.replaceAll("\n", " ")}
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

export default function ExploreBookstorePage() {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? "personal-development");
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const activeCategory =
    categories.find((category) => category.id === activeCategoryId) ?? categories[0];
  const activeBooks = activeCategory.books
    .map((id) => bookMap[id])
    .filter(Boolean) as Book[];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveAdIndex((current) => (current + 1) % adImages.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      id="page-top"
      className="min-h-screen bg-white text-[#1d2430]"
    >
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
                <Image
                  src={src}
                  alt="Bookstore promotion"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,20,28,0.48)_0%,rgba(17,20,28,0.18)_17%,rgba(255,255,255,0.03)_46%,rgba(255,255,255,0)_64%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18)_0%,transparent_52%)]" />
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
                  index === activeAdIndex ? "w-7 bg-[#5a8fe9]" : "w-2.5 bg-[#cfd9ea]"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full flex-col gap-12 px-4 py-8 sm:px-6 lg:gap-14 lg:px-8 xl:px-10">
        <section id="categories" className="-mt-1 space-y-8">
          <div className="grid gap-7 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                active={activeCategoryId === category.id}
                onSelect={() => {
                  startTransition(() => setActiveCategoryId(category.id));
                }}
              />
            ))}
          </div>
          <BookRow id="active-category" title={activeCategory.title} booksToShow={activeBooks} />
        </section>

        <section id="my-library" className="space-y-12">
          <BookRow
            id="recommendation"
            title="Recommendation"
            booksToShow={recommendationIds.map((id) => bookMap[id]).filter(Boolean) as Book[]}
          />
          <BookRow
            id="just-came-out"
            title="Just came out"
            booksToShow={justCameOutIds.map((id) => bookMap[id]).filter(Boolean) as Book[]}
          />
          <TopBooksRow
            booksToShow={topBookIds.map((id) => bookMap[id]).filter(Boolean) as Book[]}
          />
        </section>
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
