"use client";

import { readStoredJson, writeStoredJson } from "@/src/lib/browserStorage";

export type AdminPlanName = "Normal" | "Pro" | "Premium";
export type AdminPlanStatus =
  | "not_selected"
  | "active"
  | "pending"
  | "rejected";

export type AdminSubscription = {
  plan: AdminPlanName | null;
  status: AdminPlanStatus;
  proofFileName: string;
  paymentReference: string;
  paymentNote: string;
  submittedAt: string | null;
  updatedAt: string | null;
};

export const ADMIN_SUBSCRIPTION_STORAGE_KEY = "admin-subscription";

export const DEFAULT_ADMIN_SUBSCRIPTION: AdminSubscription = {
  plan: null,
  status: "not_selected",
  proofFileName: "",
  paymentReference: "",
  paymentNote: "",
  submittedAt: null,
  updatedAt: null,
};

function normalizeStoredSubscription(value: unknown): AdminSubscription {
  if (!value || typeof value !== "object") {
    return DEFAULT_ADMIN_SUBSCRIPTION;
  }

  const nextValue = value as Partial<AdminSubscription>;
  const plan =
    nextValue.plan === "Normal" ||
    nextValue.plan === "Pro" ||
    nextValue.plan === "Premium"
      ? nextValue.plan
      : null;
  const status =
    nextValue.status === "active" ||
    nextValue.status === "pending" ||
    nextValue.status === "rejected"
      ? nextValue.status
      : "not_selected";

  return {
    plan,
    status,
    proofFileName:
      typeof nextValue.proofFileName === "string" ? nextValue.proofFileName : "",
    paymentReference:
      typeof nextValue.paymentReference === "string"
        ? nextValue.paymentReference
        : "",
    paymentNote:
      typeof nextValue.paymentNote === "string" ? nextValue.paymentNote : "",
    submittedAt:
      typeof nextValue.submittedAt === "string" ? nextValue.submittedAt : null,
    updatedAt:
      typeof nextValue.updatedAt === "string" ? nextValue.updatedAt : null,
  };
}

export function getPlanBookLimit(plan: AdminPlanName | null) {
  if (plan === "Premium") {
    return Number.POSITIVE_INFINITY;
  }

  if (plan === "Pro") {
    return 50;
  }

  if (plan === "Normal") {
    return 20;
  }

  return 0;
}

export function formatPlanLimit(limit: number) {
  return Number.isFinite(limit) ? String(limit) : "Unlimited";
}

export function readAdminSubscription() {
  const stored = readStoredJson<AdminSubscription>(ADMIN_SUBSCRIPTION_STORAGE_KEY);
  const subscription = normalizeStoredSubscription(stored);

  if (!stored) {
    writeStoredJson(ADMIN_SUBSCRIPTION_STORAGE_KEY, subscription);
  }

  return subscription;
}

export function writeAdminSubscription(subscription: AdminSubscription) {
  writeStoredJson(ADMIN_SUBSCRIPTION_STORAGE_KEY, subscription);
}

export function activateAdminPlan(plan: AdminPlanName) {
  const nextValue: AdminSubscription = {
    plan,
    status: "active",
    proofFileName: "",
    paymentReference: "",
    paymentNote: "",
    submittedAt: null,
    updatedAt: new Date().toISOString(),
  };

  writeAdminSubscription(nextValue);
  return nextValue;
}

export function submitAdminPlanForReview(input: {
  plan: Exclude<AdminPlanName, "Normal">;
  proofFileName: string;
  paymentReference: string;
  paymentNote: string;
}) {
  const now = new Date().toISOString();
  const nextValue: AdminSubscription = {
    plan: input.plan,
    status: "pending",
    proofFileName: input.proofFileName,
    paymentReference: input.paymentReference,
    paymentNote: input.paymentNote,
    submittedAt: now,
    updatedAt: now,
  };

  writeAdminSubscription(nextValue);
  return nextValue;
}

export function updateAdminPlanReviewStatus(status: "active" | "rejected") {
  const current = readAdminSubscription();
  const nextValue: AdminSubscription = {
    ...current,
    status,
    updatedAt: new Date().toISOString(),
  };

  writeAdminSubscription(nextValue);
  return nextValue;
}
