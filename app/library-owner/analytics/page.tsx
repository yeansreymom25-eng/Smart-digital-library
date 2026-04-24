import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import AnalyticsManager from "@/components/admin/AnalyticsManager";

export default async function AdminAnalyticsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const [
    { count: totalUsers },
    { count: totalBooks },
    { data: revenueRows },
    { count: rentals },
    { count: purchases },
    { data: categoryRows },
    { data: bookRows },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase.from("transactions").select("amount").eq("status", "Approved").neq("type", "Free"),
    supabase.from("transactions").select("*", { count: "exact", head: true }).eq("type", "Rent").eq("status", "Approved"),
    supabase.from("transactions").select("*", { count: "exact", head: true }).eq("type", "Purchase").eq("status", "Approved"),
    supabase.from("categories").select("name, books"),
    supabase.from("books").select("category"),
  ]);

  const totalRevenue = (revenueRows ?? []).reduce(
    (sum, row) => sum + (Number(row.amount) || 0), 0
  );

  // Count books per category
  const categoryCount: Record<string, number> = {};
  (bookRows ?? []).forEach((row) => {
    const cat = (row.category as string) ?? "Unknown";
    categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
  });

  const categorySegments = Object.entries(categoryCount).map(([label, value], i) => {
    const colors = ["#4d98f0", "#f8e78d", "#a8f0d6", "#d29af1", "#e6a41c", "#ffd2a8", "#57da5b"];
    return { label, value, color: colors[i % colors.length] };
  });

  return (
    <AnalyticsManager
      totalRevenue={totalRevenue}
      totalBooks={totalBooks ?? 0}
      totalUsers={totalUsers ?? 0}
      rentals={rentals ?? 0}
      purchases={purchases ?? 0}
      categorySegments={categorySegments}
    />
  );
}