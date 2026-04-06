export type ReaderBookAccess = "free" | "buy" | "buy-rent";

export type ReaderBookDetail = {
  id: string;
  title: string;
  author: string;
  imageSrc: string;
  description: string;
  access: ReaderBookAccess;
  originalPrice?: number;
  currentPrice?: number;
};

export const readerBookDetails: ReaderBookDetail[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    imageSrc: "/MainPage/Books/Atomic_habits.jpg",
    description:
      "The international bestseller about building better systems, tiny habits, and lasting personal growth through small repeated actions.",
    access: "free",
  },
  {
    id: "it-ends-with-us",
    title: "It Ends With Us",
    author: "Colleen Hoover",
    imageSrc: "/MainPage/Books/12132023_Book_Cover-Lessons_in_Chemistry_152020.jpg.webp",
    description:
      "A popular contemporary novel with emotional tension, powerful relationships, and a fast reading pace that keeps readers invested.",
    access: "buy-rent",
    originalPrice: 20,
  },
  {
    id: "life-impossible",
    title: "The Life Impossible",
    author: "Matt Haig",
    imageSrc: "/MainPage/Books/9780399547003.jpeg",
    description:
      "An imaginative and reflective story for readers who enjoy wonder, healing, and emotionally rich fiction with a calm pace.",
    access: "buy-rent",
    originalPrice: 24,
    currentPrice: 18,
  },
  {
    id: "verity",
    title: "Verity",
    author: "Colleen Hoover",
    imageSrc: "/MainPage/Books/9780062390769_p0_v4_s600x595.jpg",
    description:
      "A dark suspense pick with sharp twists, layered character tension, and a gripping atmosphere for readers who love psychological mystery.",
    access: "buy",
    originalPrice: 18,
  },
  {
    id: "thorns-and-roses",
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    imageSrc: "/MainPage/Books/The Castle In the Mist.jpeg",
    description:
      "A dramatic fantasy journey filled with romance, danger, and strong worldbuilding for readers who enjoy immersive escapist series.",
    access: "buy-rent",
    originalPrice: 22,
    currentPrice: 15,
  },
  {
    id: "song-of-achilles",
    title: "Song of Achilles",
    author: "Madeline Miller",
    imageSrc: "/MainPage/Books/all-the-single-ladies.jpg.webp",
    description:
      "A lyrical and emotional retelling with beautiful writing, mythic depth, and a strong character-driven love story.",
    access: "buy",
    originalPrice: 19,
  },
  {
    id: "listen-for-the-lie",
    title: "Listen for the Lie",
    author: "Amy Tintera",
    imageSrc: "/MainPage/Books/listen-for-the-lie.jpeg",
    description:
      "A twisty modern thriller with an easy reading pace and a sharp hook for readers who like clever suspense and momentum.",
    access: "buy-rent",
    originalPrice: 17,
    currentPrice: 11,
  },
  {
    id: "favorites",
    title: "The Favorites",
    author: "Layne Fargo",
    imageSrc: "/MainPage/Books/the-favorites.jpeg",
    description:
      "A stylish and dramatic read with ambition, glamour, and emotional complexity for readers who love character-forward drama.",
    access: "buy",
    originalPrice: 21,
  },
  {
    id: "wild-dark-shore",
    title: "Wild Dark Shore",
    author: "Charlotte McConaghy",
    imageSrc: "/MainPage/Books/The Castle In the Mist.jpeg",
    description:
      "A moody, atmospheric fiction pick with tension and vivid scenery for readers who enjoy immersive, haunting storytelling.",
    access: "buy-rent",
    originalPrice: 20,
  },
  {
    id: "three-days-in-june",
    title: "Three Days in June",
    author: "Anne Tyler",
    imageSrc: "/MainPage/Books/9780399547003.jpeg",
    description:
      "A thoughtful literary read with intimate character work and emotional realism for readers who enjoy subtle stories.",
    access: "buy",
    originalPrice: 18,
    currentPrice: 12,
  },
  {
    id: "dirt",
    title: "Dirt",
    author: "Charmaine Wilkerson",
    imageSrc: "/MainPage/Books/the-favorites.jpeg",
    description:
      "A contemporary shelf pick with layered family emotion, strong atmosphere, and a story that unfolds with warmth and mystery.",
    access: "buy-rent",
    originalPrice: 18,
  },
  {
    id: "elf-shack",
    title: "Elif Shafak",
    author: "Novel Picks",
    imageSrc: "/MainPage/Books/Are you my mother.jpg",
    description:
      "A reflective and thoughtful shelf pick for readers who like literary voices, ideas, and beautifully composed storytelling.",
    access: "buy",
    originalPrice: 16,
  },
  {
    id: "castle-in-the-mist",
    title: "The Castle in the Mist",
    author: "Amy Ephron",
    imageSrc: "/MainPage/Books/The Castle In the Mist.jpeg",
    description:
      "A magical, adventure-led fantasy with a classic feel that fits readers who want wonder, charm, and imaginative settings.",
    access: "buy-rent",
    originalPrice: 20,
    currentPrice: 15,
  },
  {
    id: "castle-in-the-moon",
    title: "There Is a Castle in the Moon",
    author: "Ken Barlon",
    imageSrc: "/MainPage/Books/The Castle In the Moon.jpg",
    description:
      "A fantasy adventure pick with atmospheric worldbuilding and a sense of mystery, ideal for readers who want visual escapism.",
    access: "buy-rent",
    originalPrice: 19,
  },
  {
    id: "lessons-in-chemistry",
    title: "Lessons in Chemistry",
    author: "Bonnie Garmus",
    imageSrc: "/MainPage/Books/12132023_Book_Cover-Lessons_in_Chemistry_152020.jpg.webp",
    description:
      "A bright, witty, and character-led novel that mixes heart, intelligence, and momentum for mainstream readers.",
    access: "buy",
    originalPrice: 18,
    currentPrice: 12,
  },
  {
    id: "all-the-single-ladies",
    title: "All the Single Ladies",
    author: "Dorothea Benton Frank",
    imageSrc: "/MainPage/Books/all-the-single-ladies.jpg.webp",
    description:
      "A warm and accessible novel for readers who want relationship-centered stories with personality and a relaxed pace.",
    access: "buy",
    originalPrice: 16,
  },
  {
    id: "are-you-my-mother",
    title: "Are You My Mother?",
    author: "P. D. Eastman",
    imageSrc: "/MainPage/Books/Are you my mother.jpg",
    description:
      "A light and familiar classic suitable for readers who want comforting, short, and recognizable titles.",
    access: "free",
  },
  {
    id: "germany-travel-book",
    title: "A Visit to Germany",
    author: "Jared Campbell",
    imageSrc: "/MainPage/Books/Germany Travel Book.jpg",
    description:
      "A travel-focused title with destination highlights and visual appeal for readers who enjoy places, trips, and practical inspiration.",
    access: "buy",
    originalPrice: 14,
    currentPrice: 9,
  },
  {
    id: "hate-to-cook-book",
    title: "The I Hate to Cook Book",
    author: "Peg Bracken",
    imageSrc: "/MainPage/Books/The I Hate To Cook Book.jpg",
    description:
      "A fun and practical cooking title for readers who want approachable recipes and an easy, casual tone.",
    access: "buy",
    originalPrice: 15,
    currentPrice: 10,
  },
  {
    id: "khmer-1",
    title: "Khmer Knowledge",
    author: "Khmer Author",
    imageSrc: "/MainPage/Books/khmer_Books/image.png",
    description:
      "A Khmer-language reading option designed for local readers who want familiar language, style, and cultural context.",
    access: "free",
  },
  {
    id: "khmer-2",
    title: "Khmer History",
    author: "Khmer Author",
    imageSrc: "/MainPage/Books/khmer_Books/image copy.png",
    description:
      "A Khmer reading option centered on history and context, with a familiar local presentation and reading experience.",
    access: "buy",
    originalPrice: 12,
  },
  {
    id: "khmer-3",
    title: "Khmer Culture",
    author: "Khmer Author",
    imageSrc: "/MainPage/Books/khmer_Books/image copy 2.png",
    description:
      "A Khmer reading option focused on local stories and cultural identity for readers who prefer Khmer content.",
    access: "buy-rent",
    originalPrice: 13,
    currentPrice: 9,
  },
  {
    id: "khmer-4",
    title: "Khmer Stories",
    author: "Khmer Author",
    imageSrc: "/MainPage/Books/khmer_Books/image copy 3.png",
    description:
      "A Khmer fiction option with strong local atmosphere, ideal for readers who want language and story style that feel familiar.",
    access: "buy-rent",
    originalPrice: 12,
  },
  {
    id: "khmer-5",
    title: "Khmer Classics",
    author: "Khmer Author",
    imageSrc: "/MainPage/Books/khmer_Books/image copy 4.png",
    description:
      "A Khmer classic shelf title for readers who want a more traditional and recognizable local reading experience.",
    access: "buy",
    originalPrice: 11,
  },
  {
    id: "khmer-6",
    title: "Khmer Learning",
    author: "Khmer Author",
    imageSrc: "/MainPage/Books/khmer_Books/image copy 5.png",
    description:
      "A Khmer learning title for readers who want practical content and an accessible Khmer-language presentation.",
    access: "free",
  },
];

export const readerBookDetailsMap = Object.fromEntries(
  readerBookDetails.map((book) => [book.id, book])
) as Record<string, ReaderBookDetail>;

export function getReaderBookDetail(id: string) {
  return readerBookDetailsMap[id];
}

export function getReaderBookCurrentPrice(book: ReaderBookDetail) {
  return book.currentPrice ?? book.originalPrice ?? 0;
}

export function isReaderBookDiscounted(book: ReaderBookDetail) {
  return typeof book.originalPrice === "number" &&
    typeof book.currentPrice === "number" &&
    book.currentPrice < book.originalPrice;
}

export function getReaderBookDiscountRate(book: ReaderBookDetail) {
  if (book.access === "free") {
    return 100;
  }

  if (!isReaderBookDiscounted(book) || !book.originalPrice) {
    return 0;
  }

  return Math.round(((book.originalPrice - getReaderBookCurrentPrice(book)) / book.originalPrice) * 100);
}
