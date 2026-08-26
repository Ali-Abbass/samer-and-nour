'use client';

import { useEffect, useState } from 'react';

interface ScrollCueProps {
  label: string;
}

/**
 * Scroll hint on the hero: a hand making a looping swipe-up gesture
 * (with a soft chevron above it) that fades out permanently once the
 * visitor scrolls past ~15% of the hero. The localized label is kept
 * for screen readers only.
 */
export function ScrollCue({ label }: ScrollCueProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (hidden) return;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.15) {
        setHidden(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hidden]);

  return (
    <div
      aria-hidden={hidden}
      className={`absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-gold-deep transition-opacity duration-700 ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden className="flex flex-col items-center gap-1">
        <svg
          viewBox="0 0 24 24"
          className="cue-chevron h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 14 6-6 6 6" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="cue-hand h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 11V6a2 2 0 0 0-4 0v5" />
          <path d="M14 10V4a2 2 0 0 0-4 0v2" />
          <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
          <path d="m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6A8 8 0 0 0 12 22h2a8 8 0 0 0 8-8V7a2 2 0 0 0-4 0v5" />
        </svg>
      </span>
    </div>
  );
}
