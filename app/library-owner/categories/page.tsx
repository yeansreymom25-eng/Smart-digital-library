import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import CategoriesManager from "@/components/admin/CategoriesManager";
import type { AdminCategory } from "@/src/lib/adminCategories";
function countKey(category: string, libraryType: string) {
  return `${libraryType}:${category.trim().toLowerCase()}`;
}

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: categoryRows }, { data: bookRows }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true }),
    supabase
      .from("books")
      .select("category, library_type")
      .eq("owner_id", user?.id ?? ""),
  ]);

  const bookCounts = new Map<string, number>();
  (bookRows ?? []).forEach((row) => {
    const category = typeof row.category === "string" ? row.category : "";
    const libraryType = row.library_type === "khmer" ? "khmer" : "english";
    if (!category.trim()) return;

    const key = countKey(category, libraryType);
    bookCounts.set(key, (bookCounts.get(key) ?? 0) + 1);
  });

  const categories: AdminCategory[] = (categoryRows ?? []).map((row) => {
    const name = row.name as string;
    const libraryType = row.library_type === "khmer" ? "khmer" : "english";

    return {
      id: row.id as string,
      name,
      description: (row.description as string) ?? "",
      books: bookCounts.get(countKey(name, libraryType)) ?? 0,
      libraryType,
    };
  });

  return <CategoriesManager initialCategories={categories} />;
}
