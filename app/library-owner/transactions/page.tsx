import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import TransactionsManager from "@/components/admin/TransactionsManager";
import type { AdminTransaction } from "@/src/lib/adminTransactions";

export default async function AdminTransactionsPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  // Fetch transactions without join first
  const { data: rows } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  // Then fetch user and book details separately
  const transactions: AdminTransaction[] = await Promise.all(
    (rows ?? []).map(async (row) => {
      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", row.user_id)
        .maybeSingle();

      // Get book title
      const { data: book } = await supabase
        .from("books")
        .select("title")
        .eq("id", row.book_id)
        .maybeSingle();

      const rawAmount = row.amount;
      const amount = typeof rawAmount === "number"
        ? `$${Number(rawAmount).toFixed(2)}`
        : String(rawAmount ?? "$0.00");

      return {
        id: row.id as string,
        user: profile?.full_name ?? "Unknown User",
        book: book?.title ?? "Unknown Book",
        userId: (row.user_id as string) ?? "",
        bookId: (row.book_id as string) ?? "",
        type: (row.type as AdminTransaction["type"]) ?? "Purchase",
        amount,
        date: row.created_at
          ? new Date(row.created_at as string).toLocaleDateString("en-US")
          : "",
        status: (row.status as AdminTransaction["status"]) ?? "Pending",
        proofReference: (row.proof_url as string) ?? "",
      };
    })
  );

  return <TransactionsManager initialTransactions={transactions} />;
}