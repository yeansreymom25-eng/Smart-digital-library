"use client";

import { readStoredJson, writeStoredJson } from "@/src/lib/browserStorage";

export type CategoryLibraryType = "english" | "khmer";

export type AdminCategory = {
  id: string;
  name: string;
  description: string;
  books: number;
  libraryType: CategoryLibraryType;
};

type CategoryStat = {
  id: string;
  name: string;
  books: number;
  percent: number;
  tone: string;
  libraryType: CategoryLibraryType;
};

const ADMIN_CATEGORIES_STORAGE_KEY = "admin-categories";

const defaultAdminCategories: AdminCategory[] = [
  { id: "self-help", name: "Self-Help", description: "Growth, mindset, habits, and personal improvement books.", books: 6, libraryType: "english" },
  { id: "fantasy", name: "Fantasy", description: "Magic, kingdoms, quests, and imaginative adventures.", books: 4, libraryType: "english" },
  { id: "historical", name: "Historical", description: "History-inspired stories, timelines, and past civilizations.", books: 3, libraryType: "english" },
  { id: "sci-fi", name: "Sci-Fi", description: "Future worlds, science fiction, and speculative ideas.", books: 5, libraryType: "english" },
  { id: "classics", name: "Classics", description: "Timeless literature and enduring classic works.", books: 2, libraryType: "english" },
  { id: "science", name: "Science", description: "Biology, chemistry, physics, and scientific learning.", books: 4, libraryType: "english" },
  { id: "finance", name: "Finance", description: "Money, investing, business growth, and practical finance.", books: 3, libraryType: "english" },
  { id: "mystery", name: "Mystery", description: "Suspense, detective stories, and hidden truths.", books: 4, libraryType: "english" },
  { id: "khmer-knowledge", name: "Khmer Knowledge", description: "Khmer learning resources, general knowledge, and practical reading.", books: 3, libraryType: "khmer" },
  { id: "khmer-history", name: "Khmer History", description: "Khmer history, heritage, and national identity titles.", books: 2, libraryType: "khmer" },
  { id: "khmer-culture", name: "Khmer Culture", description: "Culture, traditions, arts, and community storytelling.", books: 3, libraryType: "khmer" },
  { id: "khmer-stories", name: "Khmer Stories", description: "Fiction, folklore, and modern Khmer storytelling.", books: 5, libraryType: "khmer" },
  { id: "khmer-classics", name: "Khmer Classics", description: "Classic Khmer literature and enduring works.", books: 2, libraryType: "khmer" },
  { id: "khmer-learning", name: "Khmer Learning", description: "Educational Khmer books for reading and study.", books: 3, libraryType: "khmer" },
  { id: "khmer-fiction", name: "Khmer Fiction", description: "Imaginative Khmer fiction and novel collections.", books: 4, libraryType: "khmer" },
  { id: "khmer-drama", name: "Khmer Drama", description: "Drama, emotions, and character-driven Khmer writing.", books: 2, libraryType: "khmer" },
];

const statTones = ["#4f9df6", "#ff6b5f", "#75bf43", "#3750db", "#d5ad56"];

function normalizeStoredCategories(value: unknown) {
  if (!Array.isArray(value)) {
    return defaultAdminCategories;
  }

  return value
    .filter(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.description === "string" &&
        typeof item.books === "number"
    )
    .map((item) => {
      const legacyName =
        typeof item.name === "string"
          ? item.name
          : typeof item.nameEn === "string"
            ? item.nameEn
            : "";

      const nextLibraryType =
        item.libraryType === "khmer" || String(item.id).startsWith("khmer-")
          ? "khmer"
          : "english";

      return {
        id: item.id,
        name: legacyName,
        description: item.description,
        books: item.books,
        libraryType: nextLibraryType,
      };
    }) as AdminCategory[];
}

function writeAdminCategories(categories: AdminCategory[]) {
  writeStoredJson(ADMIN_CATEGORIES_STORAGE_KEY, categories);
}

function slugifyCategoryName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function readAdminCategories() {
  const stored = readStoredJson<AdminCategory[]>(ADMIN_CATEGORIES_STORAGE_KEY);
  const categories = normalizeStoredCategories(stored);

  if (!stored) {
    writeAdminCategories(categories);
  }

  return categories;
}

export function createAdminCategory(category: Omit<AdminCategory, "id">) {
  const categories = readAdminCategories();
  const baseSlug = slugifyCategoryName(category.name) || "category";
  const uniqueId = categories.some((item) => item.id === baseSlug)
    ? `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`
    : baseSlug;
  const nextCategories = [...categories, { id: uniqueId, ...category }];

  writeAdminCategories(nextCategories);

  return nextCategories;
}

export function updateAdminCategory(categoryId: string, updates: Omit<AdminCategory, "id">) {
  const nextCategories = readAdminCategories().map((item) =>
    item.id === categoryId ? { ...item, ...updates } : item
  );

  writeAdminCategories(nextCategories);

  return nextCategories;
}

export function removeAdminCategory(categoryId: string) {
  const nextCategories = readAdminCategories().filter((item) => item.id !== categoryId);

  writeAdminCategories(nextCategories);

  return nextCategories;
}

export function getCategoryStats(categories: AdminCategory[]): CategoryStat[] {
  const totalBooks = categories.reduce((sum, item) => sum + item.books, 0);

  return categories.map((category, index) => ({
    id: category.id,
    name: category.name,
    books: category.books,
    percent: totalBooks > 0 ? Math.round((category.books / totalBooks) * 100) : 0,
    tone: category.books === 0 ? "#d9dfe9" : statTones[index % statTones.length],
    libraryType: category.libraryType,
  }));
}
