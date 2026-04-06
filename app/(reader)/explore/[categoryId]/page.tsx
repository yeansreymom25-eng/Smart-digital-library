import { notFound } from "next/navigation";
import ExploreCategoryCollectionPage from "@/components/main/ExploreCategoryCollectionPage";
import { getExploreCategory, type ExploreOption } from "@/src/lib/exploreCategoryCollections";

export default async function ExploreCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ option?: string }>;
}) {
  const { categoryId } = await params;
  const { option } = await searchParams;
  const selectedOption: ExploreOption = option === "khmer" ? "khmer" : "english";
  const category = getExploreCategory(selectedOption, categoryId);

  if (!category) {
    notFound();
  }

  return <ExploreCategoryCollectionPage category={category} option={selectedOption} />;
}
