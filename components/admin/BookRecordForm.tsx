"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  readAdminCategories,
  type CategoryLibraryType,
} from "@/src/lib/adminCategories";
import {
  createAdminBook,
  readAdminBooks,
  updateAdminBook,
  type AdminBook,
} from "@/src/lib/adminBooks";
import {
  DEFAULT_ADMIN_SUBSCRIPTION,
  formatPlanLimit,
  getPlanBookLimit,
  readAdminSubscription,
} from "@/src/lib/adminSubscription";

type BookRecordFormProps = {
  mode: "create" | "edit";
  bookId?: string;
};

export default function BookRecordForm({
  mode,
  bookId,
}: BookRecordFormProps) {
  const router = useRouter();
  const existingBook =
    mode === "edit" && bookId
      ? readAdminBooks().find((item) => item.id === bookId) ?? null
      : null;
  const [bookTitle, setBookTitle] = useState(existingBook?.title ?? "");
  const [author, setAuthor] = useState(existingBook?.author ?? "");
  const [category, setCategory] = useState(existingBook?.category ?? "");
  const [libraryType, setLibraryType] = useState<CategoryLibraryType>(existingBook?.libraryType ?? "english");
  const [accessType, setAccessType] = useState(existingBook?.type ?? "Buy/Rent");
  const [status, setStatus] = useState<AdminBook["status"]>(existingBook?.status ?? "Published");
  const [price, setPrice] = useState(existingBook?.price ?? "");
  const [pdfName, setPdfName] = useState(existingBook?.pdfName ?? "");
  const [coverName, setCoverName] = useState(existingBook?.coverName ?? "");
  const [coverImageSrc, setCoverImageSrc] = useState(existingBook?.coverImageSrc ?? "");
  const [paymentQrName, setPaymentQrName] = useState(existingBook?.paymentQrName ?? "");
  const [paymentQrImageSrc, setPaymentQrImageSrc] = useState(existingBook?.paymentQrImageSrc ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [subscription] = useState(() => {
    const savedSubscription = readAdminSubscription();
    return savedSubscription ?? DEFAULT_ADMIN_SUBSCRIPTION;
  });
  const existingBooks = readAdminBooks();
  const bookLimit = getPlanBookLimit(subscription.plan);
  const isReady = mode === "create" || Boolean(existingBook);
  const isMissing = mode === "edit" && !existingBook;
  const availableCategories = useMemo(
    () => readAdminCategories().filter((item) => item.libraryType === libraryType),
    [libraryType]
  );
  const requiresPaymentQr = accessType !== "Free";

  function validateInput(books: AdminBook[]) {
    const trimmedTitle = bookTitle.trim();
    const trimmedAuthor = author.trim();
    const trimmedCategory = category.trim();

    if (mode === "create" && subscription.status !== "active") {
      return "Choose and activate a plan before adding books.";
    }

    if (
      mode === "create" &&
      Number.isFinite(bookLimit) &&
      books.length >= bookLimit
    ) {
      return `Your ${subscription.plan ?? "current"} plan allows only ${formatPlanLimit(bookLimit)} books.`;
    }

    if (!trimmedTitle) {
      return "Book title is required.";
    }

    const duplicate = books.find(
      (item) =>
        item.id !== bookId &&
        item.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (duplicate) {
      return "Book title already exists.";
    }

    if (!trimmedAuthor) {
      return "Author name is required.";
    }

    if (!trimmedCategory) {
      return "Category is required.";
    }

    if (!coverImageSrc.trim()) {
      return "Cover image path is required.";
    }

    if (requiresPaymentQr && !paymentQrImageSrc.trim()) {
      return "Payment QR code path is required for books that are rented or sold.";
    }

    return "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationMessage = validateInput(existingBooks);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    const nextBook = {
      title: bookTitle.trim(),
      author: author.trim(),
      category: category.trim(),
      libraryType,
      type: accessType,
      status,
      price: price.trim(),
      pdfName,
      coverName,
      coverImageSrc: coverImageSrc.trim(),
      paymentQrName,
      paymentQrImageSrc: paymentQrImageSrc.trim(),
    };

    if (mode === "create") {
      createAdminBook(nextBook);
    } else if (bookId) {
      updateAdminBook(bookId, nextBook);
    }

    router.push("/library-owner/books");
  }

  if (!isReady) {
    return (
      <section className="rounded-[18px] border border-[#d8e6fb] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <p className="text-base text-[#4d6691]">Loading book...</p>
      </section>
    );
  }

  if (isMissing) {
    return (
      <section className="rounded-[18px] border border-[#d8e6fb] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f4a8a]">
          Books
        </p>
        <h1 className="mt-3 text-[2.5rem] font-bold leading-none text-[#173b73]">
          Book not found
        </h1>
        <p className="mt-3 text-base leading-7 text-[#5c7297]">
          The book you tried to edit is no longer available.
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

  const pageEyebrow = mode === "create" ? "Add New Book" : "Edit Book";
  const pageTitle =
    mode === "create" ? "Create a new book record" : "Update book record";
  const pageDescription =
    mode === "create"
      ? "Enter book details, upload the PDF, choose a cover file name, add the public image path, attach the payment QR code for paid books, and save the record."
      : "Update this book's information, file names, cover path, payment QR code, and publishing settings.";

  return (
    <section className="flex min-h-[calc(100vh-1.5rem)] flex-col rounded-[18px] border border-[#d8e6fb] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1f4a8a]">
            {pageEyebrow}
          </p>
          <h1 className="mt-3 text-[2.5rem] font-bold leading-none text-[#173b73]">
            {pageTitle}
          </h1>
          <p className="mt-2 max-w-4xl text-base leading-7 text-[#4d6691]">
            {pageDescription}
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

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
        {mode === "create" && subscription.status !== "active" ? (
          <div className="sm:col-span-2 rounded-xl border border-[#ffe0b8] bg-[#fff8ef] px-4 py-4 text-sm text-[#8a5b18]">
            Choose a plan and activate it first on{" "}
            <Link href="/library-owner/subscription" className="font-semibold underline">
              the subscription page
            </Link>
            . Paid plans become available after approval.
          </div>
        ) : null}

        {mode === "create" &&
        subscription.status === "active" &&
        Number.isFinite(bookLimit) ? (
          <div className="sm:col-span-2 rounded-xl border border-[#d7e5fb] bg-[#f7fbff] px-4 py-4 text-sm text-slate-600">
            Active plan:{" "}
            <span className="font-semibold text-slate-900">{subscription.plan}</span>.
            Current books:{" "}
            <span className="font-semibold text-slate-900">
              {existingBooks.length}/{formatPlanLimit(bookLimit)}
            </span>
            .
          </div>
        ) : null}

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Title
          </span>
          <input
            type="text"
            value={bookTitle}
            onChange={(event) => setBookTitle(event.target.value)}
            placeholder="Enter book title"
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-base placeholder:text-[#5678a8]"
          />
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Author
          </span>
          <input
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Enter author name"
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-base placeholder:text-[#5678a8]"
          />
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Book Type
          </span>
          <select
            value={libraryType}
            onChange={(event) => {
              const nextType = event.target.value as CategoryLibraryType;
              setLibraryType(nextType);
              setCategory("");
            }}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none"
          >
            <option value="english">English Books</option>
            <option value="khmer">Khmer Books</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Category
          </span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none"
          >
            <option value="">Select a category</option>
            {availableCategories.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Access Type
          </span>
          <select
            value={accessType}
            onChange={(event) => setAccessType(event.target.value)}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none"
          >
            <option>Buy/Rent</option>
            <option>Free</option>
            <option>Buy</option>
            <option>Rent</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Status
          </span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as AdminBook["status"])}
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none"
          >
            <option>Published</option>
            <option>Hidden</option>
            <option>Draft</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Price
          </span>
          <input
            type="text"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="$0.00"
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-base placeholder:text-[#5678a8]"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Payment QR Code
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              const fileName = file?.name ?? "";
              setPaymentQrName(fileName);

              if (fileName && !paymentQrImageSrc.trim()) {
                setPaymentQrImageSrc(`/payments/${fileName}`);
              }
            }}
            className="block w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] file:mr-4 file:rounded-lg file:border-0 file:bg-[#e8f1ff] file:px-4 file:py-2.5 file:text-base file:font-semibold file:text-[#1f4a8a]"
          />
          <p className="mt-2 text-sm text-slate-500">
            Required for <span className="font-semibold">Buy</span>, <span className="font-semibold">Rent</span>, and <span className="font-semibold">Buy/Rent</span> books. Free books can leave this blank.
          </p>
        </label>

        <label className="block">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            PDF File
          </span>
          <input
            type="file"
            accept=".pdf"
            onChange={(event) => setPdfName(event.target.files?.[0]?.name ?? "")}
            className="block w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] file:mr-4 file:rounded-lg file:border-0 file:bg-[#e8f1ff] file:px-4 file:py-2.5 file:text-base file:font-semibold file:text-[#1f4a8a]"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Cover Image
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              const fileName = file?.name ?? "";
              setCoverName(fileName);

              if (fileName && !coverImageSrc.trim()) {
                setCoverImageSrc(`/MainPage/Books/${fileName}`);
              }
            }}
            className="block w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] file:mr-4 file:rounded-lg file:border-0 file:bg-[#e8f1ff] file:px-4 file:py-2.5 file:text-base file:font-semibold file:text-[#1f4a8a]"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Cover Image Path
          </span>
          <input
            type="text"
            value={coverImageSrc}
            onChange={(event) => setCoverImageSrc(event.target.value)}
            placeholder="/MainPage/Books/Atomic_habits.jpg"
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-base placeholder:text-[#5678a8]"
          />
          <p className="mt-2 text-sm text-slate-500">
            Use an image already inside the <span className="font-semibold">public</span> folder so it matches the reader-side cards.
            Example: <span className="font-semibold">/MainPage/Books/Atomic_habits.jpg</span>
          </p>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
            Payment QR Path
          </span>
          <input
            type="text"
            value={paymentQrImageSrc}
            onChange={(event) => setPaymentQrImageSrc(event.target.value)}
            placeholder="/payments/library-owner-qr.png"
            className="w-full rounded-xl border border-[#c8dcff] bg-white px-5 py-4 text-base text-[#1e3a6d] outline-none placeholder:text-base placeholder:text-[#5678a8]"
          />
          <p className="mt-2 text-sm text-slate-500">
            Point this to a QR image in the <span className="font-semibold">public</span> folder so readers can scan and pay the library directly.
          </p>
        </label>

        {errorMessage ? (
          <div className="sm:col-span-2 rounded-xl border border-[#ffc8c8] bg-[#fff4f4] px-4 py-3 text-sm font-medium text-[#b33434]">
            {errorMessage}
          </div>
        ) : null}

        <div className="sm:col-span-2 grid gap-3 rounded-[14px] bg-[#f7fbff] p-5 text-base text-[#1e3a6d] sm:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-900">Book type:</span>{" "}
            {libraryType === "khmer" ? "Khmer Books" : "English Books"}
          </p>
          <p>
            <span className="font-semibold text-slate-900">PDF:</span>{" "}
            {pdfName || "No file selected"}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Cover:</span>{" "}
            {coverName || "No image selected"}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Payment QR:</span>{" "}
            {paymentQrName || (requiresPaymentQr ? "Required" : "Not needed for free books")}
          </p>
          <p className="sm:col-span-2">
            <span className="font-semibold text-slate-900">Cover path:</span>{" "}
            {coverImageSrc || "No cover path set"}
          </p>
          <p className="sm:col-span-2">
            <span className="font-semibold text-slate-900">Payment QR path:</span>{" "}
            {paymentQrImageSrc || "No QR path set"}
          </p>
        </div>

        <div className="sm:col-span-2 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
              Cover Preview
            </p>
            {coverImageSrc ? (
              <div className="mt-4 flex items-start gap-5">
                <div className="relative aspect-[2/3] w-[9.5rem] overflow-hidden rounded-[12px] border border-[#d6e4fb] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
                  <Image
                    src={coverImageSrc}
                    alt={bookTitle || "Book cover preview"}
                    fill
                    className="object-cover"
                    sizes="152px"
                  />
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">{bookTitle || "Book title preview"}</p>
                  <p>{author || "Author preview"}</p>
                  <p className="break-all">{coverImageSrc}</p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Add a cover image path to preview how the reader-side card image will look.
              </p>
            )}
          </div>

          <div className="rounded-[14px] border border-[#dce8fb] bg-[#f8fbff] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4a8a]">
              Payment QR Preview
            </p>
            {paymentQrImageSrc ? (
              <div className="mt-4 flex items-start gap-5">
                <div className="relative aspect-square w-[9.5rem] overflow-hidden rounded-[12px] border border-[#d6e4fb] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
                  <Image
                    src={paymentQrImageSrc}
                    alt={bookTitle ? `${bookTitle} payment QR code` : "Payment QR code preview"}
                    fill
                    className="object-contain"
                    sizes="152px"
                  />
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">
                    {requiresPaymentQr ? "Reader payment QR" : "Optional payment QR"}
                  </p>
                  <p>{paymentQrName || "No QR file selected"}</p>
                  <p className="break-all">{paymentQrImageSrc}</p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Add a QR image path so users can scan it when they rent or buy this book.
              </p>
            )}
          </div>
        </div>

        <div className="sm:col-span-2 flex flex-col gap-3 pt-3 sm:flex-row sm:justify-end">
          <Link
            href="/library-owner/books"
            className="rounded-xl border border-[#c8dcff] bg-white px-6 py-3 text-center text-base font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-xl bg-[#4d98f0] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#3789ea]"
          >
            {mode === "create" ? "Save Book" : "Update Book"}
          </button>
        </div>
      </form>
    </section>
  );
}
