import type { InvitationContent } from '@/content';
import { Card } from './Card';
import { Ornament } from './Ornament';
import { Section } from './Section';

interface EventDetailsProps {
  content: InvitationContent['event'];
}

export function EventDetails({ content }: EventDetailsProps) {
  return (
    <Section id="s3">
      <Card>
        <h2
          className="label-caps reveal text-[0.84rem] text-stone"
          style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
        >
          {content.heading}
        </h2>

        <Ornament delay="120ms" />

        <p
          className="reveal font-display text-[clamp(2rem,8vw,2.9rem)] font-normal leading-snug text-ink"
          style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
        >
          {content.date}
        </p>

        <p
          className="reveal font-body text-[1.12rem] tracking-wide text-stone"
          style={{ '--reveal-delay': '360ms' } as React.CSSProperties}
        >
          {content.time}
        </p>
      </Card>
    </Section>
  );
}
