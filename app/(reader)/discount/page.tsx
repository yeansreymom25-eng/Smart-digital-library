"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getReaderBookCurrentPrice,
  getReaderBookDiscountRate,
  isReaderBookDiscounted,
  readerBookDetails,
  type ReaderBookDetail,
} from "@/src/lib/readerBookDetails";

type DiscountKind = "rent" | "buy" | "free";
type DiscountRate = 25 | 50 | 75 | 100;

type DiscountBook = ReaderBookDetail & {
  discountRate: DiscountRate;
  kind: DiscountKind;
};

const rateFilters = [25, 50, 75] as const;
const kindFilters = [
  { value: "rent" as const, label: "Rent Discount" },
  { value: "buy" as const, label: "Buy Discount" },
  { value: "free" as const, label: "Free" },
] as const;

const discountBooks: DiscountBook[] = readerBookDetails
  .filter((book) => book.access === "free" || isReaderBookDiscounted(book))
  .map((book) => {
    const discountRate = getReaderBookDiscountRate(book) as DiscountRate;
    const kind: DiscountKind =
      book.access === "free" ? "free" : book.access === "buy-rent" ? "rent" : "buy";

    return {
      ...book,
      discountRate,
      kind,
    };
  });

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-[#222733] bg-[#222733] text-white shadow-[0_10px_18px_rgba(34,39,51,0.16)]"
          : "border-[#d9dee7] bg-white text-[#6a7484] hover:border-[#bfc7d4] hover:text-[#222733]"
      }`}
    >
      {label}
    </button>
  );
}

function DiscountBadge({ book }: { book: DiscountBook }) {
  const label = book.kind === "free" ? "FREE" : `${book.discountRate}% OFF`;

  return (
    <div className="flex h-[5.75rem] w-[5.75rem] items-center justify-center rounded-full bg-[#ef4937] text-center shadow-[0_14px_26px_rgba(239,73,55,0.22)]">
      <span className="text-[1.15rem] font-black leading-[1.02] tracking-[-0.05em] text-white">
        {label.split(" ").map((part, index) => (
          <span key={`${label}-${index}`} className="block">
            {part}
          </span>
        ))}
      </span>
    </div>
  );
}

function DiscountKindPill({ kind }: { kind: DiscountKind }) {
  const label = kind === "rent" ? "Rent" : kind === "buy" ? "Buy" : "Free";

  return (
    <span className="inline-flex rounded-full bg-[#eef1f7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#566173]">
      {label}
    </span>
  );
}

export default function DiscountPage() {
  const [selectedRates, setSelectedRates] = useState<DiscountRate[]>([]);
  const [selectedKinds, setSelectedKinds] = useState<DiscountKind[]>([]);
  const [search, setSearch] = useState("");

  const filteredBooks = useMemo(() => {
    return discountBooks.filter((book) => {
      const matchesRate =
        selectedRates.length === 0 ||
        (book.discountRate !== 100 && selectedRates.includes(book.discountRate));
      const matchesKind = selectedKinds.length === 0 || selectedKinds.includes(book.kind);
      const matchesSearch =
        search.trim().length === 0 ||
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());

      return matchesRate && matchesKind && matchesSearch;
    });
  }, [search, selectedKinds, selectedRates]);

  function toggleRate(rate: DiscountRate) {
    setSelectedRates((current) =>
      current.includes(rate) ? current.filter((item) => item !== rate) : [...current, rate]
    );
  }

  function toggleKind(kind: DiscountKind) {
    setSelectedKinds((current) =>
      current.includes(kind) ? current.filter((item) => item !== kind) : [...current, kind]
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[96rem] space-y-8">
        <section className="rounded-[2rem] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-5 shadow-[0_18px_34px_rgba(15,23,42,0.06)] sm:px-6">
          <div className="flex flex-col gap-5">
            <div className="grid gap-4 xl:grid-cols-[12rem_minmax(0,1fr)_20rem] xl:items-center">
              <div className="text-sm font-semibold text-[#495364]">Discount Type</div>
              <div className="flex flex-wrap gap-3">
                {rateFilters.map((rate) => (
                  <FilterChip
                    key={rate}
                    active={selectedRates.includes(rate)}
                    label={`${rate}%`}
                    onClick={() => toggleRate(rate)}
                  />
                ))}
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search discount books"
                className="h-11 rounded-full border border-[#dbe2ec] bg-white px-4 text-sm text-[#314053] outline-none placeholder:text-[#a0a9b8]"
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-[12rem_minmax(0,1fr)] xl:items-center">
              <div className="text-sm font-semibold text-[#495364]">Selection</div>
              <div className="flex flex-wrap gap-3">
                {kindFilters.map((item) => (
                  <FilterChip
                    key={item.value}
                    active={selectedKinds.includes(item.value)}
                    label={item.label}
                    onClick={() => toggleKind(item.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          {filteredBooks.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#d7dde7] bg-[#fbfcff] px-6 py-14 text-center text-[#7b8595] shadow-[0_14px_28px_rgba(15,23,42,0.04)]">
              No discounted books match those filters right now.
            </div>
          ) : (
            filteredBooks.map((book) => {
              const currentPrice = getReaderBookCurrentPrice(book);

              return (
                <article
                  key={book.id}
                  className="rounded-[2.2rem] border border-black/5 bg-white px-6 py-6 shadow-[0_18px_34px_rgba(15,23,42,0.06)]"
                >
                  <div className="grid gap-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] md:items-start lg:gap-8">
                    <div className="mx-auto w-[12rem] md:mx-0 md:w-[14rem]">
                      <Link
                        href={`/book/${book.id}/read`}
                        className="relative block aspect-[2/3] overflow-hidden rounded-[0.8rem] border border-black/5 shadow-[0_18px_28px_rgba(15,23,42,0.12)]"
                      >
                        <Image
                          src={book.imageSrc}
                          alt={book.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 224px, 192px"
                        />
                      </Link>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Link
                          href={`/book/${book.id}/read`}
                          className="block text-[2.4rem] font-semibold tracking-[-0.06em] text-[#8b8f98] transition hover:text-[#5f6672]"
                        >
                          {book.title}
                        </Link>
                        <p className="text-[1.45rem] font-medium tracking-[-0.04em] text-[#8b8f98]">
                          {book.author}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <DiscountKindPill kind={book.kind} />
                        {book.kind !== "free" ? (
                          <span className="inline-flex rounded-full bg-[#eef1f7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#566173]">
                            {book.discountRate}% Discount
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {book.kind === "free" ? (
                          <span className="text-[1.55rem] font-semibold tracking-[-0.05em] text-[#6b6f76]">
                            Free
                          </span>
                        ) : (
                          <>
                            {book.originalPrice ? (
                              <span className="text-[1.35rem] font-semibold text-[#9ea5b1] line-through">
                                {formatPrice(book.originalPrice)}
                              </span>
                            ) : null}
                            <span className="text-[1.55rem] font-semibold tracking-[-0.05em] text-[#444d5b]">
                              {formatPrice(currentPrice)}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="max-w-3xl text-[1rem] leading-7 text-[#949ba7]">
                        {book.description}
                      </p>
                    </div>

                    <div className="flex justify-center md:justify-end">
                      <DiscountBadge book={book} />
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
