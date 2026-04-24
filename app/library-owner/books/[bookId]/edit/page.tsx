import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { notFound } from "next/navigation";
import BookRecordForm from "@/components/admin/BookRecordForm";
import type { AdminBook } from "@/src/lib/adminBooks";
import type { AdminCategory } from "@/src/lib/adminCategories";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: bookRow }, { data: categoryRows }] = await Promise.all([
    supabase
      .from("books")
      .select("*")
      .eq("id", bookId)
      .eq("owner_id", user?.id ?? "")
      .maybeSingle(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!bookRow) {
    notFound();
  }

  const initialBook: AdminBook | null = bookRow
    ? {
        id: bookRow.id as string,
        title: bookRow.title as string,
        author: bookRow.author as string,
        category: bookRow.category as string,
        libraryType: bookRow.library_type === "khmer" ? "khmer" : "english",
        type: bookRow.type as string,
        status: bookRow.status as AdminBook["status"],
        price: bookRow.price as string,
        pdfName: (bookRow.pdf_url as string) ?? "",
        coverName: (bookRow.cover_url as string) ?? "",
        coverImageSrc: (bookRow.cover_url as string) ?? "",
        paymentQrName: (bookRow.payment_qr_url as string) ?? "",
        paymentQrImageSrc: (bookRow.payment_qr_url as string) ?? "",
      }
    : null;

  const categories: AdminCategory[] = (categoryRows ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    books: typeof row.books === "number" ? row.books : 0,
    libraryType: row.library_type === "khmer" ? "khmer" : "english",
  }));

  return (
    <section className="min-h-[calc(100vh-1.5rem)]">
      <BookRecordForm
        mode="edit"
        bookId={bookId}
        initialBook={initialBook}
        initialCategories={categories}
      />
    </section>
  );
}
