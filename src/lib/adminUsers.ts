import { createServerClient } from "@supabase/ssr";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "User" | "Admin";
  joinedDate: string;
  status: "Active" | "Inactive";
};

function getClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

function rowToUser(row: Record<string, unknown>): AdminUser {
  return {
    id: row.id as string,
    name: (row.full_name as string) ?? "",
    email: (row.email as string) ?? "",
    role: row.role === "Admin" ? "Admin" : "User",
    joinedDate: row.created_at
      ? new Date(row.created_at as string).toLocaleDateString("en-US")
      : "",
    status: "Active",
  };
}

export async function readAdminUsers(): Promise<AdminUser[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => rowToUser(row as Record<string, unknown>));
}
