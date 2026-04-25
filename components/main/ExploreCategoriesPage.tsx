"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  type ExploreCategoryCollection,
  type ExploreOption,
} from "@/src/lib/exploreCategoryCollections";

function ExploreCategoryCard({
  category,
  option,
}: {
  category: ExploreCategoryCollection;
  option: ExploreOption;
}) {
  return (
    <Link
      href={`/explore/${category.id}?option=${option}`}
      className={`group relative block aspect-[0.88] overflow-hidden rounded-[1.65rem] bg-gradient-to-br ${category.color} p-5 shadow-[0_18px_36px_rgba(15,23,42,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_42px_rgba(15,23,42,0.18)]`}
    >
      <div className="relative z-10">
        <h2 className="text-[1.65rem] font-semibold tracking-[-0.05em] text-white">
          {category.title}
        </h2>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[36%] overflow-hidden rounded-b-[1.65rem]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,14,32,0)_0%,rgba(9,14,32,0.18)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[54%] bg-[rgba(22,28,58,0.18)]" />
        <div className="absolute inset-x-0 bottom-0 h-full">
          {category.backgroundImages.slice(0, 4).map((src, index) => (
            <div
              key={`${category.id}-bg-${index}`}
              className="absolute bottom-[-8%] overflow-hidden rounded-t-[0.35rem] opacity-[0.2]"
              style={{
                left: `${[-8, 16, 40, 67][index]}%`,
                width: `${[34, 32, 34, 32][index]}%`,
                height: `${[92, 82, 88, 80][index]}%`,
                transform: `rotate(${[-2, 1.5, -1, 2][index]}deg)`,
              }}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="140px" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pt-6">
        <div className="relative h-[62%] w-[48%] min-w-[9.8rem] max-w-[13rem] overflow-hidden rounded-[0.28rem] shadow-[0_20px_32px_rgba(0,0,0,0.28)] transition duration-300 group-hover:-translate-y-1">
          <Image
            src={category.heroImage}
            alt={category.title}
            fill
            className="object-cover"
            sizes="260px"
          />
        </div>
      </div>

      <div className="absolute inset-0 rounded-[1.65rem] ring-1 ring-white/14" />
    </Link>
  );
}

export default function ExploreCategoriesPage({
  option = "english",
  categories,
}: {
  option?: ExploreOption;
  categories: ExploreCategoryCollection[];
}) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<ExploreOption>(option);

  function handleOptionChange(nextOption: ExploreOption) {
    setSelectedOption(nextOption);
    router.replace(nextOption === "khmer" ? "/explore?option=khmer" : "/explore");
  }

  return (
    <main className="min-h-screen bg-white px-4 pb-14 pt-36 sm:px-6 sm:pt-40 lg:px-8">
      <div className="mx-auto max-w-[96rem] space-y-6">
        <div className="relative z-[1] flex items-center justify-start">
          <label className="inline-flex items-center gap-3 rounded-full border border-[#dde3ec] bg-white px-4 py-2.5 text-sm font-medium text-[#5f6a7b] shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#95a0b0]">
              Browse
            </span>
            <select
              value={selectedOption}
              onChange={(event) => handleOptionChange(event.target.value as ExploreOption)}
              className="min-w-[7rem] appearance-none bg-transparent pr-5 text-sm font-semibold text-[#202532] outline-none"
            >
              <option value="english">English</option>
              <option value="khmer">Khmer</option>
            </select>
          </label>
        </div>

        <section className="grid gap-4 pt-2 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <ExploreCategoryCard key={category.id} category={category} option={selectedOption} />
          ))}
        </section>
      </div>
    </main>
  );
}
