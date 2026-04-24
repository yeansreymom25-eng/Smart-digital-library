import Image from "next/image";
import Link from "next/link";
import { readAdminBooks, type AdminBook } from "@/src/lib/adminBooks";

export default async function BookDetailsPanel({ bookId }: { bookId: string }) {
  const books = await readAdminBooks();
  const book: AdminBook | null =
    books.find((item: AdminBook) => item.id === bookId) ?? null;

  if (!book) {
    return (
      <section className="rounded-[18px] border border-[#d8e6fb] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f4a8a]">
          Books
        </p>
        <h1 className="mt-3 text-[2.5rem] font-bold leading-none text-[#173b73]">
          Book not found
        </h1>
        <p className="mt-3 text-base leading-7 text-[#5c7297]">
          The book you tried to view is no longer available.
        </p>
        <Link
          href="/library-owner/books"
          className="mt-6 inline-flex rounded-xl bg-[#4d98f0] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#3789ea]"
        >
          Back to Books
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-[18px] border border-[#d8e6fb] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f4a8a]">
            Book Details
          </p>
          <h1 className="mt-3 text-[2.5rem] font-bold leading-none text-[#173b73]">
            {book.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#5c7297] sm:text-lg">
            Review this book record, attached file names, and publishing settings.
          </p>
        </div>

        <Link
          href="/library-owner/books"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef5ff] text-xl font-semibold text-[#1e3a6d] transition hover:bg-[#dce9ff]"
          aria-label="Back to books page"
        >
          x
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Author</p>
          <p className="mt-3 text-lg font-semibold text-[#1e3a6d]">{book.author}</p>
        </div>
        <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Category</p>
          <p className="mt-3 text-lg font-semibold text-[#1e3a6d]">{book.category}</p>
        </div>
        <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Book Type</p>
          <p className="mt-3 text-lg font-semibold text-[#1e3a6d]">
            {book.libraryType === "khmer" ? "Khmer Books" : "English Books"}
          </p>
        </div>
        <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Access Type</p>
          <p className="mt-3 text-lg font-semibold text-[#1e3a6d]">{book.type}</p>
        </div>
        <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Price</p>
          <p className="mt-3 text-lg font-semibold text-[#1e3a6d]">{book.price || "$0.00"}</p>
        </div>
        <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Status</p>
          <p className="mt-3 text-lg font-semibold text-[#1e3a6d]">{book.status}</p>
        </div>
        <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">PDF File</p>
          <p className="mt-3 text-lg font-semibold text-[#1e3a6d]">{book.pdfName || "No file selected"}</p>
        </div>
        <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-5 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Cover Image</p>
          <p className="mt-3 text-lg font-semibold text-[#1e3a6d]">{book.coverName || "No image selected"}</p>
          <p className="mt-2 break-all text-sm text-slate-500">{book.coverImageSrc || "No cover path set"}</p>
          {book.coverImageSrc ? (
            <div className="relative mt-5 aspect-[2/3] w-[11rem] overflow-hidden rounded-[14px] border border-[#d6e4fb] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
              <Image
                src={book.coverImageSrc}
                alt={book.title}
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>
          ) : null}
        </div>
        <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-5 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">Payment QR Code</p>
          <p className="mt-3 text-lg font-semibold text-[#1e3a6d]">{book.paymentQrName || "No QR image selected"}</p>
          <p className="mt-2 break-all text-sm text-slate-500">{book.paymentQrImageSrc || "No QR path set"}</p>
          {book.paymentQrImageSrc ? (
            <div className="relative mt-5 aspect-square w-[11rem] overflow-hidden rounded-[14px] border border-[#d6e4fb] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
              <Image
                src={book.paymentQrImageSrc}
                alt={`${book.title} payment QR code`}
                fill
                className="object-contain"
                sizes="176px"
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Add a QR code if this book is being rented or sold so readers know how to pay.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/library-owner/books"
          className="rounded-xl border border-[#c8dcff] bg-white px-6 py-3 text-center text-base font-semibold text-[#1e3a6d] transition hover:bg-slate-50"
        >
          Back
        </Link>
        <Link
          href={`/library-owner/books/${book.id}/edit`}
          className="rounded-xl bg-[#4d98f0] px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-[#3789ea]"
        >
          Edit Book
        </Link>
      </div>
    </section>
  );
}
