import AdminPageIntro from "@/components/admin/AdminPageIntro";
import AdminPlaceholderCard from "@/components/admin/AdminPlaceholderCard";

export default function AdminAnalyticsPage() {
  return (
    <>
      <AdminPageIntro
        eyebrow="Analytics"
        title="Analytics and insights"
        description="Reserved for revenue charts, user growth, popular books, and rental versus purchase trends."
      />
      <AdminPlaceholderCard
        title="Planned analytics blocks"
        items={[
          "Revenue chart",
          "User growth chart",
          "Popular books summary",
          "Rental versus purchase breakdown",
        ]}
      />
    </>
  );
}
