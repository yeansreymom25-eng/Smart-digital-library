import { notFound } from "next/navigation";
import ReaderBookDetailPage from "@/components/main/ReaderBookDetailPage";
import { getReaderBookDetail } from "@/src/lib/readerBookDetails";

export default async function BookDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = getReaderBookDetail(id);

  if (!book) {
    notFound();
  }

  return <ReaderBookDetailPage book={book} />;
}
