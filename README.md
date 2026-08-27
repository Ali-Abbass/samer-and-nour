# Samer & Nourhane — Wedding Invitation

A bilingual (English `/en` · Arabic `/ar`), mobile-first, single-page
interactive wedding invitation built with Next.js (App Router),
TypeScript and Tailwind CSS.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /en
```

Production build (static export — writes a plain HTML/CSS/JS site to `out/`):

```bash
npm run build
npx serve out   # or any static file server, to preview
```

## Deploy (GitHub Pages)

The site is a static export, so GitHub Pages hosts it as-is:

1. Push the project to a GitHub repository (branch `main`).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds
   the export and publishes `out/`. Use **Actions → Deploy to GitHub Pages → Run workflow** to redeploy by hand.

The workflow reads the Pages URL from GitHub itself and passes it to the
build as `NEXT_PUBLIC_SITE_URL` (used for WhatsApp/social previews) and
`NEXT_PUBLIC_BASE_PATH` (`/<repo>` for a project site, empty for a
`<user>.github.io` repo or a custom domain). Nothing needs hard-coding
in the source. For a custom domain, set it under Settings → Pages and
add a `public/CNAME` file containing the domain so it survives deploys.

Note: free GitHub Pages requires a **public** repository, which exposes
the source and the original photo/video/music files to anyone who finds
the repo. Use a private repo with GitHub Pro (or a host like Netlify /
Cloudflare Pages) if that matters.

## Where to change things

Everything you're likely to edit lives in two places:

### 1. `src/config/site.ts` — dates, venue, assets

| What | Constant |
| --- | --- |
| **Wedding date & time** | `WEDDING_DATE_ISO` — one constant drives the countdown. The displayed date *strings* live in the content files (below). |
| **Map pin** | `VENUE.mapQuery` today; fill in `VENUE.placeId` / `VENUE.coordinates` (marked `TODO`) when you have the exact pin. |
| **Background photo** | `ASSETS.heroImage` → currently `public/images/hero-original.jpg` (the bright, untouched photo). It is a fixed backdrop that every card scrolls over; the white-gold theme adds its own warm grade, vignette and ivory haze, so it wants a bright photo. `hero.jpg` is the pre-darkened version used by the earlier dark theme, kept only for reference. Portrait photos work best: on phones the couple should sit in the top ~45% (`object-[50%_30%]` in `BackgroundImage.tsx` nudges the crop). |
| **WhatsApp/social preview image** | `ASSETS.ogImage` → replace `public/images/og.jpg` (1200×630). |
| **Music** | `ASSETS.audioTrack` → replace `public/audio/theme.mp3`. Keep it light — it starts downloading at the tap, alongside the video. The current file is 96 kbps MP3 (1.3 MB for 1:50); re-encode a new track with `npx -p ffmpeg-static -c 'ffmpeg -i in.mp3 -c:a libmp3lame -b:a 96k public/audio/theme.mp3'`. |
| **Opening video** | `ASSETS.introVideo` → replace `public/videos/intro.mp4`. It waits on its poster (`public/images/intro-poster.jpg`, a still of its first frame — replace it too when you swap the video) for a tap anywhere; the tap plays it with sound and primes the music, and near its end the overlay whites it out and fades into the invitation (the fade-to-white is done by the page, not baked into the clip — see `ENDING_LEAD_S` / `HANDOVER_LEAD_S` in `VideoIntro.tsx` to retime it for a new clip). The video is shown whole over a blurred copy of the poster, so any aspect ratio fills the phone without cropping. Keep the file small (the current one is 720 px wide, 8 s, H.264 CRF 26, ~0.71 MB) — it is prefetched into memory on page load so the tap plays instantly, and phones on mobile data are the audience. **File size is the main thing that decides whether the tap feels instant**: a guest who taps before the prefetch lands has to stream instead, so grow this only if you have to. To re-encode a new clip without a system ffmpeg: `npx -p ffmpeg-static -c 'ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 26 -vf scale=720:-2,format=yuv420p -c:a aac -b:a 72k -movflags +faststart public/videos/intro.mp4'`, then the poster: `npx -p ffmpeg-static -c 'ffmpeg -ss 0 -i public/videos/intro.mp4 -frames:v 1 -q:v 3 public/images/intro-poster.jpg'`. |
| **Deployed URL** | `SITE_URL` — read from `NEXT_PUBLIC_SITE_URL`, which the deploy workflow sets automatically from the GitHub Pages config. Only the local fallback lives in the file. |
| **Default language** | `DEFAULT_LOCALE`, plus the matching `url=en/` in `public/index.html` (see Notes). |

### 2. `src/content/en.ts` and `src/content/ar.ts` — all copy

Every visible string (names, messages, labels, alt text, metadata) lives
in these two files, typed against `src/content/types.ts` — if you add a
field to one language and forget the other, the build fails.

In `ar.ts`, flip `useArabicNumerals: true` to render the countdown with
Eastern Arabic numerals (٠١٢…).

### Colors & fonts

- Palette (white gold): CSS variables at the top of `src/app/globals.css`
  — ivory `#EEEDEB`, paper `#EBE8E1`, champagne `#BFA78D`, plus a
  metallic gold gradient (`--gold-gradient`) used for the names and
  monogram (`.gold-text`) and the Maps button (`.btn-gold`). Text on the
  card uses `--ink` / `--stone` / `--gold-deep`, all ≥ 4.5:1 on paper.
  A full recolor is a one-file edit.
- Fonts: `src/app/[locale]/fonts.ts`, three roles per locale —
  *script* (the couple's names: Pinyon Script / Aref Ruqaa for Arabic),
  *display* (headings, dates, family names: Cormorant Garamond / Amiri)
  and *body* (EB Garamond / IBM Plex Sans Arabic). Names use the
  `.script-names` class (never add letter-spacing to it — it breaks the
  connected script). Poetic lines use `.poem`: italic for Latin, upright
  for Arabic.

### The scroll experience

- Every screen after the hero is a **scene** (`Section.tsx`): the photo
  shows through the top part, and a **card** (`Card.tsx`) of translucent
  ivory paper with torn edges sits over the lower part. The photo blurs
  softly through the card (`backdrop-filter`).
- `ScrollDirector.tsx` is one passive scroll loop that drives the
  cinematic motion without React re-renders: photo parallax, the ivory
  haze that deepens past the hero, and per-scene `--enter` / `--leave`
  variables that make each card rise from a little further below and
  recede as it leaves. The hero's names and scrim dissolve on the same
  signal. It does nothing under `prefers-reduced-motion`.
- Card shape: the torn edges are two tiny SVG masks (`--torn-top` /
  `--torn-bottom` in `globals.css`), generated deterministically —
  change `--torn-edge` to make the tear taller or shorter.
- Don't put `filter`, `opacity` or `mask` on any *ancestor* of `.card`:
  browsers then stop the card's backdrop blur from seeing the photo.
  That is why the shadow is a masked sibling and the scroll motion is a
  transform-only wrapper.
- Fixed UI: language toggle at the page's inline-end corner, mute button
  at the inline-start corner (opposite sides in both languages).

## Notes

- `/` → `/en/` (or `/ar/` for Arabic-language browsers) is done by
  `public/index.html`, a tiny client-side redirect: a static host has
  no server to redirect with, and `app/[locale]/layout.tsx` is the
  root layout, so a Next.js page at `/` would have needed a second
  root layout. Its `url=en/` must match `DEFAULT_LOCALE`.
- Asset paths (`ASSETS` in `src/config/site.ts`) are wrapped in
  `withBasePath()` because Next.js only auto-prefixes the base path on
  `<Link>`/router URLs, not on `<img>`, `<video>`, `<audio>` or
  metadata. `ogImage` is the one exception — Next's metadata resolver
  prefixes it via `metadataBase` already.
- Mobile browsers only allow audio after a user gesture, which is why
  the intro waits for a tap: that tap plays the video with sound and
  primes the background music, so the music can fade in by itself when
  the intro hands over. The audio element lives outside React so
  switching language never restarts the music.
- The intro (`VideoIntro.tsx`) shows a still of the first frame as its
  own `<img>` over the video (not the `poster` attribute, which browsers
  swap out the instant playback starts — a visible jump, and a black
  flash on iOS) and only dissolves it once the video reports its first
  frame painted. It hands over 0.4 s before the last frame so the
  dissolve overlaps the ending, and the photo behind does a short
  focus-pull (blur → sharp) as the invitation opens.
- The intro has three ways to start, all inside the tap gesture: normally it plays from an in-memory copy prefetched on
  page load (iOS ignores `preload`, so this is what makes the tap
  instant); a tap before the prefetch finishes streams the file from
  `intro.mp4?stream` — the query string is deliberate, it keeps the
  stream on a separate HTTP-cache entry from the aborted prefetch, which
  otherwise stalls the video in Chrome; and a tap before React has even
  hydrated (slow connection) is caught by a small inline script in the
  server HTML that starts the video itself.
- Playback starts on `pointerdown`, not `click` — a phone only fires
  `click` once the finger lifts, so waiting for it threw away 100-300 ms
  on every tap. `click` stays wired up as the retry for any browser that
  won't treat pointerdown as the activating gesture; only that second
  attempt is allowed to fall back to muted playback, so a browser that
  merely wanted the later event doesn't end up with a silent intro.
  While the clip buffers after a tap, three dots show underneath — the
  message fades out immediately, and without them a slow start looks
  like a tap that never registered.
- All animations respect `prefers-reduced-motion`.
