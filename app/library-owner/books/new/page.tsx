import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import BookRecordForm from "@/components/admin/BookRecordForm";
import type { AdminCategory } from "@/src/lib/adminCategories";
import Link from "next/link";

function getPlanLimit(plan: string | null): number {
  if (plan === "Premium") return Infinity;
  if (plan === "Pro") return 50;
  if (plan === "Normal") return 20;
  return 0;
}

export default async function NewBookPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Get subscription
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user?.id ?? "")
    .eq("status", "active")
    .maybeSingle();

  const plan = (sub?.plan as string) ?? null;
  const limit = getPlanLimit(plan);

  // Count only THIS admin's books
  const { count: bookCount } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user?.id ?? "");

  const currentCount = bookCount ?? 0;
  const isLimitReached = currentCount >= limit;
  const hasNoPlan = !plan;

  const { data } = await supabase.from("categories").select("*").order("name");

  const categories: AdminCategory[] = (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    books: typeof row.books === "number" ? row.books : 0,
    libraryType: row.library_type === "khmer" ? "khmer" : "english",
  }));

  if (hasNoPlan || isLimitReached) {
    return (
      <section className="flex min-h-[calc(100vh-1.5rem)] flex-col items-center justify-center rounded-[18px] border border-[#d8e6fb] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)] text-center">
        <div className="text-6xl">{hasNoPlan ? "🔒" : "📚"}</div>
        <h1 className="mt-6 text-3xl font-bold text-[#173b73]">
          {hasNoPlan ? "No Active Plan" : "Book Limit Reached"}
        </h1>
        <p className="mt-3 max-w-md text-base text-[#4d6691]">
          {hasNoPlan
            ? "You need an active subscription plan to add books."
            : `You have reached the ${plan} plan limit of ${limit} books. Upgrade to add more.`}
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/library-owner/subscription"
            className="rounded-xl bg-[#4d98f0] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3789ea]">
            {hasNoPlan ? "Choose a Plan" : "Upgrade Plan"}
          </Link>
          <Link href="/library-owner/books"
            className="rounded-xl border border-[#c8dcff] bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Back to Books
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Your books: {currentCount} / {limit === Infinity ? "Unlimited" : limit}
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-1.5rem)]">
      <div className="mb-4 rounded-[10px] border border-[#c8dcff] bg-[#eef5ff] px-4 py-3">
        <p className="text-sm text-[#2456b6]">
          📚 <span className="font-semibold">{plan} Plan</span> — {currentCount} / {limit === Infinity ? "Unlimited" : limit} books used
        </p>
      </div>
      <BookRecordForm mode="create" initialCategories={categories} />
    </section>
  );
}