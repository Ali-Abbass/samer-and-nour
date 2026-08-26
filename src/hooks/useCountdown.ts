'use client';

import { useEffect, useState } from 'react';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target moment has passed. */
  done: boolean;
}

function partsUntil(targetMs: number): CountdownParts {
  const diff = targetMs - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: false,
  };
}

/**
 * Hydration-safe countdown: returns null until mounted (the component
 * renders a stable placeholder), then ticks once per second.
 */
export function useCountdown(targetIso: string): CountdownParts | null {
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const targetMs = new Date(targetIso).getTime();
    const tick = () => setParts(partsUntil(targetMs));
    // First tick is deferred a frame so the effect body stays pure;
    // the placeholder is replaced immediately after mount.
    const firstTick = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(firstTick);
      clearInterval(interval);
    };
  }, [targetIso]);

  return parts;
}
