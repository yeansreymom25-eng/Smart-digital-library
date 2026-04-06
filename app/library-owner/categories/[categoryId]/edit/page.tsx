import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  return <CategoryForm mode="edit" categoryId={categoryId} />;
}
