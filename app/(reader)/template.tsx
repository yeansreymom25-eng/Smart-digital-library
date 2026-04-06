import type { ReactNode } from "react";

export default function ReaderTemplate({ children }: { children: ReactNode }) {
  return <div className="reader-page-swap relative z-10">{children}</div>;
}
