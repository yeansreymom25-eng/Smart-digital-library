"use client";

function ReaderArrow({
  direction,
}: {
  direction: "left" | "right";
}) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M14.5 5.5L8 12l6.5 6.5" : "M9.5 5.5 16 12l-6.5 6.5"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FullscreenIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 3H3v5M21 8V3h-5M16 21h5v-5M3 16v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ReaderToolbar({
  title,
  pageLabel,
  onBack,
  onPrevious,
  onNext,
  onToggleFullscreen,
  fullscreen,
  locked,
}: {
  title: string;
  pageLabel: string;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFullscreen: () => void;
  fullscreen: boolean;
  locked: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 w-full rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,20,28,0.92),rgba(12,14,20,0.82))] px-4 py-3 shadow-[0_18px_42px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 text-sm font-semibold text-white transition hover:bg-white/12"
          >
            <ReaderArrow direction="left" />
            Back
          </button>
          <div>
            <div className="text-sm font-semibold tracking-[0.08em] text-white/55">
              {locked ? "Sample Reader" : "Reader"}
            </div>
            <div className="text-[1rem] font-semibold tracking-[-0.03em] text-white sm:text-[1.1rem]">
              {title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm font-semibold text-white/80">
            {pageLabel}
          </span>
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white/12"
            aria-label="Previous page"
          >
            <ReaderArrow direction="left" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white/12"
            aria-label="Next page"
          >
            <ReaderArrow direction="right" />
          </button>
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white/12"
            aria-label="Toggle fullscreen"
          >
            <FullscreenIcon active={fullscreen} />
          </button>
        </div>
      </div>
    </header>
  );
}
