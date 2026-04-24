import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getDashboardStats() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  // Run all queries in parallel for speed
  const [
    { count: totalUsers },
    { count: totalBooks },
    { data: revenueRows },
    { count: pendingPayments },
    { count: activeRentals },
    { count: totalPurchases },
    { count: publishedBooks },
    { data: recentTxRows },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase
      .from("transactions")
      .select("amount")
      .eq("status", "Approved")
      .neq("type", "Free"),
    supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending"),
    supabase
      .from("reader_library")
      .select("*", { count: "exact", head: true })
      .eq("access_type", "rent")
      .gt("expires_at", new Date().toISOString()),
    supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("type", "Purchase")
      .eq("status", "Approved"),
    supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("status", "Published"),
    // Recent transactions with user + book names resolved separately
    supabase
      .from("transactions")
      .select("id, user_id, book_id, type, amount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  // Sum revenue
  const totalRevenue = (revenueRows ?? []).reduce(
    (sum, row) => sum + (Number(row.amount) || 0),
    0
  );

  // Resolve user + book names for recent transactions
  const recentTransactions = await Promise.all(
    (recentTxRows ?? []).map(async (row) => {
      const [{ data: profile }, { data: book }] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", row.user_id)
          .maybeSingle(),
        supabase
          .from("books")
          .select("title")
          .eq("id", row.book_id)
          .maybeSingle(),
      ]);

      return {
        id: row.id as string,
        user: (profile?.full_name as string) ?? "Unknown",
        book: (book?.title as string) ?? "Unknown",
        type: row.type as string,
        amount:
          typeof row.amount === "number"
            ? `$${Number(row.amount).toFixed(2)}`
            : row.amount === 0 || row.amount === "0"
            ? "Free"
            : String(row.amount ?? "-"),
        date: row.created_at
          ? new Date(row.created_at as string).toLocaleDateString("en-US")
          : "-",
        status: (row.status as string).toLowerCase(),
      };
    })
  );

  return {
    totalUsers: totalUsers ?? 0,
    totalBooks: totalBooks ?? 0,
    totalRevenue,
    pendingPayments: pendingPayments ?? 0,
    activeRentals: activeRentals ?? 0,
    totalPurchases: totalPurchases ?? 0,
    publishedBooks: publishedBooks ?? 0,
    recentTransactions,
  };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function StatIcon({
  kind,
}: {
  kind: "user" | "book" | "dollar" | "clock" | "external" | "money";
}) {
  const cls = "h-6 w-6";
  switch (kind) {
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19v14H7.5A2.5 2.5 0 0 0 5 20.5V6.5Z" />
          <path d="M5 6h12" />
        </svg>
      );
    case "dollar":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M13.5 3v2.1c2.1.3 3.7 1.6 4.1 3.6h-2.8c-.3-.8-1.1-1.3-2.3-1.3-1.4 0-2.3.6-2.3 1.5 0 .8.5 1.2 2.6 1.7 3.2.8 4.7 1.9 4.7 4.4 0 2.2-1.6 3.8-4 4.2V21h-2.2v-1.9c-2.7-.3-4.5-1.8-4.8-4.1h2.8c.3 1.1 1.2 1.7 2.7 1.7s2.5-.6 2.5-1.6c0-.9-.6-1.3-2.7-1.8-3-.7-4.6-1.8-4.6-4.2 0-2.1 1.5-3.6 3.9-4.1V3h2.4Z" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "external":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <path d="M14 5h5v5" />
          <path d="M10 14 19 5" />
          <path d="M19 13v5H5V5h5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
          <path d="M13.5 3v2.1c2.1.3 3.7 1.6 4.1 3.6h-2.8c-.3-.8-1.1-1.3-2.3-1.3-1.4 0-2.3.6-2.3 1.5 0 .8.5 1.2 2.6 1.7 3.2.8 4.7 1.9 4.7 4.4 0 2.2-1.6 3.8-4 4.2V21h-2.2v-1.9c-2.7-.3-4.5-1.8-4.8-4.1h2.8c.3 1.1 1.2 1.7 2.7 1.7s2.5-.6 2.5-1.6c0-.9-.6-1.3-2.7-1.8-3-.7-4.6-1.8-4.6-4.2 0-2.1 1.5-3.6 3.9-4.1V3h2.4Z" />
        </svg>
      );
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const topStats = [
    {
      title: "Total Users",
      value: String(stats.totalUsers),
      note: "Registered accounts",
      icon: "user" as const,
    },
    {
      title: "Total Books",
      value: String(stats.totalBooks),
      note: "In the library",
      icon: "book" as const,
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      note: "From approved transactions",
      icon: "dollar" as const,
    },
    {
      title: "Pending Payments",
      value: String(stats.pendingPayments),
      note: "Awaiting verification",
      icon: "clock" as const,
    },
  ];

  const overviewCards = [
    {
      title: "Active Rentals",
      value: String(stats.activeRentals),
      note: "Books currently rented",
      icon: "external" as const,
    },
    {
      title: "Total Purchases",
      value: String(stats.totalPurchases),
      note: "Books purchased",
      icon: "money" as const,
    },
    {
      title: "Published Books",
      value: String(stats.publishedBooks),
      note: "Currently available",
      icon: "book" as const,
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-[2rem] font-bold leading-none text-[#173b73] sm:text-[2.5rem]">
          Dashboard
        </h1>
        <p className="mt-2 text-base text-[#4d6691]">
          Overview of your library system
        </p>
      </div>

      {/* Top stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map((card) => (
          <article
            key={card.title}
            className="rounded-[10px] bg-[#4d98f0] px-4 py-4 text-white shadow-[0_10px_20px_rgba(77,152,240,0.14)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm leading-5 text-white/95">{card.title}</p>
                <p className="mt-3 text-[2.1rem] font-bold leading-none sm:text-3xl">
                  {card.value}
                </p>
                <p className="mt-4 text-xs text-white/80">{card.note}</p>
              </div>
              <div className="shrink-0 text-white/85">
                <StatIcon kind={card.icon} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Overview cards */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[10px] border border-[#cfcfcf] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(132,145,165,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="pr-3 text-base font-medium text-slate-950 sm:text-[1.05rem]">
                {card.title}
              </h2>
              <span
                className={`shrink-0 ${
                  card.title === "Total Purchases"
                    ? "text-[#19b03c]"
                    : "text-slate-500"
                }`}
              >
                <StatIcon kind={card.icon} />
              </span>
            </div>
            <p className="mt-8 text-[2.4rem] font-bold leading-none text-slate-950 sm:text-4xl">
              {card.value}
            </p>
            <p className="mt-8 text-sm text-slate-500">{card.note}</p>
          </article>
        ))}
      </div>

      {/* Recent transactions table */}
      <section className="rounded-[8px] border border-[#cfcfcf] bg-white shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <div className="border-b border-[#cfcfcf] px-4 py-4 sm:px-6">
          <h2 className="text-[1.4rem] font-bold text-slate-950">
            Recent Transactions
          </h2>
        </div>

        <div className="overflow-x-auto">
          {stats.recentTransactions.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-400">
              No transactions yet.
            </p>
          ) : (
            <table className="w-full min-w-[760px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-[1.05rem] text-[#2456b6]">
                  <th className="px-6 py-5 font-medium">User</th>
                  <th className="px-4 py-5 font-medium">Book</th>
                  <th className="px-4 py-5 font-medium">Type</th>
                  <th className="px-4 py-5 font-medium">Amount</th>
                  <th className="px-4 py-5 font-medium">Date</th>
                  <th className="px-4 py-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="text-[1.05rem] text-slate-900">
                    <td className="border-t border-[#cfcfcf] px-6 py-5">{tx.user}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-5">{tx.book}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-5">{tx.type}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-5">{tx.amount}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-5">{tx.date}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-5">
                      <span
                        className={`inline-flex min-w-[80px] justify-center rounded-[4px] px-3 py-1 text-xs font-medium capitalize text-white ${
                          tx.status === "approved"
                            ? "bg-[#2ec84d]"
                            : tx.status === "rejected"
                            ? "bg-red-500"
                            : "bg-[#e3a11b]"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </section>
  );
}