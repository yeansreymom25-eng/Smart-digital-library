"use client";

import type { ReaderContentPage } from "@/src/lib/readerBookContent";
import ReaderPage from "@/components/main/reader/ReaderPage";

export default function ReaderSpread({
  leftPage,
  rightPage,
  desktop,
  onPrevious,
  onNext,
}: {
  leftPage?: ReaderContentPage;
  rightPage?: ReaderContentPage;
  desktop: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="relative w-full">
      <div className={`flex w-full gap-3 lg:gap-0 ${desktop ? "flex-row" : "flex-col"}`}>
        <ReaderPage page={leftPage} side="left" />
        {desktop ? <ReaderPage page={rightPage} side="right" /> : null}
      </div>

      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous page"
        className="absolute inset-y-0 left-0 w-[20%] cursor-w-resize rounded-l-[2rem] focus:outline-none"
      />
      <button
        type="button"
        onClick={onNext}
        aria-label="Next page"
        className="absolute inset-y-0 right-0 w-[20%] cursor-e-resize rounded-r-[2rem] focus:outline-none"
      />
    </div>
  );
}
