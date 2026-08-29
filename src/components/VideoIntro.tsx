'use client';

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ASSETS } from '@/config/site';
import type { InvitationContent } from '@/content';
import { primeAudio } from './AudioPlayer';
import { OPEN_EVENT, OPENED_KEY } from './invitation';

const noopSubscribe = () => () => undefined;

/** If the video stalls and never fires `ended`, release the guest. */
const SAFETY_TIMEOUT_MS = 20000;

/**
 * The clip (an envelope opening on cream paper, 8 s) ends on its
 * brightest frame and never fades on its own, so the overlay whites it
 * out itself: from ENDING_LEAD_S before the end a bloom of light rises
 * over the video and its ambient bars (`.intro-veil`, 0.3 s), and the
 * hand-over begins HANDOVER_LEAD_S before the end, cross-fading to the
 * invitation in 0.4 s. The whole thing is a ~0.8 s flash of light, not
 * a dissolve. Re-measure both if the clip changes.
 *
 * The gap between them (0.38 s) is deliberately wider than the veil's
 * 0.3 s: `timeupdate` fires only ~4x/s, so a tick landing late can
 * compress the window, and the slack keeps the screen fully lit before
 * the cross-fade starts.
 */
const ENDING_LEAD_S = 0.6;
const HANDOVER_LEAD_S = 0.22;

/**
 * The URL the <video> element streams from if the guest taps before
 * the prefetch below has finished. It is the same file, but the query
 * string gives it a separate HTTP-cache entry: Chrome serialises
 * requests for one URL through its cache, so a media load that shares
 * the URL with an in-flight (then aborted) fetch() stalls forever at
 * readyState 0. Static hosts ignore the query string.
 */
const STREAM_SRC = `${ASSETS.introVideo}?stream`;

declare global {
  interface Window {
    /** Set by the inline script below: the guest tapped before React hydrated. */
    __introTapped?: boolean;
  }
}

/**
 * Runs from the server-rendered HTML, before React's JavaScript has
 * arrived: on a slow connection the poster and message are visible for
 * a second or two before hydration, and a tap in that window would
 * otherwise do nothing. This starts the video inside that very tap and
 * leaves a flag for the component to pick up when it mounts.
 *
 * Like the hydrated handler below it goes on `pointerdown` and keeps
 * `click` as the retry: if a browser declines to treat pointerdown as
 * the activating gesture, the rejected promise clears the guard so the
 * click landing right behind it tries again — with sound, rather than
 * dropping to a muted fallback on the first refusal.
 */
const PRE_HYDRATION_TAP = `(function(){var o=document.getElementById('intro-overlay');if(!o)return;var t=false;function go(){if(t||window.__introTapped)return;t=true;var v=o.querySelector('video');if(!v){t=false;return;}try{v.muted=false;var p=v.play();if(p&&p.then){p.then(function(){window.__introTapped=true;},function(){t=false;});}else{window.__introTapped=true;}}catch(e){t=false;}}o.addEventListener('pointerdown',go);o.addEventListener('click',go);})();`;

type IntroState = 'waiting' | 'playing' | 'closing' | 'closed';

interface VideoIntroProps {
  content: InvitationContent['intro'];
  /** Extra fixed UI shown during the intro (e.g. the language toggle). */
  children?: React.ReactNode;
}

/**
 * Full-screen opening video, shown whole (never cropped) over a blurred
 * copy of its own first frame so it fills any phone screen without
 * black bars. It waits, on a still of its first frame, for a tap
 * anywhere; the tap plays it with sound (a user gesture, so mobile
 * browsers allow that) and primes the background music.
 *
 * Seamless start: the still is a separate <img> laid exactly over the
 * video, not the browser's `poster` — a poster is swapped out the
 * instant playback begins (a visible jump, and a black flash on iOS),
 * whereas the still here is only dissolved once the video reports its
 * first frame actually painted.
 *
 * Instant playback: as soon as the page loads, the whole file is
 * prefetched into memory and the video is pointed at that in-memory
 * copy while the still is still up — invisible to the guest, and the
 * only way to have the video ready before the tap on iOS, which ignores
 * `preload`. The tap then plays from memory with no reload. A guest
 * who taps before the prefetch finishes simply streams it instead.
 *
 * Near its last frame the overlay dissolves and zooms away while the
 * hero entrance plays underneath (also on error or a stall). Once
 * opened, it stays dismissed for the session, so switching language
 * doesn't replay it.
 */
export function VideoIntro({ content, children }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishedRef = useRef(false);
  const [state, setState] = useState<IntroState>('waiting');
  // Synchronous mirror of `state` for callbacks that outlive renders
  // (the prefetch) — updated in start() itself, before React re-renders,
  // so a prefetch landing in that same tick can't swap the source under
  // a video that has just started playing.
  const stateRef = useRef<IntroState>('waiting');
  const [firstFramePainted, setFirstFramePainted] = useState(false);
  const [ending, setEnding] = useState(false);

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

  // Prefetch the video into memory while the still is showing.
  const objectUrlRef = useRef<string | null>(null);
  useEffect(() => {
    if (effectiveState !== 'waiting') return;
    const controller = new AbortController();

    // `priority: 'high'` (Chromium) puts the video ahead of the photo,
    // fonts and scripts still downloading; other browsers ignore it.
    fetch(ASSETS.introVideo, { signal: controller.signal, priority: 'high' })
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(response.statusText))))
      .then((blob) => {
        const video = videoRef.current;
        if (!video || stateRef.current !== 'waiting' || !video.paused) return;
        objectUrlRef.current = URL.createObjectURL(blob);
        // Swapping the source under the still changes nothing on screen;
        // it just means play() later reads from memory.
        video.src = objectUrlRef.current;
      })
      .catch(() => undefined);

    // Tapped before the download finished: stop it so the video's own
    // streaming request has the bandwidth to itself. (The object URL is
    // deliberately NOT revoked here — the video may be playing from it.)
    return () => controller.abort();
  }, [effectiveState]);

  // Release the in-memory copy only when the intro is gone for good.
  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    sessionStorage.setItem(OPENED_KEY, 'true');
    window.dispatchEvent(new Event(OPEN_EVENT));
    stateRef.current = 'closing';
    setState('closing');
    // Just past the 0.45 s exit transition — long enough that the
    // overlay is never unmounted mid-fade, short enough that it stops
    // covering the invitation the moment it is invisible.
    window.setTimeout(() => {
      stateRef.current = 'closed';
      setState('closed');
    }, 520);
  };

  // The safety net only counts once playback has actually been started.
  useEffect(() => {
    if (effectiveState !== 'playing') return;
    const safety = window.setTimeout(finish, SAFETY_TIMEOUT_MS);
    return () => window.clearTimeout(safety);
  }, [effectiveState]);

  /**
   * Begin playback. Called first from `pointerdown` — the moment the
   * finger lands, ~100-300 ms before the browser synthesises `click` —
   * and again from the `click` behind it if that first go was refused.
   *
   * `lastChance` marks that second call: only then is the muted
   * fallback allowed. Falling back on the pointerdown attempt would
   * turn a browser that simply doesn't accept pointerdown as the
   * activating gesture into a silent intro, when the click a moment
   * later would have played it with sound.
   */
  const start = (lastChance: boolean) => {
    const video = videoRef.current;
    if (!video || stateRef.current !== 'waiting') return;
    stateRef.current = 'playing';
    // A real user gesture: also start the music silently so it is
    // already unlocked when the intro hands over to the invitation.
    primeAudio();
    setState('playing');
    video.muted = false;
    video.play().catch(() => {
      if (!lastChance) {
        // Hand the attempt back to the click that follows.
        stateRef.current = 'waiting';
        setState('waiting');
        return;
      }
      // Audible playback refused (unusual inside a gesture) — try
      // muted, and if even that fails, go straight to the invitation.
      video.muted = true;
      video.play().catch(finish);
    });
    // Dissolve the still only once a real frame is on screen.
    const painted = () => setFirstFramePainted(true);
    if (typeof video.requestVideoFrameCallback === 'function') {
      video.requestVideoFrameCallback(painted);
    } else {
      // Older Firefox: the first timeupdate lands a frame or two later.
      video.addEventListener('timeupdate', painted, { once: true });
    }
  };

  // A tap that landed before hydration already started the video (see
  // PRE_HYDRATION_TAP); adopt that state instead of waiting again.
  useEffect(() => {
    if (effectiveState === 'waiting' && window.__introTapped) start(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  if (effectiveState === 'closed') return null;

  const waiting = effectiveState === 'waiting';

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    const remaining = video.duration - video.currentTime;
    if (remaining <= ENDING_LEAD_S && !ending) setEnding(true);
    if (remaining <= HANDOVER_LEAD_S) finish();
  };

  return (
    <div
      id="intro-overlay"
      className={`intro-overlay fixed inset-0 z-50 overflow-hidden bg-ivory ${
        ending ? 'intro-overlay-ending' : ''
      } ${effectiveState === 'closing' ? 'intro-overlay-closing pointer-events-none' : ''}`}
    >
      {waiting && <script dangerouslySetInnerHTML={{ __html: PRE_HYDRATION_TAP }} />}

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
        src={STREAM_SRC}
        playsInline
        /* Header only (a few KB — the file is +faststart, so the moov
           box is at the front). Having duration and codecs already
           parsed means the tap goes straight to fetching media data
           instead of starting from nothing. */
        preload="metadata"
        aria-label={content.videoLabel}
        className="relative h-full w-full object-contain"
        onTimeUpdate={onTimeUpdate}
        onEnded={finish}
        onError={finish}
      />

      {/* The still of the first frame, exactly over the video, until the
          video has painted its own first frame. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ASSETS.introPoster}
        alt=""
        aria-hidden
        className={`intro-still absolute inset-0 h-full w-full object-contain ${
          firstFramePainted ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Blooms over the clip at its end, so the hand-over is a flash of
          light rather than a cut from the bright final frame. (Its own
          gradient background lives in `.intro-veil`.) */}
      <div aria-hidden className="intro-veil pointer-events-none absolute inset-0" />

      {/* Tapped, but no frame on screen yet — the clip is still
          buffering. Without this the message fades out and nothing
          visibly happens, which reads as a tap that didn't register. */}
      <div
        aria-hidden
        className={`intro-loading pointer-events-none absolute inset-0 z-10 flex items-end justify-center pb-[18svh] transition-opacity duration-300 ${
          effectiveState === 'playing' && !firstFramePainted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="intro-dots">
          <i />
          <i />
          <i />
        </span>
      </div>

      {/* Tap anywhere. Only the message is visible; it fades once playing. */}
      <button
        type="button"
        onPointerDown={() => start(false)}
        onClick={() => start(true)}
        disabled={!waiting}
        aria-hidden={!waiting}
        className={`intro-tap-target absolute inset-0 z-10 flex cursor-pointer items-end justify-center pb-[5svh] transition-opacity duration-500 ${
          waiting ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <span className="intro-tap label-caps text-[0.95rem] text-ink">{content.tapToOpen}</span>
      </button>

      {/* The overlay's own copy of the fixed UI (language toggle) is dropped
          the moment the dissolve starts: the page's identical pill sits
          underneath, and keeping this one would make it drift outward
          with the overlay's zoom. */}
      {effectiveState !== 'closing' && children}
    </div>
  );
}
