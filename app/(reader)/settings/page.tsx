import ReaderAccountShell from "@/components/main/account/ReaderAccountShell";
import SettingsSection from "@/components/main/account/SettingsSection";

export default function SettingsPage() {
  return (
    <ReaderAccountShell
      activeSection="settings"
      eyebrow="Account"
      title="Setting"
    >
      <SettingsSection />
    </ReaderAccountShell>
  );
}
