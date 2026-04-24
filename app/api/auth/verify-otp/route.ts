import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token } = body as { email: string; token: string };

    if (!email || !token) {
      return NextResponse.json(
        { error: "Missing email or token" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    const response = NextResponse.json({ success: true, role: "user" });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Fetch role from profiles table
    let role = "user";
    if (data.user?.id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      role = (profile?.role as string) ?? "user";
    }

    const finalResponse = NextResponse.json({ success: true, role });

    response.cookies.getAll().forEach(({ name, value, ...rest }) => {
      finalResponse.cookies.set(name, value, rest);
    });

    return finalResponse;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
