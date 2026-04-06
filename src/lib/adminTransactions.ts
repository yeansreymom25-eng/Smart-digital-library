"use client";

import { readStoredJson, writeStoredJson } from "@/src/lib/browserStorage";

export type AdminTransaction = {
  id: string;
  user: string;
  book: string;
  type: "Rent" | "Purchase" | "Subscription";
  amount: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
  proofReference: string;
};

const ADMIN_TRANSACTIONS_STORAGE_KEY = "admin-transactions";

const defaultAdminTransactions: AdminTransaction[] = [
  {
    id: "bormey-art-of-programming",
    user: "Bormey",
    book: "The Art of Programming",
    type: "Rent",
    amount: "$2.99",
    date: "1/15/2026",
    status: "Approved",
    proofReference: "Receipt screenshot uploaded at 10:24 AM",
  },
  {
    id: "mean-digital-marketing",
    user: "Mean",
    book: "Digital Marketing",
    type: "Rent",
    amount: "$2.99",
    date: "1/15/2026",
    status: "Approved",
    proofReference: "QR payment receipt uploaded at 11:02 AM",
  },
  {
    id: "vith-leadership-principle",
    user: "Vith",
    book: "Leadership Principle",
    type: "Purchase",
    amount: "$5.99",
    date: "1/15/2026",
    status: "Approved",
    proofReference: "Purchase confirmation receipt uploaded at 1:15 PM",
  },
  {
    id: "lina-history-of-idea",
    user: "Lina",
    book: "History of Idea",
    type: "Rent",
    amount: "$2.99",
    date: "1/15/2026",
    status: "Pending",
    proofReference: "Pending proof review from uploaded payment image",
  },
];

function normalizeStoredTransactions(value: AdminTransaction[] | null) {
  if (!Array.isArray(value)) {
    return defaultAdminTransactions;
  }

  return value.filter(
    (item) =>
      typeof item?.id === "string" &&
      typeof item?.user === "string" &&
      typeof item?.book === "string" &&
      (item?.type === "Rent" ||
        item?.type === "Purchase" ||
        item?.type === "Subscription") &&
      typeof item?.amount === "string" &&
      typeof item?.date === "string" &&
      (item?.status === "Approved" ||
        item?.status === "Pending" ||
        item?.status === "Rejected") &&
      typeof item?.proofReference === "string"
  ) as AdminTransaction[];
}

function writeAdminTransactions(transactions: AdminTransaction[]) {
  writeStoredJson(ADMIN_TRANSACTIONS_STORAGE_KEY, transactions);
}

export function readAdminTransactions() {
  const stored = readStoredJson<AdminTransaction[]>(
    ADMIN_TRANSACTIONS_STORAGE_KEY
  );
  const transactions = normalizeStoredTransactions(stored);

  if (!stored) {
    writeAdminTransactions(transactions);
  }

  return transactions;
}

export function updateAdminTransactionStatus(
  transactionId: string,
  status: AdminTransaction["status"]
) {
  const nextTransactions = readAdminTransactions().map((transaction) =>
    transaction.id === transactionId ? { ...transaction, status } : transaction
  );

  writeAdminTransactions(nextTransactions);

  return nextTransactions;
}

export function createAdminTransaction(transaction: Omit<AdminTransaction, "id">) {
  const transactions = readAdminTransactions();
  const uniqueId = `transaction-${crypto.randomUUID().slice(0, 8)}`;
  const nextTransactions = [{ id: uniqueId, ...transaction }, ...transactions];

  writeAdminTransactions(nextTransactions);

  return nextTransactions;
}
