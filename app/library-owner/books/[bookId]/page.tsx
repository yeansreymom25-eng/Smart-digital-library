import BookDetailsPanel from "@/components/admin/BookDetailsPanel";

export default async function ViewBookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;

  return <BookDetailsPanel bookId={bookId} />;
}
