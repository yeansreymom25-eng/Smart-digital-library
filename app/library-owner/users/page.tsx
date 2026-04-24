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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <UsersManager initialUsers={[]} />;
  }

  const { data: ownedBooks } = await supabase
    .from("books")
    .select("id")
    .eq("owner_id", user.id);

  const ownedBookIds = ((ownedBooks ?? []) as Array<Record<string, unknown>>).map(
    (book) => book.id as string
  );

  if (ownedBookIds.length === 0) {
    return <UsersManager initialUsers={[]} />;
  }

  const { data: ownerTransactions } = await supabase
    .from("transactions")
    .select("user_id")
    .in("book_id", ownedBookIds);

  const userIds = Array.from(
    new Set(((ownerTransactions ?? []) as Array<Record<string, unknown>>).map((row) => row.user_id as string).filter(Boolean))
  );

  if (userIds.length === 0) {
    return <UsersManager initialUsers={[]} />;
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .in("id", userIds)
    .order("created_at", { ascending: false });

  // Get emails from auth.users (requires service role)
  const { data: authUsers } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });

  const emailEntries: Array<[string, string]> = (authUsers?.users ?? []).map(
    (u) => [u.id, u.email ?? ""] as [string, string]
  );
  const emailMap = new Map<string, string>(
    emailEntries
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
