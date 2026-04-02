"use client";

import Image from "next/image";
import { useState } from "react";

type ExploreCategory = {
  id: string;
  title: string;
  color: string;
  heroImage: string;
  backgroundImages: string[];
};

type ExploreOption = "english" | "khmer";

const sharedBackgroundBooks = [
  "/MainPage/Books/Are you my mother.jpg",
  "/MainPage/Books/Atomic_habits.jpg",
  "/MainPage/Books/Germany Travel Book.jpg",
  "/MainPage/Books/The I Hate To Cook Book.jpg",
];

const khmerBookImages = [
  "/MainPage/Books/khmer_Books/image.png",
  "/MainPage/Books/khmer_Books/image copy.png",
  "/MainPage/Books/khmer_Books/image copy 2.png",
  "/MainPage/Books/khmer_Books/image copy 3.png",
  "/MainPage/Books/khmer_Books/image copy 4.png",
  "/MainPage/Books/khmer_Books/image copy 5.png",
];

const khmerBackgroundBooks = khmerBookImages.slice(0, 4);

const exploreCategories: ExploreCategory[] = [
  {
    id: "self-help",
    title: "Self-Help",
    color: "from-[#6e8465] to-[#49604a]",
    heroImage: "/MainPage/Books/Atomic_habits.jpg",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "fantasy",
    title: "Fantasy",
    color: "from-[#d85f58] to-[#9f3e3a]",
    heroImage: "/MainPage/Books/The Castle In the Moon.jpg",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "historical",
    title: "Historical",
    color: "from-[#5faa39] to-[#467d28]",
    heroImage: "/MainPage/Books/The Castle In the Mist.jpeg",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "sci-fi",
    title: "Sci-Fi",
    color: "from-[#1d2bca] to-[#10196f]",
    heroImage: "/MainPage/Books/9780399547003.jpeg",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "classics",
    title: "Classics",
    color: "from-[#cb7a73] to-[#954f4a]",
    heroImage: "/MainPage/Books/12132023_Book_Cover-Lessons_in_Chemistry_152020.jpg.webp",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "science",
    title: "Science",
    color: "from-[#db5bc8] to-[#983992]",
    heroImage: "/MainPage/Books/9780062390769_p0_v4_s600x595.jpg",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "finance",
    title: "Finance",
    color: "from-[#d5ad56] to-[#9a7331]",
    heroImage: "/MainPage/Books/all-the-single-ladies.jpg.webp",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "mystery",
    title: "Mystery",
    color: "from-[#6954f0] to-[#4532aa]",
    heroImage: "/MainPage/Books/The Castle In the Mist.jpeg",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "philosophy",
    title: "Philosophy",
    color: "from-[#cb3b2e] to-[#8d1f18]",
    heroImage: "/MainPage/Books/Are you my mother.jpg",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "biography",
    title: "Biography",
    color: "from-[#b2be4d] to-[#76812e]",
    heroImage: "/MainPage/Books/all-the-single-ladies.jpg.webp",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "romance",
    title: "Romance",
    color: "from-[#d9d9db] to-[#aeb3b9]",
    heroImage: "/MainPage/Books/12132023_Book_Cover-Lessons_in_Chemistry_152020.jpg.webp",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "travel",
    title: "Travel",
    color: "from-[#402420] to-[#241311]",
    heroImage: "/MainPage/Books/Germany Travel Book.jpg",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "drama",
    title: "Drama",
    color: "from-[#5dcf69] to-[#359048]",
    heroImage: "/MainPage/Books/The Castle In the Moon.jpg",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "cooking",
    title: "Cooking",
    color: "from-[#6cf0ca] to-[#3cb98e]",
    heroImage: "/MainPage/Books/The I Hate To Cook Book.jpg",
    backgroundImages: sharedBackgroundBooks,
  },
  {
    id: "horror",
    title: "Horror",
    color: "from-[#334e73] to-[#223754]",
    heroImage: "/MainPage/Books/9780399547003.jpeg",
    backgroundImages: sharedBackgroundBooks,
  },
];

const khmerExploreCategories: ExploreCategory[] = [
  {
    id: "khmer-knowledge",
    title: "Khmer Knowledge",
    color: "from-[#8f5f4a] to-[#62392c]",
    heroImage: khmerBookImages[0],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-history",
    title: "Khmer History",
    color: "from-[#c95f54] to-[#9a3c36]",
    heroImage: khmerBookImages[1],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-culture",
    title: "Khmer Culture",
    color: "from-[#5a9b43] to-[#396a2d]",
    heroImage: khmerBookImages[2],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-stories",
    title: "Khmer Stories",
    color: "from-[#2838bf] to-[#151c77]",
    heroImage: khmerBookImages[3],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-classics",
    title: "Khmer Classics",
    color: "from-[#c47f76] to-[#92554f]",
    heroImage: khmerBookImages[4],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-learning",
    title: "Khmer Learning",
    color: "from-[#d35cbf] to-[#9b3991]",
    heroImage: khmerBookImages[5],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-growth",
    title: "Khmer Growth",
    color: "from-[#d5ad56] to-[#9a7331]",
    heroImage: khmerBookImages[0],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-fiction",
    title: "Khmer Fiction",
    color: "from-[#6a57ef] to-[#4431a9]",
    heroImage: khmerBookImages[1],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-thoughts",
    title: "Khmer Thoughts",
    color: "from-[#cb3b2e] to-[#8d1f18]",
    heroImage: khmerBookImages[2],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-biography",
    title: "Khmer Biography",
    color: "from-[#b2be4d] to-[#76812e]",
    heroImage: khmerBookImages[3],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-romance",
    title: "Khmer Romance",
    color: "from-[#d9d9db] to-[#aeb3b9]",
    heroImage: khmerBookImages[4],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-travel",
    title: "Khmer Travel",
    color: "from-[#402420] to-[#241311]",
    heroImage: khmerBookImages[5],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-drama",
    title: "Khmer Drama",
    color: "from-[#5dcf69] to-[#359048]",
    heroImage: khmerBookImages[0],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-cooking",
    title: "Khmer Cooking",
    color: "from-[#6cf0ca] to-[#3cb98e]",
    heroImage: khmerBookImages[1],
    backgroundImages: khmerBackgroundBooks,
  },
  {
    id: "khmer-horror",
    title: "Khmer Horror",
    color: "from-[#334e73] to-[#223754]",
    heroImage: khmerBookImages[2],
    backgroundImages: khmerBackgroundBooks,
  },
];

function ExploreCategoryCard({ category }: { category: ExploreCategory }) {
  return (
    <article
      className={`group relative aspect-[0.88] overflow-hidden rounded-[1.65rem] bg-gradient-to-br ${category.color} p-5 shadow-[0_18px_36px_rgba(15,23,42,0.16)]`}
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
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="140px"
              />
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
    </article>
  );
}

export default function ExploreCategoriesPage({
  option = "english",
}: {
  option?: ExploreOption;
}) {
  const [selectedOption, setSelectedOption] = useState<ExploreOption>(option);
  const categories =
    selectedOption === "khmer" ? khmerExploreCategories : exploreCategories;

  return (
    <main className="min-h-screen bg-white px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8">
      <div className="mx-auto max-w-[96rem] space-y-6">
        <div className="relative z-[60] flex items-center justify-end pt-8 sm:pt-10">
          <div className="inline-flex rounded-full border border-[#dde3ec] bg-white p-1 shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
            <button
              type="button"
              onClick={() => setSelectedOption("english")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedOption === "english"
                  ? "bg-[#1f2430] text-white"
                  : "text-[#667081] hover:text-[#1f2430]"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setSelectedOption("khmer")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedOption === "khmer"
                  ? "bg-[#1f2430] text-white"
                  : "text-[#667081] hover:text-[#1f2430]"
              }`}
            >
              Khmer
            </button>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <ExploreCategoryCard key={category.id} category={category} />
          ))}
        </section>
      </div>
    </main>
  );
}
