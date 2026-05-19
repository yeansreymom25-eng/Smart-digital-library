import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { AdminPlanName, AdminPlanStatus } from "@/src/lib/adminSubscription";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const body = await request.json() as {
      userId: string;
      plan: string;
      status: string;
      proofFileName?: string;
      paymentReference?: string;
      paymentNote?: string;
    };
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== body.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = body.plan === "Normal" || body.plan === "Pro" || body.plan === "Premium"
      ? (body.plan as AdminPlanName)
      : null;
    const status = body.status === "active" || body.status === "pending"
      ? (body.status as AdminPlanStatus)
      : null;

    if (!plan || !status) {
      return NextResponse.json({ error: "Invalid subscription request." }, { status: 400 });
    }

    if (plan === "Normal" && status !== "active") {
      return NextResponse.json({ error: "Normal plan must be activated directly." }, { status: 400 });
    }

    if (plan !== "Normal" && status !== "pending") {
      return NextResponse.json({ error: "Paid plan changes must be submitted for review." }, { status: 400 });
    }

    const now = new Date().toISOString();

    const { error } = await supabase.from("subscriptions").upsert(
      {
        user_id: user.id,
        plan,
        status,
        proof_url: body.proofFileName ?? "",
        payment_reference: body.paymentReference ?? "",
        submitted_at: now,
        updated_at: now,
      },
      { onConflict: "user_id" }
    );

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
