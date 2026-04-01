import AdminPageIntro from "@/components/admin/AdminPageIntro";
import AdminPlaceholderCard from "@/components/admin/AdminPlaceholderCard";

export default function AdminProfilePage() {
  return (
    <>
      <AdminPageIntro
        eyebrow="Profile"
        title="Admin profile"
        description="Reserved for library owner account details, profile editing, password changes, and logout actions."
      />
      <AdminPlaceholderCard
        title="Planned profile tools"
        items={[
          "Profile details card",
          "Edit profile form",
          "Change password form",
          "Account actions",
        ]}
      />
    </>
  );
}
