const plans = [
  {
    name: "Normal",
    price: "$0",
    cadence: "/month",
    accent: "from-[#8bc3ff] to-[#4d8df4]",
    badge: "Current Plan",
    summary: "Basic admin setup for a small digital library",
    modules: ["Dashboard", "Books", "Categories", "Users", "Profile"],
    highlights: [
      "View total users, books, rentals, and purchases",
      "Add, edit, publish, or hide books",
      "Upload PDF files and cover images",
      "Set price, rental duration, and access type",
    ],
  },
  {
    name: "Pro",
    price: "$9.99",
    cadence: "/month",
    accent: "from-[#6abf7c] to-[#3f9f61]",
    badge: "Recommended",
    summary: "Adds payment verification and analytics for growing libraries",
    modules: [
      "Everything in Normal",
      "Transactions",
      "Analytics",
    ],
    highlights: [
      "View and filter rental and purchase payments",
      "Approve or reject payment proof",
      "Track pending, approved, and rejected statuses",
      "See revenue, user growth, and book popularity charts",
    ],
  },
  {
    name: "Premium",
    price: "$19.99",
    cadence: "/month",
    accent: "from-[#f0b654] to-[#df8244]",
    badge: "Advanced",
    summary: "Complete admin workspace with reports and subscription control",
    modules: [
      "Everything in Pro",
      "Reports",
      "Subscription",
    ],
    highlights: [
      "Generate revenue, sales, and user activity reports",
      "Export reports to PDF or Excel",
      "View billing history and plan expiration",
      "Manage upgrades inside the subscription module",
    ],
  },
];

const featureMatrix = [
  {
    feature: "Dashboard overview",
    normal: "Included",
    pro: "Included",
    premium: "Included",
  },
  {
    feature: "Book, category, and user management",
    normal: "Included",
    pro: "Included",
    premium: "Included",
  },
  {
    feature: "Transaction verification",
    normal: "Locked",
    pro: "Included",
    premium: "Included",
  },
  {
    feature: "Analytics and charts",
    normal: "Locked",
    pro: "Included",
    premium: "Included",
  },
  {
    feature: "Reports export",
    normal: "Locked",
    pro: "Basic",
    premium: "Advanced",
  },
  {
    feature: "Subscription billing history",
    normal: "Locked",
    pro: "Locked",
    premium: "Included",
  },
];

const workflow = [
  {
    step: "01",
    title: "Choose a plan",
    text: "Library owners start with Normal or upgrade to Pro or Premium depending on the modules they need.",
  },
  {
    step: "02",
    title: "Generate QR payment",
    text: "Paid plans create a QR payment request so the admin can complete subscription payment.",
  },
  {
    step: "03",
    title: "Upload payment proof",
    text: "The owner submits proof of payment for review and the system stores a pending status.",
  },
  {
    step: "04",
    title: "Activation after approval",
    text: "When payment is approved, the plan becomes active and the admin modules are unlocked.",
  },
];

const billingEvents = [
  {
    label: "Current status",
    value: "Active on Normal",
  },
  {
    label: "Upgrade target",
    value: "Pro plan",
  },
  {
    label: "Payment method",
    value: "QR verification",
  },
  {
    label: "Approval state",
    value: "Pending review",
  },
];

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="m12 2 2.1 5.4L20 9.5l-4.5 3.3 1.6 5.7L12 15.3 6.9 18.5l1.6-5.7L4 9.5l5.9-2.1L12 2Z" />
    </svg>
  );
}

function CheckDot() {
  return <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#35c759]" aria-hidden="true" />;
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.92),_rgba(255,255,255,0.98)_42%,_rgba(239,246,255,1)_100%)] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1320px] rounded-[32px] border border-[#d8e7ff] bg-white/60 shadow-[0_30px_90px_rgba(103,142,196,0.16)] backdrop-blur-sm">
        <header className="border-b border-white/70 px-6 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-15 w-15 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#4f8ef5,#97c2ff)] text-white shadow-[0_14px_30px_rgba(79,142,245,0.28)]">
                <SparkIcon />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#5f88b7]">
                  Smart Digital Library
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Admin Subscription Workspace
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Library owner view only. This screen covers the SaaS plan flow
                  from your SRS: plan selection, QR payment, proof upload,
                  approval status, and admin module access.
                </p>
              </div>
            </div>

            <div className="grid gap-3 rounded-[24px] border border-[#d6e7ff] bg-white/80 p-4 shadow-[0_16px_40px_rgba(125,156,203,0.12)] sm:grid-cols-2">
              {billingEvents.map((event) => (
                <div key={event.label} className="rounded-2xl bg-[#f2f7ff] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7391b8]">
                    {event.label}
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900">{event.value}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-10 lg:py-10">
          <div className="rounded-[28px] border border-[#d7e8ff] bg-[linear-gradient(135deg,rgba(244,249,255,0.95),rgba(255,255,255,0.92))] p-6 shadow-[0_20px_50px_rgba(126,163,214,0.12)] sm:p-8">
            <p className="inline-flex rounded-full border border-[#c4dbff] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#6288b6]">
              Library Owner Flow
            </p>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Subscribe to unlock the right admin modules for your library
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              The admin side of the Smart Digital Library is tier-based. Normal
              gives the core management tools. Pro unlocks transactions and
              analytics. Premium completes the system with reports and
              subscription billing controls.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] bg-[#eef5ff] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6c8db4]">
                  Current capability
                </p>
                <p className="mt-3 text-2xl font-black text-slate-950">5 modules</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Dashboard, books, categories, users, and profile are active.
                </p>
              </div>
              <div className="rounded-[22px] bg-[#eefbf1] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5f9e70]">
                  Next unlock
                </p>
                <p className="mt-3 text-2xl font-black text-slate-950">Transactions</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Upgrade to Pro to verify payments and manage proof approval.
                </p>
              </div>
              <div className="rounded-[22px] bg-[#fff5e8] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#be7c2f]">
                  Premium unlock
                </p>
                <p className="mt-3 text-2xl font-black text-slate-950">Reports</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Advanced exports, yearly reports, and subscription billing.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-[28px] border border-[#d7e8ff] bg-white/90 p-6 shadow-[0_20px_50px_rgba(126,163,214,0.12)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6288b6]">
              Payment Review
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              QR subscription activation
            </h2>

            <div className="mt-6 rounded-[24px] border border-dashed border-[#a7c9ff] bg-[#f2f8ff] p-5 text-center">
              <div className="mx-auto grid h-44 w-44 place-items-center rounded-[24px] bg-[linear-gradient(135deg,#ffffff,#dbeaff)] shadow-inner">
                <div className="grid grid-cols-6 gap-1">
                  {Array.from({ length: 36 }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-4 w-4 rounded-[3px] ${
                        index % 2 === 0 || index % 5 === 0
                          ? "bg-slate-900"
                          : "bg-white"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-800">
                Sample QR payment placeholder
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Your friend can connect the real payment source later. This UI
                already reflects the SRS flow for paid admin plans.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-[#eef5ff] px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Upload payment proof</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Receipt image or transfer screenshot for admin review.
                </p>
              </div>
              <div className="rounded-2xl bg-[#fff7ea] px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Status tracking</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Pending, approved, and rejected states are part of the admin
                  subscription module.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#4c92f2] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(76,146,242,0.26)] transition hover:bg-[#337de2]"
            >
              Upgrade to Pro
            </button>
          </aside>
        </section>

        <section className="px-6 pb-8 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-[#d7e8ff] bg-white/85 p-6 shadow-[0_20px_50px_rgba(126,163,214,0.12)] sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6288b6]">
                    Plan Comparison
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-slate-950">
                    Admin modules by subscription tier
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  Based only on the library owner requirements in your SRS.
                </p>
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-3">
                {plans.map((plan) => (
                  <article
                    key={plan.name}
                    className="flex flex-col rounded-[26px] border border-[#b8d5ff] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,248,255,0.92))] p-6 shadow-[0_16px_38px_rgba(138,171,217,0.16)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div
                          className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white ${plan.accent}`}
                        >
                          {plan.badge}
                        </div>
                        <h3 className="mt-4 text-3xl font-black text-slate-950">
                          {plan.name}
                        </h3>
                      </div>
                      <div className="rounded-full border border-[#bfe0a7] bg-[#d9ffbd] p-2 text-[#55a63d]">
                        <SparkIcon />
                      </div>
                    </div>

                    <div className="mt-5 flex items-end gap-1 border-b border-[#d8e6fb] pb-5">
                      <span className="text-[2rem] font-black leading-none text-slate-950">
                        {plan.price}
                      </span>
                      <span className="mb-1 text-xs font-semibold text-slate-500">
                        {plan.cadence}
                      </span>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-600">{plan.summary}</p>

                    <div className="mt-6 rounded-2xl bg-[#eef5ff] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6c8db4]">
                        Main modules
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {plan.modules.map((module) => (
                          <span
                            key={module}
                            className="rounded-full border border-[#c9dcfb] bg-white px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </div>

                    <ul className="mt-6 flex flex-1 flex-col gap-4 text-sm text-slate-700">
                      {plan.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckDot />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className="mt-8 rounded-2xl bg-[#4c92f2] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(76,146,242,0.22)] transition hover:bg-[#337de2]"
                    >
                      {plan.name === "Normal" ? "Current Plan" : `Choose ${plan.name}`}
                    </button>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <section className="rounded-[28px] border border-[#d7e8ff] bg-white/85 p-6 shadow-[0_20px_50px_rgba(126,163,214,0.12)] sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6288b6]">
                  Workflow
                </p>
                <h2 className="mt-3 text-2xl font-black text-slate-950">
                  Subscription lifecycle
                </h2>
                <div className="mt-6 space-y-4">
                  {workflow.map((item) => (
                    <div key={item.step} className="flex gap-4 rounded-2xl bg-[#f3f8ff] p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#4c92f2] text-sm font-bold text-white">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-[#d7e8ff] bg-white/85 p-6 shadow-[0_20px_50px_rgba(126,163,214,0.12)] sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6288b6]">
                  Access Matrix
                </p>
                <h2 className="mt-3 text-2xl font-black text-slate-950">
                  What each plan unlocks
                </h2>
                <div className="mt-6 space-y-3">
                  {featureMatrix.map((row) => (
                    <div key={row.feature} className="rounded-2xl bg-[#f4f8ff] p-4">
                      <p className="text-sm font-semibold text-slate-900">{row.feature}</p>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div className="rounded-xl bg-white px-3 py-2 text-slate-600">
                          <span className="block font-semibold text-slate-900">Normal</span>
                          {row.normal}
                        </div>
                        <div className="rounded-xl bg-white px-3 py-2 text-slate-600">
                          <span className="block font-semibold text-slate-900">Pro</span>
                          {row.pro}
                        </div>
                        <div className="rounded-xl bg-white px-3 py-2 text-slate-600">
                          <span className="block font-semibold text-slate-900">Premium</span>
                          {row.premium}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
