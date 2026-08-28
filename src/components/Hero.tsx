import type { InvitationContent } from '@/content';
import { HeroEntrance } from './HeroEntrance';
import { ScrollCue } from './ScrollCue';

interface HeroProps {
  content: InvitationContent['hero'];
}

/**
 * First screen: the photo in full, the names in metallic gold rising
 * out of an ivory scrim at the bottom, plus the scroll cue. `data-scene`
 * lets ScrollDirector fade the names as the hero is scrolled away.
 */
export function Hero({ content }: HeroProps) {
  return (
    <section
      id="s0"
      data-scene
      className="snap-section relative flex items-end justify-center overflow-hidden"
    >
      <div aria-hidden className="hero-scrim absolute inset-x-0 bottom-0 h-[64%]" />

      <HeroEntrance>
        <h1 className="he-names script-names script-names--hero">
          <span className="gold-text">{content.names}</span>
        </h1>
        <span aria-hidden className="he-rule block h-px w-14 bg-gold-deep/70" />
        <p className="he-date label-caps text-[clamp(0.78rem,2.8vw,0.95rem)] text-ink/75">
          {content.date}
        </p>
      </HeroEntrance>

      <ScrollCue label={content.scrollCue} />
    </section>
  );
}
