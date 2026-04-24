import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  let plan = "No Plan";

  if (user) {
    const { data } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (data?.plan) plan = `${data.plan as string} Plan`;
  }

  return <AdminLayoutShell plan={plan}>{children}</AdminLayoutShell>;
}