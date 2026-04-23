"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminCategory, CategoryLibraryType } from "@/src/lib/adminCategories";

type CategoryFormProps = {
  mode: "create" | "edit";
  categoryId?: string;
  initialCategory?: AdminCategory | null;
};

export default function CategoryForm({ mode, categoryId, initialCategory }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialCategory?.name ?? "");
  const [libraryType, setLibraryType] = useState<CategoryLibraryType>(initialCategory?.libraryType ?? "english");
  const [description, setDescription] = useState(initialCategory?.description ?? "");
  const [books, setBooks] = useState(initialCategory ? String(initialCategory.books) : "0");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const parsedBooks = Number(books);

    if (!trimmedName) return setErrorMessage("Category name is required.");
    if (!trimmedDescription) return setErrorMessage("Description is required.");
    if (!Number.isInteger(parsedBooks) || parsedBooks < 0) return setErrorMessage("Book count must be 0 or greater.");

    setIsSubmitting(true);

    try {
      const payload = {
        name: trimmedName,
        libraryType,
        description: trimmedDescription,
        books: parsedBooks,
      };

      let res: Response;

      if (mode === "create") {
        res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/categories/${categoryId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setErrorMessage(data.error ?? "Something went wrong.");
        return;
      }

      router.push("/library-owner/categories");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const pageTitle = mode === "create" ? "Add category" : "Edit category";
  const pageDescription =
    mode === "create"
      ? "Create a category under English books or Khmer books so it matches the reader-side structure."
      : "Update the category details and keep the English or Khmer grouping consistent.";

  return (
    <section className="flex min-h-[calc(100vh-1.5rem)] flex-col rounded-[18px] border border-[#d8e6fb] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f4a8a]">Categories</p>
          <h1 className="mt-3 text-[2.5rem] font-bold leading-none text-[#173b73]">{pageTitle}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#5c7297] sm:text-lg">{pageDescription}</p>
        </div>
        <Link
          href="/library-owner/categories"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef5ff] text-xl font-semibold text-[#1e3a6d] transition hover:bg-[#dce9ff]"
          aria-label="Back to categories page"
        >
          x
        </Link>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Book Type</span>
            <select
              value={libraryType}
              onChange={(e) => setLibraryType(e.target.value as CategoryLibraryType)}
              className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none"
            >
              <option value="english">English Books</option>
              <option value="khmer">Khmer Books</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Category Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={libraryType === "english" ? "Self-Help" : "Khmer Knowledge"}
              className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-[#5678a8]"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this category"
            rows={4}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-[#5678a8]"
          />
        </label>

        <label className="block max-w-xs">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Book Count</span>
          <input
            type="number"
            min="0"
            step="1"
            value={books}
            onChange={(e) => setBooks(e.target.value)}
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
            disabled={isSubmitting}
            className="rounded-xl bg-[#4d98f0] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#3789ea] disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : mode === "create" ? "Save Category" : "Update Category"}
          </button>
        </div>
      </form>
    </section>
  );
}