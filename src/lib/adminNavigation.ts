import type { AdminPlanName } from "@/src/lib/adminSubscription";

export type AdminNavItem = {
  title: string;
  href: string;
  description: string;
  plans: AdminPlanName[];
};

export const adminNavigation: AdminNavItem[] = [
  {
    title: "Overview",
    href: "/library-owner",
    description: "Entry point for the library owner workspace.",
    plans: ["Normal", "Pro", "Premium"],
  },
  {
    title: "Subscription",
    href: "/library-owner/subscription",
    description: "Plan selection, billing, QR payment, and approval flow.",
    plans: ["Normal", "Pro", "Premium"],
  },
  {
    title: "Dashboard",
    href: "/library-owner/dashboard",
    description: "Library metrics, recent activity, and quick statistics.",
    plans: ["Normal", "Pro", "Premium"],
  },
  {
    title: "Books",
    href: "/library-owner/books",
    description: "Manage books, files, covers, pricing, and visibility.",
    plans: ["Normal", "Pro", "Premium"],
  },
  {
    title: "Categories",
    href: "/library-owner/categories",
    description: "Create and organize book categories.",
    plans: ["Normal", "Pro", "Premium"],
  },
  {
    title: "Users",
    href: "/library-owner/users",
    description: "Monitor reader accounts and account status.",
    plans: ["Normal", "Pro", "Premium"],
  },
  {
    title: "Transactions",
    href: "/library-owner/transactions",
    description: "Review payments and verify proofs for paid plans.",
    plans: ["Pro", "Premium"],
  },
  {
    title: "Analytics",
    href: "/library-owner/analytics",
    description: "Charts and performance insights for the library.",
    plans: ["Pro", "Premium"],
  },
  {
    title: "Reports",
    href: "/library-owner/reports",
    description: "Exportable reports and historical summaries.",
    plans: ["Premium"],
  },
  {
    title: "Profile",
    href: "/library-owner/profile",
    description: "Library owner profile and account settings.",
    plans: ["Normal", "Pro", "Premium"],
  },
];

export function getAdminNavigationForPlan(plan: AdminPlanName | null) {
  const activePlan = plan ?? "Normal";
  return adminNavigation.filter((item) => item.plans.includes(activePlan));
}
