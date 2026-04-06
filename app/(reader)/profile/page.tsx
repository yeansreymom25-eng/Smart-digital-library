import ReaderAccountShell from "@/components/main/account/ReaderAccountShell";
import ProfileSection from "@/components/main/account/ProfileSection";

export default function ProfilePage() {
  return (
    <ReaderAccountShell
      activeSection="profile"
      eyebrow="Account"
      title="Profile"
    >
      <ProfileSection />
    </ReaderAccountShell>
  );
}
