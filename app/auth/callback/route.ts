import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

import { AUTH_ROUTES, type SocialAuthIntent } from "@/src/lib/authFlow";
import { getSupabaseAdminClient } from "@/src/lib/supabaseAdmin";
import { getRequestAppOrigin } from "@/src/lib/siteUrl";

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

function getRoleDestination(role: string | null | undefined, intent: SocialAuthIntent | null) {
  if (role === "super_admin") {
    return "/super-admin/dashboard";
  }

  if (role === "admin") {
    return intent === "signup" ? "/library-owner/subscription" : "/library-owner/dashboard";
  }

  return AUTH_ROUTES.dashboard;
}

function getIntent(value: string | null): SocialAuthIntent | null {
  return value === "signup" || value === "login" ? value : null;
}

function getRequestedRole(value: string | null) {
  return value === "admin" ? "admin" : "user";
}

function getDisplayName(user: User) {
  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null;

  return metadataName?.trim() || user.email?.split("@")[0] || "Smart Library User";
}

async function ensureSocialProfile(
  user: User,
  intent: SocialAuthIntent | null,
  requestedRole: "user" | "admin"
) {
  const admin = getSupabaseAdminClient();

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const existingRole =
    existingProfile?.role === "admin" || existingProfile?.role === "super_admin"
      ? existingProfile.role
      : existingProfile?.role === "user"
        ? "user"
        : null;

  const role = existingRole ?? (intent === "signup" && isFreshOAuthSignup(user) ? requestedRole : "user");
  const fullName = getDisplayName(user);

  if (!existingProfile) {
    await admin.from("profiles").insert({
      id: user.id,
      full_name: fullName,
      role,
    });
  }

  const currentMetadataRole =
    typeof user.user_metadata?.role === "string" ? user.user_metadata.role : null;

  if (currentMetadataRole !== role) {
    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        full_name: fullName,
        role,
      },
    });
  }

  return role;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = getRequestAppOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const providerError =
    requestUrl.searchParams.get("error_description") ?? requestUrl.searchParams.get("error");
  const intent = getIntent(requestUrl.searchParams.get("intent"));
  const requestedRole = getRequestedRole(requestUrl.searchParams.get("role"));

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

  const role = data.session?.user
    ? await ensureSocialProfile(data.session.user, intent, requestedRole)
    : "user";
  const destination = getRoleDestination(role, intent);
  const response = NextResponse.redirect(new URL(destination, origin));

  authCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
