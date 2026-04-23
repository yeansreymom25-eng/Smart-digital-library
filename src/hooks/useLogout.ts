"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/src/lib/supabaseBrowser";

export function useLogout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function logout() {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // 1. Tell the server to clear the HttpOnly session cookies
      await fetch("/api/auth/logout", { method: "POST" });

      // 2. Also clear the browser-side Supabase memory
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.auth.signOut({ scope: "local" });
      }
    } catch {
      // Still redirect even if something fails
    } finally {
      setIsLoading(false);
      router.push("/Log_in");
      router.refresh();
    }
  }

  return { logout, isLoading };
}