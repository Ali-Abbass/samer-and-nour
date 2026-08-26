/**
 * A faint, static film grain over the whole page — the "shot on film"
 * texture that ties the photo and the paper cards together. One tiny
 * SVG noise tile, multiplied at very low opacity; no animation, so it
 * costs nothing while scrolling.
 */
export function FilmGrain() {
  return <div aria-hidden className="film-grain pointer-events-none fixed inset-0 z-30" />;
}
