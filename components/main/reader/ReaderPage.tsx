"use client";

import type { ReaderContentPage } from "@/src/lib/readerBookContent";

export default function ReaderPage({
  page,
  side,
}: {
  page?: ReaderContentPage;
  side: "left" | "right";
}) {
  if (!page) {
    return (
      <div className="relative flex min-h-[26rem] flex-1 items-center justify-center overflow-hidden rounded-[1.9rem] border border-white/8 bg-[linear-gradient(180deg,#f9f5ee_0%,#f1ebe1_100%)] shadow-[0_28px_50px_rgba(0,0,0,0.22)] lg:min-h-[42rem]">
        <div className="absolute inset-y-0 left-0 w-[1px] bg-black/6" />
      </div>
    );
  }

  const paperClass =
    side === "left"
      ? "rounded-l-[2rem] rounded-r-[1.15rem]"
      : "rounded-r-[2rem] rounded-l-[1.15rem]";

  return (
    <article
      className={`relative flex min-h-[26rem] flex-1 flex-col overflow-hidden border border-[#e6dece] bg-[linear-gradient(180deg,#fffdf8_0%,#f6efe5_100%)] px-6 py-7 text-[#2b241d] shadow-[0_28px_50px_rgba(0,0,0,0.22)] lg:min-h-[42rem] lg:px-10 lg:py-9 ${paperClass}`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[1px] bg-black/5" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[1px] bg-black/5" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),transparent)]" />

      <div className="relative z-10 flex h-full flex-col">
        {page.eyebrow ? (
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#94826b] lg:text-[0.8rem]">
            {page.eyebrow}
          </div>
        ) : null}

        {page.heading ? (
          <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-[#241f1a] [font-family:'Iowan_Old_Style',Georgia,serif] lg:text-[2.35rem]">
            {page.heading}
          </h2>
        ) : null}

        <div className={`space-y-5 ${page.heading ? "mt-6" : "mt-3"} lg:space-y-6`}>
          {page.paragraphs.map((paragraph, index) => (
            <p
              key={`${page.number}-${index}`}
              className="text-[1rem] leading-8 text-[#41372c] [font-family:'Iowan_Old_Style',Georgia,serif] lg:text-[1.08rem] lg:leading-9"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-auto pt-8 text-right text-[0.82rem] font-medium tracking-[0.08em] text-[#9f8d77]">
          {page.number}
        </div>
      </div>
    </article>
  );
}
