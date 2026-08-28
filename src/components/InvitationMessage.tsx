import type { InvitationContent } from '@/content';
import { Card } from './Card';
import { Ornament } from './Ornament';
import { Section } from './Section';

interface InvitationMessageProps {
  content: InvitationContent['invitation'];
}

export function InvitationMessage({ content }: InvitationMessageProps) {
  return (
    <Section id="s2">
      <Card dense>
        <div
          className="reveal flex flex-col gap-1.5"
          style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
        >
          {content.lines.map((line) => (
            <p
              key={line}
              className="font-display text-[clamp(1.02rem,4.1vw,1.2rem)] font-normal leading-[1.5] text-ink/85"
            >
              {line}
            </p>
          ))}
        </div>

        <Ornament delay="140ms" />

        {/* Families: side by side on wide screens, stacked on mobile. */}
        <div
          className="reveal flex w-full flex-col items-center gap-2 sm:flex-row sm:items-stretch sm:justify-center sm:gap-0"
          style={{ '--reveal-delay': '280ms' } as React.CSSProperties}
        >
          <p className="flex-1 font-display text-[clamp(1.1rem,4vw,1.35rem)] font-semibold leading-snug text-ink sm:text-end sm:pe-6">
            {content.familyA}
          </p>
          <span aria-hidden className="h-px w-10 bg-champagne sm:h-auto sm:w-px" />
          <p className="flex-1 font-display text-[clamp(1.1rem,4vw,1.35rem)] font-semibold leading-snug text-ink sm:text-start sm:ps-6">
            {content.familyB}
          </p>
        </div>

        <p
          className="reveal max-w-xs font-body text-[0.95rem] leading-[1.55] text-stone"
          style={{ '--reveal-delay': '420ms' } as React.CSSProperties}
        >
          {content.inviteLine}
        </p>

        <p
          className="script-names script-names--invite reveal flex flex-wrap items-baseline justify-center gap-x-3"
          style={{ '--reveal-delay': '560ms' } as React.CSSProperties}
        >
          <span className="gold-text">{content.groom}</span>
          <span aria-hidden className="gold-text text-[0.7em]">
            {content.and}
          </span>
          <span className="gold-text">{content.bride}</span>
        </p>
      </Card>
    </Section>
  );
}
