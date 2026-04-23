import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import UsersManager from "@/components/admin/UsersManager";
import type { AdminUser } from "@/src/lib/adminUsers";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  // Fetch profiles + cross-reference auth.users for email via service role
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false });

  // Get emails from auth.users (requires service role)
  const { data: authUsers } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });

  const emailMap = new Map(
    (authUsers?.users ?? []).map((u) => [u.id, u.email ?? ""])
  );

  const users: AdminUser[] = (profiles ?? []).map((row) => ({
    id: row.id as string,
    name: (row.full_name as string) ?? "",
    email: emailMap.get(row.id as string) ?? "",
    role: row.role === "admin" ? "Admin" : "User",
    joinedDate: row.created_at
      ? new Date(row.created_at as string).toLocaleDateString("en-US")
      : "",
    status: "Active",
  }));

  return <UsersManager initialUsers={users} />;
}