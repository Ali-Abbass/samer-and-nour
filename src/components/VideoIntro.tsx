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
 * Full-screen opening video, shown whole (never cropped) over a blurred
 * copy of its own first frame so it fills any phone screen without
 * black bars. It waits, on its poster, for a tap anywhere; the tap
 * plays it with sound (a user gesture, so mobile browsers allow that)
 * and primes the background music.
 *
 * Instant playback: as soon as the page loads, the whole file is
 * prefetched into memory and the video is pointed at that in-memory
 * copy while the poster is still up — invisible to the guest, and the
 * only way to have the video ready before the tap on iOS, which ignores
 * `preload`. The tap then plays from memory with no reload. A guest
 * who taps before the prefetch finishes simply streams it instead.
 *
 * When the video ends — or errors, or stalls — it fades and zooms away
 * while the hero entrance plays underneath. Once opened, it stays
 * dismissed for the session, so switching language doesn't replay it.
 */
export function VideoIntro({ content, children }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishedRef = useRef(false);
  const [state, setState] = useState<IntroState>('waiting');
  // Mirror of `state` for the prefetch callback (which outlives renders).
  const stateRef = useRef<IntroState>('waiting');
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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

  // Prefetch the video into memory while the poster is showing.
  useEffect(() => {
    if (effectiveState !== 'waiting') return;
    const controller = new AbortController();
    let objectUrl: string | null = null;

    fetch(ASSETS.introVideo, { signal: controller.signal })
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(response.statusText))))
      .then((blob) => {
        const video = videoRef.current;
        if (!video || stateRef.current !== 'waiting') return;
        objectUrl = URL.createObjectURL(blob);
        // Swapping the source under the poster changes nothing on screen;
        // it just means play() later reads from memory.
        video.src = objectUrl;
      })
      .catch(() => undefined);

    return () => {
      // Tapped before the download finished: stop it so the video's own
      // streaming request has the bandwidth to itself.
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [effectiveState]);

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

  const waiting = effectiveState === 'waiting';

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-ink transition-[opacity,transform] duration-1000 ease-out ${
        effectiveState === 'closing'
          ? 'pointer-events-none scale-[1.045] opacity-0'
          : 'scale-100 opacity-100'
      }`}
    >
      {/* Ambient fill: the first frame, blurred, behind the whole video. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ASSETS.introPoster}
        alt=""
        aria-hidden
        className="intro-ambient absolute inset-0 h-full w-full object-cover"
      />

      <video
        ref={videoRef}
        src={ASSETS.introVideo}
        poster={ASSETS.introPoster}
        playsInline
        preload="none"
        aria-label={content.videoLabel}
        className="relative h-full w-full object-contain"
        onEnded={finish}
        onError={finish}
      />

      {/* Tap anywhere. Only the message is visible; it fades once playing. */}
      <button
        type="button"
        onClick={start}
        disabled={!waiting}
        aria-hidden={!waiting}
        className={`absolute inset-0 z-10 flex cursor-pointer items-end justify-center pb-[18svh] transition-opacity duration-500 ${
          waiting ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <span className="intro-tap label-caps text-[0.82rem] text-ink/85">{content.tapToOpen}</span>
      </button>

      {children}
    </div>
  );
}
