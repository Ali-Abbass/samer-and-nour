import type { InvitationContent } from '@/content';
import { Card } from './Card';
import { Ornament } from './Ornament';
import { Section } from './Section';

interface ClosingProps {
  content: InvitationContent['closing'];
}

export function Closing({ content }: ClosingProps) {
  return (
    <Section id="s5">
      <Card>
        <p
          className="poem reveal font-display text-[clamp(1.15rem,4.6vw,1.4rem)] font-normal leading-[1.7] text-ink/85"
          style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
        >
          {content.line}
        </p>

        <Ornament delay="140ms" />

        <p
          className="script-names script-names--closing reveal"
          style={{ '--reveal-delay': '280ms' } as React.CSSProperties}
        >
          <span className="gold-text">{content.monogram}</span>
        </p>

        {/* RSVP deadline: the last line of the invitation, below the
            names, as it sits on a printed one. Deliberately quieter than
            the closing line above — practical, not poetic — but in
            gold-deep and behind its own rule so a date the guest has to
            act on doesn't read as a footnote. */}
        <div
          className="reveal flex flex-col items-center gap-3"
          style={{ '--reveal-delay': '420ms' } as React.CSSProperties}
        >
          <span aria-hidden className="h-px w-12 bg-champagne/70" />
          <p className="max-w-xs font-body text-[0.95rem] leading-relaxed text-gold-deep">
            {content.rsvp}
          </p>
        </div>
      </Card>
    </Section>
  );
}
