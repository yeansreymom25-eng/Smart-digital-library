import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getPlanLimit(plan: string | null): number {
  if (plan === "Premium") return Infinity;
  if (plan === "Pro") return 50;
  if (plan === "Normal") return 20;
  return 0;
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check subscription
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    const plan = (sub?.plan as string) ?? null;
    const limit = getPlanLimit(plan);

    if (limit === 0) {
      return NextResponse.json({ error: "You need an active plan to add books." }, { status: 403 });
    }

    // Count only THIS admin's books
    const { count: bookCount } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", user.id);

    if ((bookCount ?? 0) >= limit) {
      return NextResponse.json(
        { error: `You have reached the ${plan} plan limit of ${limit} books. Please upgrade your plan.` },
        { status: 403 }
      );
    }

    const body = await request.json() as {
      title: string;
      author: string;
      category: string;
      libraryType: string;
      type: string;
      status: string;
      price: string;
      pdfName: string;
      coverImageSrc: string;
      paymentQrImageSrc: string;
    };

    // Insert with owner_id
    const { error } = await supabase.from("books").insert({
      title: body.title,
      author: body.author,
      category: body.category,
      library_type: body.libraryType,
      type: body.type,
      status: body.status,
      price: body.price,
      pdf_url: body.pdfName,
      cover_url: body.coverImageSrc,
      payment_qr_url: body.paymentQrImageSrc,
      owner_id: user.id,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}