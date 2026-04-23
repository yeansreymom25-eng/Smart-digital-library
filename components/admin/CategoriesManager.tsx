"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getCategoryStats, type AdminCategory, type CategoryLibraryType } from "@/src/lib/adminCategories";

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
      <path d="m12 6 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M6 7l1 12h10l1-12" />
    </svg>
  );
}

function typeLabel(type: CategoryLibraryType) {
  return type === "khmer" ? "Khmer Books" : "English Books";
}

export default function CategoriesManager({ initialCategories = [] }: { initialCategories?: AdminCategory[] }) {
  const [categories, setCategories] = useState<AdminCategory[]>(initialCategories);
  const [selectedType, setSelectedType] = useState<CategoryLibraryType>("english");
  const [pendingDelete, setPendingDelete] = useState<AdminCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.libraryType === selectedType),
    [categories, selectedType]
  );

  const stats = useMemo(() => getCategoryStats(filteredCategories), [filteredCategories]);

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/categories/${pendingDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== pendingDelete.id));
      }
    } catch {
      // silently fail
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[2.5rem] font-bold leading-none text-[#173b73]">Categories</h1>
          <p className="mt-2 max-w-3xl text-base text-[#4d6691]">Organize your book categories.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-full border border-[#dde3ec] bg-white p-1 shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
            <button
              type="button"
              onClick={() => setSelectedType("english")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedType === "english" ? "bg-[#1f2430] text-white" : "text-[#667081] hover:text-[#1f2430]"}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("khmer")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedType === "khmer" ? "bg-[#1f2430] text-white" : "text-[#667081] hover:text-[#1f2430]"}`}
            >
              Khmer
            </button>
          </div>

          <Link
            href="/library-owner/categories/new"
            className="rounded-[10px] bg-[#4d98f0] px-6 py-3 text-base font-semibold text-white shadow-[0_10px_20px_rgba(77,152,240,0.18)] transition hover:bg-[#3789ea]"
          >
            + Add Category
          </Link>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredCategories.map((category) => (
          <article
            key={category.id}
            className="rounded-[18px] border border-[#d8e2f2] bg-[linear-gradient(145deg,#f9fbff,#eef5ff)] p-5 shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[1.55rem] font-bold tracking-[-0.04em] text-[#173b73]">{category.name}</h2>
                <p className="mt-2 text-sm text-[#6f83a7]">{typeLabel(category.libraryType)}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#6a82aa] shadow-[0_8px_16px_rgba(15,23,42,0.05)]">
                {category.books} books
              </span>
            </div>

            <p className="mt-5 text-sm leading-6 text-[#557095]">{category.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href={`/library-owner/categories/${category.id}/edit`}
                className="flex items-center justify-center gap-1.5 rounded-[10px] bg-[#4d98f0] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#3789ea]"
              >
                <PencilIcon />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setPendingDelete(category)}
                className="flex items-center justify-center gap-1.5 rounded-[10px] border border-[#d7dee8] bg-white px-3 py-2.5 text-sm font-medium text-[#c72f2f] transition hover:bg-[#f9fbff]"
              >
                <TrashIcon />
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>

      {!filteredCategories.length ? (
        <section className="rounded-[12px] border border-dashed border-[#cfd6e2] bg-white px-6 py-10 text-center shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
          <p className="text-lg font-semibold text-[#173b73]">No categories yet</p>
          <p className="mt-2 text-sm text-[#5d749a]">
            Add your first {selectedType === "english" ? "English" : "Khmer"} category.
          </p>
        </section>
      ) : null}

      <section className="rounded-[12px] border border-[#cfd6e2] bg-white p-5 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <h2 className="text-xl font-semibold text-[#173b73]">Category Statistics</h2>
        <div className="mt-6 space-y-4">
          {stats.map((stat) => (
            <div key={stat.id}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-[#1e3a6d]">{stat.name}</span>
                <span className="text-[#7286a7]">{stat.books} books ({stat.percent}%)</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#e5e7eb]">
                <div className="h-full rounded-full" style={{ width: `${stat.percent}%`, backgroundColor: stat.tone }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {pendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-[22px] border border-[#ffd4d4] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.24)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c74a4a]">Delete Category</p>
            <h2 className="mt-3 text-2xl font-bold text-[#8f2626]">Are you sure?</h2>
            <p className="mt-3 text-sm leading-6 text-[#6f5050]">
              &quot;{pendingDelete.name}&quot; will be permanently deleted.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-xl border border-[#e3b9b9] bg-white px-5 py-2.5 text-sm font-semibold text-[#7f4c4c] transition hover:bg-[#fff1f1]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteConfirm()}
                disabled={isDeleting}
                className="rounded-xl bg-[#d94b4b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c93d3d] disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}