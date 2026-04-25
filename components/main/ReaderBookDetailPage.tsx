"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReaderBookDetail } from "@/src/lib/readerBookDetails";
import { getSupabaseBrowserClient } from "@/src/lib/supabaseBrowser";

type PurchaseAction = "buy" | "rent" | "free";
type PaymentMethod = "aba" | "bakong";
type AccessStatus = "none" | "pending" | "approved" | "rejected";

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 5.5L8 12l6.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 3.75A2.25 2.25 0 0 1 9.25 1.5h5.5A2.25 2.25 0 0 1 17 3.75v17.38a.75.75 0 0 1-1.18.615L12 18.99l-3.82 2.755A.75.75 0 0 1 7 21.13V3.75Z" />
    </svg>
  );
}

function SampleSparkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="sample-spark-gradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff5dbb" />
          <stop offset="0.45" stopColor="#a86dff" />
          <stop offset="1" stopColor="#40b9ff" />
        </linearGradient>
      </defs>
      <path
        d="M8.8 4.2c.7 2.2 1.8 3.3 4 4-.7.2-1.4.6-2 1.1-1 .8-1.6 1.7-2 2.9-.7-2.2-1.8-3.3-4-4 2.2-.7 3.3-1.8 4-4Z"
        stroke="url(#sample-spark-gradient)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.2 11.4c.5 1.5 1.3 2.2 2.8 2.7-1.5.5-2.3 1.3-2.8 2.8-.5-1.5-1.3-2.3-2.8-2.8 1.5-.5 2.3-1.2 2.8-2.7Z"
        fill="url(#sample-spark-gradient)"
      />
    </svg>
  );
}

function DiscountBurst({ label }: { label: string }) {
  const spikes = Array.from({ length: 20 }, (_, index) => {
    const rotation = (360 / 20) * index;
    return (
      <span
        key={rotation}
        className="absolute left-1/2 top-1/2 h-[1.15rem] w-[0.46rem] origin-bottom rounded-full bg-[#ff5644]"
        style={{ transform: `translate(-50%, -100%) rotate(${rotation}deg) translateY(-3.1rem)` }}
      />
    );
  });

  return (
    <div className="relative flex h-[8.4rem] w-[8.4rem] items-center justify-center">
      {spikes}
      <div className="relative z-10 flex h-[6.2rem] w-[6.2rem] items-center justify-center rounded-full bg-[#ff5644] text-center shadow-[0_18px_30px_rgba(255,86,68,0.24)]">
        <span className="text-[1.25rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-white">
          {label.split(" ").map((part, index) => (
            <span key={`${label}-${index}`} className="block">
              {part}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default function ReaderBookDetailPage({
  book,
  userId,
}: {
  book: ReaderBookDetail;
  userId?: string;
}) {
  const router = useRouter();

  const [modalAction, setModalAction] = useState<PurchaseAction | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("aba");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofFileName, setProofFileName] = useState<string | undefined>();
  const [wantToRead, setWantToRead] = useState(false);
  const [accessStatus, setAccessStatus] = useState<AccessStatus>("none");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Check if user already has access to this book
  useEffect(() => {
    async function checkAccess() {
      if (!userId) return;
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      // Check reader_library for approved access
      const { data: libraryEntry } = await supabase
        .from("reader_library")
        .select("id, access_type, expires_at")
        .eq("user_id", userId)
        .eq("book_id", book.id)
        .maybeSingle();

      if (libraryEntry) {
        // Check if rental expired
        if (libraryEntry.expires_at) {
          const expired = new Date(libraryEntry.expires_at as string) < new Date();
          setAccessStatus(expired ? "none" : "approved");
        } else {
          setAccessStatus("approved");
        }
        return;
      }

      // Check transactions for pending
      const { data: pendingTx } = await supabase
        .from("transactions")
        .select("id, status")
        .eq("user_id", userId)
        .eq("book_id", book.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pendingTx) {
        const status = pendingTx.status as string;
        if (status === "Pending") setAccessStatus("pending");
        else if (status === "Rejected") setAccessStatus("rejected");
      }
    }

    void checkAccess();
  }, [book.id]);

  const currentPrice = book.currentPrice ?? book.originalPrice ?? 0;
  const rentPrice = useMemo(() => Number((currentPrice * 0.15).toFixed(2)), [currentPrice]);
  const canRent = book.access === "buy-rent";
  const isFree = book.access === "free";
  const hasDiscount = Boolean(book.originalPrice && book.currentPrice && book.originalPrice > book.currentPrice);
  const discountLabel = isFree
    ? "FREE"
    : hasDiscount && book.originalPrice
    ? `${Math.round(((book.originalPrice - currentPrice) / book.originalPrice) * 100)}% OFF`
    : null;

  const paymentReady =
    modalAction === "free"
      ? true
      : proofFile !== null;

  function openAction(action: PurchaseAction) {
    setModalAction(action);
    setProofFile(null);
    setProofFileName(undefined);
    setSubmitMessage(null);
    setSubmitError(null);
    setPaymentMethod("aba");
  }

  async function handleSubmit() {
    if (!modalAction || !paymentReady || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      if (!userId) throw new Error("Please log in first");

      let proofUrl: string | undefined;

      // Upload proof image to Supabase Storage
      if (proofFile && modalAction !== "free") {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) throw new Error("Could not connect to storage");

        const fileExt = proofFile.name.split(".").pop() ?? "jpg";
        const filePath = `payment-proofs/${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("proofs")
          .upload(filePath, proofFile, { upsert: true });

        if (uploadError) {
          // Fallback: use base64 if storage bucket not available
          proofUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(proofFile);
          });
        } else {
          const { data: urlData } = supabase.storage
            .from("proofs")
            .getPublicUrl(filePath);
          proofUrl = urlData.publicUrl;
        }
      }

      const amount = modalAction === "rent" ? rentPrice : modalAction === "buy" ? currentPrice : 0;

      const response = await fetch("/api/payment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          action: modalAction,
          amount,
          proofUrl,
          paymentMethod,
        }),
      });

      const result = await response.json() as { success?: boolean; status?: string; message?: string; error?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Something went wrong");
      }

      if (result.status === "approved") {
        setAccessStatus("approved");
        setModalAction(null);
      } else {
        setAccessStatus("pending");
        setSubmitMessage(result.message ?? "Payment submitted! Waiting for admin approval.");
        setTimeout(() => setModalAction(null), 2500);
      }

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const actionPrice =
    modalAction === "rent"
      ? formatPrice(rentPrice)
      : modalAction === "buy"
      ? formatPrice(currentPrice)
      : "Free";

  const sampleHeadline = `${book.title} Sample`;
  const sampleText = `${book.description} ${book.description}`;

  // QR image: use book's payment_qr_url or fallback to local
  const qrImageSrc = (book as unknown as Record<string, unknown>).paymentQrImageSrc as string | undefined
    ?? "/User_Image/Library owner_image/QR.jpg";

  return (
    <>
      <main className="min-h-screen bg-white px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[96rem]">
          <section className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]">
            <div className="mx-auto w-full max-w-[22rem] lg:mx-0 xl:max-w-[24rem]">
              <div className="mb-5 flex justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => router.push("/my-library")}
                  className="inline-flex items-center gap-2 rounded-[0.8rem] bg-[#e8eaee] px-4 py-2 text-[1rem] font-medium text-[#6b7482] transition hover:bg-[#dfe4ea] hover:text-[#222733]"
                >
                  <BackIcon />
                  Back
                </button>
              </div>

              <div className="relative aspect-[2/3] overflow-hidden rounded-[0.85rem] border border-black/6 bg-white shadow-[0_20px_32px_rgba(15,23,42,0.12)]">
                {book.imageSrc ? (
                  <Image
                    src={book.imageSrc}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 384px, (min-width: 1024px) 352px, 320px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e8eaee] to-[#d0d4dc]">
                    <span className="text-2xl font-bold text-[#6b7482]">{book.title}</span>
                  </div>
                )}
              </div>

              <div className="mt-7 space-y-2">
                <div className="text-[1.8rem] font-semibold tracking-[-0.05em] text-black [font-family:'Iowan_Old_Style',Georgia,serif]">
                  Description :
                </div>
                <p className="text-[1rem] leading-8 text-[#7f7f7f] [font-family:'Iowan_Old_Style',Georgia,serif]">
                  {book.description || "No description available."}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h1 className="text-[3.5rem] font-medium tracking-[-0.08em] text-black [font-family:'SF_Pro_Display','SF_Pro_Text','Helvetica_Neue','Arial',sans-serif] sm:text-[4.2rem] xl:text-[5rem]">
                      {book.title}
                    </h1>
                    <p className="text-[2rem] font-semibold tracking-[-0.05em] text-[#7d7d7d] [font-family:'Iowan_Old_Style',Georgia,serif]">
                      By : {book.author}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {isFree ? (
                      <span className="text-[2rem] font-semibold tracking-[-0.05em] text-[#6b6b6b]">
                        Free
                      </span>
                    ) : (
                      <>
                        {book.originalPrice && book.originalPrice > currentPrice ? (
                          <span className="text-[1.9rem] font-semibold tracking-[-0.05em] text-[#8a8a8a] line-through decoration-[2px]">
                            {formatPrice(book.originalPrice)}
                          </span>
                        ) : null}
                        <span className="text-[1.9rem] font-semibold tracking-[-0.05em] text-[#6b6b6b]">
                          {formatPrice(currentPrice)}
                        </span>
                        {canRent ? (
                          <span className="rounded-full bg-[#eef1f7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6a7a]">
                            Rent / month {formatPrice(rentPrice)}
                          </span>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>

                {discountLabel ? (
                  <div className="flex justify-center xl:justify-end xl:pt-6">
                    <DiscountBurst label={discountLabel} />
                  </div>
                ) : null}
              </div>

              {/* Sample preview */}
              <div className="rounded-[2.1rem] bg-[linear-gradient(135deg,#ff73cf_0%,#c88aff_28%,#72b7ff_68%,#5dd4ff_100%)] p-[1.5px] shadow-[0_18px_30px_rgba(129,139,255,0.18)]">
                <div className="rounded-[calc(2.1rem-1.5px)] bg-[linear-gradient(135deg,rgba(255,246,252,0.92)_0%,rgba(255,255,255,0.96)_18%,rgba(245,250,255,0.98)_100%)] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-[0_10px_20px_rgba(129,139,255,0.14)]">
                      <SampleSparkIcon />
                    </div>
                    <div>
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8a91a1]">
                        Preview
                      </div>
                      <div className="text-base font-semibold tracking-[-0.03em] text-[#232833] [font-family:'Iowan_Old_Style',Georgia,serif]">
                        Read a sample first
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 min-h-[13.5rem] rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(255,113,206,0.08)_0%,rgba(198,125,255,0.05)_35%,rgba(78,186,255,0.08)_100%)] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] lg:min-h-[15.5rem] xl:min-h-[17rem]">
                    <div className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#9aa2af]">
                      {sampleHeadline}
                    </div>
                    <p className="mt-3 line-clamp-4 text-[0.98rem] leading-7 text-[#606977] [font-family:'Iowan_Old_Style',Georgia,serif]">
                      {sampleText}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#8b93a2]">
                      <span>Sample only</span>
                      <span>Continue to unlock</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Access status banners */}
              {accessStatus === "approved" && (
                <div className="rounded-[1.4rem] border border-[#d8f0d1] bg-[#f6fff3] px-5 py-4 text-[#3d7f2f] shadow-[0_12px_20px_rgba(95,174,77,0.08)]">
                  ✅ You have access to this book!
                </div>
              )}
              {accessStatus === "pending" && (
                <div className="rounded-[1.4rem] border border-[#fde68a] bg-[#fffbeb] px-5 py-4 text-[#92400e]">
                  ⏳ Your payment is pending admin approval. You'll get access once verified.
                </div>
              )}
              {accessStatus === "rejected" && (
                <div className="rounded-[1.4rem] border border-[#fecaca] bg-[#fff5f5] px-5 py-4 text-[#991b1b]">
                  ❌ Your previous payment was rejected. Please try again.
                </div>
              )}

              <div className="flex w-full max-w-[44rem] flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setWantToRead((v) => !v)}
                  className={`flex min-h-[4.4rem] w-full items-center justify-center gap-2 rounded-full border px-8 py-4 text-[1.15rem] font-semibold transition ${
                    wantToRead
                      ? "border-[#1f2530] bg-[#1f2530] text-white"
                      : "border-[#d4dae4] bg-white text-[#1f2530] hover:border-[#bfc8d6]"
                  }`}
                >
                  <BookmarkIcon />
                  {wantToRead ? "Saved to Want to read" : "Want to read"}
                </button>

                {accessStatus === "approved" ? (
                  <button
                    type="button"
                    onClick={() => router.push(`/book/${book.id}/read`)}
                    className="min-h-[4.4rem] w-full rounded-full bg-[#1f2530] px-8 py-4 text-[1.15rem] font-semibold text-white shadow-[0_14px_24px_rgba(31,37,48,0.18)]"
                  >
                    Read now
                  </button>
                ) : accessStatus === "pending" ? (
                  <button
                    type="button"
                    disabled
                    className="min-h-[4.4rem] w-full rounded-full bg-[#b5bdca] px-8 py-4 text-[1.15rem] font-semibold text-white cursor-not-allowed"
                  >
                    Awaiting approval...
                  </button>
                ) : isFree ? (
                  <button
                    type="button"
                    onClick={() => openAction("free")}
                    className="min-h-[4.4rem] w-full rounded-full bg-[#1f2530] px-8 py-4 text-[1.15rem] font-semibold text-white shadow-[0_14px_24px_rgba(31,37,48,0.18)] transition hover:bg-[#313948]"
                  >
                    Get free
                  </button>
                ) : canRent ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => openAction("buy")}
                      className="min-h-[4.6rem] w-full rounded-full bg-[#2a313d] px-8 py-4 text-[1.15rem] font-semibold text-white shadow-[0_14px_24px_rgba(31,37,48,0.18)] transition hover:bg-[#1f2530]"
                    >
                      Purchase
                    </button>
                    <button
                      type="button"
                      onClick={() => openAction("rent")}
                      className="min-h-[4.6rem] w-full rounded-full bg-[#687286] px-8 py-4 text-[1.15rem] font-semibold text-white shadow-[0_14px_24px_rgba(78,88,108,0.18)] transition hover:bg-[#586174]"
                    >
                      Rent
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAction("buy")}
                    className="min-h-[4.4rem] w-full rounded-full bg-[#1f2530] px-8 py-4 text-[1.15rem] font-semibold text-white shadow-[0_14px_24px_rgba(31,37,48,0.18)] transition hover:bg-[#313948]"
                  >
                    Buy
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Payment Modal */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          modalAction ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close payment popup"
          onClick={() => setModalAction(null)}
          className="absolute inset-0 bg-[#101521]/18 backdrop-blur-[4px]"
        />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className={`relative w-full max-w-2xl rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_28px_50px_rgba(15,23,42,0.2)] transition-all duration-300 ${
              modalAction ? "translate-y-0 scale-100" : "translate-y-5 scale-[0.98]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa2af]">
                  {modalAction === "rent"
                    ? "Rent confirmation — 30 days"
                    : modalAction === "buy"
                    ? "Purchase confirmation"
                    : "Claim free book"}
                </p>
                <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.06em] text-[#1f2530]">
                  {book.title}
                </h2>
                <p className="mt-1 text-[#748092]">Amount: {actionPrice}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="rounded-full border border-[#dce1ea] px-3 py-2 text-sm font-medium text-[#697385] transition hover:bg-[#f7f9fc]"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="space-y-4">
                {modalAction === "free" ? (
                  <p className="text-sm leading-6 text-[#556072]">
                    This book is free! Click confirm to add it to your library and start reading.
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#556072]">Payment method</p>
                      <div className="flex gap-3">
                        {(["aba", "bakong"] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                              paymentMethod === method
                                ? "bg-[#1f2530] text-white"
                                : "border border-[#dce1ea] bg-white text-[#5d6777]"
                            }`}
                          >
                            {method === "aba" ? "ABA QR" : "Bakong QR"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#556072]">
                        1. Scan the QR code and pay {actionPrice}
                      </p>
                      <p className="text-sm font-medium text-[#556072]">
                        2. Take a screenshot of the payment confirmation
                      </p>
                      <p className="text-sm font-medium text-[#556072]">
                        3. Upload the screenshot below
                      </p>
                    </div>

                    <label className="space-y-2">
                      <span className="text-sm font-medium text-[#556072]">Upload payment proof *</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setProofFile(file);
                          setProofFileName(file?.name);
                        }}
                        className="block w-full rounded-[1rem] border border-[#dde3ec] bg-white px-4 py-3 text-sm text-[#5d6777]"
                      />
                      {proofFileName && (
                        <p className="text-xs text-emerald-600">✅ {proofFileName} selected</p>
                      )}
                    </label>
                  </>
                )}

                {submitMessage && (
                  <div className="rounded-[1rem] border border-[#d8f0d1] bg-[#f6fff3] px-4 py-3 text-sm text-[#3d7f2f]">
                    {submitMessage}
                  </div>
                )}
                {submitError && (
                  <div className="rounded-[1rem] border border-[#fecaca] bg-[#fff5f5] px-4 py-3 text-sm text-[#991b1b]">
                    {submitError}
                  </div>
                )}
              </div>

              {/* QR Code panel */}
              <div className="rounded-[1.6rem] border border-[#e2e8f0] bg-[linear-gradient(180deg,#fbfcff_0%,#f6f8fc_100%)] p-4">
                <div className="text-sm font-semibold uppercase tracking-[0.08em] text-[#8c95a5]">
                  {modalAction === "free" ? "Ready to unlock" : paymentMethod === "aba" ? "ABA QR" : "Bakong QR"}
                </div>
                {modalAction !== "free" && (
                  <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-black/6 bg-white shadow-[0_12px_22px_rgba(15,23,42,0.06)]">
                    <Image
                      src={qrImageSrc}
                      alt="QR payment"
                      width={480}
                      height={480}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                )}
                <p className="mt-3 text-sm leading-6 text-[#6c7585]">
                  {modalAction === "free"
                    ? "This book is free. Confirm to add it to your library."
                    : "Scan this QR, complete the payment, upload the proof screenshot, and your access will unlock once the admin verifies it."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!paymentReady || submitting}
                className="rounded-full bg-[#1f2530] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#313948] disabled:cursor-not-allowed disabled:bg-[#b5bdca]"
              >
                {submitting ? "Submitting..." : modalAction === "free" ? "Get free now" : "Submit payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
