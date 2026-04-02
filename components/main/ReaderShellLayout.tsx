import type { ReactNode } from "react";
import ReaderMainNavigation from "@/components/main/ReaderMainNavigation";

export default function ReaderShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <ReaderMainNavigation />
      {children}
    </div>
  );
}
