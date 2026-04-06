import { getReaderBookDetail, type ReaderBookDetail } from "@/src/lib/readerBookDetails";

export type ExploreOption = "english" | "khmer";

export type ExploreCategoryCollection = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  heroBookId: string;
  heroImage: string;
  backgroundImages: string[];
  bookIds: string[];
};

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

export const englishExploreCategories: ExploreCategoryCollection[] = [
  {
    id: "self-help",
    title: "Self-Help",
    subtitle: "Popular self-growth and practical books for readers who want to improve day by day.",
    color: "from-[#6e8465] to-[#49604a]",
    heroBookId: "atomic-habits",
    heroImage: "/MainPage/Books/Atomic_habits.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["atomic-habits", "life-impossible", "verity", "favorites", "three-days-in-june"],
  },
  {
    id: "fantasy",
    title: "Fantasy",
    subtitle: "Magical worlds, adventure, mystery, and beautiful escapist fiction.",
    color: "from-[#d85f58] to-[#9f3e3a]",
    heroBookId: "castle-in-the-moon",
    heroImage: "/MainPage/Books/The Castle In the Moon.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["castle-in-the-moon", "castle-in-the-mist", "thorns-and-roses", "wild-dark-shore", "song-of-achilles"],
  },
  {
    id: "historical",
    title: "Historical",
    subtitle: "Stories with rich atmosphere, memory, and time-shaped settings.",
    color: "from-[#5faa39] to-[#467d28]",
    heroBookId: "castle-in-the-mist",
    heroImage: "/MainPage/Books/The Castle In the Mist.jpeg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["castle-in-the-mist", "song-of-achilles", "three-days-in-june", "dirt", "favorites"],
  },
  {
    id: "sci-fi",
    title: "Sci-Fi",
    subtitle: "Futuristic, imaginative, and emotionally immersive speculative reads.",
    color: "from-[#1d2bca] to-[#10196f]",
    heroBookId: "life-impossible",
    heroImage: "/MainPage/Books/9780399547003.jpeg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["life-impossible", "wild-dark-shore", "castle-in-the-mist", "favorites", "listen-for-the-lie"],
  },
  {
    id: "classics",
    title: "Classics",
    subtitle: "Recognizable titles and timeless stories that still feel fresh.",
    color: "from-[#cb7a73] to-[#954f4a]",
    heroBookId: "lessons-in-chemistry",
    heroImage: "/MainPage/Books/12132023_Book_Cover-Lessons_in_Chemistry_152020.jpg.webp",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["are-you-my-mother", "lessons-in-chemistry", "three-days-in-june", "song-of-achilles", "verity"],
  },
  {
    id: "science",
    title: "Science",
    subtitle: "Books for curious minds who enjoy ideas, knowledge, and discovery.",
    color: "from-[#db5bc8] to-[#983992]",
    heroBookId: "all-the-single-ladies",
    heroImage: "/MainPage/Books/9780062390769_p0_v4_s600x595.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["lessons-in-chemistry", "all-the-single-ladies", "atomic-habits", "life-impossible", "favorites"],
  },
  {
    id: "finance",
    title: "Finance",
    subtitle: "Smart money and practical thinking for readers who want useful insight.",
    color: "from-[#d5ad56] to-[#9a7331]",
    heroBookId: "atomic-habits",
    heroImage: "/MainPage/Books/Atomic_habits.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["atomic-habits", "life-impossible", "all-the-single-ladies", "favorites", "verity"],
  },
  {
    id: "mystery",
    title: "Mystery",
    subtitle: "Suspenseful, twisty books that keep readers curious until the end.",
    color: "from-[#6954f0] to-[#4532aa]",
    heroBookId: "listen-for-the-lie",
    heroImage: "/MainPage/Books/listen-for-the-lie.jpeg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["listen-for-the-lie", "verity", "wild-dark-shore", "favorites", "castle-in-the-mist"],
  },
  {
    id: "philosophy",
    title: "Philosophy",
    subtitle: "Reflective, idea-driven reads for slow thoughtful reading.",
    color: "from-[#cb3b2e] to-[#8d1f18]",
    heroBookId: "are-you-my-mother",
    heroImage: "/MainPage/Books/Are you my mother.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["atomic-habits", "life-impossible", "elf-shack", "three-days-in-june", "song-of-achilles"],
  },
  {
    id: "biography",
    title: "Biography",
    subtitle: "Personal stories, life journeys, and books with a human center.",
    color: "from-[#b2be4d] to-[#76812e]",
    heroBookId: "all-the-single-ladies",
    heroImage: "/MainPage/Books/all-the-single-ladies.jpg.webp",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["all-the-single-ladies", "favorites", "dirt", "three-days-in-june", "life-impossible"],
  },
  {
    id: "romance",
    title: "Romance",
    subtitle: "Warm, emotional, and relationship-driven books for comfort reading.",
    color: "from-[#d9d9db] to-[#aeb3b9]",
    heroBookId: "it-ends-with-us",
    heroImage: "/MainPage/Books/12132023_Book_Cover-Lessons_in_Chemistry_152020.jpg.webp",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["it-ends-with-us", "thorns-and-roses", "all-the-single-ladies", "favorites", "three-days-in-june"],
  },
  {
    id: "travel",
    title: "Travel",
    subtitle: "Place-based books and destination-inspired reading for wanderers.",
    color: "from-[#402420] to-[#241311]",
    heroBookId: "germany-travel-book",
    heroImage: "/MainPage/Books/Germany Travel Book.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["germany-travel-book", "life-impossible", "dirt", "favorites", "three-days-in-june"],
  },
  {
    id: "drama",
    title: "Drama",
    subtitle: "Emotion-rich stories with tension, relationships, and strong character arcs.",
    color: "from-[#5dcf69] to-[#359048]",
    heroBookId: "favorites",
    heroImage: "/MainPage/Books/the-favorites.jpeg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["favorites", "it-ends-with-us", "thorns-and-roses", "dirt", "life-impossible"],
  },
  {
    id: "cooking",
    title: "Cooking",
    subtitle: "Practical and casual cooking books for readers who want something useful.",
    color: "from-[#6cf0ca] to-[#3cb98e]",
    heroBookId: "hate-to-cook-book",
    heroImage: "/MainPage/Books/The I Hate To Cook Book.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["hate-to-cook-book", "atomic-habits", "germany-travel-book", "all-the-single-ladies", "life-impossible"],
  },
  {
    id: "horror",
    title: "Horror",
    subtitle: "Dark, eerie, and atmospheric reads with a stronger edge.",
    color: "from-[#334e73] to-[#223754]",
    heroBookId: "wild-dark-shore",
    heroImage: "/MainPage/Books/The Castle In the Mist.jpeg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["wild-dark-shore", "listen-for-the-lie", "castle-in-the-mist", "verity", "favorites"],
  },
];

export const khmerExploreCategories: ExploreCategoryCollection[] = [
  {
    id: "khmer-knowledge",
    title: "Khmer Knowledge",
    subtitle: "Popular Khmer books collected around practical and accessible knowledge.",
    color: "from-[#8f5f4a] to-[#62392c]",
    heroBookId: "khmer-1",
    heroImage: khmerBookImages[0],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-1", "khmer-6", "khmer-5", "khmer-2"],
  },
  {
    id: "khmer-history",
    title: "Khmer History",
    subtitle: "Khmer historical titles and culturally rooted reading suggestions.",
    color: "from-[#c95f54] to-[#9a3c36]",
    heroBookId: "khmer-2",
    heroImage: khmerBookImages[1],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-2", "khmer-3", "khmer-1", "khmer-4"],
  },
  {
    id: "khmer-culture",
    title: "Khmer Culture",
    subtitle: "Books reflecting Khmer culture, feeling, and familiar local stories.",
    color: "from-[#5a9b43] to-[#396a2d]",
    heroBookId: "khmer-3",
    heroImage: khmerBookImages[2],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-3", "khmer-4", "khmer-1", "khmer-5"],
  },
  {
    id: "khmer-stories",
    title: "Khmer Stories",
    subtitle: "Popular Khmer story collections for readers who want narrative-focused local books.",
    color: "from-[#2838bf] to-[#151c77]",
    heroBookId: "khmer-4",
    heroImage: khmerBookImages[3],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-4", "khmer-2", "khmer-3", "khmer-5"],
  },
  {
    id: "khmer-classics",
    title: "Khmer Classics",
    subtitle: "Traditional and recognizable Khmer reading in one place.",
    color: "from-[#c47f76] to-[#92554f]",
    heroBookId: "khmer-5",
    heroImage: khmerBookImages[4],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-5", "khmer-1", "khmer-2", "khmer-4"],
  },
  {
    id: "khmer-learning",
    title: "Khmer Learning",
    subtitle: "Useful Khmer reading for readers who want practical improvement.",
    color: "from-[#d35cbf] to-[#9b3991]",
    heroBookId: "khmer-6",
    heroImage: khmerBookImages[5],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-6", "khmer-1", "khmer-3", "khmer-5"],
  },
  {
    id: "khmer-growth",
    title: "Khmer Growth",
    subtitle: "Khmer books that feel practical, reflective, and motivating.",
    color: "from-[#d5ad56] to-[#9a7331]",
    heroBookId: "khmer-1",
    heroImage: khmerBookImages[0],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-1", "khmer-6", "khmer-2", "khmer-3"],
  },
  {
    id: "khmer-fiction",
    title: "Khmer Fiction",
    subtitle: "A category for readers who want story-led Khmer books.",
    color: "from-[#6a57ef] to-[#4431a9]",
    heroBookId: "khmer-2",
    heroImage: khmerBookImages[1],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-4", "khmer-2", "khmer-3", "khmer-5"],
  },
  {
    id: "khmer-thoughts",
    title: "Khmer Thoughts",
    subtitle: "Reflective Khmer reading with a calmer and more thoughtful tone.",
    color: "from-[#cb3b2e] to-[#8d1f18]",
    heroBookId: "khmer-3",
    heroImage: khmerBookImages[2],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-3", "khmer-1", "khmer-6", "khmer-5"],
  },
  {
    id: "khmer-biography",
    title: "Khmer Biography",
    subtitle: "People-centered Khmer reading grouped into one shelf.",
    color: "from-[#b2be4d] to-[#76812e]",
    heroBookId: "khmer-4",
    heroImage: khmerBookImages[3],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-4", "khmer-2", "khmer-1", "khmer-3"],
  },
  {
    id: "khmer-romance",
    title: "Khmer Romance",
    subtitle: "Softer local stories for readers who want emotional Khmer books.",
    color: "from-[#d9d9db] to-[#aeb3b9]",
    heroBookId: "khmer-5",
    heroImage: khmerBookImages[4],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-5", "khmer-4", "khmer-2", "khmer-1"],
  },
  {
    id: "khmer-travel",
    title: "Khmer Travel",
    subtitle: "Travel-feeling Khmer titles and local atmosphere in one place.",
    color: "from-[#402420] to-[#241311]",
    heroBookId: "khmer-6",
    heroImage: khmerBookImages[5],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-6", "khmer-3", "khmer-2", "khmer-1"],
  },
  {
    id: "khmer-drama",
    title: "Khmer Drama",
    subtitle: "Character-led Khmer books with more emotional storytelling.",
    color: "from-[#5dcf69] to-[#359048]",
    heroBookId: "khmer-1",
    heroImage: khmerBookImages[0],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-1", "khmer-4", "khmer-3", "khmer-2"],
  },
  {
    id: "khmer-cooking",
    title: "Khmer Cooking",
    subtitle: "Practical Khmer reads with useful, everyday value.",
    color: "from-[#6cf0ca] to-[#3cb98e]",
    heroBookId: "khmer-2",
    heroImage: khmerBookImages[1],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-2", "khmer-6", "khmer-1", "khmer-5"],
  },
  {
    id: "khmer-horror",
    title: "Khmer Horror",
    subtitle: "Darker Khmer shelf picks collected into one category page.",
    color: "from-[#334e73] to-[#223754]",
    heroBookId: "khmer-3",
    heroImage: khmerBookImages[2],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-3", "khmer-4", "khmer-2", "khmer-5"],
  },
];

export function getExploreCategories(option: ExploreOption) {
  return option === "khmer" ? khmerExploreCategories : englishExploreCategories;
}

export function getExploreCategory(option: ExploreOption, categoryId: string) {
  return getExploreCategories(option).find((category) => category.id === categoryId);
}

export function getExploreCategoryBooks(category: ExploreCategoryCollection): ReaderBookDetail[] {
  return category.bookIds
    .map((id) => getReaderBookDetail(id))
    .filter((book): book is ReaderBookDetail => Boolean(book));
}
