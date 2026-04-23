import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

    const now = new Date().toISOString();

    const { error } = await supabase.from("subscriptions").upsert(
      {
        user_id: body.userId,
        plan: body.plan,
        status: body.status,
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