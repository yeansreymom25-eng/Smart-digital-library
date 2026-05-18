import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

import { AUTH_ROUTES, type SocialAuthIntent } from "@/src/lib/authFlow";
import { getRequestAppOrigin } from "@/src/lib/siteUrl";

function hasEmailPasswordIdentity(user: User | null | undefined) {
  const providers = new Set<string>();

  user?.identities?.forEach((identity) => {
    if (identity.provider) {
      providers.add(identity.provider);
    }
  });

  user?.app_metadata?.providers?.forEach((provider) => {
    if (typeof provider === "string") {
      providers.add(provider);
    }
  });

  return providers.has("email");
}

function isFreshOAuthSignup(user: User | null | undefined) {
  if (!user?.created_at || !user?.last_sign_in_at) {
    return false;
  }

  const createdAt = Date.parse(user.created_at);
  const lastSignInAt = Date.parse(user.last_sign_in_at);

  if (Number.isNaN(createdAt) || Number.isNaN(lastSignInAt)) {
    return false;
  }

  return Math.abs(lastSignInAt - createdAt) <= 60_000;
}

function resolvePostOAuthRoute(
  intent: SocialAuthIntent | null,
  user: User | null | undefined
) {
  const needsPasswordSetup =
    intent === "signup" && (isFreshOAuthSignup(user) || !hasEmailPasswordIdentity(user));

  if (needsPasswordSetup) {
    return `${AUTH_ROUTES.updatePassword}?mode=social-signup`;
  }

  return AUTH_ROUTES.dashboard;
}

function getIntent(value: string | null): SocialAuthIntent | null {
  return value === "signup" || value === "login" ? value : null;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = getRequestAppOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const providerError =
    requestUrl.searchParams.get("error_description") ?? requestUrl.searchParams.get("error");
  const intent = getIntent(requestUrl.searchParams.get("intent"));

  if (providerError || !code) {
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

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.login, origin));
  }

  const destination = resolvePostOAuthRoute(intent, data.session?.user);
  const response = NextResponse.redirect(new URL(destination, origin));

  authCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
