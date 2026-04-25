import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import BookReader from "@/components/main/reader/BookReader";
import { getReaderBookContent } from "@/src/lib/readerBookContent";

export default async function ReaderRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await getReaderBookContent(id);

  if (!content) {
    notFound();
  }

  let isUnlocked = content.book.access === "free";

  if (!isUnlocked) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: libraryEntry } = await supabase
        .from("reader_library")
        .select("id, access_type, expires_at")
        .eq("user_id", user.id)
        .eq("book_id", content.book.id)
        .maybeSingle();

      if (libraryEntry) {
        isUnlocked = libraryEntry.expires_at
          ? new Date(libraryEntry.expires_at as string) > new Date()
          : true;
      }
    }
  }

  return <BookReader book={content.book} pages={content.pages} isUnlocked={isUnlocked} />;
}
