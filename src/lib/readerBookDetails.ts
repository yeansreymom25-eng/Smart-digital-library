import { createServerClient } from "@supabase/ssr";

export type ReaderBookAccess = "free" | "buy" | "buy-rent";

export type ReaderBookDetail = {
  id: string;
  slug: string; // URL slug e.g. "atomic-habits"
  title: string;
  author: string;
  imageSrc: string;
  description: string;
  access: ReaderBookAccess;
  originalPrice?: number;
  currentPrice?: number;
};

function getClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

function rowToBookDetail(row: Record<string, unknown>, slug = ""): ReaderBookDetail {
  let access: ReaderBookAccess = "free";
  const type = (row.type as string) ?? "";
  if (type === "Buy/Rent") access = "buy-rent";
  else if (type === "Buy") access = "buy";
  else access = "free";

  // price can be a number (18) or a string ("$18.00") depending on the DB column type
  const rawPrice = row.price;
  const priceNum = typeof rawPrice === "number"
    ? rawPrice
    : parseFloat(String(rawPrice ?? "0").replace(/[^0-9.]/g, ""));
  const originalPrice = isNaN(priceNum) || priceNum === 0 ? undefined : priceNum;

  return {
    id: row.id as string,
    slug,
    title: row.title as string,
    author: row.author as string,
    imageSrc: (row.cover_url as string) ?? "",
    description: (row.description as string) ?? "",
    access,
    originalPrice,
  };
}

/**
 * Converts a URL slug like "atomic-habits" to a search string "atomic habits"
 * then does a case-insensitive ilike search against the title column.
 */
export async function getReaderBookDetail(slug: string): Promise<ReaderBookDetail | undefined> {
  const supabase = getClient();

  // Convert slug to title-like string: "atomic-habits" → "atomic habits"
  const titleSearch = slug.replace(/-/g, " ");

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .ilike("title", titleSearch)
    .eq("status", "Published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return undefined;
  return rowToBookDetail(data as Record<string, unknown>, slug);
}

export async function fetchReaderBookDetails(): Promise<ReaderBookDetail[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("status", "Published")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => rowToBookDetail(row as Record<string, unknown>));
}

export function getReaderBookCurrentPrice(book: ReaderBookDetail) {
  return book.currentPrice ?? book.originalPrice ?? 0;
}

export function isReaderBookDiscounted(book: ReaderBookDetail) {
  return (
    typeof book.originalPrice === "number" &&
    typeof book.currentPrice === "number" &&
    book.currentPrice < book.originalPrice
  );
}

export function getReaderBookDiscountRate(book: ReaderBookDetail) {
  if (book.access === "free") {
    return 100;
  }

  if (!isReaderBookDiscounted(book) || !book.originalPrice) {
    return 0;
  }

  return Math.round(
    ((book.originalPrice - getReaderBookCurrentPrice(book)) / book.originalPrice) * 100
  );
}