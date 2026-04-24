import { createServerClient } from "@supabase/ssr";

export type CategoryLibraryType = "english" | "khmer";

export type AdminCategory = {
  id: string;
  name: string;
  description: string;
  books: number;
  libraryType: CategoryLibraryType;
};

type CategoryStat = {
  id: string;
  name: string;
  books: number;
  percent: number;
  tone: string;
  libraryType: CategoryLibraryType;
};

const statTones = ["#4f9df6", "#ff6b5f", "#75bf43", "#3750db", "#d5ad56"];

function getClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

function rowToCategory(row: Record<string, unknown>): AdminCategory {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    books: typeof row.books === "number" ? row.books : 0,
    libraryType: (row.library_type === "khmer" ? "khmer" : "english") as CategoryLibraryType,
  };
}

export async function readAdminCategories(): Promise<AdminCategory[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => rowToCategory(row as Record<string, unknown>));
}

export async function createAdminCategory(category: Omit<AdminCategory, "id">): Promise<AdminCategory[]> {
  const supabase = getClient();
  const { error } = await supabase.from("categories").insert({
    name: category.name,
    description: category.description,
    books: category.books,
    library_type: category.libraryType,
  });

  if (error) throw new Error(error.message);
  return readAdminCategories();
}

export async function updateAdminCategory(categoryId: string, updates: Omit<AdminCategory, "id">): Promise<AdminCategory[]> {
  const supabase = getClient();
  const { error } = await supabase
    .from("categories")
    .update({
      name: updates.name,
      description: updates.description,
      books: updates.books,
      library_type: updates.libraryType,
    })
    .eq("id", categoryId);

  if (error) throw new Error(error.message);
  return readAdminCategories();
}

export async function removeAdminCategory(categoryId: string): Promise<AdminCategory[]> {
  const supabase = getClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);

  if (error) throw new Error(error.message);
  return readAdminCategories();
}

export function getCategoryStats(categories: AdminCategory[]): CategoryStat[] {
  const totalBooks = categories.reduce((sum, item) => sum + item.books, 0);

  return categories.map((category, index) => ({
    id: category.id,
    name: category.name,
    books: category.books,
    percent: totalBooks > 0 ? Math.round((category.books / totalBooks) * 100) : 0,
    tone: category.books === 0 ? "#d9dfe9" : statTones[index % statTones.length],
    libraryType: category.libraryType,
  }));
}
