import type { ReactNode } from "react";
import AuthNavbar from "@/components/auth/AuthNavbar";

export default function AuthenticationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(90deg,#d9e7ff_0%,#ffffff_62%)]">
      <AuthNavbar />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
