import { createServerClient } from "@supabase/ssr";

export type ReaderAccountSection = "profile" | "settings" | "transactions";

export type ReaderProfileData = {
  avatarDataUrl?: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  country: string;
  bio: string;
  passwordLabel: string;
};

export type AppearanceMode = "light" | "dark" | "system";
export type ReadingMode = "scroll" | "paged";
export type ReaderTheme = "paper" | "mist" | "night";
export type FontSize = "small" | "medium" | "large";
export type LineSpacing = "compact" | "comfortable" | "relaxed";
export type PageTransition = "slide" | "fade" | "curl";

export type ReaderSettingsData = {
  appearance: AppearanceMode;
  fontSize: FontSize;
  readerTheme: ReaderTheme;
  emailNotifications: boolean;
  purchaseConfirmation: boolean;
  newBookAlerts: boolean;
  readingMode: ReadingMode;
  lineSpacing: LineSpacing;
  pageTransition: PageTransition;
  readingBackground: string;
  language: string;
  paymentMethods: Array<{
    id: string;
    label: string;
    detail: string;
  }>;
  sessions: Array<{
    id: string;
    device: string;
    location: string;
    lastActive: string;
    current?: boolean;
  }>;
};

export type ReaderTransactionStatus = "Pending" | "Verified" | "Rejected";
export type ReaderTransactionMethod = "ABA QR" | "Bakong QR" | "Free Access";

export type ReaderTransactionRecord = {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  amountPaid: number;
  originalPrice?: number;
  action: "buy" | "rent" | "free";
  purchasedAt: string;
  status: ReaderTransactionStatus;
  reference: string;
  method: ReaderTransactionMethod;
  proofImageUrl?: string;
  proofFileName?: string;
};

export const defaultProfile: ReaderProfileData = {
  fullName: "Smart Reader",
  email: "reader@smartlibrary.app",
  phone: "+855 12 345 678",
  gender: "Female",
  dateOfBirth: "2000-06-18",
  country: "Phnom Penh, Cambodia",
  bio: "Enjoys practical self-growth books, modern fiction, and quiet night reading sessions.",
  passwordLabel: "Last changed 21 days ago",
};

export const defaultSettings: ReaderSettingsData = {
  appearance: "light",
  fontSize: "medium",
  readerTheme: "paper",
  emailNotifications: true,
  purchaseConfirmation: true,
  newBookAlerts: true,
  readingMode: "scroll",
  lineSpacing: "comfortable",
  pageTransition: "slide",
  readingBackground: "Soft Ivory",
  language: "English",
  paymentMethods: [
    { id: "pm-aba", label: "ABA QR", detail: "Preferred payment for book purchases" },
    { id: "pm-bakong", label: "Bakong QR", detail: "Quick transfer with Bakong" },
  ],
  sessions: [
    { id: "session-1", device: "MacBook Pro", location: "Phnom Penh", lastActive: "Active now", current: true },
    { id: "session-2", device: "iPhone 15", location: "Phnom Penh", lastActive: "Yesterday, 8:42 PM" },
  ],
};

function getClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

function rowToTransaction(row: Record<string, unknown>): ReaderTransactionRecord {
  const type = (row.type as string) ?? "";
  const action: ReaderTransactionRecord["action"] =
    type === "Rent" ? "rent" : type === "Purchase" ? "buy" : "free";

  const amountStr = (row.amount as string) ?? "$0.00";
  const amountPaid = parseFloat(amountStr.replace(/[^0-9.]/g, "")) || 0;

  const status = row.status as string;
  const txStatus: ReaderTransactionStatus =
    status === "Approved" ? "Verified" : status === "Rejected" ? "Rejected" : "Pending";

  return {
    id: row.id as string,
    bookId: (row.book_id as string) ?? "",
    bookTitle: "",
    bookCover: "",
    amountPaid,
    action,
    purchasedAt: (row.created_at as string) ?? new Date().toISOString(),
    status: txStatus,
    reference: (row.proof_url as string) ?? "",
    method: amountPaid === 0 ? "Free Access" : "ABA QR",
    proofImageUrl: (row.proof_url as string) ?? undefined,
  };
}

export async function getReaderProfile(userId: string): Promise<ReaderProfileData> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return defaultProfile;

  return {
    ...defaultProfile,
    fullName: (data.full_name as string) ?? defaultProfile.fullName,
    avatarDataUrl: (data.avatar_url as string) ?? undefined,
  };
}

export async function saveReaderProfile(userId: string, profile: ReaderProfileData): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: profile.fullName,
      avatar_url: profile.avatarDataUrl ?? null,
    })
    .eq("id", userId);

  if (error) throw new Error(error.message);
}

export function getReaderSettings(): ReaderSettingsData {
  if (typeof window === "undefined") return defaultSettings;
  const raw = window.localStorage.getItem("reader-account-settings");
  if (!raw) return defaultSettings;
  try {
    return JSON.parse(raw) as ReaderSettingsData;
  } catch {
    return defaultSettings;
  }
}

export function saveReaderSettings(settings: ReaderSettingsData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("reader-account-settings", JSON.stringify(settings));
}

export async function getReaderTransactions(userId: string): Promise<ReaderTransactionRecord[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => rowToTransaction(row as Record<string, unknown>));
}

export async function appendReaderTransaction(
  userId: string,
  transaction: Omit<ReaderTransactionRecord, "id">
): Promise<ReaderTransactionRecord[]> {
  const supabase = getClient();

  const typeMap = { buy: "Purchase", rent: "Rent", free: "Rent" } as const;

  const { error } = await supabase.from("transactions").insert({
    user_id: userId,
    book_id: transaction.bookId,
    type: typeMap[transaction.action],
    amount: `$${transaction.amountPaid.toFixed(2)}`,
    status: transaction.status === "Verified" ? "Approved" : transaction.status,
    proof_url: transaction.proofImageUrl ?? transaction.reference ?? null,
  });

  if (error) throw new Error(error.message);
  return getReaderTransactions(userId);
}
