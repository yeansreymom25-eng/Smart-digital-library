"use client";

import { readStoredJson, writeStoredJson } from "@/src/lib/browserStorage";
import type { CategoryLibraryType } from "@/src/lib/adminCategories";

export type AdminBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  libraryType: CategoryLibraryType;
  type: string;
  status: "Published" | "Hidden" | "Draft";
  price: string;
  pdfName: string;
  coverName: string;
  coverImageSrc: string;
  paymentQrName: string;
  paymentQrImageSrc: string;
};

const ADMIN_BOOKS_STORAGE_KEY = "admin-books";

const defaultAdminBooks: AdminBook[] = [
  {
    id: "the-arts-of-programming",
    title: "The Arts of programming",
    author: "Sarah Johnson",
    category: "Self-Help",
    libraryType: "english",
    type: "Buy/Rent",
    status: "Published",
    price: "$12.00",
    pdfName: "arts-of-programming.pdf",
    coverName: "arts-of-programming.jpg",
    coverImageSrc: "/MainPage/Books/Atomic_habits.jpg",
    paymentQrName: "",
    paymentQrImageSrc: "",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    author: "Vy seoul",
    category: "Finance",
    libraryType: "english",
    type: "Free",
    status: "Published",
    price: "$0.00",
    pdfName: "digital-marketing.pdf",
    coverName: "digital-marketing.jpg",
    coverImageSrc: "/MainPage/Books/12132023_Book_Cover-Lessons_in_Chemistry_152020.jpg.webp",
    paymentQrName: "",
    paymentQrImageSrc: "",
  },
  {
    id: "the-science-of-mind",
    title: "The Science if Mind",
    author: "Mr.saravuth",
    category: "Khmer Knowledge",
    libraryType: "khmer",
    type: "Buy/Rent",
    status: "Draft",
    price: "$8.00",
    pdfName: "science-of-mind.pdf",
    coverName: "science-of-mind.jpg",
    coverImageSrc: "/MainPage/Books/9780399547003.jpeg",
    paymentQrName: "",
    paymentQrImageSrc: "",
  },
];

function normalizeStoredBooks(value: AdminBook[] | null) {
  if (!Array.isArray(value)) {
    return defaultAdminBooks;
  }

  return value
    .filter(
      (item) =>
        typeof item?.id === "string" &&
        typeof item?.title === "string" &&
        typeof item?.author === "string" &&
        typeof item?.category === "string" &&
        typeof item?.type === "string" &&
        typeof item?.status === "string" &&
        typeof item?.price === "string" &&
        typeof item?.pdfName === "string" &&
        typeof item?.coverName === "string"
    )
    .map((item) => ({
      ...item,
      libraryType: item.libraryType === "khmer" ? "khmer" : "english",
      coverImageSrc:
        typeof item.coverImageSrc === "string" && item.coverImageSrc
          ? item.coverImageSrc
          : item.coverName
            ? `/MainPage/Books/${item.coverName}`
            : "",
      paymentQrName:
        typeof item.paymentQrName === "string" ? item.paymentQrName : "",
      paymentQrImageSrc:
        typeof item.paymentQrImageSrc === "string"
          ? item.paymentQrImageSrc
          : "",
    })) as AdminBook[];
}

function writeAdminBooks(books: AdminBook[]) {
  writeStoredJson(ADMIN_BOOKS_STORAGE_KEY, books);
}

function slugifyBookTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function readAdminBooks() {
  const stored = readStoredJson<AdminBook[]>(ADMIN_BOOKS_STORAGE_KEY);
  const books = normalizeStoredBooks(stored);

  if (!stored) {
    writeAdminBooks(books);
  }

  return books;
}

export function createAdminBook(book: Omit<AdminBook, "id">) {
  const books = readAdminBooks();
  const baseSlug = slugifyBookTitle(book.title) || "book";
  const uniqueId = books.some((item) => item.id === baseSlug)
    ? `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`
    : baseSlug;
  const nextBooks = [...books, { id: uniqueId, ...book }];

  writeAdminBooks(nextBooks);

  return nextBooks;
}

export function updateAdminBook(bookId: string, updates: Omit<AdminBook, "id">) {
  const nextBooks = readAdminBooks().map((item) =>
    item.id === bookId ? { ...item, ...updates } : item
  );

  writeAdminBooks(nextBooks);

  return nextBooks;
}

export function removeAdminBook(bookId: string) {
  const nextBooks = readAdminBooks().filter((item) => item.id !== bookId);

  writeAdminBooks(nextBooks);

  return nextBooks;
}
