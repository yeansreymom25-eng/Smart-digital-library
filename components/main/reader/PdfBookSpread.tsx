"use client";

import { useEffect, useRef, useState } from "react";
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from "pdfjs-dist/legacy/build/pdf.mjs";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function EmptyPdfPage({ side }: { side: "left" | "right" }) {
  const radiusClass =
    side === "left"
      ? "rounded-l-[2rem] rounded-r-[1.15rem]"
      : "rounded-r-[2rem] rounded-l-[1.15rem]";

  return (
    <div
      className={`relative flex min-h-[34rem] flex-1 items-center justify-center overflow-hidden border border-[#e6dece] bg-[linear-gradient(180deg,#fffdf8_0%,#f6efe5_100%)] shadow-[0_28px_50px_rgba(0,0,0,0.22)] ${radiusClass}`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[1px] bg-black/5" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[1px] bg-black/5" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),transparent)]" />
    </div>
  );
}

export default function PdfBookSpread({
  pdfUrl,
  currentPage,
  desktop,
  title,
  onPageCountChange,
}: {
  pdfUrl: string;
  currentPage: number;
  desktop: boolean;
  title: string;
  onPageCountChange?: (pageCount: number) => void;
}) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let active = true;

    async function loadPdf() {
      try {
        setLoading(true);
        setError(null);

        const task = getDocument({
          url: pdfUrl,
        });

        const doc = await task.promise;
        if (!active) {
          await doc.destroy();
          return;
        }

        setPdfDoc(doc);
        setPageCount(doc.numPages);
        onPageCountChange?.(doc.numPages);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setPdfDoc(null);
        setPageCount(0);
        onPageCountChange?.(0);
        setError(loadError instanceof Error ? loadError.message : "Could not load PDF preview.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPdf();

    return () => {
      active = false;
    };
  }, [onPageCountChange, pdfUrl]);

  useEffect(() => {
    if (!pdfDoc || !leftCanvasRef.current) {
      return;
    }

    let cancelled = false;
    const loadedPdf = pdfDoc;
    const leftCanvas = leftCanvasRef.current;

    async function renderPage(canvas: HTMLCanvasElement, pageNumber: number) {
      const page = await loadedPdf.getPage(pageNumber);
      const initialViewport = page.getViewport({ scale: 1 });
      const containerWidth = canvas.parentElement?.clientWidth ?? initialViewport.width;
      const outputScale = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: containerWidth / initialViewport.width });

      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      context.setTransform(outputScale, 0, 0, outputScale, 0, 0);
      context.clearRect(0, 0, viewport.width, viewport.height);

      await page.render({
        canvas,
        canvasContext: context,
        viewport,
      }).promise;
    }

    async function renderSpread() {
      const leftPage = Math.min(currentPage, loadedPdf.numPages);
      const rightPage = currentPage + 1;

      try {
        await renderPage(leftCanvas, leftPage);

        if (desktop && rightCanvasRef.current && rightPage <= loadedPdf.numPages) {
          await renderPage(rightCanvasRef.current, rightPage);
        }
      } catch (renderError) {
        if (!cancelled) {
          setError(renderError instanceof Error ? renderError.message : "Could not render PDF spread.");
        }
      }
    }

    void renderSpread();

    return () => {
      cancelled = true;
    };
  }, [currentPage, desktop, pdfDoc]);

  const rightPageVisible = desktop && currentPage + 1 <= pageCount;

  if (loading) {
    return (
      <div className="flex min-h-[72vh] items-center justify-center rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,20,30,0.9),rgba(12,14,20,0.82))] text-white/70">
        Loading book spread...
      </div>
    );
  }

  if (error || !pdfDoc) {
    return (
      <div className="flex min-h-[72vh] items-center justify-center rounded-[1.8rem] border border-[#ffdbdb]/20 bg-[#1a1114] px-6 text-center text-[#ffb7b7]">
        {error ?? "Could not load PDF preview for this book."}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className={`flex w-full gap-3 lg:gap-0 ${desktop ? "flex-row" : "flex-col"}`}>
        <article className="relative flex min-h-[34rem] flex-1 items-center justify-center overflow-hidden rounded-l-[2rem] rounded-r-[1.15rem] border border-[#e6dece] bg-[linear-gradient(180deg,#fffdf8_0%,#f6efe5_100%)] px-4 py-5 shadow-[0_28px_50px_rgba(0,0,0,0.22)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[1px] bg-black/5" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[1px] bg-black/5" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),transparent)]" />
          <canvas ref={leftCanvasRef} aria-label={`${title} page ${Math.min(currentPage, pageCount)}`} className="block max-h-[78vh] max-w-full rounded-[0.6rem]" />
        </article>

        {desktop ? (
          rightPageVisible ? (
            <article className="relative flex min-h-[34rem] flex-1 items-center justify-center overflow-hidden rounded-r-[2rem] rounded-l-[1.15rem] border border-[#e6dece] bg-[linear-gradient(180deg,#fffdf8_0%,#f6efe5_100%)] px-4 py-5 shadow-[0_28px_50px_rgba(0,0,0,0.22)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[1px] bg-black/5" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[1px] bg-black/5" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),transparent)]" />
              <canvas ref={rightCanvasRef} aria-label={`${title} page ${Math.min(currentPage + 1, pageCount)}`} className="block max-h-[78vh] max-w-full rounded-[0.6rem]" />
            </article>
          ) : (
            <EmptyPdfPage side="right" />
          )
        ) : null}
      </div>
    </div>
  );
}
