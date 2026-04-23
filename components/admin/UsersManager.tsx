"use client";

import { useMemo, useState } from "react";
import type { AdminUser } from "@/src/lib/adminUsers";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-slate-400" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function UsersStatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6" aria-hidden="true">
      <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function StatusBadge({ status }: { status: AdminUser["status"] }) {
  const className =
    status === "Active"
      ? "bg-[#2ec84d] text-white"
      : "bg-[#eef2f7] text-[#62718a]";

  return (
    <span className={`inline-flex min-w-[88px] justify-center rounded-[4px] px-3 py-1 text-sm font-semibold ${className}`}>
      {status}
    </span>
  );
}

export default function UsersManager({ initialUsers = [] }: { initialUsers?: AdminUser[] }) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return initialUsers;
    return initialUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
    );
  }, [search, initialUsers]);

  const totalUsers = initialUsers.length;
  const activeUsers = initialUsers.filter((u) => u.status === "Active").length;
  const inactiveUsers = initialUsers.filter((u) => u.status === "Inactive").length;

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-[2.5rem] font-bold leading-none text-[#173b73]">Users Management</h1>
        <p className="mt-2 text-base text-[#4d6691]">View all registered users</p>
      </div>

      <section className="rounded-[10px] border border-[#cfcfcf] bg-white p-4 shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <div className="flex items-center gap-3 rounded-[8px] border border-[#ececec] bg-white px-4 py-3">
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full border-0 bg-transparent text-base text-[#1e3a6d] outline-none placeholder:text-sm placeholder:text-slate-400"
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[8px] bg-[#4d98f0] p-4 text-white shadow-[0_8px_20px_rgba(77,152,240,0.18)]">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium text-[#eaf3ff]">Total Users</p>
            <UsersStatIcon />
          </div>
          <p className="mt-8 text-5xl font-bold leading-none">{totalUsers}</p>
        </article>

        <article className="rounded-[8px] bg-[#4d98f0] p-4 text-white shadow-[0_8px_20px_rgba(77,152,240,0.18)]">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium text-[#eaf3ff]">Active Users</p>
            <UsersStatIcon />
          </div>
          <p className="mt-8 text-5xl font-bold leading-none">{activeUsers}</p>
        </article>

        <article className="rounded-[8px] bg-[#4d98f0] p-4 text-white shadow-[0_8px_20px_rgba(77,152,240,0.18)]">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium text-[#eaf3ff]">Inactive Users</p>
            <UsersStatIcon />
          </div>
          <p className="mt-8 text-5xl font-bold leading-none">{inactiveUsers}</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-[10px] border border-[#cfcfcf] bg-white shadow-[0_8px_20px_rgba(132,145,165,0.05)]">
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-lg font-semibold text-[#1e3a6d]">No users found</p>
              <p className="mt-2 text-sm text-slate-500">Try another search term.</p>
            </div>
          ) : (
            <table className="w-full min-w-[900px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-base text-[#2456b6]">
                  <th className="px-6 py-5 font-medium">Name</th>
                  <th className="px-4 py-5 font-medium">Email</th>
                  <th className="px-4 py-5 font-medium">Role</th>
                  <th className="px-4 py-5 font-medium">Joined Date</th>
                  <th className="px-4 py-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="text-[1.08rem] text-slate-900">
                    <td className="border-t border-[#cfcfcf] px-6 py-6">{user.name}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-6">{user.email}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-6">{user.role}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-6">{user.joinedDate}</td>
                    <td className="border-t border-[#cfcfcf] px-4 py-6">
                      <StatusBadge status={user.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </section>
  );
}