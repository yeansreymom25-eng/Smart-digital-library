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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json() as {
      fullName?: string;
      avatarDataUrl?: string;
      phone?: string;
      gender?: string;
      dateOfBirth?: string;
      country?: string;
      bio?: string;
    };

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: body.fullName,
        avatar_url: body.avatarDataUrl ?? null,
        phone: body.phone ?? null,
        gender: body.gender ?? null,
        date_of_birth: body.dateOfBirth ?? null,
        country: body.country ?? null,
        bio: body.bio ?? null,
      })
      .eq("id", user.id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}