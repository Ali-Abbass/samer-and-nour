'use client';

import { useEffect, useState } from 'react';
import { ASSETS } from '@/config/site';
import type { InvitationContent } from '@/content';
import { OPEN_EVENT } from './invitation';

const MUTED_KEY = 'invitation:muted';
const TARGET_VOLUME = 0.35;
const FADE_MS = 2000;
/** Silence between the track ending and starting again. */
const REPLAY_GAP_MS = 1000;
/** Ramp down over the track's last moments so the repeat has no edge. */
const FADE_OUT_MS = 3000;

/**
 * The audio element lives at module scope, outside React: switching
 * locale remounts the page tree, but the music keeps playing
 * uninterrupted because the element itself is never recreated.
 */
let sharedAudio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!sharedAudio) {
    const audio = new Audio(ASSETS.audioTrack);
    // Deliberately NOT `audio.loop = true`. That restarts the instant
    // the last sample plays, so the track runs on with no seam — this
    // one is meant to finish, leave a beat of silence, then begin
    // again. `loop` gives no way to hold that beat, so the repeat is
    // driven from `ended` instead.
    audio.loop = false;
    audio.preload = 'auto';

    // Bring the volume down over the closing seconds so the track
    // arrives at silence instead of being cut off at it. Driven from
    // `timeupdate`, which only fires a few times a second — that is
    // fine as a trigger, since the ramp itself then runs on rAF.
    let fadingOut = false;
    audio.addEventListener('timeupdate', () => {
      // `audio.ended` matters here. A `timeupdate` still queued from the
      // end of the track lands after the repeat starts, and it reports
      // currentTime at the duration — which re-arms the fade-out and
      // supersedes the fade back in, leaving the music silently
      // "playing" at volume 0 for good. Measured, not theorised.
      if (fadingOut || audio.ended || !Number.isFinite(audio.duration)) return;
      if (audio.duration - audio.currentTime <= FADE_OUT_MS / 1000) {
        fadingOut = true;
        ramp(audio, 0, FADE_OUT_MS);
      }
    });

    audio.addEventListener('ended', () => {
      window.setTimeout(() => {
        // The tab may have gone away during the silence. Starting
        // audio in a hidden tab would be the one thing worse than not
        // looping, so hand it to the visibility handler instead, which
        // resumes on return exactly as it does for a mid-track pause.
        if (document.hidden) {
          audio.dataset.resume = 'true';
          return;
        }
        audio.currentTime = 0;
        // Fade back up rather than snapping to full: the ending faded
        // to nothing, so a hard start would put the edge back.
        audio
          .play()
          .then(() => {
            // Cleared only once the track is genuinely running again, so
            // nothing can re-arm the fade during the silence.
            fadingOut = false;
            fadeIn(audio);
          })
          .catch(() => undefined);
      }, REPLAY_GAP_MS);
    });
    // The element is module scope and never torn down, so this listener
    // is attached once for the life of the page — nothing to clean up.
    sharedAudio = audio;
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
  ensureGraph(audio);
  if (!audio.paused) return;
  audio.muted = true;
  audio.play().catch(() => undefined);
}

/**
 * Routes the element through a gain node, because on iOS
 * `HTMLMediaElement.volume` is read-only — the volume there belongs to
 * the hardware buttons, assignments are ignored and reads always give
 * back 1. Every fade in this file was therefore silent on iPhones. A
 * GainNode is scriptable on every platform, so the fades run through it
 * instead and `volume` is left alone at 1.
 *
 * Built lazily from a user gesture: iOS starts an AudioContext
 * suspended, and only a gesture may resume it. Once an element has been
 * given a MediaElementAudioSource it must stay connected to a
 * destination or it goes silent, which is why the graph is wired in one
 * step and the node kept for the life of the page.
 */
let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;

function ensureGraph(audio: HTMLAudioElement): GainNode | null {
  if (gainNode) {
    if (audioCtx?.state === 'suspended') void audioCtx.resume();
    return gainNode;
  }
  const Ctor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    audioCtx = new Ctor();
    const source = audioCtx.createMediaElementSource(audio);
    gainNode = audioCtx.createGain();
    // Start silent: the first thing to happen is always a fade in.
    gainNode.gain.value = 0;
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    // The element's own volume is now a second attenuation in series;
    // pin it open so gain is the only thing shaping the level.
    audio.volume = 1;
    void audioCtx.resume();
    return gainNode;
  } catch {
    // Already sourced, or the context was refused. Fall back to volume,
    // which still works everywhere except iOS.
    return null;
  }
}

/**
 * Ramps the level to `to` over `ms`. Each call supersedes the one
 * before it — without that, a fade-out still in flight when the track
 * restarts would keep pulling the level back down against the fade-in.
 *
 * Through the gain node this is one scheduled ramp rather than a
 * per-frame loop, so it also runs to completion whether or not the page
 * is painting.
 */
let rampToken = 0;
function ramp(audio: HTMLAudioElement, to: number, ms: number) {
  const token = ++rampToken;
  const gain = ensureGraph(audio);

  if (gain && audioCtx) {
    const now = audioCtx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(to, now + ms / 1000);
    return;
  }

  // No Web Audio: drive the element's own volume, which works
  // everywhere except iOS — the platform this exists to fix.
  const from = audio.volume;
  const startedAt = performance.now();
  const step = (now: number) => {
    if (token !== rampToken) return;
    const progress = Math.min((now - startedAt) / ms, 1);
    audio.volume = from + (to - from) * progress;
    if (progress < 1 && !audio.paused) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function fadeIn(audio: HTMLAudioElement) {
  const gain = ensureGraph(audio);
  if (gain && audioCtx) {
    gain.gain.cancelScheduledValues(audioCtx.currentTime);
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
  } else {
    audio.volume = 0;
  }
  ramp(audio, TARGET_VOLUME, FADE_MS);
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
      className="glass-pill soft-rise fixed top-[calc(1.25rem_+_env(safe-area-inset-top))] start-5 z-40 flex h-11 w-11 items-center justify-center rounded-full"
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
