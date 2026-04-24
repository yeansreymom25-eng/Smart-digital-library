import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, role } = body as {
      email: string;
      password: string;
      fullName: string;
      role: string;
    };

    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    // Create user with password already set and email confirmed
    const { data: createData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // ← password is set properly now
        user_metadata: { full_name: fullName, role },
      });

    if (createError || !createData.user) {
      return NextResponse.json(
        { error: createError?.message ?? "Failed to create user" },
        { status: 400 }
      );
    }

    // Create profile row
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({ id: createData.user.id, full_name: fullName, role });

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    // Send OTP for verification
    const supabaseAnon = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    const { error: otpError } = await supabaseAnon.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (otpError) {
      return NextResponse.json({ error: otpError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
