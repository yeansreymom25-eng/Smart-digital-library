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

const PROFILE_KEY = "reader-account-profile";
const SETTINGS_KEY = "reader-account-settings";
const TRANSACTIONS_KEY = "reader-account-transactions";

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

export const defaultTransactions: ReaderTransactionRecord[] = [
  {
    id: "txn-1",
    bookId: "life-impossible",
    bookTitle: "The Life Impossible",
    bookCover: "/MainPage/Books/9780399547003.jpeg",
    amountPaid: 18,
    originalPrice: 24,
    action: "buy",
    purchasedAt: "2026-04-02T10:30:00.000Z",
    status: "Verified",
    reference: "SDL-240402-1842",
    method: "ABA QR",
    proofImageUrl: "/User_Image/Library owner_image/QR.jpg",
    proofFileName: "aba-proof-apr-02.jpg",
  },
  {
    id: "txn-2",
    bookId: "atomic-habits",
    bookTitle: "Atomic Habits",
    bookCover: "/MainPage/Books/Atomic_habits.jpg",
    amountPaid: 0,
    action: "free",
    purchasedAt: "2026-04-01T08:15:00.000Z",
    status: "Verified",
    reference: "SDL-240401-9982",
    method: "Free Access",
  },
  {
    id: "txn-3",
    bookId: "listen-for-the-lie",
    bookTitle: "Listen for the Lie",
    bookCover: "/MainPage/Books/listen-for-the-lie.jpeg",
    amountPaid: 1.65,
    originalPrice: 11,
    action: "rent",
    purchasedAt: "2026-03-28T17:20:00.000Z",
    status: "Pending",
    reference: "SDL-240328-6135",
    method: "Bakong QR",
  },
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getReaderProfile(): ReaderProfileData {
  return readStorage(PROFILE_KEY, defaultProfile);
}

export function saveReaderProfile(profile: ReaderProfileData) {
  writeStorage(PROFILE_KEY, profile);
}

export function getReaderSettings(): ReaderSettingsData {
  return readStorage(SETTINGS_KEY, defaultSettings);
}

export function saveReaderSettings(settings: ReaderSettingsData) {
  writeStorage(SETTINGS_KEY, settings);
}

export function getReaderTransactions(): ReaderTransactionRecord[] {
  return readStorage(TRANSACTIONS_KEY, defaultTransactions);
}

export function saveReaderTransactions(transactions: ReaderTransactionRecord[]) {
  writeStorage(TRANSACTIONS_KEY, transactions);
}

export function appendReaderTransaction(transaction: ReaderTransactionRecord) {
  const current = getReaderTransactions();
  const next = [transaction, ...current.filter((item) => item.id !== transaction.id)];
  saveReaderTransactions(next);
  return next;
}
