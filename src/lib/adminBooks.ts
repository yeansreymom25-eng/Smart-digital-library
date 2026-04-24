import { createServerClient } from "@supabase/ssr";
import type { CategoryLibraryType } from "@/src/lib/adminCategories";

export type AdminBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  libraryType: CategoryLibraryType;
  type: string;
  status: "Published" | "Hidden" | "Draft";
  price: string;
  pdfName: string;
  coverName: string;
  coverImageSrc: string;
  paymentQrName: string;
  paymentQrImageSrc: string;
};

function getClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

function rowToBook(row: Record<string, unknown>): AdminBook {
  return {
    id: row.id as string,
    title: row.title as string,
    author: row.author as string,
    category: row.category as string,
    libraryType: (row.library_type === "khmer" ? "khmer" : "english") as CategoryLibraryType,
    type: row.type as string,
    status: row.status as AdminBook["status"],
    price: row.price as string,
    pdfName: (row.pdf_url as string) ?? "",
    coverName: (row.cover_url as string) ?? "",
    coverImageSrc: (row.cover_url as string) ?? "",
    paymentQrName: (row.payment_qr_url as string) ?? "",
    paymentQrImageSrc: (row.payment_qr_url as string) ?? "",
  };
}

export async function readAdminBooks(): Promise<AdminBook[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => rowToBook(row as Record<string, unknown>));
}

export async function createAdminBook(book: Omit<AdminBook, "id">): Promise<AdminBook[]> {
  const supabase = getClient();
  const { error } = await supabase.from("books").insert({
    title: book.title,
    author: book.author,
    category: book.category,
    library_type: book.libraryType,
    type: book.type,
    status: book.status,
    price: book.price,
    pdf_url: book.pdfName,
    cover_url: book.coverImageSrc || book.coverName,
    payment_qr_url: book.paymentQrImageSrc || book.paymentQrName,
  });

  if (error) throw new Error(error.message);
  return readAdminBooks();
}

export async function updateAdminBook(bookId: string, updates: Omit<AdminBook, "id">): Promise<AdminBook[]> {
  const supabase = getClient();
  const { error } = await supabase
    .from("books")
    .update({
      title: updates.title,
      author: updates.author,
      category: updates.category,
      library_type: updates.libraryType,
      type: updates.type,
      status: updates.status,
      price: updates.price,
      pdf_url: updates.pdfName,
      cover_url: updates.coverImageSrc || updates.coverName,
      payment_qr_url: updates.paymentQrImageSrc || updates.paymentQrName,
    })
    .eq("id", bookId);

  if (error) throw new Error(error.message);
  return readAdminBooks();
}

export async function removeAdminBook(bookId: string): Promise<AdminBook[]> {
  const supabase = getClient();
  const { error } = await supabase.from("books").delete().eq("id", bookId);

  if (error) throw new Error(error.message);
  return readAdminBooks();
}
