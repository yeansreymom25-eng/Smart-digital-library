import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import AdminProfileSettings from "@/components/admin/AdminProfileSettings";

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id ?? "")
    .single();

  return (
    <AdminProfileSettings
      userId={user?.id ?? ""}
      fullName={(profile?.full_name as string) ?? ""}
      email={user?.email ?? ""}
      role={(profile?.role as string) ?? "admin"}
      avatarUrl={(profile?.avatar_url as string) ?? ""}
    />
  );
}
