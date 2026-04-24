import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import ReaderAccountShell from "@/components/main/account/ReaderAccountShell";
import ProfileSection from "@/components/main/account/ProfileSection";
import type { ReaderProfileData } from "@/src/lib/readerAccountStorage";
import { defaultProfile } from "@/src/lib/readerAccountStorage";

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Fetch profile from Supabase
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, role, phone, gender, date_of_birth, country, bio")
    .eq("id", user.id)
    .maybeSingle();

  const profile: ReaderProfileData = {
    ...defaultProfile,
    fullName: (profileRow?.full_name as string) ?? user.user_metadata?.full_name ?? defaultProfile.fullName,
    email: user.email ?? defaultProfile.email,
    avatarDataUrl: (profileRow?.avatar_url as string) ?? undefined,
    phone: (profileRow?.phone as string) ?? defaultProfile.phone,
    gender: (profileRow?.gender as string) ?? defaultProfile.gender,
    dateOfBirth: (profileRow?.date_of_birth as string) ?? defaultProfile.dateOfBirth,
    country: (profileRow?.country as string) ?? defaultProfile.country,
    bio: (profileRow?.bio as string) ?? defaultProfile.bio,
  };

  return (
    <ReaderAccountShell
      activeSection="profile"
      eyebrow="Account"
      title="Profile"
    >
      <ProfileSection initialProfile={profile} userId={user.id} />
    </ReaderAccountShell>
  );
}