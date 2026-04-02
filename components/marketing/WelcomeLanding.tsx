"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AUTH_ROUTES } from "@/src/lib/authFlow";

type SectionKey = "read" | "listen" | "explore";
type ScrollDirection = "up" | "down";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function stage(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start));
}

function getStageOpacity(
  progress: number,
  start: number,
  end: number,
  direction: ScrollDirection,
  fadeStart = 0.9,
  fadeOutLength = 0.22,
  fadeInLength = 0.44
) {
  const enter = easeInOutCubic(stage(progress, start, end));
  const exitLength = direction === "down" ? fadeOutLength : fadeInLength;
  const exit = easeInOutCubic(clamp((progress - fadeStart) / exitLength));
  return clamp(enter * (1 - exit));
}

function getStageStyle(
  progress: number,
  start: number,
  end: number,
  direction: ScrollDirection,
  distanceY = 40,
  distanceX = 0,
  scaleFrom = 0.94,
  fadeStart = 0.9,
  fadeOutLength = 0.22,
  fadeInLength = 0.44
): CSSProperties {
  const enter = easeInOutCubic(stage(progress, start, end));
  const opacity = getStageOpacity(
    progress,
    start,
    end,
    direction,
    fadeStart,
    fadeOutLength,
    fadeInLength
  );
  const exitLength = direction === "down" ? fadeOutLength : fadeInLength;
  const exit = easeInOutCubic(clamp((progress - fadeStart) / exitLength));
  const translateY = (1 - enter) * distanceY - exit * (direction === "down" ? 26 : 14);
  const translateX = (1 - enter) * distanceX;
  const scale = scaleFrom + enter * (1 - scaleFrom) - exit * 0.03;

  return {
    opacity,
    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
  };
}

function getNumberStyle(
  progress: number,
  start: number,
  end: number,
  direction: ScrollDirection,
  fadeStart = 0.985
) {
  const enter = easeInOutCubic(stage(progress, start, end));
  const exit = easeInOutCubic(clamp((progress - fadeStart) / (direction === "down" ? 0.22 : 0.44)));

  return {
    opacity: clamp(0.62 * enter * (1 - exit)),
    transform: `translate3d(-50%, ${92 - enter * 92 - exit * (direction === "down" ? 30 : 16)}px, 0) scale(${0.48 + enter * 0.52 - exit * 0.05})`,
    filter: `blur(${(1 - enter) * 10 + exit * (direction === "down" ? 2 : 1)}px)`,
  } satisfies CSSProperties;
}

function getHeaderPopStyle(
  progress: number,
  start: number,
  end: number,
  direction: ScrollDirection,
  fadeStart = 0.985
) {
  const enter = easeInOutCubic(stage(progress, start, end));
  const exit = easeInOutCubic(clamp((progress - fadeStart) / (direction === "down" ? 0.22 : 0.44)));

  return {
    opacity: clamp(enter * (1 - exit)),
    transform: `translate3d(0, ${88 - enter * 88 - exit * (direction === "down" ? 24 : 12)}px, 0) scale(${0.62 + enter * 0.38 - exit * 0.04})`,
    filter: `blur(${(1 - enter) * 12 + exit * (direction === "down" ? 2 : 1)}px)`,
  } satisfies CSSProperties;
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 5.25A2.25 2.25 0 017.25 3H19v15.5H7.25A2.25 2.25 0 005 20.75V5.25z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M19 3h.75A2.25 2.25 0 0122 5.25v13.25H7.25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeadphoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 12.75a7.5 7.5 0 1115 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="4" y="12" width="4" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="16" y="12" width="4" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="5.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SectionPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/84 px-4 py-2 text-sm font-medium text-zinc-700 shadow-[0_10px_26px_rgba(15,23,42,0.06)] backdrop-blur">
      <span className="text-zinc-500">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function Sparkle({ className }: { className: string }) {
  return (
    <div className={`absolute ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <path
          d="M50 6L60 40L94 50L60 60L50 94L40 60L6 50L40 40L50 6Z"
          fill="url(#sparkle-fill)"
        />
        <circle cx="50" cy="50" r="7" fill="white" fillOpacity="0.92" />
        <defs>
          <linearGradient id="sparkle-fill" x1="50" y1="6" x2="50" y2="94" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9BC0FF" />
            <stop offset="1" stopColor="#6A9AF6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function DeskPlant() {
  return (
    <div className="absolute bottom-[16%] left-[17%] z-20 w-[16%] min-w-[96px]">
      <div className="relative mx-auto h-24 w-24">
        <div className="absolute left-1/2 top-4 h-16 w-8 -translate-x-1/2 -rotate-[12deg] rounded-full bg-[linear-gradient(180deg,#5fb34f,#2d8a37)]" />
        <div className="absolute left-5 top-6 h-14 w-7 -rotate-[42deg] rounded-full bg-[linear-gradient(180deg,#78c45f,#3c9442)]" />
        <div className="absolute left-10 top-1 h-16 w-7 rotate-[14deg] rounded-full bg-[linear-gradient(180deg,#8cd166,#4aa34e)]" />
        <div className="absolute right-4 top-7 h-14 w-7 rotate-[34deg] rounded-full bg-[linear-gradient(180deg,#74bf61,#41994b)]" />
        <div className="absolute left-7 top-10 h-10 w-5 -rotate-[18deg] rounded-full bg-[linear-gradient(180deg,#69bb54,#2d8b39)]" />
        <div className="absolute right-7 top-10 h-10 w-5 rotate-[22deg] rounded-full bg-[linear-gradient(180deg,#6fbe58,#318d3c)]" />
      </div>
      <div className="mx-auto -mt-4 h-14 w-20 rounded-[1.5rem_1.5rem_1.15rem_1.15rem] bg-[linear-gradient(180deg,#ffffff,#d7d9df)] shadow-[0_16px_30px_rgba(15,23,42,0.14)]" />
      <div className="mx-auto -mt-2 h-5 w-24 rounded-full bg-[radial-gradient(circle,#dbe3f2_0%,transparent_75%)] opacity-70 blur-sm" />
    </div>
  );
}

function DeskMug() {
  return (
    <div className="absolute bottom-[16%] right-[16%] z-20">
      <div className="relative h-24 w-20 rounded-[1.5rem] bg-[linear-gradient(180deg,#ffffff,#e5e7ec)] shadow-[0_18px_34px_rgba(15,23,42,0.14)]">
        <div className="absolute left-2 right-2 top-2 h-4 rounded-full bg-[linear-gradient(180deg,#7d5329,#3c2411)] opacity-90" />
      </div>
      <div className="absolute right-[-16px] top-7 h-10 w-7 rounded-full border-[6px] border-[#d4d8e1] border-l-0" />
      <div className="mx-auto mt-1 h-4 w-24 rounded-full bg-[radial-gradient(circle,#dde4f2_0%,transparent_75%)] opacity-80 blur-sm" />
    </div>
  );
}

function DeskNotebook() {
  return (
    <div className="absolute bottom-[15%] right-[5%] z-10 w-[16%] min-w-[88px]">
      <div className="relative h-5 w-full rounded-[0.7rem] bg-white/95 shadow-[0_12px_24px_rgba(15,23,42,0.08)]" />
      <div className="relative -mt-2 ml-2 h-5 w-[94%] rounded-[0.7rem] bg-[#f6f7fb] shadow-[0_10px_20px_rgba(15,23,42,0.06)]" />
      <div className="absolute right-[18%] top-[-10px] h-[4px] w-[52%] rotate-[22deg] rounded-full bg-[linear-gradient(90deg,#d4d7e0,#7a838f)]" />
    </div>
  );
}

function DeskGlasses() {
  return (
    <svg
      className="absolute bottom-[19%] left-[8%] z-20 h-auto w-[12%] min-w-[86px] text-[#414b59]/72"
      viewBox="0 0 180 80"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="48" cy="42" rx="28" ry="20" stroke="currentColor" strokeWidth="6" />
      <ellipse cx="126" cy="42" rx="28" ry="20" stroke="currentColor" strokeWidth="6" />
      <path d="M76 42h22" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M19 46L5 58" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M154 46l18 12" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function MusicNote({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`absolute ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M39 10v26.5a8 8 0 11-4-6.93V18.2l18-4.2v17.5a8 8 0 11-4-6.93V10.95L39 13.2z"
        fill="currentColor"
      />
    </svg>
  );
}

function JoggerFigure() {
  return (
    <div className="absolute bottom-[4%] right-[1%] z-20 w-[18%] min-w-[132px]">
      <div className="absolute inset-x-[16%] bottom-[1%] h-6 rounded-full bg-[radial-gradient(circle,#dfe6f5_0%,transparent_72%)] blur-sm" />
      <Image
        src="/User_Image/Welcome_Page/Womanwithheadphone.png"
        alt="Woman listening with headphones"
        width={640}
        height={960}
        className="relative h-auto w-full object-contain drop-shadow-[0_24px_42px_rgba(15,23,42,0.16)]"
      />
    </div>
  );
}

export default function WelcomeLanding() {
  const readRef = useRef<HTMLElement | null>(null);
  const listenRef = useRef<HTMLElement | null>(null);
  const exploreRef = useRef<HTMLElement | null>(null);

  const [heroReady, setHeroReady] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("down");
  const [progress, setProgress] = useState<Record<SectionKey, number>>({
    read: 0,
    listen: 0,
    explore: 0,
  });

  useEffect(() => {
    const introFrame = window.requestAnimationFrame(() => setHeroReady(true));
    return () => window.cancelAnimationFrame(introFrame);
  }, []);

  useEffect(() => {
    let ticking = false;
    let lastScrollY = window.scrollY;

    const updateProgress = () => {
      const viewportHeight = window.innerHeight;
      const currentScrollY = window.scrollY;
      const enterOffset = viewportHeight * 0.06;

      const compute = (element: HTMLElement | null) => {
        if (!element) {
          return 0;
        }

        const rect = element.getBoundingClientRect();
        const total = rect.height - viewportHeight;

        if (total <= 0) {
          return rect.top <= enterOffset ? 1 : 0;
        }

        return clamp((enterOffset - rect.top) / (total + enterOffset));
      };

      setProgress({
        read: compute(readRef.current),
        listen: compute(listenRef.current),
        explore: compute(exploreRef.current),
      });

      setScrollDirection(currentScrollY < lastScrollY ? "up" : "down");
      setShowStickyCta(window.scrollY > viewportHeight * 0.18);
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateProgress);
    };

    updateProgress();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const readNumberStyle = getNumberStyle(progress.read, -0.02, 0.12, scrollDirection, 0.985);
  const readPillStyle = getStageStyle(progress.read, 0.01, 0.12, scrollDirection, 42, 0, 0.82, 0.98, 0.22, 0.48);
  const readTitleStyle = getHeaderPopStyle(progress.read, 0.08, 0.2, scrollDirection, 0.985);
  const readDescStyle = getStageStyle(progress.read, 0.16, 0.32, scrollDirection, 54, 0, 0.84, 0.988, 0.2, 0.46);
  const readMediaStyle = getStageStyle(progress.read, 0.28, 0.5, scrollDirection, 62, 0, 0.88, 0.992, 0.18, 0.42);
  const readWritingPhase = progress.read * Math.PI * 10;
  const readWritingSwingX = Math.sin(readWritingPhase) * 7;
  const readWritingSwingY = Math.cos(readWritingPhase * 0.85) * 5;
  const readWritingTilt = Math.sin(progress.read * Math.PI * 8) * 3.5;
  const readWritingStroke = clamp(stage(progress.read, 0.34, 0.58));
  const listenGlow = clamp(stage(progress.listen, 0.24, 0.56));

  const listenNumberStyle = getNumberStyle(progress.listen, -0.02, 0.12, scrollDirection, 0.985);
  const listenPillStyle = getStageStyle(progress.listen, 0.01, 0.12, scrollDirection, 42, 0, 0.82, 0.98, 0.22, 0.48);
  const listenTitleStyle = getHeaderPopStyle(progress.listen, 0.08, 0.2, scrollDirection, 0.985);
  const listenDescStyle = getStageStyle(progress.listen, 0.16, 0.32, scrollDirection, 54, 0, 0.84, 0.988, 0.2, 0.46);
  const listenMediaStyle = getStageStyle(progress.listen, 0.28, 0.5, scrollDirection, 62, 0, 0.88, 0.992, 0.18, 0.42);

  const exploreNumberStyle = getNumberStyle(progress.explore, -0.02, 0.12, scrollDirection, 0.985);
  const explorePillStyle = getStageStyle(progress.explore, 0.01, 0.12, scrollDirection, 42, 0, 0.82, 0.98, 0.22, 0.48);
  const exploreTitleStyle = getHeaderPopStyle(progress.explore, 0.08, 0.2, scrollDirection, 0.985);
  const exploreDescStyle = getStageStyle(progress.explore, 0.16, 0.32, scrollDirection, 54, 0, 0.84, 0.988, 0.2, 0.46);
  const exploreMediaStyle = getStageStyle(progress.explore, 0.28, 0.5, scrollDirection, 62, 0, 0.88, 0.992, 0.18, 0.42);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fcfcfa] text-zinc-950">
      <main>
        <section className="relative isolate min-h-[86vh] overflow-hidden px-5 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28 lg:px-12 lg:pb-10 lg:pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#dfe8fa_0%,transparent_28%),radial-gradient(circle_at_left_30%,#f3f7ff_0%,transparent_26%),linear-gradient(180deg,#fcfcfa_0%,#f8fbff_100%)]" />
          <div className="absolute -right-[9%] top-[6%] h-[270px] w-[270px] rounded-full bg-[#d9dde8] sm:h-[380px] sm:w-[380px] lg:h-[460px] lg:w-[460px]" />

          <div className="relative mx-auto grid min-h-[86vh] max-w-[84rem] items-center gap-8 lg:grid-cols-[minmax(0,0.98fr)_minmax(520px,760px)] lg:gap-14">
            <div className="max-w-2xl pt-10 sm:pt-16 lg:pt-0">
              <p
                className={`max-w-xl text-sm font-medium uppercase tracking-[0.24em] text-[#6f8bb8] transition-all duration-1000 ease-out ${
                  heroReady ? "translate-x-0 opacity-100" : "-translate-x-14 opacity-0"
                }`}
              >
                Read. Listen. Explore.
              </p>
              <h1
                className={`mt-5 max-w-4xl text-balance text-[clamp(2.5rem,5.8vw,5rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-zinc-950 transition-all duration-[1200ms] ease-out ${
                  heroReady ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
                }`}
              >
                Come for the stories. Stay for the knowledge. Where stories come alive.
              </h1>
              <p
                className={`mt-7 max-w-xl text-lg leading-8 text-zinc-600 transition-all delay-150 duration-[1200ms] ease-out ${
                  heroReady ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
              >
                Reading popular books, listening to audiobooks, and exploring podcasts
                to fuel your knowledge.
              </p>
            </div>

            <div
              className={`relative mx-auto w-full max-w-[720px] transition-all delay-200 duration-[1200ms] ease-out ${
                heroReady ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              <div className="absolute -right-10 top-1 h-[220px] w-[220px] rounded-full bg-[#d8dce6] sm:h-[320px] sm:w-[320px]" />
              <Image
                src="/User_Image/Welcome_Page/Collection.png"
                alt="Collection preview"
                width={1536}
                height={1024}
                className="relative z-10 ml-auto h-auto w-[108%] max-w-none object-contain drop-shadow-[0_30px_58px_rgba(15,23,42,0.18)] lg:w-[112%]"
                priority
              />
            </div>
          </div>
        </section>

        <section ref={readRef} className="relative h-[112vh] sm:h-[118vh]">
          <div className="sticky top-0 overflow-hidden px-5 py-1 sm:px-8 lg:h-screen lg:px-12 lg:py-2">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_right_top,#e7edf8_0%,transparent_32%),linear-gradient(180deg,#f6f9ff_0%,#ffffff_18%,#fffefb_70%,#fffaf0_100%)]"
              style={{ transform: `translate3d(0, ${progress.read * 36}px, 0)` }}
            />
            <div className="relative mx-auto flex h-full max-w-[86rem] items-start justify-center pt-5 sm:pt-6 lg:pt-8">
              <span
                className="pointer-events-none absolute left-1/2 top-[48%] z-0 -translate-y-1/2 text-[clamp(11rem,30vw,25rem)] font-semibold leading-none tracking-[-0.11em] text-[#dce5f7]"
                style={readNumberStyle}
              >
                1
              </span>

              <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-4 text-center lg:gap-5">
                <div style={readPillStyle}>
                  <SectionPill icon={<BookIcon />} label="Read" />
                </div>
                <div style={readTitleStyle}>
                  <h2 className="mt-4 text-[clamp(2.6rem,4.7vw,4.6rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-zinc-950">
                    1. Read
                  </h2>
                </div>

                <div style={readDescStyle} className="w-full max-w-2xl">
                  <div className="rounded-[2rem] border border-[#dbe5f8] bg-white/88 p-5 shadow-[0_22px_50px_rgba(15,23,42,0.06)] backdrop-blur">
                    <p className="text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
                      Dive deep into the world of knowledge. Our vast library of books
                      offers everything from personal development to fiction, keeping you
                      entertained while learning.
                    </p>
                  </div>
                </div>

                <div className="relative w-full max-w-[920px] lg:max-w-[980px]" style={readMediaStyle}>
                  <div className="absolute inset-x-[10%] top-[4%] h-[78%] rounded-t-[17rem] bg-[radial-gradient(circle_at_center_top,#f7faff_0%,#edf3ff_38%,#e3ecff_70%,#eef4ff_100%)]" />
                  <div className="absolute inset-x-[8%] bottom-[10%] h-[18%] rounded-[999px] bg-[radial-gradient(circle,#eff4ff_0%,#fbfdff_44%,transparent_78%)] blur-2xl" />
                  <div className="absolute inset-x-[9%] bottom-[8%] h-[22%] rounded-[999px] bg-[radial-gradient(circle,#ffffff_0%,#f7fbff_55%,transparent_88%)]" />
                  <div className="absolute left-[6%] top-[17%] h-32 w-32 rounded-full bg-[#dce9ff]/75 blur-3xl" />
                  <div className="absolute right-[8%] top-[12%] h-40 w-40 rounded-full bg-[#f2f6ff] blur-3xl" />
                  <div className="absolute bottom-[13%] left-[18%] h-[12%] w-[26%] rotate-[8deg] rounded-[1.4rem] bg-white/82 shadow-[0_16px_34px_rgba(15,23,42,0.05)]" />
                  <div className="absolute bottom-[11%] right-[11%] h-[11%] w-[22%] -rotate-[10deg] rounded-[1.25rem] bg-white/86 shadow-[0_16px_34px_rgba(15,23,42,0.05)]" />
                  <Sparkle className="left-[10%] top-[30%] h-7 w-7 opacity-90" />
                  <Sparkle className="left-[17%] top-[22%] h-5 w-5 opacity-80" />
                  <Sparkle className="left-[22%] top-[32%] h-4 w-4 opacity-70" />
                  <Sparkle className="left-[29%] top-[24%] h-3 w-3 opacity-60" />
                  <Sparkle className="right-[25%] top-[23%] h-5 w-5 opacity-80" />
                  <Sparkle className="right-[18%] top-[29%] h-7 w-7 opacity-90" />
                  <Sparkle className="right-[12%] top-[22%] h-4 w-4 opacity-75" />
                  <Sparkle className="right-[9%] top-[36%] h-3 w-3 opacity-60" />
                  <DeskPlant />
                  <DeskGlasses />
                  <DeskMug />
                  <DeskNotebook />
                  <Image
                    src="/User_Image/Welcome_Page/IPad.png"
                    alt="iPad for reading"
                    width={1536}
                    height={1024}
                    className="relative z-10 mx-auto h-auto w-[88%] -rotate-[10deg] object-contain drop-shadow-[0_46px_92px_rgba(15,23,42,0.24)] sm:w-[92%]"
                  />
                  <Image
                    src="/User_Image/Welcome_Page/ApplePencil.png"
                    alt="Apple Pencil"
                    width={633}
                    height={394}
                    className="absolute right-[8%] top-[35%] z-30 h-auto w-[28%] object-contain"
                    style={{
                      transform: `translate3d(${16 + progress.read * 12 + readWritingSwingX}px, ${-34 + readWritingSwingY}px, 0) rotate(${-19 + readWritingTilt}deg)`,
                    }}
                  />
                  <div
                    className="absolute left-[47%] top-[55.5%] z-20 h-[2px] rounded-full bg-[#bfd0fb]/95 blur-[0.5px]"
                    style={{
                      width: `${18 + readWritingStroke * 34}px`,
                      opacity: 0.18 + readWritingStroke * 0.72,
                      transform: `translate3d(${readWritingSwingX * 0.5}px, ${readWritingSwingY * 0.35}px, 0) rotate(-14deg)`,
                    }}
                  />
                  <div
                    className="absolute left-[49%] top-[57.1%] z-20 h-[2px] rounded-full bg-[#d6e2ff]/90 blur-[0.5px]"
                    style={{
                      width: `${10 + readWritingStroke * 22}px`,
                      opacity: 0.12 + readWritingStroke * 0.52,
                      transform: `translate3d(${4 + readWritingSwingX * 0.45}px, ${2 + readWritingSwingY * 0.3}px, 0) rotate(-11deg)`,
                    }}
                  />
                  <div
                    className="absolute left-[48%] top-[56%] z-20 h-3 w-24 rounded-full bg-[#cad8fb]/85 blur-[6px]"
                    style={{
                      opacity: clamp(stage(progress.read, 0.28, 0.52)),
                      transform: `translate3d(${progress.read * 14 + readWritingSwingX * 0.35}px, ${progress.read * -6 + readWritingSwingY * 0.25}px, 0) rotate(-16deg)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={listenRef} className="relative h-[112vh] sm:h-[118vh]">
          <div className="sticky top-0 overflow-hidden px-5 py-1 sm:px-8 lg:h-screen lg:px-12 lg:py-2">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_left_bottom,#fff0dc_0%,transparent_26%),linear-gradient(180deg,#fffaf0_0%,#fffdf9_18%,#ffffff_68%,#f9fcfa_100%)]"
              style={{ transform: `translate3d(0, ${progress.listen * 34}px, 0)` }}
            />
            <div className="relative mx-auto flex h-full max-w-[86rem] items-start justify-center pt-5 sm:pt-6 lg:pt-8">
              <span
                className="pointer-events-none absolute left-1/2 top-[48%] z-0 -translate-y-1/2 text-[clamp(11rem,30vw,25rem)] font-semibold leading-none tracking-[-0.11em] text-[#eadfce]"
                style={listenNumberStyle}
              >
                2
              </span>

              <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-4 text-center lg:gap-5">
                <div style={listenPillStyle}>
                  <SectionPill icon={<HeadphoneIcon />} label="Listen" />
                </div>
                <div style={listenTitleStyle}>
                  <h2 className="mt-4 text-[clamp(2.6rem,4.7vw,4.6rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-zinc-950">
                    2. Listen
                  </h2>
                </div>

                <div style={listenDescStyle} className="w-full max-w-2xl">
                  <div className="rounded-[2rem] border border-[#f0e2d0] bg-white/90 p-5 shadow-[0_22px_50px_rgba(15,23,42,0.06)] backdrop-blur">
                    <p className="text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
                      Take your learning with you, no matter where you go. With
                      audiobooks and podcasts, you can listen while commuting, working
                      out, or just relaxing.
                    </p>
                  </div>
                </div>

                <div
                  className="relative w-full max-w-[980px] h-[25rem] sm:h-[29rem] lg:h-[33rem]"
                  style={listenMediaStyle}
                >
                  <div className="absolute inset-x-[3%] bottom-[3%] top-[11%] rounded-[3.4rem] bg-[radial-gradient(circle_at_left_center,#dfe7ff_0%,transparent_26%),radial-gradient(circle_at_right_center,#ffe9c8_0%,transparent_24%),linear-gradient(135deg,#f8fbff_0%,#fff9f0_52%,#f9fbff_100%)] shadow-[0_26px_64px_rgba(15,23,42,0.08)]" />
                  <div className="absolute left-[4%] bottom-[12%] top-[18%] w-[22%] overflow-hidden rounded-[2.6rem] bg-[linear-gradient(180deg,#d8e1f5,#fefeff)] opacity-28 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.92)_34%,rgba(202,214,242,0.28)_100%)]" />
                    <div className="absolute left-[10%] top-[12%] h-[60%] w-[18%] rounded-[1rem] bg-white/72 blur-[1px]" />
                    <div className="absolute left-[34%] top-[8%] h-[64%] w-[18%] rounded-[1rem] bg-white/58 blur-[1px]" />
                    <div className="absolute left-[58%] top-[12%] h-[58%] w-[18%] rounded-[1rem] bg-white/66 blur-[1px]" />
                    <div
                      className="absolute inset-y-0 left-[-20%] w-[44%] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.32)_42%,transparent_100%)] blur-md"
                      style={{ transform: `translate3d(${22 + progress.listen * 30}px, 0, 0)` }}
                    />
                  </div>
                  <div
                    className="absolute right-[6%] top-[20%] h-[52%] w-[24%] rounded-full bg-[radial-gradient(circle,#ffd783_0%,#ffe9ba_28%,#fff4dd_52%,transparent_78%)] blur-xl"
                    style={{ opacity: 0.55 + listenGlow * 0.45 }}
                  />
                  <div className="absolute inset-x-[10%] bottom-[3%] h-[18%] rounded-[999px] bg-[radial-gradient(circle,#ffffff_0%,#f7fbff_52%,transparent_82%)]" />
                  <MusicNote className="left-[17%] top-[24%] h-7 w-7 text-[#b8b3ef] opacity-80" />
                  <MusicNote className="left-[24%] top-[36%] h-10 w-10 text-[#a9c1f8] opacity-75" />
                  <MusicNote className="left-[31%] bottom-[28%] h-7 w-7 text-[#8ab1ff] opacity-70" />
                  <MusicNote className="right-[25%] top-[30%] h-8 w-8 text-[#99c0ff] opacity-75" />
                  <MusicNote className="right-[18%] top-[40%] h-10 w-10 text-[#f7c38c] opacity-70" />
                  <MusicNote className="right-[9%] top-[26%] h-6 w-6 text-[#90b6ff] opacity-65" />
                  <Sparkle className="left-[8%] top-[18%] h-4 w-4 opacity-55" />
                  <Sparkle className="left-[12%] bottom-[16%] h-3 w-3 opacity-45" />
                  <Sparkle className="right-[22%] top-[18%] h-5 w-5 opacity-60" />
                  <Sparkle className="right-[14%] bottom-[20%] h-4 w-4 opacity-50" />
                  <JoggerFigure />
                  <div className="absolute bottom-[10%] left-[20%] h-[10%] w-[38%] rounded-[999px] bg-[radial-gradient(circle,#cfdcff_0%,transparent_74%)] blur-xl" />
                  <div className="absolute bottom-[11%] right-[11%] h-[11%] w-[24%] rounded-[999px] bg-[radial-gradient(circle,#ffe7bd_0%,transparent_76%)] blur-xl" />
                  <div className="absolute bottom-[9%] left-[44%] z-20 w-[64%] -translate-x-1/2 sm:left-[43%] sm:w-[66%]">
                    <Image
                      src="/User_Image/Welcome_Page/audiobook.png"
                      alt="Audiobook interface on tablet"
                      width={612}
                      height={408}
                      className="relative z-20 h-auto w-full object-contain drop-shadow-[0_34px_72px_rgba(15,23,42,0.18)]"
                    />
                  </div>
                  <div className="absolute right-[18%] top-[27%] z-30 h-[46%] w-[24%]">
                    <div className="absolute inset-[8%] rotate-[43deg] rounded-[2.8rem] border border-[#8fb4ff]/80 bg-white/26 shadow-[0_24px_60px_rgba(116,151,226,0.22)] backdrop-blur-sm" />
                    <div className="absolute inset-[2%] rotate-[43deg] rounded-[3rem] border border-white/70" />
                    <div className="absolute inset-[16%] rounded-full bg-[radial-gradient(circle,#eef4ff_0%,transparent_74%)] blur-xl" />
                    <Image
                      src="/User_Image/Welcome_Page/Earpod.png"
                      alt="Earbuds for listening"
                      width={500}
                      height={500}
                      className="absolute left-1/2 top-1/2 h-auto w-[98%] -translate-x-1/2 -translate-y-1/2 rotate-[8deg] object-contain drop-shadow-[0_26px_52px_rgba(15,23,42,0.16)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={exploreRef} className="relative h-[112vh] sm:h-[118vh]">
          <div className="sticky top-0 overflow-hidden px-5 py-1 sm:px-8 lg:h-screen lg:px-12 lg:py-2">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#eef5ef_0%,transparent_30%),linear-gradient(180deg,#f9fcfa_0%,#ffffff_18%,#ffffff_68%,#f3faf4_100%)]"
              style={{ transform: `translate3d(0, ${progress.explore * 38}px, 0)` }}
            />
            <div className="relative mx-auto flex h-full max-w-[86rem] items-start justify-center pt-5 sm:pt-6 lg:pt-8">
              <span
                className="pointer-events-none absolute left-1/2 top-[48%] z-0 -translate-y-1/2 text-[clamp(11rem,30vw,25rem)] font-semibold leading-none tracking-[-0.11em] text-[#dfe7e1]"
                style={exploreNumberStyle}
              >
                3
              </span>

              <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-4 text-center lg:gap-5">
                <div style={explorePillStyle}>
                  <SectionPill icon={<SearchIcon />} label="Explore" />
                </div>
                <div style={exploreTitleStyle}>
                  <h2 className="mt-4 text-[clamp(2.6rem,4.7vw,4.6rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-zinc-950">
                    3. Explore
                  </h2>
                </div>

                <div style={exploreDescStyle} className="relative w-full max-w-[78rem]">
                  <div className="absolute left-[0%] top-[6%] z-20 hidden rounded-full border border-[#e6ebf4] bg-white/88 px-6 py-3 text-[clamp(1rem,1.4vw,1.25rem)] font-medium text-[#8f97a8] shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur md:block">
                    Mystery
                  </div>
                  <div className="absolute left-[4%] top-[116%] z-20 hidden rounded-full border border-[#e6ebf4] bg-white/88 px-6 py-3 text-[clamp(1rem,1.4vw,1.25rem)] font-medium text-[#8f97a8] shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur md:block">
                    Fantasy
                  </div>
                  <div className="absolute right-[0%] top-[6%] z-20 hidden rounded-full border border-[#e6ebf4] bg-white/88 px-6 py-3 text-[clamp(1rem,1.4vw,1.25rem)] font-medium text-[#8f97a8] shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur md:block">
                    Self-improvement
                  </div>
                  <div className="absolute right-[4%] top-[116%] z-20 hidden rounded-full border border-[#e6ebf4] bg-white/88 px-6 py-3 text-[clamp(1rem,1.4vw,1.25rem)] font-medium text-[#8f97a8] shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur md:block">
                    Sci-Fi
                  </div>
                  <div className="relative z-10 mx-auto max-w-3xl rounded-[2rem] border border-[#dfe8df] bg-white/88 px-6 py-4 shadow-[0_22px_50px_rgba(15,23,42,0.06)] backdrop-blur sm:px-8 sm:py-5">
                    <p className="text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
                      Explore a wide range of genres. Our platform offers everything
                      from mystery to self-improvement, designed to expand your
                      knowledge and creativity.
                    </p>
                  </div>
                </div>

                <div className="relative h-[25rem] w-full max-w-[820px] lg:h-[28rem] lg:max-w-[860px]" style={exploreMediaStyle}>
                  <div className="absolute inset-x-[9%] top-[8%] bottom-[10%] rounded-[3rem] bg-[#f2f6f1]" />
                  <div className="absolute left-[8%] top-[18%] h-28 w-28 rounded-full bg-[#ebf5ec] blur-3xl" />
                  <div className="absolute right-[10%] top-[16%] h-32 w-32 rounded-full bg-[#fff3df] blur-3xl" />
                  <div className="absolute right-[10%] top-[14%] rounded-full bg-[#fff3df] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8f6b2b]">
                    New collections
                  </div>
                  <div className="absolute left-[8%] bottom-[12%] rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6f8472] shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
                    Discover more
                  </div>
                  <Image
                    src="/User_Image/Welcome_Page/BookCollection.png"
                    alt="Book collage"
                    width={408}
                    height={612}
                    className="absolute left-[43%] top-1/2 z-20 h-auto w-[44%] min-w-[220px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_30px_58px_rgba(15,23,42,0.2)] sm:w-[47%]"
                  />
                  <Image
                    src="/User_Image/Welcome_Page/Collection.png"
                    alt="Audio and book devices"
                    width={1536}
                    height={1024}
                    className="absolute bottom-[0%] right-[5%] z-10 h-auto w-[38%] object-contain opacity-92 sm:w-[40%]"
                    style={{ transform: `translate3d(0, ${progress.explore * 18}px, 0)` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex justify-center px-5 pb-6 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showStickyCta ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
      >
        <Link
          href={AUTH_ROUTES.signup}
          className="inline-flex h-14 items-center justify-center rounded-full bg-[#4f8ff0] px-8 text-base font-semibold text-white shadow-[0_22px_42px_rgba(79,143,240,0.28)] transition hover:bg-[#3e80e8] active:bg-[#2f6fd0]"
        >
          Try for Free
        </Link>
      </div>
    </div>
  );
}
