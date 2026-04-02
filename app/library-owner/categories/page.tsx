import AdminPageIntro from "@/components/admin/AdminPageIntro";
import AdminPlaceholderCard from "@/components/admin/AdminPlaceholderCard";

export default function AdminCategoriesPage() {
  return (
    <>
      <AdminPageIntro
        eyebrow="Categories"
        title="Category management"
        description="Reserved for category creation, editing, deletion, and assigning books to categories."
      />
      <AdminPlaceholderCard
        title="Planned category tools"
        items={[
          "Category list",
          "Create and edit category form",
          "Assign books to category flow",
          "Delete confirmation state",
        ]}
      />
    </>
  );
}
