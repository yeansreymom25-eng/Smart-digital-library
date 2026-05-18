export const LIBRARY_OWNER_EMAIL = "yean.sreymom25@kit.edu.kh";

export type AppRole = "user" | "admin" | "super_admin";

export function normalizeAuthEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

export function canUseLibraryOwnerRole(email: string | null | undefined) {
  return normalizeAuthEmail(email) === LIBRARY_OWNER_EMAIL;
}

export function resolveSignupRole(
  email: string | null | undefined,
  requestedRole: string | null | undefined
): "user" | "admin" {
  return requestedRole === "admin" && canUseLibraryOwnerRole(email) ? "admin" : "user";
}

export function resolveStoredRole(
  email: string | null | undefined,
  storedRole: string | null | undefined
): AppRole {
  if (storedRole === "super_admin") {
    return "super_admin";
  }

  if (storedRole === "admin" && canUseLibraryOwnerRole(email)) {
    return "admin";
  }

  return "user";
}
