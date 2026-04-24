"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserSSR } from "@/src/lib/supabaseBrowserSSR";

export type ReaderUser = {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  initials: string;
};

function toInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function useReaderUser() {
  const [user, setUser] = useState<ReaderUser>({
    fullName: "",
    email: "",
    avatarUrl: null,
    initials: "",
  });

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserSSR();
      if (!supabase) return;

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const email = authUser.email ?? "";

      // Quick fallback from metadata
      let fullName =
        (authUser.user_metadata?.full_name as string) ||
        (authUser.user_metadata?.name as string) ||
        email.split("@")[0] ||
        "User";

      let avatarUrl: string | null = null;

      // Fetch from profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profile?.full_name) fullName = profile.full_name as string;
      if (profile?.avatar_url) avatarUrl = profile.avatar_url as string;

      setUser({ fullName, email, avatarUrl, initials: toInitials(fullName) });
    }

    void load();

    // Re-load when auth state changes (e.g. after profile update)
    const supabase = getSupabaseBrowserSSR();
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      void load();
    });

    return () => subscription.unsubscribe();
  }, []);

  return user;
}
