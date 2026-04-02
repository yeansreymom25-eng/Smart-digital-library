export type AdminNavItem = {
  title: string;
  href: string;
  description: string;
};

export const adminNavigation: AdminNavItem[] = [
  {
    title: "Overview",
    href: "/library-owner",
    description: "Entry point for the library owner workspace.",
  },
  {
    title: "Subscription",
    href: "/library-owner/subscription",
    description: "Plan selection, billing, QR payment, and approval flow.",
  },
  {
    title: "Dashboard",
    href: "/library-owner/dashboard",
    description: "Library metrics, recent activity, and quick statistics.",
  },
  {
    title: "Books",
    href: "/library-owner/books",
    description: "Manage books, files, covers, pricing, and visibility.",
  },
  {
    title: "Categories",
    href: "/library-owner/categories",
    description: "Create and organize book categories.",
  },
  {
    title: "Users",
    href: "/library-owner/users",
    description: "Monitor reader accounts and account status.",
  },
  {
    title: "Transactions",
    href: "/library-owner/transactions",
    description: "Review payments and verify proofs for paid plans.",
  },
  {
    title: "Analytics",
    href: "/library-owner/analytics",
    description: "Charts and performance insights for the library.",
  },
  {
    title: "Reports",
    href: "/library-owner/reports",
    description: "Exportable reports and historical summaries.",
  },
  {
    title: "Profile",
    href: "/library-owner/profile",
    description: "Library owner profile and account settings.",
  },
];
