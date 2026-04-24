import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import AnalyticsManager from "@/components/admin/AnalyticsManager";

type ActivityRange = "Weekly" | "Monthly" | "Yearly";

function emptyActivitySeries() {
  return {
    Weekly: { labels: [], values: [] },
    Monthly: { labels: [], values: [] },
    Yearly: { labels: [], values: [] },
  } satisfies Record<ActivityRange, { labels: string[]; values: number[] }>;
}

function buildActivitySeries(transactions: Array<Record<string, unknown>>) {
  const now = new Date();

  const weeklyLabels = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });
  const weeklyValues = Array.from({ length: 7 }, () => 0);

  const monthlyLabels = Array.from({ length: 4 }, (_, index) => `Week ${index + 1}`);
  const monthlyValues = Array.from({ length: 4 }, () => 0);

  const yearlyLabels = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), index, 1);
    return date.toLocaleDateString("en-US", { month: "short" });
  });
  const yearlyValues = Array.from({ length: 12 }, () => 0);

  transactions.forEach((row) => {
    const createdAt = row.created_at ? new Date(row.created_at as string) : null;
    if (!createdAt || Number.isNaN(createdAt.getTime())) return;

    const diffInDays = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays >= 0 && diffInDays < 7) {
      weeklyValues[6 - diffInDays] += 1;
    }

    if (diffInDays >= 0 && diffInDays < 28) {
      const weekIndex = 3 - Math.floor(diffInDays / 7);
      if (weekIndex >= 0 && weekIndex < 4) {
        monthlyValues[weekIndex] += 1;
      }
    }

    if (createdAt.getFullYear() === now.getFullYear()) {
      yearlyValues[createdAt.getMonth()] += 1;
    }
  });

  return {
    Weekly: { labels: weeklyLabels, values: weeklyValues },
    Monthly: { labels: monthlyLabels, values: monthlyValues },
    Yearly: { labels: yearlyLabels, values: yearlyValues },
  } satisfies Record<ActivityRange, { labels: string[]; values: number[] }>;
}

export default async function AdminAnalyticsPage() {
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
      <AnalyticsManager
        totalRevenue={0}
        totalBooks={0}
        totalUsers={0}
        rentals={0}
        purchases={0}
        categorySegments={[]}
        activitySeries={emptyActivitySeries()}
      />
    );
  }

  const { data: ownedBooks } = await supabase
    .from("books")
    .select("id, category")
    .eq("owner_id", user.id);

  const ownerBookRows = (ownedBooks ?? []) as Array<Record<string, unknown>>;
  const ownedBookIds = ownerBookRows.map((book) => book.id as string);

  if (ownedBookIds.length === 0) {
    return (
      <AnalyticsManager
        totalRevenue={0}
        totalBooks={0}
        totalUsers={0}
        rentals={0}
        purchases={0}
        categorySegments={[]}
        activitySeries={emptyActivitySeries()}
      />
    );
  }

  const { data: transactionRows } = await supabase
    .from("transactions")
    .select("user_id, type, amount, status, book_id, created_at")
    .in("book_id", ownedBookIds);

  const ownerTransactions = (transactionRows ?? []) as Array<Record<string, unknown>>;
  const activitySeries = buildActivitySeries(ownerTransactions);
  const totalRevenue = ownerTransactions.reduce((sum, row) => {
    if (row.status !== "Approved" || row.type === "Free") return sum;
    return sum + (Number(row.amount) || 0);
  }, 0);

  const totalUsers = new Set(
    ownerTransactions.map((row) => row.user_id as string).filter(Boolean)
  ).size;
  const rentals = ownerTransactions.filter(
    (row) => row.type === "Rent" && row.status === "Approved"
  ).length;
  const purchases = ownerTransactions.filter(
    (row) => row.type === "Purchase" && row.status === "Approved"
  ).length;

  const categoryCount: Record<string, number> = {};
  ownerBookRows.forEach((row) => {
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
      totalBooks={ownerBookRows.length}
      totalUsers={totalUsers}
      rentals={rentals}
      purchases={purchases}
      categorySegments={categorySegments}
      activitySeries={activitySeries}
    />
  );
}
