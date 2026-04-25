import { createServerClient } from "@supabase/ssr";

export type AdminPlanName = "Normal" | "Pro" | "Premium";
export type AdminPlanStatus =
  | "not_selected"
  | "active"
  | "pending"
  | "rejected";

export type AdminSubscription = {
  plan: AdminPlanName | null;
  status: AdminPlanStatus;
  proofFileName: string;
  paymentReference: string;
  paymentNote: string;
  submittedAt: string | null;
  updatedAt: string | null;
};

export const DEFAULT_ADMIN_SUBSCRIPTION: AdminSubscription = {
  plan: null,
  status: "not_selected",
  proofFileName: "",
  paymentReference: "",
  paymentNote: "",
  submittedAt: null,
  updatedAt: null,
};

function getClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

function rowToSubscription(row: Record<string, unknown> | null): AdminSubscription {
  if (!row) return DEFAULT_ADMIN_SUBSCRIPTION;

  const plan =
    row.plan === "Normal" || row.plan === "Pro" || row.plan === "Premium"
      ? (row.plan as AdminPlanName)
      : null;

  const status =
    row.status === "active" ||
    row.status === "pending" ||
    row.status === "rejected"
      ? (row.status as AdminPlanStatus)
      : "not_selected";

  return {
    plan,
    status,
    proofFileName: (row.proof_url as string) ?? "",
    paymentReference: (row.payment_reference as string) ?? "",
    paymentNote: "",
    submittedAt: (row.submitted_at as string) ?? null,
    updatedAt: (row.updated_at as string) ?? null,
  };
}

export function getPlanBookLimit(plan: AdminPlanName | null) {
  if (plan === "Premium") return Number.POSITIVE_INFINITY;
  if (plan === "Pro") return 50;
  if (plan === "Normal") return 20;
  return 0;
}

export function getUsableAdminPlan(subscription: Pick<AdminSubscription, "plan" | "status"> | null) {
  if (!subscription?.plan) return null;
  if (subscription.status === "active") return subscription.plan;
  return "Normal";
}

export function formatPlanLimit(limit: number) {
  return Number.isFinite(limit) ? String(limit) : "Unlimited";
}

export async function readAdminSubscription(userId: string): Promise<AdminSubscription> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return rowToSubscription(data as Record<string, unknown> | null);
}

export async function writeAdminSubscription(userId: string, subscription: AdminSubscription): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan: subscription.plan,
      status: subscription.status,
      proof_url: subscription.proofFileName,
      payment_reference: subscription.paymentReference,
      submitted_at: subscription.submittedAt,
      updated_at: subscription.updatedAt ?? new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) throw new Error(error.message);
}

export async function activateAdminPlan(userId: string, plan: AdminPlanName): Promise<AdminSubscription> {
  const nextValue: AdminSubscription = {
    plan,
    status: "active",
    proofFileName: "",
    paymentReference: "",
    paymentNote: "",
    submittedAt: null,
    updatedAt: new Date().toISOString(),
  };

  await writeAdminSubscription(userId, nextValue);
  return nextValue;
}

export async function submitAdminPlanForReview(
  userId: string,
  input: {
    plan: Exclude<AdminPlanName, "Normal">;
    proofFileName: string;
    paymentReference: string;
    paymentNote: string;
  }
): Promise<AdminSubscription> {
  const now = new Date().toISOString();
  const nextValue: AdminSubscription = {
    plan: input.plan,
    status: "pending",
    proofFileName: input.proofFileName,
    paymentReference: input.paymentReference,
    paymentNote: input.paymentNote,
    submittedAt: now,
    updatedAt: now,
  };

  await writeAdminSubscription(userId, nextValue);
  return nextValue;
}

export async function updateAdminPlanReviewStatus(
  userId: string,
  status: "active" | "rejected"
): Promise<AdminSubscription> {
  const current = await readAdminSubscription(userId);
  const nextValue: AdminSubscription = {
    ...current,
    status,
    updatedAt: new Date().toISOString(),
  };

  await writeAdminSubscription(userId, nextValue);
  return nextValue;
}
