import { createServerClient } from "@supabase/ssr";

export type AdminTransaction = {
  id: string;
  user: string;
  book: string;
  userId: string;
  bookId: string;
  type: "Rent" | "Purchase" | "Subscription";
  amount: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
  proofReference: string;
};

function getClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

function rowToTransaction(row: Record<string, unknown>): AdminTransaction {
  return {
    id: row.id as string,
    user: (row.user_id as string) ?? "",
    book: (row.book_id as string) ?? "",
    userId: (row.user_id as string) ?? "",
    bookId: (row.book_id as string) ?? "",
    type: row.type as AdminTransaction["type"],
    amount: (row.amount as string) ?? "$0.00",
    date: row.created_at
      ? new Date(row.created_at as string).toLocaleDateString("en-US")
      : "",
    status: row.status as AdminTransaction["status"],
    proofReference: (row.proof_url as string) ?? "",
  };
}

export async function readAdminTransactions(): Promise<AdminTransaction[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => rowToTransaction(row as Record<string, unknown>));
}

export async function updateAdminTransactionStatus(
  transactionId: string,
  status: AdminTransaction["status"]
): Promise<AdminTransaction[]> {
  const supabase = getClient();
  const { error } = await supabase
    .from("transactions")
    .update({ status })
    .eq("id", transactionId);

  if (error) throw new Error(error.message);
  return readAdminTransactions();
}

export async function createAdminTransaction(transaction: Omit<AdminTransaction, "id">): Promise<AdminTransaction[]> {
  const supabase = getClient();
  const { error } = await supabase.from("transactions").insert({
    user_id: transaction.userId || transaction.user,
    book_id: transaction.bookId || transaction.book,
    type: transaction.type,
    amount: transaction.amount,
    status: transaction.status,
    proof_url: transaction.proofReference,
  });

  if (error) throw new Error(error.message);
  return readAdminTransactions();
}
