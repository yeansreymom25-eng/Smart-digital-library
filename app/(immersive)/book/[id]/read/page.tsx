import { notFound } from "next/navigation";
import BookReader from "@/components/main/reader/BookReader";
import { getReaderBookContent } from "@/src/lib/readerBookContent";

export default async function ReaderRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = getReaderBookContent(id);

  if (!content) {
    notFound();
  }

  return <BookReader book={content.book} pages={content.pages} />;
}
