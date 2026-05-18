import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import type { SocialAuthIntent } from "@/src/lib/authFlow";
import { AUTH_ROUTES } from "@/src/lib/authFlow";
import { getRequestAppOrigin } from "@/src/lib/siteUrl";
import type { SocialProvider } from "@/src/lib/socialAuth";

function getProvider(value: string | null): SocialProvider | null {
  return value === "google" || value === "apple" ? value : null;
}

function getIntent(value: string | null): SocialAuthIntent {
  return value === "signup" ? "signup" : "login";
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = getRequestAppOrigin(request);
  const provider = getProvider(requestUrl.searchParams.get("provider"));
  const intent = getIntent(requestUrl.searchParams.get("intent"));

  if (!provider) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.login, origin));
  }

  const authCookies: { name: string; value: string; options: CookieOptions }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          authCookies.push(...cookiesToSet);
        },
      },
    }
  );

  const callbackUrl = new URL(`${origin}${AUTH_ROUTES.oauthCallback}`);
  callbackUrl.searchParams.set("intent", intent);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.login, origin));
  }

  const response = NextResponse.redirect(data.url);

  authCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
