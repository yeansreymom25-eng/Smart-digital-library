import AdminPageIntro from "@/components/admin/AdminPageIntro";
import AdminPlaceholderCard from "@/components/admin/AdminPlaceholderCard";

export default function AdminTransactionsPage() {
  return (
    <>
      <AdminPageIntro
        eyebrow="Transactions"
        title="Payment verification"
        description="Reserved for rental and purchase payments, proof review, and approving or rejecting transaction records."
      />
      <AdminPlaceholderCard
        title="Planned transaction tools"
        items={[
          "Payment table with filters",
          "Proof of payment preview",
          "Pending, approved, and rejected tabs",
          "Approve and reject action controls",
        ]}
      />
    </>
  );
}
