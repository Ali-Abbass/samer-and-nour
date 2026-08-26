'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { OPEN_EVENT, OPENED_KEY } from './invitation';

const noopSubscribe = () => () => undefined;

interface HeroEntranceProps {
  children: React.ReactNode;
}

/**
 * Choreographs the hero's entrance: the names and date stay hidden
 * behind the opening overlay, then rise into view the moment the intro
 * hands over (or immediately, if the invitation was already opened
 * this session — e.g. after a language switch).
 */
export function HeroEntrance({ children }: HeroEntranceProps) {
  const alreadyOpened = useSyncExternalStore(
    noopSubscribe,
    () => sessionStorage.getItem(OPENED_KEY) === 'true',
    () => false,
  );
  const [openedNow, setOpenedNow] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpenedNow(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const open = alreadyOpened || openedNow;

  return (
    <div
      className={`hero-entrance relative z-10 flex flex-col items-center gap-5 px-6 pb-28 text-center text-ink ${
        open ? 'is-open' : ''
      }`}
    >
      {children}
    </div>
  );
}
