"use client";

import {
  AUTH_ROUTES,
  storeSocialAuthIntent,
  type SocialAuthIntent,
} from "@/src/lib/authFlow";
import { getClientAppOrigin } from "@/src/lib/siteUrl";
import { getSupabaseBrowserSSR } from "@/src/lib/supabaseBrowserSSR";

export type SocialProvider = "google" | "apple";

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

  const redirectTo =
    typeof window !== "undefined"
      ? (() => {
          storeSocialAuthIntent(intent);
          const url = new URL(`${getClientAppOrigin()}${AUTH_ROUTES.oauthCallback}`);
          url.searchParams.set("intent", intent);
          return url.toString();
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
