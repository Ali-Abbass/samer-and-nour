'use client';

import { WEDDING_DATE_ISO } from '@/config/site';
import type { InvitationContent } from '@/content';
import { useCountdown } from '@/hooks/useCountdown';
import { Card } from './Card';
import { Ornament } from './Ornament';
import { Section } from './Section';

interface CountdownProps {
  content: InvitationContent['countdown'];
  useArabicNumerals: boolean;
}

export function Countdown({ content, useArabicNumerals }: CountdownProps) {
  const parts = useCountdown(WEDDING_DATE_ISO);

  const formatNumber = (value: number): string => {
    const padded = String(value).padStart(2, '0');
    return useArabicNumerals
      ? padded.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)])
      : padded;
  };

  const units = [
    { label: content.days, value: parts?.days },
    { label: content.hours, value: parts?.hours },
    { label: content.minutes, value: parts?.minutes },
    { label: content.seconds, value: parts?.seconds },
  ];

  return (
    <Section id="s1">
      <Card>
        <h2
          className="label-caps reveal text-[0.74rem] text-stone"
          style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
        >
          {content.heading}
        </h2>

        <Ornament delay="120ms" />

        {parts?.done ? (
          <p
            className="reveal font-display text-[clamp(1.8rem,7vw,3rem)] font-normal text-ink"
            style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
          >
            {content.dayArrived}
          </p>
        ) : (
          <div
            className="reveal grid w-full grid-cols-4 gap-1"
            style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
          >
            {units.map((unit) => (
              <div key={unit.label} className="flex flex-col items-center gap-2">
                <span className="font-display text-[clamp(1.9rem,8.5vw,3.4rem)] font-normal leading-none tabular-nums text-gold-deep">
                  {/* Stable placeholder until mounted → no hydration mismatch.
                      The key remounts the span when the value changes, so
                      each new number ticks in with a tiny rise. */}
                  {unit.value === undefined ? (
                    '--'
                  ) : (
                    <span key={unit.value} className="digit-in">
                      {formatNumber(unit.value)}
                    </span>
                  )}
                </span>
                <span className="label-caps text-[0.62rem] text-stone">{unit.label}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Section>
  );
}
