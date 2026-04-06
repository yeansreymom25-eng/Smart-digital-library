import type { ReactNode } from "react";

export default function AuthenticationTemplate({ children }: { children: ReactNode }) {
  return <div className="auth-page-swap relative z-10">{children}</div>;
}
