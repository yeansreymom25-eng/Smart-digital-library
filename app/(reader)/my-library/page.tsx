import Image from "next/image";

type LibraryBook = {
  id: string;
  title: string;
  author: string;
  imageSrc: string;
};

type HistoryBook = LibraryBook & {
  progress: number;
};

type RentBook = LibraryBook & {
  daysLeft: number;
};

const historyBooks: HistoryBook[] = [
  {
    id: "history-1",
    title: "Atomic Habits",
    author: "James Clear",
    imageSrc: "/MainPage/Books/Atomic_habits.jpg",
    progress: 100,
  },
  {
    id: "history-2",
    title: "Atomic Habits",
    author: "James Clear",
    imageSrc: "/MainPage/Books/Atomic_habits.jpg",
    progress: 92,
  },
  {
    id: "history-3",
    title: "Atomic Habits",
    author: "James Clear",
    imageSrc: "/MainPage/Books/Atomic_habits.jpg",
    progress: 88,
  },
  {
    id: "history-4",
    title: "Atomic Habits",
    author: "James Clear",
    imageSrc: "/MainPage/Books/Atomic_habits.jpg",
    progress: 76,
  },
  {
    id: "history-5",
    title: "Atomic Habits",
    author: "James Clear",
    imageSrc: "/MainPage/Books/Atomic_habits.jpg",
    progress: 64,
  },
  {
    id: "history-6",
    title: "Atomic Habits",
    author: "James Clear",
    imageSrc: "/MainPage/Books/Atomic_habits.jpg",
    progress: 43,
  },
];

const boughtBooks: LibraryBook[] = [
  {
    id: "buy-1",
    title: "It Ends With Us",
    author: "Colleen Hoover",
    imageSrc: "/MainPage/Books/12132023_Book_Cover-Lessons_in_Chemistry_152020.jpg.webp",
  },
  {
    id: "buy-2",
    title: "Atomic Habits",
    author: "James Clear",
    imageSrc: "/MainPage/Books/Atomic_habits.jpg",
  },
  {
    id: "buy-3",
    title: "Song of Achilles",
    author: "Madeline Miller",
    imageSrc: "/MainPage/Books/all-the-single-ladies.jpg.webp",
  },
  {
    id: "buy-4",
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    imageSrc: "/MainPage/Books/The Castle In the Mist.jpeg",
  },
  {
    id: "buy-5",
    title: "Verity",
    author: "Colleen Hoover",
    imageSrc: "/MainPage/Books/9780062390769_p0_v4_s600x595.jpg",
  },
  {
    id: "buy-6",
    title: "The Life Impossible",
    author: "Matt Haig",
    imageSrc: "/MainPage/Books/9780399547003.jpeg",
  },
];

const rentedBooks: RentBook[] = [
  {
    id: "rent-1",
    title: "Atomic Habits",
    author: "James Clear",
    imageSrc: "/MainPage/Books/Atomic_habits.jpg",
    daysLeft: 9,
  },
  {
    id: "rent-2",
    title: "It Ends With Us",
    author: "Colleen Hoover",
    imageSrc: "/MainPage/Books/12132023_Book_Cover-Lessons_in_Chemistry_152020.jpg.webp",
    daysLeft: 19,
  },
  {
    id: "rent-3",
    title: "The Life Impossible",
    author: "Matt Haig",
    imageSrc: "/MainPage/Books/9780399547003.jpeg",
    daysLeft: 29,
  },
];

function BookCover({
  book,
  widthClass = "w-[8.5rem] sm:w-[9rem]",
}: {
  book: LibraryBook;
  widthClass?: string;
}) {
  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-[0.45rem] border border-black/5 shadow-[0_14px_28px_rgba(15,23,42,0.1)] ${widthClass}`}
    >
      <Image
        src={book.imageSrc}
        alt={book.title}
        fill
        className="object-cover"
        sizes="160px"
      />
    </div>
  );
}

function SectionTitle({ title, suffix }: { title: string; suffix?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <h2 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-[#232833]">{title}</h2>
      {suffix ? <span className="text-[1.15rem] text-[#a1aab7]">{suffix}</span> : null}
    </div>
  );
}

function HistoryBookCard({ book }: { book: HistoryBook }) {
  const progressStyle = {
    background: `conic-gradient(#7ef14e ${book.progress}%, #e6f0e0 ${book.progress}% 100%)`,
  };

  return (
    <div className="flex-shrink-0">
      <div className="relative">
        <BookCover book={book} widthClass="w-[10.6rem] sm:w-[11.8rem] lg:w-[12.6rem]" />
        <div className="absolute bottom-2 right-2">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full shadow-[0_10px_18px_rgba(15,23,42,0.12)]"
            style={progressStyle}
          >
            <div className="flex h-[2.25rem] w-[2.25rem] items-center justify-center rounded-full bg-white text-[0.78rem] font-semibold tracking-[-0.04em] text-[#2d3340]">
              {book.progress}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RentCard({ book }: { book: RentBook }) {
  const dayColor =
    book.daysLeft <= 10
      ? "text-[#ef5a54]"
      : book.daysLeft <= 20
      ? "text-[#f0bf44]"
      : "text-[#5bc96e]";

  return (
    <div className="flex min-w-[15rem] items-center gap-3">
      <BookCover book={book} widthClass="w-[3.3rem]" />
      <div className="min-w-0">
        <div className={`text-[2rem] font-semibold leading-none tracking-[-0.08em] ${dayColor}`}>
          {book.daysLeft}
        </div>
        <div className="mt-1 truncate text-sm font-semibold text-[#2b3341]">{book.title}</div>
        <div className="truncate text-xs text-[#7f8897]">{book.author}</div>
      </div>
    </div>
  );
}

export default function MyLibraryPage() {
  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[96rem] space-y-10">
        <section className="rounded-[2rem] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfd_100%)] px-5 py-6 shadow-[0_18px_34px_rgba(15,23,42,0.06)] sm:px-6">
          <SectionTitle title="History" suffix="›" />
          <div className="mt-5 flex gap-6 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {historyBooks.map((book) => (
              <HistoryBookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfd_100%)] px-5 py-6 shadow-[0_18px_34px_rgba(15,23,42,0.06)] sm:px-6">
          <SectionTitle title="Buy" suffix="10 ›" />
          <div className="mt-5 flex gap-7 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {boughtBooks.map((book) => (
              <div key={book.id} className="flex-shrink-0">
                <BookCover book={book} widthClass="w-[9.6rem] sm:w-[10.4rem] lg:w-[11rem]" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfd_100%)] px-5 py-6 shadow-[0_18px_34px_rgba(15,23,42,0.06)] sm:px-6">
          <SectionTitle title="Rent" suffix="›" />
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {rentedBooks.map((book) => (
              <RentCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
