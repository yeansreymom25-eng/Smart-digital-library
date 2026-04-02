"use client";

import Link from "next/link";
import { useState } from "react";

export default function BookRecordForm() {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [accessType, setAccessType] = useState("Buy/Rent");
  const [price, setPrice] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [coverName, setCoverName] = useState("");

  return (
    <section className="flex min-h-[calc(100vh-1.5rem)] flex-col rounded-[18px] border border-[#d8e6fb] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#6a8db5]">
            Add New Book
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Create a new book record
          </h1>
          <p className="mt-3 max-w-4xl text-base leading-7 text-slate-600 sm:text-lg">
            Enter book details, upload the PDF, upload the cover image, set
            pricing, and save the record.
          </p>
        </div>
        <Link
          href="/library-owner/books"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef5ff] text-xl font-semibold text-slate-700 transition hover:bg-[#dce9ff]"
          aria-label="Back to books page"
        >
          x
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">
            Title
          </span>
          <input
            type="text"
            value={bookTitle}
            onChange={(event) => setBookTitle(event.target.value)}
            placeholder="Enter book title"
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-slate-700 outline-none placeholder:text-base placeholder:text-slate-400"
          />
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">
            Author
          </span>
          <input
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Enter author name"
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-slate-700 outline-none placeholder:text-base placeholder:text-slate-400"
          />
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">
            Category
          </span>
          <input
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Technology, Business, Science..."
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-slate-700 outline-none placeholder:text-base placeholder:text-slate-400"
          />
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">
            Access Type
          </span>
          <select
            value={accessType}
            onChange={(event) => setAccessType(event.target.value)}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-slate-700 outline-none"
          >
            <option>Buy/Rent</option>
            <option>Free</option>
            <option>Buy</option>
            <option>Rent</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">
            Price
          </span>
          <input
            type="text"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="$0.00"
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-slate-700 outline-none placeholder:text-base placeholder:text-slate-400"
          />
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">
            PDF File
          </span>
          <input
            type="file"
            accept=".pdf"
            onChange={(event) => setPdfName(event.target.files?.[0]?.name ?? "")}
            className="block w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#e8f1ff] file:px-4 file:py-2.5 file:text-base file:font-semibold file:text-[#316dbf]"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">
            Cover Image
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setCoverName(event.target.files?.[0]?.name ?? "")
            }
            className="block w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#e8f1ff] file:px-4 file:py-2.5 file:text-base file:font-semibold file:text-[#316dbf]"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3 rounded-[14px] bg-[#f7fbff] p-5 text-base text-slate-600 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-slate-900">PDF:</span>{" "}
          {pdfName || "No file selected"}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Cover:</span>{" "}
          {coverName || "No image selected"}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:justify-end">
        <Link
          href="/library-owner/books"
          className="rounded-xl border border-[#c8dcff] bg-white px-6 py-3 text-center text-base font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="button"
          className="rounded-xl bg-[#4d98f0] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#3789ea]"
        >
          Save Book
        </button>
      </div>
    </section>
  );
}
