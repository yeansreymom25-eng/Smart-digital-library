import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
import {
  getEffectiveAdminSubscriptionStatus,
  getUsableAdminPlan,
} from "@/src/lib/adminSubscription";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  let plan = "No Plan";
  let ownerName = "Library Owner";
  let ownerAvatarUrl = "";

  if (user) {
    const [{ data: subscription }, { data: profile }] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("plan, status, submitted_at, updated_at")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle(),
    ]);

    const effectiveStatus = getEffectiveAdminSubscriptionStatus(
      subscription
        ? {
            status: subscription.status as "active" | "pending" | "rejected" | "not_selected" | "expired",
            submittedAt: (subscription.submitted_at as string) ?? null,
            updatedAt: (subscription.updated_at as string) ?? null,
          }
        : null
    );

    const usablePlan = getUsableAdminPlan(
      subscription
        ? {
            plan: subscription.plan as "Normal" | "Pro" | "Premium" | null,
            status: effectiveStatus,
          }
        : null
    );
    if (usablePlan) plan = `${usablePlan} Plan`;
    if (profile?.full_name) ownerName = profile.full_name as string;
    if (profile?.avatar_url) ownerAvatarUrl = profile.avatar_url as string;
  }

  return (
    <AdminLayoutShell plan={plan} ownerName={ownerName} ownerAvatarUrl={ownerAvatarUrl}>
      {children}
    </AdminLayoutShell>
  );
}
