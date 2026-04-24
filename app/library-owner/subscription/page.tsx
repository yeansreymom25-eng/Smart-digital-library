import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import AdminSubscriptionClient from "@/components/admin/AdminSubscriptionClient";
import type { AdminSubscription } from "@/src/lib/adminSubscription";
import { DEFAULT_ADMIN_SUBSCRIPTION } from "@/src/lib/adminSubscription";

export default async function AdminSubscriptionPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  let subscription: AdminSubscription = DEFAULT_ADMIN_SUBSCRIPTION;

  if (user) {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      const plan =
        data.plan === "Normal" || data.plan === "Pro" || data.plan === "Premium"
          ? data.plan
          : null;
      const status =
        data.status === "active" || data.status === "pending" || data.status === "rejected"
          ? data.status
          : "not_selected";

      subscription = {
        plan,
        status,
        proofFileName: (data.proof_url as string) ?? "",
        paymentReference: (data.payment_reference as string) ?? "",
        paymentNote: "",
        submittedAt: (data.submitted_at as string) ?? null,
        updatedAt: (data.updated_at as string) ?? null,
      };
    }
  }

  return (
    <AdminSubscriptionClient
      userId={user?.id ?? ""}
      initialSubscription={subscription}
    />
  );
}