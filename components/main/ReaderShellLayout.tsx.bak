"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ReaderMainNavigation from "@/components/main/ReaderMainNavigation";

export default function ReaderShellLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white">
      <div key={`nav-${pathname}`} className="reader-nav-swap">
        <ReaderMainNavigation />
      </div>
      {children}
    </div>
  );
}
