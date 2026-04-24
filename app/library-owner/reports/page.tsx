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

  const [
    { count: totalUsers },
    { count: totalBooks },
    { count: totalTransactions },
    { count: approvedTransactions },
    { count: pendingTransactions },
    { count: publishedBooks },
    { data: revenueRows },
    { count: rentals },
    { count: purchases },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase.from("transactions").select("*", { count: "exact", head: true }),
    supabase.from("transactions").select("*", { count: "exact", head: true }).eq("status", "Approved"),
    supabase.from("transactions").select("*", { count: "exact", head: true }).eq("status", "Pending"),
    supabase.from("books").select("*", { count: "exact", head: true }).eq("status", "Published"),
    supabase.from("transactions").select("amount").eq("status", "Approved"),
    supabase.from("transactions").select("*", { count: "exact", head: true }).eq("type", "Rent").eq("status", "Approved"),
    supabase.from("transactions").select("*", { count: "exact", head: true }).eq("type", "Purchase").eq("status", "Approved"),
  ]);

  const totalRevenue = (revenueRows ?? []).reduce(
    (sum, row) => sum + (Number(row.amount) || 0), 0
  );

  return (
    <ReportsManager
      totalRevenue={totalRevenue}
      totalUsers={totalUsers ?? 0}
      totalBooks={totalBooks ?? 0}
      totalTransactions={totalTransactions ?? 0}
      approvedTransactions={approvedTransactions ?? 0}
      pendingTransactions={pendingTransactions ?? 0}
      publishedBooks={publishedBooks ?? 0}
      rentals={rentals ?? 0}
      purchases={purchases ?? 0}
    />
  );
}