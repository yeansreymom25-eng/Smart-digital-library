import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import SuperAdminDashboard from "@/components/super-admin/SuperAdminDashboard";
import {
  getAdminSubscriptionExpiresAt,
  getEffectiveAdminSubscriptionStatus,
  type AdminPlanStatus,
} from "@/src/lib/adminSubscription";

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
  const emailEntries: Array<[string, string]> = (authUsers?.users ?? []).map(
    (u) => [u.id, u.email ?? ""] as [string, string]
  );
  const emailMap = new Map<string, string>(emailEntries);

  const libraryOwners = (profiles ?? []).map((profile) => {
    const sub = (subscriptions ?? []).find((s) => s.user_id === profile.id);
    const status = getEffectiveAdminSubscriptionStatus(
      sub
        ? {
            status: sub.status as AdminPlanStatus,
            submittedAt: (sub.submitted_at as string) ?? null,
            updatedAt: (sub.updated_at as string) ?? null,
          }
        : null
    );
    const expiresAt = getAdminSubscriptionExpiresAt(
      sub
        ? {
            status,
            submittedAt: (sub.submitted_at as string) ?? null,
            updatedAt: (sub.updated_at as string) ?? null,
          }
        : null
    );
    return {
      id: profile.id as string,
      name: (profile.full_name as string) ?? "Unknown",
      email: emailMap.get(profile.id as string) ?? "",
      plan: (sub?.plan as string) ?? null,
      status,
      proofUrl: (sub?.proof_url as string) ?? "",
      submittedAt: sub?.submitted_at
        ? new Date(sub.submitted_at as string).toLocaleDateString("en-US")
        : "-",
      expiresAt: expiresAt ? new Date(expiresAt).toLocaleDateString("en-US") : "-",
    };
  });

  return <SuperAdminDashboard libraryOwners={libraryOwners} />;
}
