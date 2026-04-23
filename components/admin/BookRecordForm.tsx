"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CategoryLibraryType, AdminCategory } from "@/src/lib/adminCategories";
import type { AdminBook } from "@/src/lib/adminBooks";

type BookRecordFormProps = {
  mode: "create" | "edit";
  bookId?: string;
  initialBook?: AdminBook | null;
  initialCategories?: AdminCategory[];
};

function UploadButton({
  label,
  accept,
  onUpload,
  currentUrl,
  isImage = false,
}: {
  label: string;
  accept: string;
  onUpload: (url: string, name: string) => void;
  currentUrl?: string;
  isImage?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) throw new Error("Missing Supabase environment variables");

      const bucket = accept.includes("pdf") ? "book-pdfs"
        : label.toLowerCase().includes("qr") ? "payment-qr"
        : "book-covers";

      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // Upload directly via Supabase Storage REST API
      const uploadRes = await fetch(
        `${url}/storage/v1/object/${bucket}/${fileName}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": file.type,
            "x-upsert": "true",
          },
          body: file,
        }
      );

      if (!uploadRes.ok) {
        const err = await uploadRes.json() as { message?: string };
        throw new Error(err.message ?? "Upload failed");
      }

      const publicUrl = `${url}/storage/v1/object/public/${bucket}/${fileName}`;
      onUpload(publicUrl, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c8dcff] bg-[#f7fbff] px-5 py-4 text-sm font-medium text-[#2456b6] transition hover:bg-[#eef5ff] disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <path d="M17 8l-5-5-5 5" />
              <path d="M12 3v12" />
            </svg>
            {currentUrl ? "Change file" : `Upload ${label}`}
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {currentUrl && isImage && (
        <div className="relative aspect-[2/3] w-24 overflow-hidden rounded-lg border border-[#d6e4fb]">
          <Image src={currentUrl} alt={label} fill className="object-cover" sizes="96px" />
        </div>
      )}
      {currentUrl && !isImage && (
        <p className="text-xs text-green-600">✅ File uploaded successfully</p>
      )}
    </div>
  );
}

export default function BookRecordForm({
  mode,
  bookId,
  initialBook,
  initialCategories = [],
}: BookRecordFormProps) {
  const router = useRouter();
  const [bookTitle, setBookTitle] = useState(initialBook?.title ?? "");
  const [author, setAuthor] = useState(initialBook?.author ?? "");
  const [category, setCategory] = useState(initialBook?.category ?? "");
  const [libraryType, setLibraryType] = useState<CategoryLibraryType>(initialBook?.libraryType ?? "english");
  const [accessType, setAccessType] = useState(initialBook?.type ?? "Buy/Rent");
  const [status, setStatus] = useState<AdminBook["status"]>(initialBook?.status ?? "Published");
  const [price, setPrice] = useState(initialBook?.price ?? "");
  const [coverUrl, setCoverUrl] = useState(initialBook?.coverImageSrc ?? "");
  const [pdfUrl, setPdfUrl] = useState(initialBook?.pdfName ?? "");
  const [paymentQrUrl, setPaymentQrUrl] = useState(initialBook?.paymentQrImageSrc ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiresPaymentQr = accessType !== "Free";

  const [allCategories, setAllCategories] = useState<AdminCategory[]>(initialCategories);

  const availableCategories = useMemo(
    () => allCategories.filter((item) => item.libraryType === libraryType),
    [allCategories, libraryType]
  );

  useEffect(() => {
    if (mode === "create") setCategory("");
  }, [libraryType, mode]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!bookTitle.trim()) return setErrorMessage("Book title is required.");
    if (!author.trim()) return setErrorMessage("Author name is required.");
    if (!category.trim()) return setErrorMessage("Category is required.");
    if (!coverUrl) return setErrorMessage("Please upload a cover image.");
    if (requiresPaymentQr && !paymentQrUrl) {
      return setErrorMessage("Please upload a payment QR code for paid books.");
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: bookTitle.trim(),
        author: author.trim(),
        category: category.trim(),
        libraryType,
        type: accessType,
        status,
        price: price.trim(),
        pdfName: pdfUrl,
        coverImageSrc: coverUrl,
        paymentQrImageSrc: paymentQrUrl,
      };

      const res = await fetch(
        mode === "create" ? "/api/admin/books" : `/api/admin/books/${bookId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setErrorMessage(data.error ?? "Something went wrong.");
        return;
      }

      router.push("/library-owner/books");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-1.5rem)] flex-col rounded-[18px] border border-[#d8e6fb] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f4a8a]">
            {mode === "create" ? "Add New Book" : "Edit Book"}
          </p>
          <h1 className="mt-3 text-[2.5rem] font-bold leading-none text-[#173b73]">
            {mode === "create" ? "Create a new book record" : "Update book record"}
          </h1>
        </div>
        <Link href="/library-owner/books"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef5ff] text-xl font-semibold text-slate-700 transition hover:bg-[#dce9ff]">
          x
        </Link>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 grid gap-5 sm:grid-cols-2">

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Title</span>
          <input type="text" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="Enter book title"
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-[#5678a8]" />
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Author</span>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter author name"
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-[#5678a8]" />
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Book Type</span>
          <select value={libraryType} onChange={(e) => setLibraryType(e.target.value as CategoryLibraryType)}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none">
            <option value="english">English Books</option>
            <option value="khmer">Khmer Books</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none">
            <option value="">Select a category</option>
            {availableCategories.map((item) => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Access Type</span>
          <select value={accessType} onChange={(e) => setAccessType(e.target.value)}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none">
            <option>Buy/Rent</option>
            <option>Free</option>
            <option>Buy</option>
            <option>Rent</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as AdminBook["status"])}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none">
            <option>Published</option>
            <option>Hidden</option>
            <option>Draft</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Price</span>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="9.99"
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-[#5678a8]" />
        </label>

        {/* File uploads */}
        <div className="sm:col-span-2 grid gap-5 lg:grid-cols-3">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Cover Image *</p>
            <UploadButton
              label="Cover Image"
              accept="image/*"
              currentUrl={coverUrl}
              isImage={true}
              onUpload={(url) => setCoverUrl(url)}
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">PDF File</p>
            <UploadButton
              label="PDF File"
              accept=".pdf"
              currentUrl={pdfUrl}
              isImage={false}
              onUpload={(url) => setPdfUrl(url)}
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
              Payment QR {requiresPaymentQr ? "*" : "(optional)"}
            </p>
            <UploadButton
              label="Payment QR"
              accept="image/*"
              currentUrl={paymentQrUrl}
              isImage={true}
              onUpload={(url) => setPaymentQrUrl(url)}
            />
          </div>
        </div>

        {errorMessage ? (
          <div className="sm:col-span-2 rounded-xl border border-[#ffc8c8] bg-[#fff4f4] px-4 py-3 text-sm font-medium text-[#b33434]">
            {errorMessage}
          </div>
        ) : null}

        <div className="sm:col-span-2 flex flex-col gap-3 pt-3 sm:flex-row sm:justify-end">
          <Link href="/library-owner/books"
            className="rounded-xl border border-[#c8dcff] bg-white px-6 py-3 text-center text-base font-semibold text-slate-700 transition hover:bg-slate-50">
            Cancel
          </Link>
          <button type="submit" disabled={isSubmitting}
            className="rounded-xl bg-[#4d98f0] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#3789ea] disabled:opacity-50">
            {isSubmitting ? "Saving..." : mode === "create" ? "Save Book" : "Update Book"}
          </button>
        </div>
      </form>
    </section>
  );
}