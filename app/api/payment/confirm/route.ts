import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Use service role for admin operations
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

    // Verify the caller is an admin
    const anonSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: { user }, error: userError } = await anonSupabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json() as {
      transactionId: string;
      action: "approve" | "reject";
    };

    const { transactionId, action } = body;

    if (!transactionId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newStatus = action === "approve" ? "Approved" : "Rejected";

    // Update transaction status
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .update({ status: newStatus })
      .eq("id", transactionId)
      .select("user_id, book_id, type, amount")
      .single();

    if (txError || !transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // If approved → add to reader_library
    if (action === "approve") {
      const isRent = transaction.type === "Rent";

      // Check not already in library
      const { data: existing } = await supabase
        .from("reader_library")
        .select("id")
        .eq("user_id", transaction.user_id)
        .eq("book_id", transaction.book_id)
        .maybeSingle();

      if (!existing) {
        const now = new Date();
        const expiresAt = isRent
          ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
          : null;

        const { error: libraryError } = await supabase
          .from("reader_library")
          .insert({
            user_id: transaction.user_id,
            book_id: transaction.book_id,
            access_type: isRent ? "rent" : "buy",
            acquired_at: now.toISOString(),
            expires_at: expiresAt,
          });

        if (libraryError) throw new Error(libraryError.message);
      }
    }

    return NextResponse.json({ success: true, status: newStatus });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}