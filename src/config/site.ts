/**
 * ─── Site configuration ──────────────────────────────────────────────
 * Everything you are likely to change lives here:
 *
 *  - WEDDING_DATE_ISO   → the single source of truth for the wedding
 *                         moment. The countdown and the displayed
 *                         dates all read from this constant.
 *  - VENUE              → name/query/coordinates for the map section.
 *  - ASSETS             → paths of the hero photo, OG image and music.
 *  - SITE_URL           → the production URL (used for share previews).
 *
 * Copy (names, messages, labels) is NOT here — edit it in
 * src/content/en.ts and src/content/ar.ts instead.
 * ─────────────────────────────────────────────────────────────────────
 */

export const LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** The wedding moment, with the Asia/Beirut UTC offset baked in. */
export const WEDDING_DATE_ISO = '2026-10-09T19:30:00+03:00';

export const VENUE = {
  name: 'Cielo Sky Venue',
  /** Query used for the "Open in Google Maps" button and the embed. */
  mapQuery: 'Cielo Sky Venue, Palacio Hotel, Rmeileh, Lebanon',
  // TODO: replace with the exact Google place ID once you have the pin
  // (open the venue on Google Maps → share → copy the place ID).
  placeId: 'JC62+WP3 Rmeileh',
  // TODO: replace with the exact coordinates of the venue pin. (33.6122513, 35.4018086)
  coordinates: { lat: 33.6122513, lng: 35.4018086 },
} as const;

export const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  VENUE.mapQuery,
)}`;

/** Key-less embed URL derived from the query. Swap for a place-ID based
 *  embed later if you want the exact pin. */
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  VENUE.mapQuery,
)}&output=embed`;

/**
 * Sub-path the site is served from. Empty for a custom domain or a
 * <user>.github.io repo; "/<repo>" for a GitHub project site. The deploy
 * workflow sets NEXT_PUBLIC_BASE_PATH automatically; locally it is "".
 * Next.js prefixes it on <Link>/router URLs by itself, but NOT on raw
 * asset paths (<img>, <video>, <audio>, metadata) — hence withBasePath.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

/** Prefix a "/public"-relative path with BASE_PATH. */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}

export const ASSETS = {
  /** Backdrop photo. Replace the file at this path to swap it. The
   *  white-gold theme lays ivory cards over it, so it wants the bright,
   *  untouched original (the pre-darkened hero.jpg suited the old dark
   *  theme and is kept for reference). */
  heroImage: withBasePath('/images/hero-original.jpg'),
  /** Optional extra section backgrounds (unused in v1, wired for later). */
  sectionImages: [] as string[],
  /** 1200×630 image used for WhatsApp / social link previews.
   *  Deliberately NOT run through withBasePath: Next's metadata resolver
   *  joins it onto `metadataBase` (SITE_URL), whose path already holds
   *  the base path — prefixing here would double it. */
  ogImage: '/images/og.jpg',
  /** Background music. Replace the file at this path to swap the track. */
  audioTrack: withBasePath('/audio/theme.mp3'),
  /** Opening video shown before the invitation. Replace the file at
   *  this path to swap it. */
  introVideo: withBasePath('/videos/intro.mp4'),
  /** First frame of the intro, shown instantly behind "tap to open"
   *  while the video itself is still downloading. Regenerate it if you
   *  swap the video (any still of its first frame will do). */
  introPoster: withBasePath('/images/intro-poster.jpg'),
  favicon: withBasePath('/favicon.ico'),
  appleTouchIcon: withBasePath('/apple-touch-icon.png'),
} as const;

/**
 * Absolute URL of the deployed site, without a trailing slash — WhatsApp
 * needs it to resolve the preview image. The deploy workflow sets
 * NEXT_PUBLIC_SITE_URL from the GitHub Pages configuration (custom
 * domain included), so it normally needs no manual edit. The fallback is
 * only used for local builds.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com').replace(
  /\/$/,
  '',
);
