'use client';

import { useEffect, useState } from 'react';
import { ASSETS } from '@/config/site';
import type { InvitationContent } from '@/content';
import { OPEN_EVENT } from './invitation';

const MUTED_KEY = 'invitation:muted';
const TARGET_VOLUME = 0.35;
const FADE_MS = 2000;

/**
 * The audio element lives at module scope, outside React: switching
 * locale remounts the page tree, but the music keeps playing
 * uninterrupted because the element itself is never recreated.
 */
let sharedAudio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!sharedAudio) {
    sharedAudio = new Audio(ASSETS.audioTrack);
    sharedAudio.loop = true;
    sharedAudio.preload = 'auto';
  }
  return sharedAudio;
}

/**
 * Called from a real user gesture during the intro video: starts the
 * music muted (allowed inside a gesture), so that when the intro ends
 * the player only has to unmute and fade in — no gesture needed then.
 */
export function primeAudio() {
  const audio = getAudio();
  if (!audio.paused) return;
  audio.muted = true;
  audio.play().catch(() => undefined);
}

function fadeIn(audio: HTMLAudioElement) {
  audio.volume = 0;
  const startedAt = performance.now();
  const step = (now: number) => {
    const progress = Math.min((now - startedAt) / FADE_MS, 1);
    audio.volume = TARGET_VOLUME * progress;
    if (progress < 1 && !audio.paused) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

interface AudioPlayerProps {
  labels: InvitationContent['audio'];
}

/**
 * Starts the music on the overlay's open event (a user gesture, so
 * mobile browsers allow it), pauses while the tab is hidden, and
 * renders the persistent mute toggle. Muted state survives the
 * session via sessionStorage.
 */
export function AudioPlayer({ labels }: AudioPlayerProps) {
  // Lazy initializers re-sync with sessionStorage and the shared audio
  // element after a locale-switch remount (both resolve to the server
  // values on first load, so hydration stays clean).
  const [muted, setMuted] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(MUTED_KEY) === 'true',
  );
  const [started, setStarted] = useState(() => sharedAudio !== null && !sharedAudio.paused);

  // Keep the external element in line with React's muted state.
  useEffect(() => {
    if (sharedAudio) {
      sharedAudio.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    const start = () => {
      const audio = getAudio();
      const begin = () => {
        audio.muted = sessionStorage.getItem(MUTED_KEY) === 'true';
        fadeIn(audio);
        setStarted(true);
      };
      if (!audio.paused) {
        // Already primed (silently) by a tap during the intro video.
        begin();
        return;
      }
      audio.play().then(begin).catch(() => {
        // No user gesture yet (the intro autoplayed untouched), so the
        // browser blocked audible playback — start on the first touch.
        const retry = () => {
          audio.play().then(begin).catch(() => undefined);
        };
        window.addEventListener('pointerdown', retry, { once: true });
      });
    };
    window.addEventListener(OPEN_EVENT, start);
    return () => window.removeEventListener(OPEN_EVENT, start);
  }, []);

  // Pause when the tab is hidden; resume on return unless muted.
  useEffect(() => {
    const onVisibility = () => {
      const audio = sharedAudio;
      if (!audio) return;
      if (document.hidden) {
        if (!audio.paused) {
          audio.pause();
          audio.dataset.resume = 'true';
        }
      } else if (audio.dataset.resume === 'true' && !audio.muted) {
        delete audio.dataset.resume;
        audio.play().catch(() => undefined);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sessionStorage.setItem(MUTED_KEY, String(next));
    const audio = sharedAudio;
    if (audio) {
      audio.muted = next;
      if (!next && audio.paused && started && !document.hidden) {
        audio.play().catch(() => undefined);
      }
    }
  };

  if (!started) return null;

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? labels.unmute : labels.mute}
      aria-pressed={muted}
      className="glass-pill fixed top-5 start-5 z-40 flex h-11 w-11 items-center justify-center rounded-full"
    >
      {muted ? (
        <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      ) : (
        <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9.5 9.5 0 0 1 0 13" />
        </svg>
      )}
    </button>
  );
}
