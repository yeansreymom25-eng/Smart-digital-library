"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReaderToolbar from "@/components/main/reader/ReaderToolbar";
import ReaderSpread from "@/components/main/reader/ReaderSpread";
import type { ReaderBookDetail } from "@/src/lib/readerBookDetails";
import type { ReaderContentPage } from "@/src/lib/readerBookContent";

function useDesktopSpread() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return desktop;
}

export default function BookReader({
  book,
  pages,
  isUnlocked = false,
}: {
  book: ReaderBookDetail;
  pages: ReaderContentPage[];
  isUnlocked?: boolean;
}) {
  const router = useRouter();
  const immersiveRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const desktop = useDesktopSpread();

  const [fullscreen, setFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use isUnlocked prop from server — no more localStorage
  const unlocked = isUnlocked || book.access === "free";
  const hasPdf = typeof book.pdfUrl === "string" && book.pdfUrl.length > 0;
  const showPdfReader = unlocked && hasPdf;
  const pdfUrl = showPdfReader ? book.pdfUrl! : "";

  const visiblePages = useMemo(() => (unlocked ? pages : pages.slice(0, 2)), [pages, unlocked]);
  const step = desktop ? 2 : 1;
  const displayIndex = useMemo(() => {
    const aligned = desktop ? currentIndex - (currentIndex % 2) : currentIndex;
    const maxIndex = Math.max(0, visiblePages.length - step);
    return Math.min(aligned, maxIndex);
  }, [currentIndex, desktop, step, visiblePages.length]);

  const toggleFullscreen = async () => {
    if (!immersiveRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await immersiveRef.current.requestFullscreen();
  };

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setCurrentIndex((previous) => Math.min(previous + step, Math.max(0, visiblePages.length - step)));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setCurrentIndex((previous) => Math.max(previous - step, 0));
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void toggleFullscreen();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [step, visiblePages.length]);

  useEffect(() => {
    function syncFullscreen() {
      setFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  function goNext() {
    setCurrentIndex((previous) => Math.min(previous + step, Math.max(0, visiblePages.length - step)));
  }

  function goPrevious() {
    setCurrentIndex((previous) => Math.max(previous - step, 0));
  }

  const leftPage = visiblePages[displayIndex];
  const rightPage = desktop ? visiblePages[displayIndex + 1] : undefined;
  const pageLabel = showPdfReader
    ? "Full PDF"
    : desktop
      ? `Pages ${displayIndex + 1}-${Math.min(displayIndex + 2, visiblePages.length)} of ${visiblePages.length}`
      : `Page ${displayIndex + 1} of ${visiblePages.length}`;

  return (
    <div
      ref={immersiveRef}
      className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,69,92,0.3),transparent_24%),linear-gradient(180deg,#0e1118_0%,#121622_18%,#141a26_100%)] px-3 py-4 text-white sm:px-5 sm:py-5 lg:px-8 lg:py-8"
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current;
        const endX = event.changedTouches[0]?.clientX ?? null;
        if (startX === null || endX === null) return;
        const distance = endX - startX;
        if (distance <= -50) goNext();
        if (distance >= 50) goPrevious();
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[120rem] flex-col gap-5">
        <ReaderToolbar
          title={book.title}
          pageLabel={pageLabel}
          onBack={() => router.push(`/book/${book.slug ?? book.id}`)}
          onPrevious={goPrevious}
          onNext={goNext}
          onToggleFullscreen={() => void toggleFullscreen()}
          fullscreen={fullscreen}
          locked={!unlocked}
        />

        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          {!unlocked ? (
            <div className="w-full max-w-[76rem] rounded-[1.35rem] border border-[#ffd79d]/20 bg-[#151a25]/88 px-5 py-4 text-center shadow-[0_20px_40px_rgba(0,0,0,0.28)] backdrop-blur-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f1c77b]">
                Sample preview only
              </p>
              <p className="mt-2 text-[1rem] leading-7 text-white/72">
                This book is still locked. You can read the opening sample here, then continue to the detail page to buy, rent, or unlock full access inside the website.
              </p>
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push(`/book/${book.id}`)}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#141a26] transition hover:bg-[#eef2f8]"
                >
                  View unlock options
                </button>
              </div>
            </div>
          ) : null}

          {showPdfReader ? (
            <div className="w-full max-w-[90rem]">
              <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,20,28,0.95),rgba(12,14,20,0.88))] shadow-[0_28px_60px_rgba(0,0,0,0.38)]">
                <div className="flex flex-col gap-4 border-b border-white/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8fa7d6]">
                      Uploaded Book File
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
                      Reading the original PDF
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-white/65">
                      This book is using the PDF file uploaded by the library owner.
                    </p>
                  </div>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#141a26] transition hover:bg-[#eef2f8]"
                  >
                    Open in new tab
                  </a>
                </div>

                <div className="bg-[#0f1420] p-3 sm:p-4">
                  <iframe
                    src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                    title={`${book.title} PDF reader`}
                    className="h-[78vh] w-full rounded-[1.4rem] border border-white/10 bg-white"
                  />
                </div>
              </section>
            </div>
          ) : (
            <div className="w-full max-w-[76rem]">
              <ReaderSpread
                leftPage={leftPage}
                rightPage={rightPage}
                desktop={desktop}
                onPrevious={goPrevious}
                onNext={goNext}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
