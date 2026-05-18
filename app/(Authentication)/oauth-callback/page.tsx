"use client";

import { useEffect } from "react";
import { AUTH_ROUTES } from "@/src/lib/authFlow";

export default function LegacyOAuthCallbackPage() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.location.replace(`${AUTH_ROUTES.oauthCallback}${window.location.search}${window.location.hash}`);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="rounded-3xl border border-zinc-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-base font-medium text-zinc-700">Redirecting your sign-in...</p>
      </div>
    </div>
  );
}
