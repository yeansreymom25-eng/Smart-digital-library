import ExploreBookstorePage from "@/components/main/ExploreBookstorePage";
import { createServerClient } from "@supabase/ssr";

export default async function HomePage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("status", "Published")
    .order("created_at", { ascending: false });

  const dbBooks = (data ?? []).map((row) => {
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
      category: (row.category as string) ?? "General",
    };
  });

  return <ExploreBookstorePage dbBooks={dbBooks} />;
}