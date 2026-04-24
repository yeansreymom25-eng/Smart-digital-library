"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  AUTH_ROUTES,
  clearSocialAuthIntent,
  readSocialAuthIntent,
} from "@/src/lib/authFlow";
import { toFriendlyAuthMessage } from "@/src/lib/authMessages";
import { getSupabaseBrowserSSR } from "@/src/lib/supabaseBrowserSSR";

function getTokensFromHash() {
  if (typeof window === "undefined") {
    return null;
  }

  const hash = window.location.hash;
  if (!hash || !hash.includes("access_token")) {
    return null;
  }

  const params = new URLSearchParams(hash.replace("#", ""));
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  if (!access_token || !refresh_token) {
    return null;
  }

  return { access_token, refresh_token };
}

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

function resolvePostOAuthRoute(_user: User | null | undefined) {
  // Always redirect OAuth users to home — no password setup needed
  return AUTH_ROUTES.dashboard;
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    let active = true;

    const client = getSupabaseBrowserSSR();
    if (!client) {
      router.replace(AUTH_ROUTES.login);
      return;
    }

    function redirectToLogin(nextMessage: string) {
      clearSocialAuthIntent();
      setMessage(nextMessage);

      window.setTimeout(() => {
        if (!active) {
          return;
        }

        router.replace(AUTH_ROUTES.login);
      }, 500);
    }

    async function completeSignIn(user: User | null | undefined) {
      if (!user) {
        router.replace(AUTH_ROUTES.login);
        return;
      }

      const supabaseClient = getSupabaseBrowserSSR();
      if (!supabaseClient) {
        router.replace(AUTH_ROUTES.dashboard);
        return;
      }

      // Always upsert profile for OAuth users to ensure it exists
      const fullName = (user.user_metadata?.full_name as string)
        ?? (user.user_metadata?.name as string)
        ?? "";
      const avatarUrl = (user.user_metadata?.avatar_url as string)
        ?? (user.user_metadata?.picture as string)
        ?? "";

      await supabaseClient.from("profiles").upsert({
        id: user.id,
        full_name: fullName || undefined,
        avatar_url: avatarUrl || undefined,
        role: "user",
      }, { onConflict: "id", ignoreDuplicates: true });

      // Now fetch role
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = profile?.role as string | undefined;
      clearSocialAuthIntent();

      if (role === "admin" || role === "super_admin") {
        router.replace("/library-owner/dashboard");
      } else {
        router.replace(AUTH_ROUTES.dashboard);
      }
    }

    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      if (!active || !session) {
        return;
      }

      void completeSignIn(session.user);
    });

    async function finishOAuth() {
      const url = new URL(window.location.href);
      const providerError =
        url.searchParams.get("error_description") ?? url.searchParams.get("error");
      const code = url.searchParams.get("code");
      const tokens = getTokensFromHash();

      if (providerError) {
        redirectToLogin(toFriendlyAuthMessage(providerError));
        return;
      }

      if (code) {
        setMessage("Confirming your Google sign-in...");

        const exchange = await client.auth.exchangeCodeForSession(code);
        if (!active) {
          return;
        }

        if (exchange.error) {
          redirectToLogin(toFriendlyAuthMessage(exchange.error.message));
          return;
        }

        const user = exchange.data.session?.user;
        void completeSignIn(user);
        return;
      }

      if (tokens) {
        setMessage("Restoring your session...");

        const sessionResult = await client.auth.setSession(tokens);
        if (!active) {
          return;
        }

        if (sessionResult.error) {
          redirectToLogin(toFriendlyAuthMessage(sessionResult.error.message));
          return;
        }

        void completeSignIn(sessionResult.data.user ?? sessionResult.data.session?.user);
        return;
      }

      const { data, error } = await client.auth.getSession();
      if (!active) {
        return;
      }

      if (error) {
        redirectToLogin(toFriendlyAuthMessage(error.message));
        return;
      }

      if (data.session) {
        void completeSignIn(data.session.user);
        return;
      }

      setMessage("Waiting for sign-in to finish...");

      window.setTimeout(async () => {
        const retry = await client.auth.getSession();
        if (!active) {
          return;
        }

        if (retry.data.session) {
          void completeSignIn(retry.data.session.user);
          return;
        }

        if (retry.error) {
          redirectToLogin(toFriendlyAuthMessage(retry.error.message));
          return;
        }

        redirectToLogin("Google sign-in did not complete. Redirecting to login...");
      }, 1200);
    }

    void finishOAuth();

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="rounded-3xl border border-zinc-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-base font-medium text-zinc-700">{message}</p>
      </div>
    </div>
  );
}
