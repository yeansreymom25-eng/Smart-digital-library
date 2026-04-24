import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import ReportsManager from "@/components/admin/ReportsManager";

export default async function AdminReportsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <ReportsManager
        totalRevenue={0}
        totalUsers={0}
        totalBooks={0}
        totalTransactions={0}
        approvedTransactions={0}
        pendingTransactions={0}
        publishedBooks={0}
        rentals={0}
        purchases={0}
      />
    );
  }

  const { data: ownedBooks } = await supabase
    .from("books")
    .select("id, status")
    .eq("owner_id", user.id);

  const ownerBookRows = (ownedBooks ?? []) as Array<Record<string, unknown>>;
  const ownedBookIds = ownerBookRows.map((book) => book.id as string);

  if (ownedBookIds.length === 0) {
    return (
      <ReportsManager
        totalRevenue={0}
        totalUsers={0}
        totalBooks={0}
        totalTransactions={0}
        approvedTransactions={0}
        pendingTransactions={0}
        publishedBooks={0}
        rentals={0}
        purchases={0}
      />
    );
  }

  const { data: transactionRows } = await supabase
    .from("transactions")
    .select("user_id, type, amount, status, book_id")
    .in("book_id", ownedBookIds);

  const ownerTransactions = (transactionRows ?? []) as Array<Record<string, unknown>>;
  const totalUsers = new Set(
    ownerTransactions.map((row) => row.user_id as string).filter(Boolean)
  ).size;
  const totalTransactions = ownerTransactions.length;
  const approvedTransactions = ownerTransactions.filter((row) => row.status === "Approved").length;
  const pendingTransactions = ownerTransactions.filter((row) => row.status === "Pending").length;
  const rentals = ownerTransactions.filter(
    (row) => row.type === "Rent" && row.status === "Approved"
  ).length;
  const purchases = ownerTransactions.filter(
    (row) => row.type === "Purchase" && row.status === "Approved"
  ).length;
  const totalRevenue = ownerTransactions.reduce((sum, row) => {
    if (row.status !== "Approved") return sum;
    return sum + (Number(row.amount) || 0);
  }, 0);
  const publishedBooks = ownerBookRows.filter((book) => book.status === "Published").length;

  return (
    <ReportsManager
      totalRevenue={totalRevenue}
      totalUsers={totalUsers}
      totalBooks={ownerBookRows.length}
      totalTransactions={totalTransactions}
      approvedTransactions={approvedTransactions}
      pendingTransactions={pendingTransactions}
      publishedBooks={publishedBooks}
      rentals={rentals}
      purchases={purchases}
    />
  );
}
