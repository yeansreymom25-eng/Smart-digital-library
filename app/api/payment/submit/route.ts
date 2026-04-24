import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // Get the logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json() as {
      bookId: string;
      action: "free" | "buy" | "rent";
      amount: number;
      proofUrl?: string;
      paymentMethod?: "aba" | "bakong";
    };

    const { bookId, action, amount, proofUrl, paymentMethod } = body;

    if (!bookId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // For free books → immediately add to reader_library
    if (action === "free") {
      // Check not already in library
      const { data: existing } = await supabase
        .from("reader_library")
        .select("id")
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .maybeSingle();

      if (!existing) {
        const { error: libraryError } = await supabase
          .from("reader_library")
          .insert({
            user_id: user.id,
            book_id: bookId,
            access_type: "free",
            acquired_at: new Date().toISOString(),
            expires_at: null,
          });

        if (libraryError) throw new Error(libraryError.message);
      }

      // Also record a transaction for history
      await supabase.from("transactions").insert({
        user_id: user.id,
        book_id: bookId,
        type: "Free",
        amount: 0,
        status: "Approved",
        proof_url: null,
      });

      return NextResponse.json({ success: true, status: "approved" });
    }

    // For buy/rent → save transaction as pending, wait for admin approval
    if (!proofUrl) {
      return NextResponse.json({ error: "Payment proof is required" }, { status: 400 });
    }

    const typeMap = { buy: "Purchase", rent: "Rent" } as const;

    const { error: txError } = await supabase.from("transactions").insert({
      user_id: user.id,
      book_id: bookId,
      type: typeMap[action],
      amount: amount,
      status: "Pending",
      proof_url: proofUrl,
    });

    if (txError) throw new Error(txError.message);

    return NextResponse.json({
      success: true,
      status: "pending",
      message: "Payment submitted! Your access will be unlocked once the admin verifies your payment.",
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}