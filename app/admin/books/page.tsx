"use client";

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
    type === "delete" ? "h-4 w-4 text-[#ff4d4f]" : "h-4 w-4 text-slate-500";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [accessType, setAccessType] = useState("Buy/Rent");
  const [price, setPrice] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [coverName, setCoverName] = useState("");

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

  function resetForm() {
    setBookTitle("");
    setAuthor("");
    setCategory("");
    setAccessType("Buy/Rent");
    setPrice("");
    setPdfName("");
    setCoverName("");
  }

  function handleCloseModal() {
    setIsAddModalOpen(false);
    resetForm();
  }

  return (
    <>
      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[2rem] font-bold leading-none text-slate-950">
              Books Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your library collection
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-[6px] bg-[#4d98f0] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(77,152,240,0.16)] transition hover:bg-[#3789ea]"
          >
            + Add New Book
          </button>
        </div>

        <section className="rounded-[8px] border border-[#cfcfcf] bg-white p-3 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
          <div className="flex items-center gap-3 rounded-[6px] border border-[#e1e1e1] px-4 py-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-slate-400">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search books by title or authors..."
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-[8px] border border-[#cfcfcf] bg-white shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-sm text-[#2456b6]">
                  <th className="px-6 py-4 font-medium">Tittle</th>
                  <th className="px-4 py-4 font-medium">Author</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">Type</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, index) => (
                  <tr key={`${book.title}-${index}`} className="text-[1rem] text-slate-900">
                    <td className="border-t border-[#cfcfcf] px-6 py-5">{book.title}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-5">{book.author}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-5">{book.category}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-5">{book.type}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-5">
                      <span className="inline-flex min-w-[82px] justify-center rounded-[4px] bg-[#2ec84d] px-3 py-1 text-xs font-medium text-white">
                        {book.status}
                      </span>
                    </td>
                    <td className="border-t border-[#cfcfcf] px-4 py-5">
                      <div className="flex items-center gap-3">
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

      {isAddModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-[2px]">
          <div className="w-full max-w-3xl rounded-[18px] border border-[#d8e6fb] bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">
                  Add New Book
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Create a new book record
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  When the library owner clicks <span className="font-semibold">Add New Book</span>, this form opens so they can enter book details, upload the PDF, upload the cover image, set pricing, and save the record.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef5ff] text-lg font-semibold text-slate-700 transition hover:bg-[#dce9ff]"
                aria-label="Close add book form"
              >
                x
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8db5]">
                  Title
                </span>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={(event) => setBookTitle(event.target.value)}
                  placeholder="Enter book title"
                  className="w-full rounded-xl border border-[#c8dcff] bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8db5]">
                  Author
                </span>
                <input
                  type="text"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  placeholder="Enter author name"
                  className="w-full rounded-xl border border-[#c8dcff] bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8db5]">
                  Category
                </span>
                <input
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="Technology, Business, Science..."
                  className="w-full rounded-xl border border-[#c8dcff] bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8db5]">
                  Access Type
                </span>
                <select
                  value={accessType}
                  onChange={(event) => setAccessType(event.target.value)}
                  className="w-full rounded-xl border border-[#c8dcff] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                >
                  <option>Buy/Rent</option>
                  <option>Free</option>
                  <option>Buy</option>
                  <option>Rent</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8db5]">
                  Price
                </span>
                <input
                  type="text"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="$0.00"
                  className="w-full rounded-xl border border-[#c8dcff] bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8db5]">
                  PDF File
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(event) =>
                    setPdfName(event.target.files?.[0]?.name ?? "")
                  }
                  className="block w-full rounded-xl border border-[#c8dcff] bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#e8f1ff] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#316dbf]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8db5]">
                  Cover Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setCoverName(event.target.files?.[0]?.name ?? "")
                  }
                  className="block w-full rounded-xl border border-[#c8dcff] bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#e8f1ff] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#316dbf]"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-3 rounded-[14px] bg-[#f7fbff] p-4 text-sm text-slate-600 sm:grid-cols-2">
              <p>
                <span className="font-semibold text-slate-900">PDF:</span>{" "}
                {pdfName || "No file selected"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Cover:</span>{" "}
                {coverName || "No image selected"}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-xl border border-[#c8dcff] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-xl bg-[#4d98f0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3789ea]"
              >
                Save Book
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
