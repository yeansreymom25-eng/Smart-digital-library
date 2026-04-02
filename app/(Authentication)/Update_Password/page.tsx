import UpdatePasswordClient, {
  type PasswordMode,
} from "@/app/(Auth)/Update_Password/UpdatePasswordClient";

type UpdatePasswordPageProps = {
  searchParams?: Promise<{
    mode?: string;
  }>;
};

export default async function UpdatePasswordPage({
  searchParams,
}: UpdatePasswordPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const mode: PasswordMode =
    resolvedSearchParams?.mode === "social-signup" ? "social-signup" : "account";

  return <UpdatePasswordClient mode={mode} />;
}
