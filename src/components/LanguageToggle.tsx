'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/config/site';
import type { InvitationContent } from '@/content';

interface LanguageToggleProps {
  locale: Locale;
  toggle: InvitationContent['languageToggle'];
}

/**
 * Ivory glass pill pinned to the top corner that swaps /en ↔ /ar.
 * It carries the currently visible section along as a #hash so the
 * guest lands on the same section after the switch; the music keeps
 * playing because the audio element lives outside the React tree.
 */
export function LanguageToggle({ locale, toggle }: LanguageToggleProps) {
  const router = useRouter();
  const target: Locale = locale === 'en' ? 'ar' : 'en';

  const switchLocale = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // Ask the sections where they are rather than dividing scrollY by
    // the viewport. Sections track the viewport now (`100dvh`), but the
    // division still drifts: one section is taller than a screen, and a
    // section can grow past a screen whenever its card does. Geometry
    // cannot drift — whichever section covers the middle of the screen
    // is the one being read.
    const middle = window.innerHeight / 2;
    const current = Array.from(document.querySelectorAll<HTMLElement>('.snap-section')).find(
      (section) => {
        const { top, bottom } = section.getBoundingClientRect();
        return top <= middle && bottom > middle;
      },
    );
    const hash = current && current.id !== 's0' ? `#${current.id}` : '';
    router.push(`/${target}${hash}`);
  };

  // Physical corner chosen from the PAGE direction: the link carries its
  // own `dir` (for the other language's label), which would make a
  // logical `end-5` flip and land on the mute button's corner.
  const corner = locale === 'ar' ? 'left-5' : 'right-5';

  return (
    <Link
      href={`/${target}`}
      onClick={switchLocale}
      aria-label={toggle.ariaLabel}
      lang={target}
      dir={target === 'ar' ? 'rtl' : 'ltr'}
      className={`glass-pill fixed top-5 ${corner} z-40 inline-flex min-h-11 items-center rounded-full px-4 font-body text-xs tracking-wide`}
    >
      {toggle.label}
    </Link>
  );
}
