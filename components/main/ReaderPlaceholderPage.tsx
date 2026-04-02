import type { ReactNode } from "react";

type ReaderPlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/70 bg-white/88 p-6 shadow-[0_18px_36px_rgba(15,23,42,0.08)] backdrop-blur">
      <h2 className="text-[1.1rem] font-semibold tracking-[-0.03em] text-[#1f2430]">{title}</h2>
      <p className="mt-2 text-[0.98rem] leading-7 text-[#667181]">{body}</p>
    </div>
  );
}

export default function ReaderPlaceholderPage({
  eyebrow,
  title,
  description,
  children,
}: ReaderPlaceholderPageProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fc_100%)] px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[96rem]">
        <section className="rounded-[2.5rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(244,247,252,0.92)_100%)] px-7 py-8 shadow-[0_24px_50px_rgba(15,23,42,0.1)] sm:px-10 sm:py-10">
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.26em] text-[#8b95a6]">{eyebrow}</p>
          <h1 className="mt-4 text-[2.4rem] font-semibold tracking-[-0.06em] text-[#1f2430] sm:text-[3.4rem]">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-[1.02rem] leading-8 text-[#677282] sm:text-[1.08rem]">
            {description}
          </p>
        </section>

        {children ? <div className="mt-8">{children}</div> : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <FeatureCard
            title="Beautiful reader layout"
            body="This page already uses the shared glass navigation layout, so you can keep adding shelves, cards, and detail views without rebuilding the header again."
          />
          <FeatureCard
            title="Reusable navigation"
            body="The top bar is now controlled in one layout file, with Home, Explore, My Library, and Discount ready to stay consistent across all reader pages."
          />
          <FeatureCard
            title="Profile overlay"
            body="The profile button opens a blurred account panel so the page behind stays visible but soft, just like the style from your screenshots."
          />
        </section>
      </div>
    </main>
  );
}
