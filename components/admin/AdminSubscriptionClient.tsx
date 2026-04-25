"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { AdminPlanName, AdminSubscription } from "@/src/lib/adminSubscription";
import { getSupabaseBrowserClient } from "@/src/lib/supabaseBrowser";

type Plan = {
  name: "Normal" | "Premium" | "Pro";
  price: string;
  period: string;
  subtitle: string;
  label: string;
  icon: "spark" | "crown" | "bolt";
  iconTone: "lime" | "amber" | "sky";
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Normal", price: "$0", period: "/month",
    subtitle: "Basic features for small libraries", label: "Basic features",
    icon: "spark", iconTone: "lime",
    features: ["Dashboard with basic stats", "Up to 20 books", "User management", "Book management", "Category management", "Basic support"],
  },
  {
    name: "Pro", price: "$9.99", period: "/month",
    subtitle: "Advanced features for growing libraries", label: "Advanced features",
    icon: "bolt", iconTone: "sky",
    features: ["All Normal features", "Up to 50 books", "Transaction management", "Payment verification", "Analytics & charts", "Priority support", "Export reports"],
  },
  {
    name: "Premium", price: "$19.99", period: "/month",
    subtitle: "Complete solution for professional libraries", label: "Complete features",
    icon: "crown", iconTone: "amber",
    features: ["All Pro features", "Unlimited books", "Advanced analytics", "Detailed reporting", "Custom reports", "API access", "24/7 support", "White-label option"],
  },
];

const notes = [
  { title: "For library owners", text: "Choose one plan before continuing to your admin dashboard." },
  { title: "Paid plans", text: "Pro and Premium will continue to QR payment and proof upload after selection." },
  { title: "Activation", text: "Your selected features become available once the plan is confirmed." },
];

const planRank: Record<Plan["name"], number> = {
  Normal: 1,
  Pro: 2,
  Premium: 3,
};

function getPlanActionLabel(plan: Plan, activePlan: Plan["name"] | null, isSelected: boolean) {
  if (activePlan === plan.name) return "Current Plan";
  if (isSelected) return "Selected";
  if (!activePlan) return "Choose Plan";
  return planRank[plan.name] > planRank[activePlan]
    ? `Upgrade to ${plan.name}`
    : `Switch to ${plan.name}`;
}

function PlanIcon({ kind, tone }: { kind: "spark" | "crown" | "bolt"; tone: "lime" | "amber" | "sky" }) {
  const toneClasses = tone === "amber" ? "border-[#d1b4ff] bg-[#f1e7ff] text-[#8a43d6]"
    : tone === "sky" ? "border-[#8bc7ff] bg-[#daf0ff] text-[#3490dc]"
    : "border-[#8de26a] bg-[#cfffaa] text-[#6cbc41]";

  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_8px_18px_rgba(108,188,65,0.14)] ${toneClasses}`}>
      {kind === "crown" ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M4 18h16l-1.5-9-4.6 4.2L12 6 10.1 13.2 5.5 9 4 18Z" /></svg>
      ) : kind === "bolt" ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="m12 2.7 2.3 4.7 5.2.76-3.76 3.66.89 5.18L12 14.62l-4.63 2.38.88-5.18-3.76-3.66 5.2-.76L12 2.7Z" /></svg>
      )}
    </div>
  );
}

export default function AdminSubscriptionClient({
  userId,
  initialSubscription,
  isOnboarding,
}: {
  userId: string;
  initialSubscription: AdminSubscription;
  isOnboarding: boolean;
}) {
  const router = useRouter();
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(
    () => initialSubscription.plan ? plans.find((p) => p.name === initialSubscription.plan) ?? null : null
  );
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofFileName, setProofFileName] = useState(initialSubscription.proofFileName);
  const [paymentReference, setPaymentReference] = useState(initialSubscription.paymentReference);
  const [paymentNote, setPaymentNote] = useState(initialSubscription.paymentNote);
  const [paymentSubmitted, setPaymentSubmitted] = useState(initialSubscription.status === "pending");
  const [subscriptionStatus, setSubscriptionStatus] = useState(initialSubscription.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const paymentSectionRef = useRef<HTMLDivElement | null>(null);
  const currentPlan = initialSubscription.plan;
  const activePlan =
    initialSubscription.status === "active"
      ? currentPlan
      : currentPlan && initialSubscription.status !== "not_selected"
        ? "Normal"
        : null;
  const hasExistingPlan = Boolean(activePlan);
  const isCurrentPlanSelected = selectedPlan?.name === activePlan;
  const pageEyebrow = isOnboarding ? "Library Owner Onboarding" : "Subscription";
  const pageTitle = isOnboarding
    ? "Subscribe to Manage Your Digital Library"
    : "Manage Your Library Plan";
  const pageDescription = isOnboarding
    ? "Choose the perfect plan to access powerful features for managing your smart digital library"
    : "Review your current plan, compare available features, and submit an upgrade request when your library is ready.";

  const statusCopy =
    subscriptionStatus === "active"
      ? {
          badge: "Active plan",
          tone: "border-[#9fe0b2] bg-[#edf9f0] text-[#2f7d42]",
          body: activePlan
            ? `Your current subscription is ${activePlan} Plan. You can keep it or choose another plan below to submit a change.`
            : "Your subscription is active.",
        }
      : subscriptionStatus === "pending"
        ? {
            badge: "Pending review",
            tone: "border-[#bfd8ff] bg-[#f2f7ff] text-[#2456b6]",
            body: currentPlan
              ? `Your ${currentPlan} Plan request is waiting for approval. Your current usable plan remains ${activePlan ?? "Normal"} Plan until approval.`
              : "Your subscription request is waiting for approval.",
          }
        : subscriptionStatus === "rejected"
          ? {
              badge: "Needs update",
              tone: "border-[#ffd2d2] bg-[#fff4f4] text-[#c93d3d]",
              body: "Your last subscription request was rejected. Please choose a plan and submit it again following the payment rules below.",
            }
          : {
              badge: "No active plan",
              tone: "border-[#d8e6fb] bg-[#f7fbff] text-[#4d6691]",
              body: "Choose a plan below to continue. Paid plans still require QR payment and proof upload.",
            };

  function handleChoosePlan(plan: Plan) {
    setSelectedPlan(plan);
    setPaymentSubmitted(initialSubscription.status === "pending" && initialSubscription.plan === plan.name);
    setSubscriptionStatus(initialSubscription.plan === plan.name ? initialSubscription.status : "not_selected");
    setUploadError(null);
    if (plan.name !== "Normal") {
      requestAnimationFrame(() => {
        paymentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  async function handleContinueNormalPlan() {
    if (!selectedPlan || !userId) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: "Normal", status: "active" }),
      });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Unable to update subscription.");
      }
      router.push("/library-owner/dashboard");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Unable to update subscription.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmitProof() {
    if (!selectedPlan || selectedPlan.name === "Normal" || !proofFile || !userId) return;
    setIsSubmitting(true);
    setUploadError(null);

    try {
      // Upload proof file to Supabase Storage
      const supabase = getSupabaseBrowserClient();
      let uploadedProofUrl = proofFileName; // fallback to filename

      if (supabase && proofFile) {
        const fileExt = proofFile.name.split(".").pop() ?? "jpg";
        const filePath = `subscription-proofs/${userId}/${Date.now()}.${fileExt}`;

        const { error: storageError } = await supabase.storage
          .from("proofs")
          .upload(filePath, proofFile, { upsert: true });

        if (storageError) {
          // If storage fails, just use the filename as reference
          console.warn("Storage upload failed, using filename as reference:", storageError.message);
          uploadedProofUrl = proofFile.name;
        } else {
          const { data: urlData } = supabase.storage
            .from("proofs")
            .getPublicUrl(filePath);
          uploadedProofUrl = urlData.publicUrl;
        }
      }

      const response = await fetch("/api/admin/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          plan: selectedPlan.name,
          status: "pending",
          proofFileName: uploadedProofUrl,
          paymentReference: paymentReference.trim(),
          paymentNote: paymentNote.trim(),
        }),
      });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "Unable to submit payment proof.");
      }
      setSubscriptionStatus("pending");
      setPaymentSubmitted(true);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className={`${isOnboarding ? "min-h-screen rounded-none border-0 bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.94),_rgba(255,255,255,0.98)_52%,_rgba(248,250,255,1)_100%)] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6" : "w-full"} w-full`}>
        <div className={isOnboarding ? "min-h-[calc(100vh-2rem)] rounded-none border-0 bg-white/18 px-4 py-4 sm:px-6 lg:px-8" : "w-full"}>
          {isOnboarding ? (
            <header className="flex flex-col gap-5 border-b border-[#b4d1ff] pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border-2 border-[#7db5ff] bg-[linear-gradient(135deg,#4f8ef5,#98c5ff)] shadow-[0_14px_28px_rgba(79,142,245,0.18)]">
                  <div className="grid grid-cols-3 gap-[2px]">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${i % 2 === 0 ? "bg-white" : "bg-[#dff0ff]"}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-black leading-none text-slate-950">Smart Digital</p>
                  <p className="text-sm font-black leading-none text-slate-950">Library</p>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-[#d7ccc0] bg-[#eae4dc]/80 p-2 shadow-[0_12px_24px_rgba(178,169,160,0.1)]">
                <div className="grid grid-cols-3 gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                  <Link href="/" className="rounded-xl bg-[#dbd4cb] px-5 py-3 text-center text-slate-700 transition hover:bg-[#d2cbc2]">Home</Link>
                  <Link href="/Log_in" className="rounded-xl px-5 py-3 text-center transition hover:bg-white/45 hover:text-slate-700">Login</Link>
                  <Link href="/Sign_up" className="rounded-xl px-5 py-3 text-center transition hover:bg-white/45 hover:text-slate-700">Sign-up</Link>
                </div>
              </div>
            </header>
          ) : null}

          <div className={isOnboarding ? "px-2 py-12 sm:px-4 sm:py-16 lg:px-8" : "py-0"}>
            <div className="mx-auto max-w-4xl text-center">
              <p className="inline-flex rounded-full border border-[#c9dbfb] bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6789b0]">
                {pageEyebrow}
              </p>
              <h1 className="mt-6 text-[2.5rem] font-bold leading-none text-[#173b73]">{pageTitle}</h1>
              <p className="mx-auto mt-2 max-w-3xl text-base leading-7 text-[#4d6691]">{pageDescription}</p>
            </div>

            <div className="mx-auto mt-14 grid w-full max-w-[1280px] gap-8 xl:grid-cols-3 xl:items-start">
              {plans.map((plan) => (
                <article key={plan.name}
                  className={`flex h-full flex-col rounded-[24px] border-2 bg-white/94 shadow-[0_16px_38px_rgba(138,171,217,0.12)] transition ${selectedPlan?.name === plan.name ? "border-[#3f8df2] ring-2 ring-[#dbeaff]" : "border-[#5fa1ff]"}`}>
                  <div className="flex items-start justify-between gap-4 px-5 pt-5">
                    <PlanIcon kind={plan.icon} tone={plan.iconTone} />
                    <div className="flex-1 text-center">
                      <h2 className="text-[1.8rem] font-black leading-none text-slate-950">{plan.name}</h2>
                      <p className="mt-2 text-[11px] text-slate-400">{plan.subtitle}</p>
                    </div>
                    <div className="w-10" />
                  </div>
                  <div className="mt-4 px-5 py-4 text-center">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-[2rem] font-medium leading-none text-slate-950">{plan.price}</span>
                      <span className="mb-1 text-[11px] font-semibold text-slate-500">{plan.period}</span>
                    </div>
                  </div>
                  <div className="px-5 pt-6">
                    <div className="rounded-[4px] border-2 border-[#67a4f6] bg-[#d9e8ff] px-4 py-2 text-center text-xs font-medium text-[#5f82aa]">{plan.label}</div>
                  </div>
                  <ul className="flex flex-1 flex-col gap-4 px-5 pb-8 pt-6 text-sm text-slate-700">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="mt-[6px] h-2.5 w-2.5 rounded-full bg-[#36cb58]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="px-5 pb-6">
                    <button type="button" onClick={() => handleChoosePlan(plan)}
                      className={`mx-auto block w-full max-w-[160px] rounded-md px-5 py-2 text-sm font-semibold text-white transition ${selectedPlan?.name === plan.name ? "bg-[#255fb4] hover:bg-[#1f549f]" : "bg-[#4794f1] hover:bg-[#327fe0]"}`}>
                      {getPlanActionLabel(plan, activePlan, selectedPlan?.name === plan.name)}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className={`mx-auto mt-8 w-full max-w-[1280px] rounded-[24px] border-2 px-5 py-5 shadow-[0_12px_28px_rgba(135,164,206,0.08)] ${statusCopy.tone}`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">{statusCopy.badge}</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    {activePlan ? `${activePlan} Plan` : "Choose your first plan"}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{statusCopy.body}</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700">
                  <p>
                    Status: <span className="font-semibold capitalize">{subscriptionStatus.replace("_", " ")}</span>
                  </p>
                  {initialSubscription.updatedAt ? (
                    <p className="mt-1 text-xs text-slate-500">Last updated: {new Date(initialSubscription.updatedAt).toLocaleString()}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-10 grid w-full max-w-[1280px] gap-4 md:grid-cols-3">
              {notes.map((note) => (
                <article key={note.title} className="rounded-[20px] border-2 border-[#9fc6ff] bg-white/78 px-5 py-4 shadow-[0_10px_28px_rgba(135,164,206,0.08)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">{note.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{note.text}</p>
                </article>
              ))}
            </div>

            {selectedPlan ? (
              <div ref={paymentSectionRef} className="mx-auto mt-8 w-full max-w-[1280px] rounded-[24px] border-2 border-[#9fc6ff] bg-white/88 p-5 shadow-[0_12px_28px_rgba(135,164,206,0.08)] sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">Selected plan</p>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">{selectedPlan.name} plan</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {selectedPlan.name === "Normal"
                        ? hasExistingPlan && !isCurrentPlanSelected
                          ? "Switching to the Normal plan will apply directly because it does not require payment proof."
                          : "You can continue directly because the Normal plan does not require payment proof."
                        : hasExistingPlan && !isCurrentPlanSelected
                          ? `You are preparing to change from ${activePlan ?? "Normal"} to ${selectedPlan.name}. This paid plan still requires QR payment and proof upload before the change can be activated.`
                          : "This paid plan requires QR payment and proof upload before advanced features are activated."}
                    </p>
                  </div>
                  <div className="rounded-2xl border-2 border-[#9fc6ff] bg-[#eef5ff] px-4 py-3 sm:min-w-[180px]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">Plan total</p>
                    <p className="mt-2 text-lg font-black text-slate-950">{selectedPlan.price}<span className="ml-1 text-xs font-semibold text-slate-500">{selectedPlan.period}</span></p>
                  </div>
                </div>

                {selectedPlan.name === "Normal" ? (
                  <div className="mt-6 rounded-[20px] border-2 border-[#a8ccff] bg-[#f7fbff] p-5">
                    <p className="text-sm font-semibold text-slate-900">Next step</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {hasExistingPlan && !isCurrentPlanSelected
                        ? "After selecting the Normal plan, continue to save this plan change immediately."
                        : "After selecting the Normal plan, continue directly to the admin dashboard."}
                    </p>
                    <button type="button" onClick={() => void handleContinueNormalPlan()} disabled={isSubmitting}
                      className="mt-4 rounded-xl bg-[#4794f1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#327fe0] disabled:opacity-50">
                      {isSubmitting ? "Saving..." : hasExistingPlan && !isCurrentPlanSelected ? "Update to Normal Plan" : "Continue to Dashboard"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
                    <div className="rounded-[20px] border-2 border-[#a8ccff] bg-[#f7fbff] p-4 text-center">
                      <button type="button" onClick={() => setIsQrOpen(true)} className="mx-auto rounded-[18px] border-2 border-[#b8d6ff] bg-white p-3 transition hover:scale-[1.02]">
                        <Image src="/User_Image/Library%20owner_image/QR.jpg" alt="QR payment" width={150} height={150} className="h-[150px] w-[150px] rounded-[14px] object-cover" />
                      </button>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">Scan to pay</p>
                    </div>

                    <div className="rounded-[20px] border-2 border-[#a8ccff] bg-[#f7fbff] p-4 sm:p-5">
                      <p className="text-sm font-semibold text-slate-900">Upload payment proof</p>
                      <div className="mt-4 grid gap-4">
                        <label className="block">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8db5]">Payment proof</span>
                          <input type="file" accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              setProofFile(file);
                              setProofFileName(file?.name ?? "");
                              setUploadError(null);
                            }}
                            className="block w-full rounded-xl border-2 border-[#b3d2ff] bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#e8f1ff] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#316dbf]" />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8db5]">Transaction ID</span>
                          <input type="text" value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)}
                            placeholder="Optional payment reference"
                            className="w-full rounded-xl border-2 border-[#b3d2ff] bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8db5]">Note</span>
                          <textarea value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)}
                            placeholder="Optional note for review" rows={4}
                            className="w-full rounded-xl border-2 border-[#b3d2ff] bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                        </label>
                      </div>

                      <div className="mt-4 rounded-xl border-2 border-[#bfd8ff] bg-white px-4 py-3 text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">Selected file:</span> {proofFileName || "No file chosen yet"}
                      </div>

                      {paymentSubmitted ? (
                        <div className="mt-4 rounded-xl border-2 border-[#8fd5a0] bg-[#edf9f0] px-4 py-4">
                          <p className="text-sm font-semibold text-[#2f7d42]">Payment proof submitted successfully</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">Status: <span className="font-semibold">Pending review</span>. Please wait for approval.</p>
                        </div>
                      ) : null}

                      {uploadError && (
                        <div className="mt-4 rounded-xl border-2 border-[#fca5a5] bg-[#fff5f5] px-4 py-3">
                          <p className="text-sm font-semibold text-[#c93d3d]">Upload error</p>
                          <p className="mt-1 text-sm text-[#e08080]">{uploadError}</p>
                        </div>
                      )}

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button type="button" onClick={() => void handleSubmitProof()} disabled={!proofFile || isSubmitting}
                          className="rounded-xl bg-[#4794f1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#327fe0] disabled:cursor-not-allowed disabled:opacity-50">
                          {isSubmitting ? "Uploading & Submitting..." : hasExistingPlan && !isCurrentPlanSelected ? "Submit Plan Change" : "Submit Payment Proof"}
                        </button>
                        {paymentSubmitted ? (
                          <button type="button" onClick={() => router.push("/library-owner/transactions")}
                            className="rounded-xl bg-[#255fb4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f549f]">
                            View Pending Review
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {isQrOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-[2px]">
          <div className="relative w-full max-w-[560px] rounded-[28px] border-2 border-[#a8ccff] bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.28)] sm:p-6">
            <button type="button" onClick={() => setIsQrOpen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#bfd8ff] bg-[#eef5ff] text-lg font-semibold text-slate-700 transition hover:bg-[#dce9ff]">
              x
            </button>
            <p className="pr-12 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6a8db5]">QR payment preview</p>
            <h2 className="mt-2 pr-12 text-2xl font-black text-slate-950">Subscription payment QR</h2>
            <div className="mt-5 rounded-[24px] border-2 border-[#b8d6ff] bg-[#f6faff] p-5">
              <Image src="/User_Image/Library%20owner_image/QR.jpg" alt="Large QR" width={480} height={480} className="mx-auto h-auto w-full max-w-[420px] rounded-[18px] object-contain" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
