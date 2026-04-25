import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import ExploreCategoryCollectionPage from "@/components/main/ExploreCategoryCollectionPage";
import { readExploreCategory, type ExploreOption } from "@/src/lib/exploreCategoryCollections";
import type { ReaderBookDetail } from "@/src/lib/readerBookDetails";

export default async function ExploreCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ option?: string }>;
}) {
  const { categoryId } = await params;
  const { option } = await searchParams;
  const selectedOption: ExploreOption = option === "khmer" ? "khmer" : "english";
  const category = await readExploreCategory(selectedOption, categoryId);

  if (!category) notFound();

  // Fetch real books from Supabase matching this category name
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("status", "Published")
    .eq("category", category.englishTitle)
    .order("created_at", { ascending: false });

  const dbBooks: ReaderBookDetail[] = (data ?? []).map((row) => {
    let access: "free" | "buy" | "buy-rent" = "free";
    const type = (row.type as string) ?? "";
    if (type === "Buy/Rent") access = "buy-rent";
    else if (type === "Buy") access = "buy";

    const rawPrice = row.price;
    const priceNum = typeof rawPrice === "number"
      ? rawPrice
      : parseFloat(String(rawPrice ?? "0").replace(/[^0-9.]/g, ""));

    return {
      id: row.id as string,
      slug: (row.title as string).toLowerCase().replace(/\s+/g, "-"),
      title: row.title as string,
      author: row.author as string,
      imageSrc: (row.cover_url as string) ?? "",
      description: (row.description as string) ?? "",
      access,
      originalPrice: isNaN(priceNum) || priceNum === 0 ? undefined : priceNum,
    };
  });

  return (
    <ExploreCategoryCollectionPage
      category={category}
      option={selectedOption}
      dbBooks={dbBooks}
    />
  );
}
