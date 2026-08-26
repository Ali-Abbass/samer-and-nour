'use client';

import { useReveal } from '@/hooks/useReveal';

interface SectionProps {
  /** Anchor id (s1…s5) used to restore position across a locale switch. */
  id: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * One full-viewport "scene": the photo shows through the top part of
 * the screen, and the card (the children) sits in the lower part, over
 * the photo. Adds `.in-view` once ~25% visible, which plays the card's
 * entrance and the staggered `reveal` of its contents. `data-scene`
 * lets ScrollDirector drive the rise/recede motion.
 */
export function Section({ id, children, className = '' }: SectionProps) {
  const { ref, inView } = useReveal<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      data-scene
      className={`snap-section scene relative flex flex-col items-center justify-end px-5 ${
        inView ? 'in-view' : ''
      } ${className}`}
    >
      {children}
    </section>
  );
}
