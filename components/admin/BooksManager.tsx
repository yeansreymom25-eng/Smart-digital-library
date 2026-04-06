"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  readAdminBooks,
  removeAdminBook,
  type AdminBook,
} from "@/src/lib/adminBooks";
import {
  DEFAULT_ADMIN_SUBSCRIPTION,
  getPlanBookLimit,
  readAdminSubscription,
} from "@/src/lib/adminSubscription";

function ActionIcon({ type }: { type: "edit" | "view" | "delete" }) {
  const className =
    type === "delete" ? "h-5 w-5 text-[#ff4d4f]" : "h-5 w-5 text-slate-500";

  if (type === "edit") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path d="M4 20h4l10-10-4-4L4 16v4Z" />
        <path d="m12 6 4 4" />
      </svg>
    );
  }

  if (type === "view") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M6 7l1 12h10l1-12" />
    </svg>
  );
}

function StatusBadge({ status }: { status: AdminBook["status"] }) {
  const colorClass =
    status === "Published"
      ? "bg-[#2ec84d]"
      : status === "Hidden"
        ? "bg-[#94a3b8]"
        : "bg-[#f59e0b]";

  return (
    <span
      className={`inline-flex min-w-[96px] justify-center rounded-[6px] px-3.5 py-1.5 text-sm font-medium text-white ${colorClass}`}
    >
      {status}
    </span>
  );
}

function LibraryTypeBadge({ libraryType }: { libraryType: AdminBook["libraryType"] }) {
  return (
    <span className="inline-flex min-w-[110px] justify-center rounded-[6px] bg-[#eef5ff] px-3.5 py-1.5 text-sm font-medium text-[#2456b6]">
      {libraryType === "khmer" ? "Khmer Books" : "English Books"}
    </span>
  );
}

export default function BooksManager() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<AdminBook[]>(() => readAdminBooks());
  const [pendingDelete, setPendingDelete] = useState<AdminBook | null>(null);
  const [subscription] = useState(() => {
    const savedSubscription = readAdminSubscription();
    return savedSubscription ?? DEFAULT_ADMIN_SUBSCRIPTION;
  });
  const bookLimit = getPlanBookLimit(subscription.plan);
  const canManageBooks = subscription.status === "active";
  const isLimitReached = canManageBooks && books.length >= bookLimit;

  const filteredBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return books;
    }

    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword) ||
        book.category.toLowerCase().includes(keyword)
    );
  }, [books, search]);

  function handleDeleteConfirm() {
    if (!pendingDelete) {
      return;
    }

    const nextBooks = removeAdminBook(pendingDelete.id);
    setBooks(nextBooks);
    setPendingDelete(null);
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[2.5rem] font-bold leading-none text-[#173b73]">
            Books Management
          </h1>
          <p className="mt-2 text-base text-[#4d6691]">
            Manage your library collection
          </p>
        </div>

        <Link
          href={canManageBooks && !isLimitReached ? "/library-owner/books/new" : "/library-owner/subscription"}
          className={`rounded-[8px] px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_20px_rgba(77,152,240,0.16)] transition ${
            canManageBooks && !isLimitReached
              ? "bg-[#4d98f0] hover:bg-[#3789ea]"
              : "bg-[#94a3b8] hover:bg-[#7f91a8]"
          }`}
        >
          {canManageBooks
            ? isLimitReached
              ? "Upgrade to Add More Books"
              : "+ Add New Book"
            : "Choose a Plan First"}
        </Link>
      </div>

      <section className="rounded-[10px] border border-[#cfcfcf] bg-white p-4 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <div className="flex items-center gap-4 rounded-[8px] border border-[#e1e1e1] px-5 py-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-slate-400">
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search books by title, author, or category..."
            className="w-full border-0 bg-transparent text-base text-slate-700 outline-none placeholder:text-base placeholder:text-slate-400"
          />
        </div>
      </section>

      {!books.length ? (
        <section className="rounded-[10px] border border-dashed border-[#cfcfcf] bg-white px-6 py-12 text-center shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
          <p className="text-xl font-semibold text-[#1e3a6d]">No books yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Add your first book record to start building the library.
          </p>
        </section>
      ) : null}

      {books.length ? (
        <section className="overflow-hidden rounded-[10px] border border-[#cfcfcf] bg-white shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-base text-[#2456b6]">
                  <th className="px-6 py-5 font-medium">Title</th>
                  <th className="px-4 py-5 font-medium">Author</th>
                  <th className="px-4 py-5 font-medium">Category</th>
                  <th className="px-4 py-5 font-medium">Book Type</th>
                  <th className="px-4 py-5 font-medium">Type</th>
                  <th className="px-4 py-5 font-medium">Payment QR</th>
                  <th className="px-4 py-5 font-medium">Status</th>
                  <th className="px-4 py-5 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="text-[1.1rem] text-slate-900">
                    <td className="border-t border-[#cfcfcf] px-6 py-6">{book.title}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-6">{book.author}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-6">{book.category}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-6">
                      <LibraryTypeBadge libraryType={book.libraryType} />
                    </td>
                    <td className="border-t border-[#cfcfcf] px-4 py-6">{book.type}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-6">
                      {book.type === "Free"
                        ? "Not needed"
                        : book.paymentQrImageSrc
                          ? "Ready"
                          : "Missing"}
                    </td>
                    <td className="border-t border-[#cfcfcf] px-4 py-6">
                      <StatusBadge status={book.status} />
                    </td>
                    <td className="border-t border-[#cfcfcf] px-4 py-6">
                      <div className="flex items-center gap-4">
                        <Link href={`/library-owner/books/${book.id}/edit`} aria-label="Edit book">
                          <ActionIcon type="edit" />
                        </Link>
                        <Link href={`/library-owner/books/${book.id}`} aria-label="View book">
                          <ActionIcon type="view" />
                        </Link>
                        <button
                          type="button"
                          aria-label="Delete book"
                          onClick={() => setPendingDelete(book)}
                        >
                          <ActionIcon type="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {pendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-[22px] border border-[#ffd4d4] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.24)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c74a4a]">
              Delete Book
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[#8f2626]">
              Are you sure?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6f5050]">
              &quot;{pendingDelete.title}&quot; will be removed from your book list. This action cannot be undone.
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
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-[#d94b4b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c93d3d]"
              >
                Delete Book
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
