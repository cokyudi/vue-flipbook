"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

const FlipBook = dynamic(() => import("./FlipBook"), {
  ssr: false,
  loading: () => (
    <p className="wordmark text-xs tracking-[0.3em] text-sepia/60">
      loading the book…
    </p>
  ),
});

export default function BookExperience() {
  const [open, setOpen] = useState(false);

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-4 py-10">
      {open ? (
        <FlipBook />
      ) : (
        <section className="flex flex-col items-center text-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open the flash book"
            className="group relative w-[230px] overflow-hidden rounded-sm ring-1 ring-bone/10 transition-transform duration-500 hover:-translate-y-1 sm:w-[260px]"
            style={{ filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.6))" }}
          >
            <Image
              src="/pages/01.jpg"
              alt="SUSU flash book cover"
              width={330}
              height={467}
              priority
              className="h-auto w-full"
            />
            <span className="pointer-events-none absolute inset-0 bg-oxblood/0 transition-colors duration-500 group-hover:bg-oxblood/10" />
          </button>

          <h1 className="wordmark mt-10 text-4xl text-bone sm:text-5xl">
            SUSU
          </h1>
          <div className="hairline mt-4 h-px w-40 opacity-60" />
          <p className="wordmark mt-4 text-xs tracking-[0.4em] text-sepia">
            FLASH&nbsp;·&nbsp;BOOK
          </p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="wordmark mt-10 border border-sepia/40 px-6 py-2 text-[0.7rem] tracking-[0.3em] text-sepia transition-colors hover:border-sepia hover:bg-oxblood/20 hover:text-bone"
          >
            OPEN THE BOOK
          </button>

          <p className="mt-12 max-w-xs text-sm italic leading-relaxed text-sepia/60">
            Hand-inked tattoo flash. Turn the pages — arrow keys, swipe, or
            click the corners.
          </p>
        </section>
      )}
    </main>
  );
}
