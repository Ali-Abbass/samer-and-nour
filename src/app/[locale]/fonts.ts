/**
 * Locale-specific font trios, loaded via next/font (self-hosted,
 * display: swap). Each locale exposes the same three CSS variables —
 * --font-script-family (the couple's names), --font-display-family
 * (headings, dates, family names) and --font-body-family (everything
 * else) — and the layout applies only the active locale's set, so a
 * page never references (and the browser never downloads) the other
 * locale's fonts.
 *
 * English: Mishega (script names) + Cormorant Garamond +
 * EB Garamond — the classic formal-invitation pairing.
 * Arabic:  Aref Ruqaa (calligraphic names) + Amiri (classic naskh) +
 * IBM Plex Sans Arabic (kept for small-text legibility).
 */
import {
  Amiri,
  Aref_Ruqaa,
  Cormorant_Garamond,
  EB_Garamond,
  IBM_Plex_Sans_Arabic,
} from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Mishega is not on Google Fonts, so it ships with the repo and is
 * self-hosted through next/font/local (same hashed-URL, preloaded
 * treatment the Google faces get).
 *
 * The .woff2 is a straight format conversion of the .otf, not a
 * subset: the licence (`fonts/mishega/`) allows converting to WOFF but
 * not modifying the font, and dropping glyphs is hard to argue is not
 * a modification. It costs ~34 KB whole, which is small enough that
 * subsetting was not worth the ambiguity.
 */
const mishega = localFont({
  src: '../../fonts/Mishega.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-script-family',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display-family',
});

const ebGaramond = EB_Garamond({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body-family',
});

const arefRuqaa = Aref_Ruqaa({
  weight: ['400', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-script-family',
  preload: false,
});

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-display-family',
  preload: false,
});

const plexArabic = IBM_Plex_Sans_Arabic({
  weight: ['300', '400'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-body-family',
  preload: false,
});

export const fontClassesByLocale = {
  en: `${mishega.variable} ${cormorant.variable} ${ebGaramond.variable}`,
  ar: `${arefRuqaa.variable} ${amiri.variable} ${plexArabic.variable}`,
} as const;
