import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

function sanitizeSearchTerm(value: string) {
  return value.trim().replace(/[,%]/g, " ");
}

export async function GET(request: NextRequest) {
  const query = sanitizeSearchTerm(request.nextUrl.searchParams.get("q") ?? "");

  if (query.length < 2) {
    return NextResponse.json({ books: [], categories: [] });
  }

  const supabase = getClient();
  const pattern = `%${query}%`;

  const [booksResponse, categoriesResponse] = await Promise.all([
    supabase
      .from("books")
      .select("id, title, author, cover_url, category")
      .eq("status", "Published")
      .or(
        `title.ilike.${pattern},author.ilike.${pattern},category.ilike.${pattern}`
      )
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("categories")
      .select("id, name, description, library_type")
      .or(`name.ilike.${pattern},description.ilike.${pattern}`)
      .order("name", { ascending: true })
      .limit(6),
  ]);

  if (booksResponse.error) {
    return NextResponse.json({ error: booksResponse.error.message }, { status: 500 });
  }

  if (categoriesResponse.error) {
    return NextResponse.json({ error: categoriesResponse.error.message }, { status: 500 });
  }

  const books = (booksResponse.data ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.title ?? ""),
    author: String(row.author ?? ""),
    imageSrc: String(row.cover_url ?? ""),
    category: String(row.category ?? ""),
    description: "",
  }));

  const categories = (categoriesResponse.data ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.name ?? ""),
    description: String(row.description ?? ""),
    libraryType: String(row.library_type ?? "english"),
  }));

  return NextResponse.json({ books, categories });
}
