import Image from 'next/image';
import { ASSETS } from '@/config/site';

/**
 * The couple's photo as a fixed, full-viewport backdrop — every card
 * scrolls on top of it. Layers, bottom to top:
 *
 *  1. `#backdrop-motion` — oversized by 9% top and bottom so the
 *     parallax drift written by ScrollDirector never exposes an edge;
 *     the inner wrapper adds a very slow Ken Burns zoom.
 *  2. A warm gold multiply grade + a soft vignette (the "colour grade").
 *  3. `#backdrop-veil` — an ivory haze whose opacity ScrollDirector
 *     raises once the hero is scrolled away, so the photo softens into
 *     a background while the cards take the stage.
 */
export function BackgroundImage() {
  /* `h-[100lvh]`, not `inset-0`. A fixed element with `inset-0` is as
     tall as the *current* viewport, so when iOS retracts its toolbar on
     the first scroll the box grows and `object-cover` re-scales the
     photo to cover it — measured at 20.6% larger, arriving in the moment
     the toolbar animates. Five times the whole Ken Burns travel, in a
     fraction of a second, which is what read as the photo zooming the
     instant you started scrolling.

     The large viewport height is fixed at the toolbar-retracted size, so
     nothing re-crops: with the toolbar up the backdrop simply extends
     behind it, and retracting it reveals more of a photo that was
     already the right size.

     Note this is the opposite of what `.snap-section` needs. Sections
     must fill the *visible* area (100dvh) or a band of the next scene
     shows below them; the backdrop must ignore it. Same viewport
     problem, opposite answers — don't unify them. */
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 h-[100lvh] -z-10 overflow-hidden bg-paper">
      <div id="backdrop-motion" className="absolute inset-x-0 -top-[9%] -bottom-[9%]">
        <div className="ken-burns absolute inset-0">
          {/* Not `priority`: the photo is hidden behind the intro video at
              first, and preloading 1.3 MB would compete with the video's
              own prefetch on mobile data. It still starts loading at once
              (it is in the viewport), just at normal priority. */}
          <Image
            src={ASSETS.heroImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[50%_30%]"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gold/20 mix-blend-multiply" />
      <div className="backdrop-vignette absolute inset-0" />
      <div id="backdrop-veil" className="absolute inset-0 bg-ivory opacity-0" />
    </div>
  );
}
