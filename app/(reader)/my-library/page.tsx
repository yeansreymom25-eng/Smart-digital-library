import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import type { ReactNode } from "react";

type LibraryBook = {
  id: string;
  bookId: string;
  slug: string;
  title: string;
  author: string;
  imageSrc: string;
  accessType: "free" | "buy" | "rent";
  expiresAt?: string | null;
};

function daysLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function titleToSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

function BookCover({
  book,
  widthClass = "w-[8.5rem] sm:w-[9rem]",
}: {
  book: LibraryBook;
  widthClass?: string;
}) {
  return (
    <Link
      href={`/book/${book.slug}/read`}
      className={`relative block aspect-[2/3] overflow-hidden rounded-[0.45rem] border border-black/5 shadow-[0_14px_28px_rgba(15,23,42,0.1)] ${widthClass}`}
    >
      {book.imageSrc ? (
        <Image src={book.imageSrc} alt={book.title} fill className="object-cover" sizes="160px" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e8eaee] to-[#d0d4dc] p-2">
          <span className="text-center text-xs font-semibold text-[#6b7482]">{book.title}</span>
        </div>
      )}
    </Link>
  );
}

function BookmarkFillIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 3.75A2.25 2.25 0 0 1 9.25 1.5h5.5A2.25 2.25 0 0 1 17 3.75v17.38a.75.75 0 0 1-1.18.615L12 18.99l-3.82 2.755A.75.75 0 0 1 7 21.13V3.75Z" />
    </svg>
  );
}

function SectionTitle({ title, suffix, icon }: { title: string; suffix?: string; icon?: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef3ff] text-[#3f76cd] shadow-[0_6px_14px_rgba(95,151,238,0.15)]">
          {icon}
        </span>
      ) : null}
      <h2 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-[#232833]">{title}</h2>
      {suffix ? <span className="text-[1.15rem] text-[#a1aab7]">{suffix}</span> : null}
    </div>
  );
}

function RentCard({ book }: { book: LibraryBook }) {
  const days = book.expiresAt ? daysLeft(book.expiresAt) : 30;
  const dayColor = days <= 10 ? "text-[#ef5a54]" : days <= 20 ? "text-[#f0bf44]" : "text-[#5bc96e]";
  return (
    <div className="flex min-w-[15rem] items-center gap-3">
      <BookCover book={book} widthClass="w-[3.3rem]" />
      <div className="min-w-0">
        <div className={`text-[2rem] font-semibold leading-none tracking-[-0.08em] ${dayColor}`}>{days}</div>
        <div className="text-xs text-[#7f8897]">days left</div>
        <div className="mt-1 truncate text-sm font-semibold text-[#2b3341]">{book.title}</div>
        <div className="truncate text-xs text-[#7f8897]">{book.author}</div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-32 items-center justify-center rounded-[1.2rem] border border-dashed border-[#d4dae4]">
      <p className="text-sm text-[#9aa2af]">{message}</p>
    </div>
  );
}

export default async function MyLibraryPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // Use service role to bypass RLS
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  // Get user from anon client
  const anonSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await anonSupabase.auth.getUser();
  if (!user) notFound();

  // Fetch library entries using service role to bypass RLS
  const { data: libraryRows } = await supabase
    .from("reader_library")
    .select("id, book_id, access_type, acquired_at, expires_at")
    .eq("user_id", user.id)
    .order("acquired_at", { ascending: false });

  // Fetch book details separately
  const allBooks: LibraryBook[] = await Promise.all(
    (libraryRows ?? []).map(async (row) => {
      const { data: book } = await supabase
        .from("books")
        .select("id, title, author, cover_url")
        .eq("id", row.book_id)
        .maybeSingle();

      return {
        id: row.id as string,
        bookId: row.book_id as string,
        slug: book ? titleToSlug(book.title) : "",
        title: book?.title ?? "Unknown",
        author: book?.author ?? "Unknown",
        imageSrc: book?.cover_url ?? "",
        accessType: (row.access_type as "free" | "buy" | "rent") ?? "free",
        expiresAt: row.expires_at as string | null,
      };
    })
  );

  const freeBooks = allBooks.filter((b) => b.accessType === "free");
  const purchasedBooks = allBooks.filter((b) => b.accessType === "buy");
  const rentedBooks = allBooks.filter((b) => {
    if (b.accessType !== "rent") return false;
    if (b.expiresAt && daysLeft(b.expiresAt) === 0) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[96rem] space-y-10">
        <section className="rounded-[2rem] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfd_100%)] px-5 py-6 shadow-[0_18px_34px_rgba(15,23,42,0.06)] sm:px-6">
          <SectionTitle title="Free Books" suffix={`${freeBooks.length} ›`} />
          <div className="mt-5 flex gap-7 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {freeBooks.length === 0 ? (
              <EmptyState message="No free books yet — claim some from the home page!" />
            ) : (
              freeBooks.map((book) => (
                <div key={book.id} className="flex-shrink-0">
                  <BookCover book={book} widthClass="w-[9.6rem] sm:w-[10.4rem] lg:w-[11rem]" />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfd_100%)] px-5 py-6 shadow-[0_18px_34px_rgba(15,23,42,0.06)] sm:px-6">
          <SectionTitle title="Purchased" suffix={`${purchasedBooks.length} ›`} />
          <div className="mt-5 flex gap-7 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {purchasedBooks.length === 0 ? (
              <EmptyState message="No purchased books yet." />
            ) : (
              purchasedBooks.map((book) => (
                <div key={book.id} className="flex-shrink-0">
                  <BookCover book={book} widthClass="w-[9.6rem] sm:w-[10.4rem] lg:w-[11rem]" />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfd_100%)] px-5 py-6 shadow-[0_18px_34px_rgba(15,23,42,0.06)] sm:px-6">
          <SectionTitle title="Rented" suffix="›" />
          {rentedBooks.length === 0 ? (
            <div className="mt-5"><EmptyState message="No active rentals." /></div>
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {rentedBooks.map((book) => <RentCard key={book.id} book={book} />)}
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfd_100%)] px-5 py-6 shadow-[0_18px_34px_rgba(15,23,42,0.06)] sm:px-6">
          <SectionTitle title="Want to read" suffix="›" icon={<BookmarkFillIcon />} />
          <div className="mt-5"><EmptyState message="Books you bookmark will appear here." /></div>
        </section>
      </div>
    </main>
  );
}