import { createServerClient } from "@supabase/ssr";

export type ExploreOption = "english" | "khmer";

export type ExploreCategoryCollection = {
  id: string;
  title: string;
  englishTitle: string;
  subtitle: string;
  color: string;
  heroBookId: string;
  heroImage: string;
  backgroundImages: string[];
  bookIds: string[];
};

type ExploreVisualPreset = Omit<ExploreCategoryCollection, "id" | "title" | "subtitle" | "englishTitle"> & {
  matchKeys: string[];
  defaultTitle: string;
  defaultSubtitle: string;
};

type CategoryRow = {
  id: string;
  name: string;
  description: string | null;
  library_type: string | null;
};

type BookVisualRow = {
  id: string;
  category: string | null;
  cover_url: string | null;
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

const englishVisualPresets: ExploreVisualPreset[] = [
  {
    matchKeys: ["self-help", "self help"],
    defaultTitle: "Self-Help",
    defaultSubtitle: "Popular self-growth and practical books for readers who want to improve day by day.",
    color: "from-[#6e8465] to-[#49604a]",
    heroBookId: "atomic-habits",
    heroImage: "/MainPage/Books/Atomic_habits.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["atomic-habits", "life-impossible", "verity", "favorites", "three-days-in-june"],
  },
  {
    matchKeys: ["fantasy"],
    defaultTitle: "Fantasy",
    defaultSubtitle: "Magical worlds, adventure, mystery, and beautiful escapist fiction.",
    color: "from-[#d85f58] to-[#9f3e3a]",
    heroBookId: "castle-in-the-moon",
    heroImage: "/MainPage/Books/The Castle In the Moon.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["castle-in-the-moon", "castle-in-the-mist", "thorns-and-roses", "wild-dark-shore", "song-of-achilles"],
  },
  {
    matchKeys: ["historical", "history"],
    defaultTitle: "Historical",
    defaultSubtitle: "Stories with rich atmosphere, memory, and time-shaped settings.",
    color: "from-[#5faa39] to-[#467d28]",
    heroBookId: "castle-in-the-mist",
    heroImage: "/MainPage/Books/The Castle In the Mist.jpeg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["castle-in-the-mist", "song-of-achilles", "three-days-in-june", "dirt", "favorites"],
  },
  {
    matchKeys: ["sci-fi", "sci fi", "science fiction"],
    defaultTitle: "Sci-Fi",
    defaultSubtitle: "Futuristic, imaginative, and emotionally immersive speculative reads.",
    color: "from-[#1d2bca] to-[#10196f]",
    heroBookId: "life-impossible",
    heroImage: "/MainPage/Books/9780399547003.jpeg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["life-impossible", "wild-dark-shore", "castle-in-the-mist", "favorites", "listen-for-the-lie"],
  },
  {
    matchKeys: ["classics", "classic"],
    defaultTitle: "Classics",
    defaultSubtitle: "Recognizable titles and timeless stories that still feel fresh.",
    color: "from-[#cb7a73] to-[#954f4a]",
    heroBookId: "lessons-in-chemistry",
    heroImage: "/MainPage/Books/12132023_Book_Cover-Lessons_in_Chemistry_152020.jpg.webp",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["are-you-my-mother", "lessons-in-chemistry", "three-days-in-june", "song-of-achilles", "verity"],
  },
  {
    matchKeys: ["science"],
    defaultTitle: "Science",
    defaultSubtitle: "Books for curious minds who enjoy ideas, knowledge, and discovery.",
    color: "from-[#db5bc8] to-[#983992]",
    heroBookId: "all-the-single-ladies",
    heroImage: "/MainPage/Books/9780062390769_p0_v4_s600x595.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["lessons-in-chemistry", "all-the-single-ladies", "atomic-habits", "life-impossible", "favorites"],
  },
  {
    matchKeys: ["finance", "business"],
    defaultTitle: "Finance",
    defaultSubtitle: "Smart money and practical thinking for readers who want useful insight.",
    color: "from-[#d5ad56] to-[#9a7331]",
    heroBookId: "atomic-habits",
    heroImage: "/MainPage/Books/Atomic_habits.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["atomic-habits", "life-impossible", "all-the-single-ladies", "favorites", "verity"],
  },
  {
    matchKeys: ["mystery"],
    defaultTitle: "Mystery",
    defaultSubtitle: "Suspenseful, twisty books that keep readers curious until the end.",
    color: "from-[#6954f0] to-[#4532aa]",
    heroBookId: "listen-for-the-lie",
    heroImage: "/MainPage/Books/listen-for-the-lie.jpeg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["listen-for-the-lie", "verity", "wild-dark-shore", "favorites", "castle-in-the-mist"],
  },
  {
    matchKeys: ["philosophy"],
    defaultTitle: "Philosophy",
    defaultSubtitle: "Reflective, idea-driven reads for slow thoughtful reading.",
    color: "from-[#cb3b2e] to-[#8d1f18]",
    heroBookId: "are-you-my-mother",
    heroImage: "/MainPage/Books/Are you my mother.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["atomic-habits", "life-impossible", "elf-shack", "three-days-in-june", "song-of-achilles"],
  },
  {
    matchKeys: ["biography", "memoir"],
    defaultTitle: "Biography",
    defaultSubtitle: "Personal stories, life journeys, and books with a human center.",
    color: "from-[#b2be4d] to-[#76812e]",
    heroBookId: "all-the-single-ladies",
    heroImage: "/MainPage/Books/all-the-single-ladies.jpg.webp",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["all-the-single-ladies", "favorites", "dirt", "three-days-in-june", "life-impossible"],
  },
  {
    matchKeys: ["romance"],
    defaultTitle: "Romance",
    defaultSubtitle: "Warm, emotional, and relationship-driven books for comfort reading.",
    color: "from-[#d9d9db] to-[#aeb3b9]",
    heroBookId: "it-ends-with-us",
    heroImage: "/MainPage/Books/12132023_Book_Cover-Lessons_in_Chemistry_152020.jpg.webp",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["it-ends-with-us", "thorns-and-roses", "all-the-single-ladies", "favorites", "three-days-in-june"],
  },
  {
    matchKeys: ["travel"],
    defaultTitle: "Travel",
    defaultSubtitle: "Place-based books and destination-inspired reading for wanderers.",
    color: "from-[#402420] to-[#241311]",
    heroBookId: "germany-travel-book",
    heroImage: "/MainPage/Books/Germany Travel Book.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["germany-travel-book", "life-impossible", "dirt", "favorites", "three-days-in-june"],
  },
  {
    matchKeys: ["drama"],
    defaultTitle: "Drama",
    defaultSubtitle: "Emotion-rich stories with tension, relationships, and strong character arcs.",
    color: "from-[#5dcf69] to-[#359048]",
    heroBookId: "favorites",
    heroImage: "/MainPage/Books/the-favorites.jpeg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["favorites", "it-ends-with-us", "thorns-and-roses", "dirt", "life-impossible"],
  },
  {
    matchKeys: ["cooking", "cook"],
    defaultTitle: "Cooking",
    defaultSubtitle: "Practical and casual cooking books for readers who want something useful.",
    color: "from-[#6cf0ca] to-[#3cb98e]",
    heroBookId: "hate-to-cook-book",
    heroImage: "/MainPage/Books/The I Hate To Cook Book.jpg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["hate-to-cook-book", "atomic-habits", "germany-travel-book", "all-the-single-ladies", "life-impossible"],
  },
  {
    matchKeys: ["horror"],
    defaultTitle: "Horror",
    defaultSubtitle: "Dark, eerie, and atmospheric reads with a stronger edge.",
    color: "from-[#334e73] to-[#223754]",
    heroBookId: "wild-dark-shore",
    heroImage: "/MainPage/Books/The Castle In the Mist.jpeg",
    backgroundImages: sharedBackgroundBooks,
    bookIds: ["wild-dark-shore", "listen-for-the-lie", "castle-in-the-mist", "verity", "favorites"],
  },
];

const khmerVisualPresets: ExploreVisualPreset[] = [
  {
    matchKeys: ["self-help", "self help"],
    defaultTitle: "Self-Help",
    defaultSubtitle: "Khmer self-growth and practical books.",
    color: "from-[#6e8465] to-[#49604a]",
    heroBookId: "khmer-1",
    heroImage: khmerBookImages[0],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-1", "khmer-6", "khmer-5", "khmer-2"],
  },
  {
    matchKeys: ["fantasy"],
    defaultTitle: "Fantasy",
    defaultSubtitle: "Khmer fantasy and imaginative stories.",
    color: "from-[#d85f58] to-[#9f3e3a]",
    heroBookId: "khmer-2",
    heroImage: khmerBookImages[1],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-2", "khmer-3", "khmer-1", "khmer-4"],
  },
  {
    matchKeys: ["historical", "history"],
    defaultTitle: "Historical",
    defaultSubtitle: "Khmer books shaped by history and culture.",
    color: "from-[#5faa39] to-[#467d28]",
    heroBookId: "khmer-3",
    heroImage: khmerBookImages[2],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-3", "khmer-4", "khmer-1", "khmer-5"],
  },
  {
    matchKeys: ["sci-fi", "sci fi", "science fiction"],
    defaultTitle: "Sci-Fi",
    defaultSubtitle: "Speculative Khmer reads and futuristic ideas.",
    color: "from-[#1d2bca] to-[#10196f]",
    heroBookId: "khmer-4",
    heroImage: khmerBookImages[3],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-4", "khmer-2", "khmer-3", "khmer-5"],
  },
  {
    matchKeys: ["classics", "classic"],
    defaultTitle: "Classics",
    defaultSubtitle: "Khmer classics and familiar works.",
    color: "from-[#cb7a73] to-[#954f4a]",
    heroBookId: "khmer-5",
    heroImage: khmerBookImages[4],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-5", "khmer-1", "khmer-2", "khmer-4"],
  },
  {
    matchKeys: ["science"],
    defaultTitle: "Science",
    defaultSubtitle: "Knowledge and science for curious Khmer readers.",
    color: "from-[#db5bc8] to-[#983992]",
    heroBookId: "khmer-6",
    heroImage: khmerBookImages[5],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-6", "khmer-1", "khmer-3", "khmer-5"],
  },
  {
    matchKeys: ["finance", "business"],
    defaultTitle: "Finance",
    defaultSubtitle: "Money and practical thinking in Khmer.",
    color: "from-[#d5ad56] to-[#9a7331]",
    heroBookId: "khmer-1",
    heroImage: khmerBookImages[0],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-1", "khmer-6", "khmer-2", "khmer-3"],
  },
  {
    matchKeys: ["mystery"],
    defaultTitle: "Mystery",
    defaultSubtitle: "Suspenseful Khmer books and hidden clues.",
    color: "from-[#6954f0] to-[#4532aa]",
    heroBookId: "khmer-2",
    heroImage: khmerBookImages[1],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-2", "khmer-4", "khmer-3", "khmer-5"],
  },
  {
    matchKeys: ["philosophy"],
    defaultTitle: "Philosophy",
    defaultSubtitle: "Reflective and idea-driven Khmer reading.",
    color: "from-[#cb3b2e] to-[#8d1f18]",
    heroBookId: "khmer-3",
    heroImage: khmerBookImages[2],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-3", "khmer-1", "khmer-6", "khmer-5"],
  },
  {
    matchKeys: ["biography", "memoir"],
    defaultTitle: "Biography",
    defaultSubtitle: "Life stories and personal journeys.",
    color: "from-[#b2be4d] to-[#76812e]",
    heroBookId: "khmer-4",
    heroImage: khmerBookImages[3],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-4", "khmer-2", "khmer-1", "khmer-3"],
  },
  {
    matchKeys: ["romance"],
    defaultTitle: "Romance",
    defaultSubtitle: "Warm and emotional Khmer romance reads.",
    color: "from-[#d9d9db] to-[#aeb3b9]",
    heroBookId: "khmer-5",
    heroImage: khmerBookImages[4],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-5", "khmer-4", "khmer-2", "khmer-1"],
  },
  {
    matchKeys: ["travel"],
    defaultTitle: "Travel",
    defaultSubtitle: "Journey-based reads and travel inspiration.",
    color: "from-[#402420] to-[#241311]",
    heroBookId: "khmer-6",
    heroImage: khmerBookImages[5],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-6", "khmer-3", "khmer-2", "khmer-1"],
  },
  {
    matchKeys: ["drama"],
    defaultTitle: "Drama",
    defaultSubtitle: "Emotion-rich Khmer stories and tension-filled arcs.",
    color: "from-[#5dcf69] to-[#359048]",
    heroBookId: "khmer-1",
    heroImage: khmerBookImages[0],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-1", "khmer-4", "khmer-3", "khmer-2"],
  },
  {
    matchKeys: ["cooking", "cook"],
    defaultTitle: "Cooking",
    defaultSubtitle: "Everyday Khmer cooking and useful food books.",
    color: "from-[#6cf0ca] to-[#3cb98e]",
    heroBookId: "khmer-2",
    heroImage: khmerBookImages[1],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-2", "khmer-6", "khmer-1", "khmer-5"],
  },
  {
    matchKeys: ["horror"],
    defaultTitle: "Horror",
    defaultSubtitle: "Dark and eerie Khmer reading.",
    color: "from-[#334e73] to-[#223754]",
    heroBookId: "khmer-3",
    heroImage: khmerBookImages[2],
    backgroundImages: khmerBackgroundBooks,
    bookIds: ["khmer-3", "khmer-4", "khmer-2", "khmer-5"],
  },
];

function getClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

function normalizeCategoryKey(value: string) {
  return value.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function getVisualPresets(option: ExploreOption) {
  return option === "khmer" ? khmerVisualPresets : englishVisualPresets;
}

function matchVisualPreset(option: ExploreOption, categoryName: string, index: number) {
  const normalizedName = normalizeCategoryKey(categoryName);
  const presets = getVisualPresets(option);

  return (
    presets.find((preset) =>
      preset.matchKeys.some((key) => normalizeCategoryKey(key) === normalizedName)
    ) ?? presets[index % presets.length]
  );
}

function buildExploreCategory(row: CategoryRow, option: ExploreOption, index: number): ExploreCategoryCollection {
  const preset = matchVisualPreset(option, row.name, index);
  return {
    id: row.id,
    title: row.name,
    englishTitle: row.name,
    subtitle: row.description?.trim() || preset.defaultSubtitle,
    color: preset.color,
    heroBookId: preset.heroBookId,
    heroImage: preset.heroImage,
    backgroundImages: preset.backgroundImages,
    bookIds: preset.bookIds,
  };
}

export async function readExploreCategories(option: ExploreOption): Promise<ExploreCategoryCollection[]> {
  const supabase = getClient();
  const [{ data: categoriesData, error: categoriesError }, { data: booksData, error: booksError }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id, name, description, library_type")
        .eq("library_type", option)
        .order("name", { ascending: true }),
      supabase
        .from("books")
        .select("id, category, cover_url")
        .eq("status", "Published")
        .order("created_at", { ascending: false }),
    ]);

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  if (booksError) {
    throw new Error(booksError.message);
  }

  const booksByCategory = new Map<string, BookVisualRow[]>();

  for (const row of (booksData ?? []) as BookVisualRow[]) {
    const categoryName = String(row.category ?? "").trim();
    if (!categoryName) {
      continue;
    }

    const current = booksByCategory.get(categoryName) ?? [];
    current.push(row);
    booksByCategory.set(categoryName, current);
  }

  return ((categoriesData ?? []) as CategoryRow[]).map((row, index) => {
    const category = buildExploreCategory(row, option, index);
    const matchingBooks = booksByCategory.get(row.name) ?? [];
    const realCoverImages = matchingBooks
      .map((book) => String(book.cover_url ?? "").trim())
      .filter(Boolean)
      .slice(0, 4);

    return {
      ...category,
      heroBookId: matchingBooks[0]?.id ?? category.heroBookId,
      heroImage: realCoverImages[0] ?? category.heroImage,
      backgroundImages: realCoverImages.length > 0 ? realCoverImages : category.backgroundImages,
      bookIds: matchingBooks.slice(0, 5).map((book) => book.id).filter(Boolean),
    };
  });
}

export async function readExploreCategory(
  option: ExploreOption,
  categoryId: string
): Promise<ExploreCategoryCollection | undefined> {
  const categories = await readExploreCategories(option);
  return categories.find((category) => category.id === categoryId);
}
