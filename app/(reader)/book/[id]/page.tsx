import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import ReaderBookDetailPage from "@/components/main/ReaderBookDetailPage";
import type { ReaderBookDetail } from "@/src/lib/readerBookDetails";

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

  // Try to find by UUID first, then fall back to title slug
  let bookRow: Record<string, unknown> | null = null;

  // Check if it looks like a UUID
  const isUuid = /^[0-9a-f-]{36}$/.test(id);

  if (isUuid) {
    const { data } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .eq("status", "Published")
      .maybeSingle();
    bookRow = data as Record<string, unknown> | null;
  } else {
    // Fall back to slug search
    const titleSearch = id.replace(/-/g, " ");
    const { data } = await supabase
      .from("books")
      .select("*")
      .ilike("title", titleSearch)
      .eq("status", "Published")
      .maybeSingle();
    bookRow = data as Record<string, unknown> | null;
  }

  if (!bookRow) notFound();

  let access: "free" | "buy" | "buy-rent" = "free";
  const type = (bookRow.type as string) ?? "";
  if (type === "Buy/Rent") access = "buy-rent";
  else if (type === "Buy") access = "buy";

  const rawPrice = bookRow.price;
  const priceNum = typeof rawPrice === "number"
    ? rawPrice
    : parseFloat(String(rawPrice ?? "0").replace(/[^0-9.]/g, ""));

  const book: ReaderBookDetail = {
    id: bookRow.id as string,
    slug: (bookRow.title as string).toLowerCase().replace(/\s+/g, "-"),
    title: bookRow.title as string,
    author: bookRow.author as string,
    imageSrc: (bookRow.cover_url as string) ?? "",
    description: (bookRow.description as string) ?? "",
    access,
    originalPrice: isNaN(priceNum) || priceNum === 0 ? undefined : priceNum,
  };

  const { data: { user } } = await supabase.auth.getUser();

  return <ReaderBookDetailPage book={book} userId={user?.id} />;
}