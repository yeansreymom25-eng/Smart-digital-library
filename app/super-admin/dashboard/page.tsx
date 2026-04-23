import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import SuperAdminDashboard from "@/components/super-admin/SuperAdminDashboard";

export default async function SuperAdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  // Get all subscriptions
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .order("submitted_at", { ascending: false });

  // Get all admin profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("role", "admin");

  // Get emails from auth
  const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const emailMap = new Map((authUsers?.users ?? []).map((u) => [u.id, u.email ?? ""]));

  const libraryOwners = (profiles ?? []).map((profile) => {
    const sub = (subscriptions ?? []).find((s) => s.user_id === profile.id);
    return {
      id: profile.id as string,
      name: (profile.full_name as string) ?? "Unknown",
      email: emailMap.get(profile.id as string) ?? "",
      plan: (sub?.plan as string) ?? null,
      status: (sub?.status as string) ?? "not_selected",
      proofUrl: (sub?.proof_url as string) ?? "",
      submittedAt: sub?.submitted_at
        ? new Date(sub.submitted_at as string).toLocaleDateString("en-US")
        : "-",
    };
  });

  return <SuperAdminDashboard libraryOwners={libraryOwners} />;
}