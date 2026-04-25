import ExploreCategoriesPage from "@/components/main/ExploreCategoriesPage";
import { readExploreCategories, type ExploreOption } from "@/src/lib/exploreCategoryCollections";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ option?: string }>;
}) {
  const { option } = await searchParams;
  const selectedOption: ExploreOption = option === "khmer" ? "khmer" : "english";
  const categories = await readExploreCategories(selectedOption);

  return <ExploreCategoriesPage option={selectedOption} categories={categories} />;
}
