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
          className="script-names reveal text-[clamp(2.6rem,11vw,4.2rem)]"
          style={{ '--reveal-delay': '280ms' } as React.CSSProperties}
        >
          <span className="gold-text">{content.monogram}</span>
        </p>
      </Card>
    </Section>
  );
}
