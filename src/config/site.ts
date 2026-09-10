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
export const WEDDING_DATE_ISO = '2026-10-09T18:30:00+03:00';

export const VENUE = {
  name: 'Cielo Sky Venue',
  /** Query used for the "Open in Google Maps" button and the embed. */
  mapQuery: 'Cielo Sky Venue, Palacio Hotel, Rmeileh, Lebanon',
  // TODO: replace with the exact Google place ID once you have the pin
  // (open the venue on Google Maps → share → copy the place ID).
  placeId: 'JC62+WP3 Rmeileh',
  /** Drives the embedded map's pin. Confirm against the real venue
   *  before the invitation goes out — a wrong pin misdirects guests. */
  coordinates: { lat: 33.6122513, lng: 35.4018086 },
} as const;

export const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  VENUE.mapQuery,
)}`;

/** Key-less embed, pinned by coordinates rather than by name.
 *
 *  The name query does not resolve: Google fell back to showing the
 *  neighbourhood with pins on the surrounding resorts and none on the
 *  venue, so the map told a guest nothing about where to go. A lat/lng
 *  query always drops a pin exactly there.
 *
 *  What it still cannot do is *label* that pin — for a named place card
 *  the embed needs a real Google place ID, which VENUE.placeId is not
 *  yet (it holds a plus code). */
export const MAPS_EMBED_URL =
  `https://www.google.com/maps?q=${VENUE.coordinates.lat},${VENUE.coordinates.lng}` +
  `&z=16&output=embed`;

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
  /** Backdrop photo. Replace the file at this path to swap it.
   *
   *  It is a crop, not the camera original: BackgroundImage covers a box
   *  118% of the viewport tall and Ken Burns zooms it 1.02–1.06, so what
   *  matters is where the faces sit *within the file*. Around a third of
   *  the way down keeps them above the cards at every zoom, and above
   *  the scrim, which starts at 36%.
   *
   *  The beach frame is cropped less aggressively than that rule would
   *  suggest, because the source is only 1280x1600 and a full-screen
   *  backdrop on a 3x phone wants ~1290 across. Zooming further trades
   *  sharpness the photo does not have to spare; the crop keeps a strip
   *  of the sunset, which is the reason for this photo.
   *
   *  Originals live outside public/ so none of them are served:
   *  design/hero-source-beach.jpg is this one untouched,
   *  design/hero-previous-portrait.jpg the backdrop it replaced, and
   *  design/hero-source.jpg / hero-previous.jpg the pair before that. */
  heroImage: withBasePath('/images/hero.jpg'),
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
