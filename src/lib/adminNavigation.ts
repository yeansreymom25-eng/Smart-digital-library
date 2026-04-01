export type AdminNavItem = {
  title: string;
  href: string;
  description: string;
};

export const adminNavigation: AdminNavItem[] = [
  {
    title: "Overview",
    href: "/admin",
    description: "Entry point for the library owner workspace.",
  },
  {
    title: "Subscription",
    href: "/admin/subscription",
    description: "Plan selection, billing, QR payment, and approval flow.",
  },
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    description: "Library metrics, recent activity, and quick statistics.",
  },
  {
    title: "Books",
    href: "/admin/books",
    description: "Manage books, files, covers, pricing, and visibility.",
  },
  {
    title: "Categories",
    href: "/admin/categories",
    description: "Create and organize book categories.",
  },
  {
    title: "Users",
    href: "/admin/users",
    description: "Monitor reader accounts and account status.",
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    description: "Review payments and verify proofs for paid plans.",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    description: "Charts and performance insights for the library.",
  },
  {
    title: "Reports",
    href: "/admin/reports",
    description: "Exportable reports and historical summaries.",
  },
  {
    title: "Profile",
    href: "/admin/profile",
    description: "Library owner profile and account settings.",
  },
];
