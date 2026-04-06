import ExploreCategoriesPage from "@/components/main/ExploreCategoriesPage";
import type { ExploreOption } from "@/src/lib/exploreCategoryCollections";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ option?: string }>;
}) {
  const { option } = await searchParams;
  const selectedOption: ExploreOption = option === "khmer" ? "khmer" : "english";

  return <ExploreCategoriesPage option={selectedOption} />;
}
