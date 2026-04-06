import ReaderAccountShell from "@/components/main/account/ReaderAccountShell";
import TransactionsSection from "@/components/main/account/TransactionsSection";

export default function TransactionsPage() {
  return (
    <ReaderAccountShell
      activeSection="transactions"
      eyebrow="Account"
      title="Transaction"
    >
      <TransactionsSection />
    </ReaderAccountShell>
  );
}
