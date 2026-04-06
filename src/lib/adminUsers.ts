"use client";

import { readStoredJson, writeStoredJson } from "@/src/lib/browserStorage";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "User" | "Admin";
  joinedDate: string;
  status: "Active" | "Inactive";
};

const ADMIN_USERS_STORAGE_KEY = "admin-users";

const defaultAdminUsers: AdminUser[] = [
  {
    id: "bormey",
    name: "Bormey",
    email: "mey@gmail.com",
    role: "User",
    joinedDate: "1/15/2026",
    status: "Active",
  },
  {
    id: "thyroth",
    name: "Thyroth",
    email: "roth2@gmail.com",
    role: "User",
    joinedDate: "2/10/2026",
    status: "Active",
  },
  {
    id: "lina",
    name: "Lina",
    email: "nana@gmail.com",
    role: "User",
    joinedDate: "5/15/2026",
    status: "Active",
  },
  {
    id: "seav-mean",
    name: "Seav Mean",
    email: "mean123@gmail.com",
    role: "User",
    joinedDate: "1/15/2026",
    status: "Active",
  },
  {
    id: "devith",
    name: "Devith",
    email: "vith@gmail.com",
    role: "User",
    joinedDate: "1/15/2026",
    status: "Active",
  },
  {
    id: "kim-srun",
    name: "Kim Srun",
    email: "srun33@gmail.com",
    role: "User",
    joinedDate: "1/15/2026",
    status: "Active",
  },
];

function normalizeStoredUsers(value: AdminUser[] | null) {
  if (!Array.isArray(value)) {
    return defaultAdminUsers;
  }

  return value.filter(
    (item) =>
      typeof item?.id === "string" &&
      typeof item?.name === "string" &&
      typeof item?.email === "string" &&
      (item?.role === "User" || item?.role === "Admin") &&
      typeof item?.joinedDate === "string" &&
      (item?.status === "Active" || item?.status === "Inactive")
  ) as AdminUser[];
}

function writeAdminUsers(users: AdminUser[]) {
  writeStoredJson(ADMIN_USERS_STORAGE_KEY, users);
}

export function readAdminUsers() {
  const stored = readStoredJson<AdminUser[]>(ADMIN_USERS_STORAGE_KEY);
  const users = normalizeStoredUsers(stored);

  if (!stored) {
    writeAdminUsers(users);
  }

  return users;
}
