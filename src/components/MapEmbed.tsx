'use client';

import { useEffect, useRef, useState } from 'react';
import { MAPS_EMBED_URL } from '@/config/site';

interface MapEmbedProps {
  title: string;
}

/**
 * Lazy Google Maps embed: the iframe is only mounted once the venue
 * section approaches the viewport, so it never competes with the
 * initial page load.
 */
export function MapEmbed({ title }: MapEmbedProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // Browsers without IntersectionObserver just mount the map eagerly.
  const [mounted, setMounted] = useState(
    () => typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined',
  );

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="h-44 w-full overflow-hidden rounded-xl border border-champagne/70 bg-ivory/60 shadow-[0_6px_18px_-10px_rgba(70,50,20,0.5)] sm:h-56"
    >
      {mounted && (
        <iframe
          src={MAPS_EMBED_URL}
          title={title}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      )}
    </div>
  );
}
