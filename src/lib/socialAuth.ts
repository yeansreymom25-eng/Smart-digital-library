"use client";

import {
  AUTH_ROUTES,
  storeSocialAuthIntent,
  type SocialAuthIntent,
} from "@/src/lib/authFlow";
import { getClientAppOrigin } from "@/src/lib/siteUrl";
import { getSupabaseBrowserSSR } from "@/src/lib/supabaseBrowserSSR";

export type SocialProvider = "google" | "facebook";

export async function signInWithSocialProvider(
  provider: SocialProvider,
  intent: SocialAuthIntent = "login"
) {
  const supabase = getSupabaseBrowserSSR();

  if (!supabase) {
    throw new Error(
      "Supabase keys are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  storeSocialAuthIntent(intent);
  const redirectTo = `${getClientAppOrigin()}${AUTH_ROUTES.oauthCallback}`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw error;
  }
}
