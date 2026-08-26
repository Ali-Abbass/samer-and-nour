'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Observes an element and flips to true (once) when ~25% of it enters
 * the viewport. Used by Section to trigger the fade/rise reveal.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  // Browsers without IntersectionObserver just show everything revealed.
  const [inView, setInView] = useState(
    () => typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined',
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
