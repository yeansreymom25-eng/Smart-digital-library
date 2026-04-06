import BookRecordForm from "@/components/admin/BookRecordForm";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;

  return <BookRecordForm mode="edit" bookId={bookId} />;
}
