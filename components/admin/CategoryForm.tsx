"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createAdminCategory,
  readAdminCategories,
  updateAdminCategory,
  type AdminCategory,
  type CategoryLibraryType,
} from "@/src/lib/adminCategories";

type CategoryFormProps = {
  mode: "create" | "edit";
  categoryId?: string;
};

export default function CategoryForm({
  mode,
  categoryId,
}: CategoryFormProps) {
  const router = useRouter();
  const existingCategory =
    mode === "edit" && categoryId
      ? readAdminCategories().find((item) => item.id === categoryId) ?? null
      : null;
  const [name, setName] = useState(existingCategory?.name ?? "");
  const [libraryType, setLibraryType] = useState<CategoryLibraryType>(existingCategory?.libraryType ?? "english");
  const [description, setDescription] = useState(existingCategory?.description ?? "");
  const [books, setBooks] = useState(existingCategory ? String(existingCategory.books) : "0");
  const [errorMessage, setErrorMessage] = useState("");
  const isReady = mode === "create" || Boolean(existingCategory);
  const isMissing = mode === "edit" && !existingCategory;

  function validateInput(existingCategories: AdminCategory[]) {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const parsedBooks = Number(books);

    if (!trimmedName) {
      return "Category name is required.";
    }

    const duplicate = existingCategories.find(
      (item) =>
        item.id !== categoryId &&
        item.libraryType === libraryType &&
        item.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicate) {
      return "Category name already exists in this book type.";
    }

    if (!trimmedDescription) {
      return "Description is required.";
    }

    if (!Number.isInteger(parsedBooks) || parsedBooks < 0) {
      return "Book count must be 0 or greater.";
    }

    return "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const existingCategories = readAdminCategories();
    const validationMessage = validateInput(existingCategories);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    const nextCategory = {
      name: name.trim(),
      libraryType,
      description: description.trim(),
      books: Number(books),
    };

    if (mode === "create") {
      createAdminCategory(nextCategory);
    } else if (categoryId) {
      updateAdminCategory(categoryId, nextCategory);
    }

    router.push("/library-owner/categories");
  }

  const pageTitle =
    mode === "create" ? "Add category" : isMissing ? "Category not found" : "Edit category";
  const pageDescription =
    mode === "create"
      ? "Create a category under English books or Khmer books so it matches the reader-side structure."
      : "Update the category details and keep the English or Khmer grouping consistent.";

  if (!isReady) {
    return (
      <section className="rounded-[18px] border border-[#d8e6fb] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <p className="text-base text-[#4d6691]">Loading category...</p>
      </section>
    );
  }

  if (isMissing) {
    return (
      <section className="rounded-[18px] border border-[#d8e6fb] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f4a8a]">
          Categories
        </p>
        <h1 className="mt-3 text-[2.5rem] font-bold leading-none text-[#173b73]">
          Category not found
        </h1>
        <p className="mt-3 text-base leading-7 text-[#5c7297]">
          The category you tried to edit is no longer available.
        </p>
        <Link
          href="/library-owner/categories"
          className="mt-6 inline-flex rounded-xl bg-[#4d98f0] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#3789ea]"
        >
          Back to Categories
        </Link>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-1.5rem)] flex-col rounded-[18px] border border-[#d8e6fb] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f4a8a]">
            Categories
          </p>
          <h1 className="mt-3 text-[2.5rem] font-bold leading-none text-[#173b73]">
            {pageTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#5c7297] sm:text-lg">
            {pageDescription}
          </p>
        </div>
        <Link
          href="/library-owner/categories"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef5ff] text-xl font-semibold text-[#1e3a6d] transition hover:bg-[#dce9ff]"
          aria-label="Back to categories page"
        >
          x
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
              Book Type
            </span>
            <select
              value={libraryType}
              onChange={(event) => setLibraryType(event.target.value as CategoryLibraryType)}
              className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none"
            >
              <option value="english">English Books</option>
              <option value="khmer">Khmer Books</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
              Category Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={libraryType === "english" ? "Self-Help" : "Khmer Knowledge"}
              className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-[#5678a8]"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Description
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe this category"
            rows={4}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-[#5678a8]"
          />
        </label>

        <label className="block max-w-xs">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Book Count
          </span>
          <input
            type="number"
            min="0"
            step="1"
            value={books}
            onChange={(event) => setBooks(event.target.value)}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none"
          />
        </label>

        {errorMessage ? (
          <div className="rounded-xl border border-[#ffc8c8] bg-[#fff4f4] px-4 py-3 text-sm font-medium text-[#b33434]">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
          <Link
            href="/library-owner/categories"
            className="rounded-xl border border-[#c8dcff] bg-white px-6 py-3 text-center text-base font-semibold text-[#1e3a6d] transition hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-xl bg-[#4d98f0] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#3789ea]"
          >
            {mode === "create" ? "Save Category" : "Update Category"}
          </button>
        </div>
      </form>
    </section>
  );
}
