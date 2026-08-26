'use client';

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ASSETS } from '@/config/site';
import type { InvitationContent } from '@/content';
import { primeAudio } from './AudioPlayer';
import { OPEN_EVENT, OPENED_KEY } from './invitation';

const noopSubscribe = () => () => undefined;

/** If the video stalls and never fires `ended`, release the guest. */
const SAFETY_TIMEOUT_MS = 20000;

type IntroState = 'waiting' | 'playing' | 'closing' | 'closed';

interface VideoIntroProps {
  content: InvitationContent['intro'];
  /** Extra fixed UI shown during the intro (e.g. the language toggle). */
  children?: React.ReactNode;
}

/**
 * Full-screen opening video. It loads paused on its first frame behind
 * a "tap to open" control; the tap starts it with sound (a user gesture,
 * so mobile browsers allow audible playback) and primes the background
 * music at the same time. When the video ends — or errors, or stalls —
 * it fades and zooms away while the hero entrance plays underneath.
 * Once opened, it stays dismissed for the session, so switching
 * language doesn't replay it.
 */
export function VideoIntro({ content, children }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishedRef = useRef(false);
  const [state, setState] = useState<IntroState>('waiting');

  const alreadyOpened = useSyncExternalStore(
    noopSubscribe,
    () => sessionStorage.getItem(OPENED_KEY) === 'true',
    () => false,
  );
  const effectiveState: IntroState = state === 'waiting' && alreadyOpened ? 'closed' : state;
  const overlayUp = effectiveState === 'waiting' || effectiveState === 'playing';

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('overlay-open', overlayUp);
    return () => document.documentElement.classList.remove('overlay-open');
  }, [overlayUp]);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    sessionStorage.setItem(OPENED_KEY, 'true');
    window.dispatchEvent(new Event(OPEN_EVENT));
    setState('closing');
    window.setTimeout(() => setState('closed'), 1000);
  };

  // The safety net only counts once playback has actually been started.
  useEffect(() => {
    if (effectiveState !== 'playing') return;
    const safety = window.setTimeout(finish, SAFETY_TIMEOUT_MS);
    return () => window.clearTimeout(safety);
  }, [effectiveState]);

  if (effectiveState === 'closed') return null;

  const start = () => {
    const video = videoRef.current;
    if (!video || state !== 'waiting') return;
    // A real user gesture: also start the music silently so it is
    // already unlocked when the intro hands over to the invitation.
    primeAudio();
    setState('playing');
    video.muted = false;
    video.play().catch(() => {
      // Audible playback refused (unusual inside a gesture) — try
      // muted, and if even that fails, go straight to the invitation.
      video.muted = true;
      video.play().catch(finish);
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-ink transition-[opacity,transform] duration-1000 ease-out ${
        effectiveState === 'closing'
          ? 'pointer-events-none scale-[1.045] opacity-0'
          : 'scale-100 opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src={ASSETS.introVideo}
        poster={ASSETS.introPoster}
        playsInline
        preload="auto"
        aria-label={content.videoLabel}
        className="h-full w-full object-contain"
        onEnded={finish}
        onError={finish}
      />

      {effectiveState === 'waiting' && (
        <button
          type="button"
          onClick={start}
          className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-5 bg-ink/35 text-ivory"
        >
          <span aria-hidden className="relative flex h-20 w-20 items-center justify-center">
            <span className="tap-ring absolute inset-0 rounded-full border border-gold/70" />
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ivory/70 bg-ivory/10 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="ms-1 h-6 w-6" fill="currentColor">
                <path d="M7 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z" />
              </svg>
            </span>
          </span>
          <span className="label-caps text-[0.78rem] text-ivory/90">{content.tapToOpen}</span>
        </button>
      )}

      {children}
    </div>
  );
}
