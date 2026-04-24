import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import CategoriesManager from "@/components/admin/CategoriesManager";
import type { AdminCategory } from "@/src/lib/adminCategories";
import { getCategoryStats } from "@/src/lib/adminCategories";

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  const categories: AdminCategory[] = (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    books: typeof row.books === "number" ? row.books : 0,
    libraryType: row.library_type === "khmer" ? "khmer" : "english",
  }));

  return <CategoriesManager initialCategories={categories} />;
}