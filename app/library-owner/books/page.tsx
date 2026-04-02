"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BookRow = {
  title: string;
  author: string;
  category: string;
  type: string;
  status: "Published" | "Hidden" | "Draft";
};

const books: BookRow[] = [
  {
    title: "The Arts of programming",
    author: "Sarah Johnson",
    category: "Technology",
    type: "Buy/Rent",
    status: "Published",
  },
  {
    title: "Digital Marketing",
    author: "Vy seoul",
    category: "Business",
    type: "Free",
    status: "Published",
  },
  {
    title: "The Science if Mind",
    author: "Mr.saravuth",
    category: "Science",
    type: "Buy/Rent",
    status: "Published",
  },
  {
    title: "The Arts of programming",
    author: "Sarah Johnson",
    category: "Technology",
    type: "Buy/Rent",
    status: "Published",
  },
  {
    title: "The Arts of programming",
    author: "Sarah Johnson",
    category: "Technology",
    type: "Buy/Rent",
    status: "Published",
  },
  {
    title: "The Arts of programming",
    author: "Sarah Johnson",
    category: "Technology",
    type: "Buy/Rent",
    status: "Published",
  },
];

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

export default function AdminBooksPage() {
  const [search, setSearch] = useState("");

  const filteredBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return books;
    }

    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword)
    );
  }, [search]);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[2.6rem] font-bold leading-none text-slate-950">
            Books Management
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Manage your library collection
          </p>
        </div>

        <Link
          href="/library-owner/books/new"
          className="rounded-[8px] bg-[#4d98f0] px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_20px_rgba(77,152,240,0.16)] transition hover:bg-[#3789ea]"
        >
          + Add New Book
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
            placeholder="Search books by title or authors..."
            className="w-full border-0 bg-transparent text-base text-slate-700 outline-none placeholder:text-base placeholder:text-slate-400"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-[10px] border border-[#cfcfcf] bg-white shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-base text-[#2456b6]">
                <th className="px-6 py-5 font-medium">Tittle</th>
                <th className="px-4 py-5 font-medium">Author</th>
                <th className="px-4 py-5 font-medium">Category</th>
                <th className="px-4 py-5 font-medium">Type</th>
                <th className="px-4 py-5 font-medium">Status</th>
                <th className="px-4 py-5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr key={`${book.title}-${index}`} className="text-[1.1rem] text-slate-900">
                  <td className="border-t border-[#cfcfcf] px-6 py-6">{book.title}</td>
                  <td className="border-t border-[#cfcfcf] px-4 py-6">{book.author}</td>
                  <td className="border-t border-[#cfcfcf] px-4 py-6">{book.category}</td>
                  <td className="border-t border-[#cfcfcf] px-4 py-6">{book.type}</td>
                  <td className="border-t border-[#cfcfcf] px-4 py-6">
                    <span className="inline-flex min-w-[96px] justify-center rounded-[6px] bg-[#2ec84d] px-3.5 py-1.5 text-sm font-medium text-white">
                      {book.status}
                    </span>
                  </td>
                  <td className="border-t border-[#cfcfcf] px-4 py-6">
                    <div className="flex items-center gap-4">
                      <button type="button" aria-label="Edit book">
                        <ActionIcon type="edit" />
                      </button>
                      <button type="button" aria-label="View book">
                        <ActionIcon type="view" />
                      </button>
                      <button type="button" aria-label="Delete book">
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
    </section>
  );
}
