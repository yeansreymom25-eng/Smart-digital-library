import { createServerClient } from "@supabase/ssr";

export type ReaderBookAccess = "free" | "buy" | "buy-rent";

export type ReaderBookDetail = {
  id: string;
  slug: string;
  title: string;
  author: string;
  imageSrc: string;
  description: string;
  access: ReaderBookAccess;
  pdfUrl?: string;
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

function normalizeBookIdentifier(value: string) {
  return value
    .normalize("NFKD")
    .trim()
    .toLowerCase()
    .replace(/['".,!?():;[\]{}]/g, "")
    .replace(/\s+/g, "-");
}

function rowToBookDetail(row: Record<string, unknown>, slug = ""): ReaderBookDetail {
  let access: ReaderBookAccess = "free";
  const type = (row.type as string) ?? "";
  if (type === "Buy/Rent") access = "buy-rent";
  else if (type === "Buy") access = "buy";

  const rawPrice = row.price;
  const priceNum =
    typeof rawPrice === "number"
      ? rawPrice
      : parseFloat(String(rawPrice ?? "0").replace(/[^0-9.]/g, ""));
  const originalPrice = Number.isNaN(priceNum) || priceNum === 0 ? undefined : priceNum;

  return {
    id: row.id as string,
    slug,
    title: row.title as string,
    author: row.author as string,
    imageSrc: (row.cover_url as string) ?? "",
    description: (row.description as string) ?? "",
    access,
    pdfUrl: (row.pdf_url as string) ?? undefined,
    originalPrice,
  };
}

async function findPublishedBookRowByIdentifier(identifier: string) {
  const supabase = getClient();
  const decodedIdentifier = decodeURIComponent(identifier).trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    decodedIdentifier
  );

  if (isUuid) {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", decodedIdentifier)
      .eq("status", "Published")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (data) return data as Record<string, unknown>;
  }

  const titleCandidate = decodedIdentifier.replace(/-/g, " ");

  const { data: exactTitleMatch, error: exactTitleError } = await supabase
    .from("books")
    .select("*")
    .eq("status", "Published")
    .or(`title.eq.${decodedIdentifier},title.eq.${titleCandidate}`)
    .maybeSingle();

  if (exactTitleError && exactTitleError.code !== "PGRST116") {
    throw new Error(exactTitleError.message);
  }
  if (exactTitleMatch) {
    return exactTitleMatch as Record<string, unknown>;
  }

  const { data: publishedBooks, error: publishedError } = await supabase
    .from("books")
    .select("*")
    .eq("status", "Published");

  if (publishedError) throw new Error(publishedError.message);

  const normalizedIdentifier = normalizeBookIdentifier(decodedIdentifier);
  const normalizedMatch = (publishedBooks ?? []).find((row) => {
    const title = String((row as Record<string, unknown>).title ?? "");
    return normalizeBookIdentifier(title) === normalizedIdentifier;
  });

  return normalizedMatch as Record<string, unknown> | undefined;
}

export async function getReaderBookDetail(identifier: string): Promise<ReaderBookDetail | undefined> {
  const row = await findPublishedBookRowByIdentifier(identifier);
  if (!row) return undefined;

  return rowToBookDetail(row, normalizeBookIdentifier(String(row.title ?? identifier)));
}

export async function fetchReaderBookDetails(): Promise<ReaderBookDetail[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("status", "Published")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const record = row as Record<string, unknown>;
    return rowToBookDetail(record, normalizeBookIdentifier(String(record.title ?? "")));
  });
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
