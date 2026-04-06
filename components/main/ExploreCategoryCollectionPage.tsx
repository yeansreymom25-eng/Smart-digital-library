"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReaderBookDetail } from "@/src/lib/readerBookDetails";
import {
  getExploreCategoryBooks,
  type ExploreCategoryCollection,
  type ExploreOption,
} from "@/src/lib/exploreCategoryCollections";

const mysteryMoodImages = [
  "/MainPage/ExploreMood/images.jpeg",
  "/MainPage/ExploreMood/images-1.jpeg",
  "/MainPage/ExploreMood/unknown.jpeg",
  "/MainPage/ExploreMood/horror-mystery.jpg",
];

function getMoodImages(category: ExploreCategoryCollection, books: ReaderBookDetail[]) {
  const thematicIds = ["mystery", "horror", "fantasy", "historical", "khmer-stories", "khmer-fiction"];
  const useMysteryImages = thematicIds.some((id) => category.id.includes(id));

  if (useMysteryImages) {
    return mysteryMoodImages;
  }

  const bookImages = books.slice(0, 4).map((book) => book.imageSrc);
  return [...bookImages, category.heroImage].filter(Boolean);
}

function getEditorialCopy(category: ExploreCategoryCollection, books: ReaderBookDetail[]) {
  return {
    eyebrow: "Collection Atmosphere",
    title: category.title,
    intro: category.subtitle,
    body: `This collection brings together ${books.length} standout reads shaped around ${category.title.toLowerCase()}. It is meant to feel like a premium shelf inside the library: more curated, more atmospheric, and easier to explore slowly.`,
    detail: `Browse the popular titles first, then move lower through the shelf for more of the same reading mood without the feeling of a sales page.`,
  };
}

function CollectionBookCard({ book }: { book: ReaderBookDetail }) {
  return (
    <Link
      href={`/book/${book.id}/read`}
      className="group flex flex-col gap-3 rounded-[1.55rem] border border-[#edf1f6] bg-white p-4 shadow-[0_12px_26px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[1rem] border border-black/5 bg-[#f8fafc]">
        <Image src={book.imageSrc} alt={book.title} fill className="object-cover" sizes="220px" />
      </div>
      <div>
        <h3 className="text-[1.05rem] font-semibold tracking-[-0.03em] text-[#202532]">{book.title}</h3>
        <p className="mt-1 text-sm text-[#7a8597]">{book.author}</p>
      </div>
    </Link>
  );
}

function ShelfRow({
  title,
  books,
}: {
  title: string;
  books: ReaderBookDetail[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-[1.85rem] font-semibold tracking-[-0.05em] text-[#202532]">{title}</h2>
        <span className="text-[1.8rem] font-medium leading-none text-[#b0b9c8]">›</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {books.map((book) => (
          <CollectionBookCard key={`${title}-${book.id}`} book={book} />
        ))}
      </div>
    </section>
  );
}

export default function ExploreCategoryCollectionPage({
  category,
  option,
}: {
  category: ExploreCategoryCollection;
  option: ExploreOption;
}) {
  const books = useMemo(() => getExploreCategoryBooks(category), [category]);
  const [imageIndex, setImageIndex] = useState(0);

  const popularBooks = books.slice(0, 4);
  const readerPicks = [...books.slice(1), ...books.slice(0, 1)].slice(0, 4);
  const moreInCategory = [...books.slice(2), ...books.slice(0, 2)].slice(0, 4);
  const moodImages = useMemo(() => getMoodImages(category, books), [books, category]);
  const copy = useMemo(() => getEditorialCopy(category, books), [books, category]);
  const activeImageIndex = moodImages.length > 0 ? imageIndex % moodImages.length : 0;

  useEffect(() => {
    if (moodImages.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % moodImages.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [moodImages]);

  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-36 sm:px-6 sm:pt-40 lg:px-8">
      <div className="mx-auto max-w-[96rem] space-y-8">
        <section
          className={`overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${category.color} p-[1px] shadow-[0_22px_42px_rgba(15,23,42,0.1)]`}
        >
          <div className="relative rounded-[calc(2.5rem-1px)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.9)_100%)] p-6 sm:p-8 lg:p-10">
            <div className="absolute left-6 top-6 z-20 sm:left-8 sm:top-8 lg:left-10 lg:top-10">
              <Link
                href={option === "khmer" ? "/explore?option=khmer" : "/explore"}
                className="inline-flex items-center gap-2 rounded-full border border-[#dbe2ec] bg-white/92 px-4 py-2 text-sm font-semibold text-[#5f6a7a] shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition hover:bg-[#fbfcff]"
              >
                <span className="text-base">‹</span>
                Back to Explore
              </Link>
            </div>

            <div className="grid gap-8 pt-14 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-stretch xl:gap-10">
              <div className="flex flex-col justify-center">
                <p className="text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-[#8a95a6]">
                  {copy.eyebrow}
                </p>
                <h1 className="mt-4 text-[3.15rem] font-semibold tracking-[-0.07em] text-[#202532] sm:text-[4.05rem]">
                  {copy.title}
                </h1>
                <p className="mt-5 max-w-2xl text-[1.08rem] leading-8 text-[#617084]">
                  {copy.intro}
                </p>
                <p className="mt-5 max-w-2xl text-[1rem] leading-8 text-[#7b8798]">
                  {copy.body}
                </p>
                <p className="mt-4 max-w-2xl text-[0.96rem] leading-8 text-[#96a0ae]">
                  {copy.detail}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <span className="rounded-full bg-[#f4f7fb] px-4 py-2 text-sm font-semibold text-[#5e6978]">
                    {books.length} books in this shelf
                  </span>
                  <span className="rounded-full bg-[#f4f7fb] px-4 py-2 text-sm font-semibold text-[#5e6978]">
                    Popular first
                  </span>
                  <span className="rounded-full bg-[#f4f7fb] px-4 py-2 text-sm font-semibold text-[#5e6978]">
                    Collection view
                  </span>
                </div>
              </div>

              <div className="relative min-h-[19rem] overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08))] shadow-[0_18px_34px_rgba(15,23,42,0.12)] xl:min-h-[25rem]">
                {moodImages.map((image, index) => (
                  <Image
                    key={`${category.id}-${image}`}
                    src={image}
                    alt={`${category.title} atmosphere ${index + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-[1600ms] ${
                      index === activeImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(min-width: 1280px) 560px, 100vw"
                  />
                ))}

                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.45)_28%,rgba(255,255,255,0.12)_58%,rgba(255,255,255,0.08)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_30%,rgba(255,255,255,0.22)_100%)]" />
                <div className="absolute -left-8 top-[18%] h-[12rem] w-[12rem] rounded-full bg-white/65 blur-[36px]" />
                <div className="absolute left-[20%] top-[55%] h-[9rem] w-[9rem] rounded-full bg-white/30 blur-[34px]" />
                <div className="absolute right-[-2rem] top-[8%] h-[10rem] w-[10rem] rounded-full bg-white/18 blur-[42px]" />

                <div className="absolute bottom-5 right-5 flex gap-3">
                  {books.slice(0, 3).map((book, index) => (
                    <div
                      key={`${category.id}-${book.id}`}
                      className="relative h-[5.8rem] w-[3.9rem] overflow-hidden rounded-[0.85rem] border border-white/35 shadow-[0_12px_24px_rgba(15,23,42,0.18)]"
                      style={{
                        transform: `translateY(${index * 6}px) rotate(${index === 1 ? "-3deg" : index === 2 ? "4deg" : "-8deg"})`,
                        opacity: index === 2 ? 0.78 : 0.92,
                      }}
                    >
                      <Image src={book.imageSrc} alt={book.title} fill className="object-cover" sizes="64px" />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-5 left-5 flex items-center gap-2">
                  {moodImages.map((_, index) => (
                    <span
                      key={`${category.id}-dot-${index}`}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeImageIndex ? "w-7 bg-white" : "w-2.5 bg-white/55"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ShelfRow title={`Popular in ${category.title}`} books={popularBooks} />
        <ShelfRow title={`Readers also choose in ${category.title}`} books={readerPicks} />
        <ShelfRow title={`More ${category.title}`} books={moreInCategory} />
      </div>
    </main>
  );
}
