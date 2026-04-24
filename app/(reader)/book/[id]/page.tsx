import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import ReaderBookDetailPage from "@/components/main/ReaderBookDetailPage";
import { getReaderBookDetail } from "@/src/lib/readerBookDetails";

export default async function BookDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const book = await getReaderBookDetail(id);
  if (!book) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  return <ReaderBookDetailPage book={book} userId={user?.id} />;
}
