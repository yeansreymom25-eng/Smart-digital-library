import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import BooksManager from "@/components/admin/BooksManager";
import type { AdminBook } from "@/src/lib/adminBooks";

export default async function AdminBooksPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Only fetch books that belong to this admin
  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("owner_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const books: AdminBook[] = (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    author: row.author as string,
    category: row.category as string,
    libraryType: row.library_type === "khmer" ? "khmer" : ("english" as const),
    type: row.type as string,
    status: row.status as AdminBook["status"],
    price: row.price as string,
    pdfName: (row.pdf_url as string) ?? "",
    coverName: (row.cover_url as string) ?? "",
    coverImageSrc: (row.cover_url as string) ?? "",
    paymentQrName: (row.payment_qr_url as string) ?? "",
    paymentQrImageSrc: (row.payment_qr_url as string) ?? "",
  }));

  return <BooksManager initialBooks={books} />;
}