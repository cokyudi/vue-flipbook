"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import HTMLFlipBook from "react-pageflip";

const PAGES = Array.from({ length: 11 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { src: `/pages/${n}.jpg`, alt: `SUSU flash — page ${i + 1}` };
});

type Page = (typeof PAGES)[number];

type FlipApi = {
  flipNext: () => void;
  flipPrev: () => void;
  turnToPage: (page: number) => void;
};

const Sheet = forwardRef<
  HTMLDivElement,
  { page: Page; index: number }
>(function Sheet({ page, index }, ref) {
  // Stiff covers (first/last), soft bending paper for interior pages.
  const isCover = index === 0 || index === PAGES.length - 1;
  return (
    <div
      ref={ref}
      className="flip-page"
      data-density={isCover ? "hard" : "soft"}
    >
      <Image
        src={page.src}
        alt={page.alt}
        fill
        priority={index < 2}
        draggable={false}
        sizes="(max-width: 768px) 90vw, 45vw"
        className="object-cover select-none pointer-events-none"
      />
    </div>
  );
});

export default function FlipBook() {
  // react-pageflip's ref exposes pageFlip(); keep it loosely typed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    audioRef.current = new Audio("/pageturn.mp3");
    audioRef.current.volume = 0.5;
  }, []);

  const flip = useCallback((): FlipApi | null => {
    return bookRef.current?.pageFlip?.() ?? null;
  }, []);

  const playTurn = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    void a.play().catch(() => {});
  }, []);

  const next = useCallback(() => flip()?.flipNext(), [flip]);
  const prev = useCallback(() => flip()?.flipPrev(), [flip]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div
        className="w-full max-w-[680px]"
        style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.6))" }}
      >
        <HTMLFlipBook
          ref={bookRef}
          width={550}
          height={777}
          size="stretch"
          minWidth={300}
          maxWidth={620}
          minHeight={420}
          maxHeight={877}
          showCover
          drawShadow
          flippingTime={1000}
          maxShadowOpacity={0.5}
          usePortrait
          mobileScrollSupport
          startPage={0}
          className=""
          style={{}}
          startZIndex={0}
          autoSize
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          showPageCorners
          disableFlipByClick={false}
          onFlip={(e: { data: number }) => {
            setPage(e.data);
            playTurn();
          }}
        >
          {PAGES.map((p, i) => (
            <Sheet key={p.src} page={p} index={i} />
          ))}
        </HTMLFlipBook>
      </div>

      <div className="flex items-center gap-6 text-sepia">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous page"
          className="px-4 py-1 text-2xl leading-none transition-colors hover:text-bone disabled:opacity-30"
        >
          ‹
        </button>
        <span className="wordmark text-xs tracking-[0.3em] text-sepia/80">
          {String(page + 1).padStart(2, "0")} / {PAGES.length}
        </span>
        <button
          type="button"
          onClick={next}
          aria-label="Next page"
          className="px-4 py-1 text-2xl leading-none transition-colors hover:text-bone disabled:opacity-30"
        >
          ›
        </button>
      </div>
    </div>
  );
}
