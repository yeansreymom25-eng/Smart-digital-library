"use client";

import {
  AUTH_ROUTES,
  storeSocialAuthIntent,
  type SocialAuthIntent,
} from "@/src/lib/authFlow";
import { getClientAppOrigin } from "@/src/lib/siteUrl";
import { getSupabaseBrowserClient } from "@/src/lib/supabaseBrowser";

export type SocialProvider = "google" | "facebook";

export async function signInWithSocialProvider(
  provider: SocialProvider,
  intent: SocialAuthIntent = "login"
) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error(
      "Supabase keys are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const redirectTo =
    typeof window !== "undefined"
      ? (() => {
          storeSocialAuthIntent(intent);
          return `${getClientAppOrigin()}${AUTH_ROUTES.oauthCallback}`;
        })()
      : undefined;

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error) {
    throw error;
  }
}
