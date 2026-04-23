import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import ReaderAccountShell from "@/components/main/account/ReaderAccountShell";
import TransactionsSection from "@/components/main/account/TransactionsSection";
import type { ReaderTransactionRecord } from "@/src/lib/readerAccountStorage";

export default async function TransactionsPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Fetch transactions with book details
  const { data: rows } = await supabase
    .from("transactions")
    .select("*, books(title, cover_url)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const transactions: ReaderTransactionRecord[] = (rows ?? []).map((row) => {
    const book = row.books as unknown as {
      title: string;
      cover_url: string;
    } | null;

    const type = (row.type as string) ?? "";
    const action: ReaderTransactionRecord["action"] =
      type === "Rent" ? "rent" : type === "Purchase" ? "buy" : "free";

    const rawAmount = row.amount;
    const amountPaid = typeof rawAmount === "number"
      ? rawAmount
      : parseFloat(String(rawAmount ?? "0").replace(/[^0-9.]/g, "")) || 0;

    const status = row.status as string;
    const txStatus: ReaderTransactionRecord["status"] =
      status === "Approved" ? "Verified" : status === "Rejected" ? "Rejected" : "Pending";

    return {
      id: row.id as string,
      bookId: (row.book_id as string) ?? "",
      bookTitle: book?.title ?? "Unknown Book",
      bookCover: book?.cover_url ?? "",
      amountPaid,
      action,
      purchasedAt: (row.created_at as string) ?? new Date().toISOString(),
      status: txStatus,
      reference: (row.id as string) ?? "",
      method: amountPaid === 0 ? "Free Access" : "ABA QR",
      proofImageUrl: (row.proof_url as string) ?? undefined,
    };
  });

  return (
    <ReaderAccountShell
      activeSection="transactions"
      eyebrow="Account"
      title="Transaction"
    >
      <TransactionsSection initialTransactions={transactions} />
    </ReaderAccountShell>
  );
}