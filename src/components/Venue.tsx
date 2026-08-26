import { MAPS_SEARCH_URL } from '@/config/site';
import type { InvitationContent } from '@/content';
import { Card } from './Card';
import { MapEmbed } from './MapEmbed';
import { Ornament } from './Ornament';
import { Section } from './Section';

interface VenueProps {
  content: InvitationContent['venue'];
}

export function Venue({ content }: VenueProps) {
  return (
    <Section id="s4">
      <Card>
        <h2
          className="label-caps reveal text-[0.74rem] text-stone"
          style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
        >
          {content.heading}
        </h2>

        <Ornament delay="120ms" />

        <div
          className="reveal flex flex-col items-center gap-2"
          style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
        >
          <p className="font-display text-[clamp(1.8rem,7vw,2.5rem)] font-normal leading-snug text-ink">
            {content.name}
          </p>
          <p className="max-w-xs font-body text-[1rem] leading-relaxed text-stone">
            {content.address}
          </p>
        </div>

        <a
          href={MAPS_SEARCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold reveal inline-flex min-h-11 items-center rounded-full px-8 py-2.5 font-body text-[0.98rem] tracking-wide"
          style={{ '--reveal-delay': '360ms' } as React.CSSProperties}
        >
          {content.openInMaps}
        </a>

        <div
          className="reveal w-full"
          style={{ '--reveal-delay': '480ms' } as React.CSSProperties}
        >
          <MapEmbed title={content.mapTitle} />
        </div>
      </Card>
    </Section>
  );
}
