/**
 * Locale-specific font trios, loaded via next/font (self-hosted,
 * display: swap). Each locale exposes the same three CSS variables —
 * --font-script-family (the couple's names), --font-display-family
 * (headings, dates, family names) and --font-body-family (everything
 * else) — and the layout applies only the active locale's set, so a
 * page never references (and the browser never downloads) the other
 * locale's fonts.
 *
 * English: a switchable script face (below) + Cormorant Garamond +
 * EB Garamond — the classic formal-invitation pairing.
 * Arabic:  Aref Ruqaa (calligraphic names) + Amiri (classic naskh) +
 * IBM Plex Sans Arabic (kept for small-text legibility).
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │ TO CHANGE THE ENGLISH SCRIPT FACE: edit SCRIPT_FACE below to │
 * │ any key of SCRIPT_FACES. That is the whole edit — sizes       │
 * │ rescale themselves, so nothing in the components or the CSS   │
 * │ needs touching.                                               │
 * └──────────────────────────────────────────────────────────────┘
 */
import {
  Amiri,
  Aref_Ruqaa,
  Cormorant_Garamond,
  EB_Garamond,
  IBM_Plex_Sans_Arabic,
  Italianno,
  Petit_Formal_Script,
  Pinyon_Script,
} from 'next/font/google';
import localFont from 'next/font/local';

/** Which face renders "Samer & Nourhane" on the English pages. */
const SCRIPT_FACE: ScriptFaceName = 'corsiva';

/* ─── The script faces ────────────────────────────────────────────────
 *
 * `scale` multiplies every script size at once (see --script-scale in
 * globals.css), so a face can be swapped without re-tuning the three
 * clamp() sizes by hand.
 *
 * The seeded numbers normalise *width*, not apparent size: each face
 * renders "Samer & Nourhane" at the same width Mishega does, because
 * that string is a single unwrapped line in the hero and width is what
 * decides whether it fits a narrow phone. Normalising x-height instead
 * would read more evenly but would push Pinyon and Italianno ~30% wider
 * than the hero can hold.
 *
 * The cost is that faces with a small x-height look daintier at the
 * same width — the ratios are noted per face so you know which way to
 * nudge. `scale` is just a number: raise it until it looks right, and
 * check the hero on a ~390px-wide screen, which is the tightest case.
 *
 * Every candidate carries `preload: false`. next/font decides preloads
 * from the declarations it can see, not from which class the layout
 * actually applies, so leaving it on would preload all five faces —
 * ~190 KB, most of it for faces the page never uses. With it off the
 * browser still downloads only the one face the CSS references; it just
 * discovers it a beat later, which the hero entrance animation covers.
 * Once the face is settled for good, dropping `preload: false` from
 * that one entry is a worthwhile last bit of polish.
 */

/**
 * Mishega is not on Google Fonts, so it ships with the repo and is
 * self-hosted through next/font/local, which gives it the same
 * hashed-URL, immutable-cache treatment as the Google faces.
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
  preload: false,
});

/**
 * Monotype Corsiva. Unlike every other face here, this one is not free
 * — it ships on a webfont licence from Monotype held by the site owner,
 * who confirmed it on 2026-08-28. Keep that in mind before reusing this
 * repo as a template: the .woff2 is committed and served to every
 * visitor, which only that licence permits.
 *
 * The copy bundled with Office/Windows does NOT permit this. Its
 * embedded notice (name ID 13) limits use "to your workstation for your
 * own publishing use. You may not copy or distribute this software",
 * and the permissive fsType bit (0x0000) covers *document* embedding
 * only. The webfont licence is what makes self-hosting legitimate.
 *
 * `italianno` is the closest freely-licensable face in this list, if
 * this ever needs to become a no-licence-required build.
 */
const corsiva = localFont({
  src: '../../fonts/MonotypeCorsiva.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-script-family',
  preload: false,
});

const pinyon = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-script-family',
  preload: false,
});

const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-script-family',
  preload: false,
});

const petitFormal = Petit_Formal_Script({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-script-family',
  preload: false,
});

const SCRIPT_FACES = {
  /** Rounded brush script. x-height 0.485em — the reference. */
  mishega: { font: mishega, scale: 1.0 },
  /** Chancery italic, formal and narrow. x-height 0.433em. Unlicensed — see above. */
  corsiva: { font: corsiva, scale: 1.03 },
  /** Formal copperplate, the original choice. x-height 0.371em. */
  pinyon: { font: pinyon, scale: 1.0 },
  /** Flowing calligraphic italic; the widest-set, so the most shrunk. x-height 0.273em. */
  italianno: { font: italianno, scale: 1.28 },
  /** Upright formal script, large on the body. x-height 0.579em. */
  petitFormal: { font: petitFormal, scale: 0.69 },
} as const;

type ScriptFaceName = keyof typeof SCRIPT_FACES;

const script = SCRIPT_FACES[SCRIPT_FACE];

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
  en: `${script.font.variable} ${cormorant.variable} ${ebGaramond.variable}`,
  ar: `${arefRuqaa.variable} ${amiri.variable} ${plexArabic.variable}`,
} as const;

/**
 * Per-locale size multiplier for `.script-names`, applied by the layout
 * as an inline --script-scale. Arabic is fixed at 1: Aref Ruqaa is the
 * only Arabic script face, so its clamp() sizes are tuned directly.
 */
export const scriptScaleByLocale = {
  en: script.scale,
  ar: 1,
} as const;
