"use client";

import { storeSocialAuthIntent, type SocialAuthIntent } from "@/src/lib/authFlow";

export type SocialProvider = "google" | "apple";

export async function signInWithSocialProvider(
  provider: SocialProvider,
  intent: SocialAuthIntent = "login"
) {
  if (typeof window === "undefined") {
    return;
  }

  storeSocialAuthIntent(intent);

  const url = new URL("/auth/social", window.location.origin);
  url.searchParams.set("provider", provider);
  url.searchParams.set("intent", intent);
  window.location.assign(url.toString());
}
