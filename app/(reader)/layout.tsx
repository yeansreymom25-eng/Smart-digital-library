import type { ReactNode } from "react";
import ReaderShellLayout from "@/components/main/ReaderShellLayout";

export default function ReaderLayout({ children }: { children: ReactNode }) {
  return <ReaderShellLayout>{children}</ReaderShellLayout>;
}
