import AdminPageIntro from "@/components/admin/AdminPageIntro";
import AdminPlaceholderCard from "@/components/admin/AdminPlaceholderCard";

export default function AdminReportsPage() {
  return (
    <>
      <AdminPageIntro
        eyebrow="Reports"
        title="Reports and exports"
        description="Reserved for detailed revenue, sales, and user activity reports with monthly, yearly, PDF, and Excel export options."
      />
      <AdminPlaceholderCard
        title="Planned report tools"
        items={[
          "Revenue and sales summaries",
          "Monthly and yearly filters",
          "Top-books analysis",
          "Export actions for PDF and Excel",
        ]}
      />
    </>
  );
}
