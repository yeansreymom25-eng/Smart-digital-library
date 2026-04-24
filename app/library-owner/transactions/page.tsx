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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <TransactionsManager initialTransactions={[]} />;
  }

  const { data: ownedBooks } = await supabase
    .from("books")
    .select("id, title")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const ownerBookRows = (ownedBooks ?? []) as Array<Record<string, unknown>>;
  const ownedBookIds = ownerBookRows.map((book) => book.id as string);

  if (ownedBookIds.length === 0) {
    return <TransactionsManager initialTransactions={[]} />;
  }

  const bookTitleMap = new Map<string, string>(
    ownerBookRows.map((book) => [book.id as string, (book.title as string) ?? "Unknown Book"])
  );

  const { data: rows } = await supabase
    .from("transactions")
    .select("*")
    .in("book_id", ownedBookIds)
    .order("created_at", { ascending: false });

  const userIds = Array.from(
    new Set(((rows ?? []) as Array<Record<string, unknown>>).map((row) => row.user_id as string).filter(Boolean))
  );
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", userIds)
    : { data: [] };

  const profileMap = new Map<string, string>(
    ((profiles ?? []) as Array<Record<string, unknown>>).map((profile) => [
      profile.id as string,
      (profile.full_name as string) ?? "Unknown User",
    ])
  );

  // Then fetch user and book details separately
  const transactions: AdminTransaction[] = await Promise.all(
    (rows ?? []).map(async (row) => {
      const rawAmount = row.amount;
      const amount = typeof rawAmount === "number"
        ? `$${Number(rawAmount).toFixed(2)}`
        : String(rawAmount ?? "$0.00");

      return {
        id: row.id as string,
        user: profileMap.get((row.user_id as string) ?? "") ?? "Unknown User",
        book: bookTitleMap.get((row.book_id as string) ?? "") ?? "Unknown Book",
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
