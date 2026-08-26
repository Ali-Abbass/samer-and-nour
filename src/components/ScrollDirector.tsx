'use client';

import { useEffect } from 'react';

/** Backdrop drift over the whole page, as a fraction of its height. */
const PARALLAX = 0.07;
/** How dense the ivory haze over the photo gets past the hero (0–1). */
const VEIL_MAX = 0.42;
/** Extra distance (in viewport heights) a card rises from as it enters. */
const RISE = 0.12;
/** How much a card shrinks as it recedes off the top. */
const SHRINK = 0.08;

/**
 * One passive scroll loop that "directs" the cinematic motion:
 *
 *  - drifts the fixed photo slowly upward (parallax) and fades in an
 *    ivory haze over it once the hero is scrolled away;
 *  - for every `[data-scene]` section, measures how far it is from
 *    resting position and writes it to CSS variables the card reads:
 *      --enter  0…1  section still below the viewport (card rises in)
 *      --leave  0…1  section scrolled past (card recedes, hero fades)
 *
 * Everything is written straight to style properties (no React state),
 * so scrolling never re-renders the tree. Honours reduced motion by
 * doing nothing at all.
 */
export function ScrollDirector() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const backdrop = document.getElementById('backdrop-motion');
    const veil = document.getElementById('backdrop-veil');
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const y = window.scrollY;
      const range = Math.max(document.documentElement.scrollHeight - vh, 1);

      if (backdrop) {
        backdrop.style.transform = `translate3d(0, ${(-(y / range) * PARALLAX * 100).toFixed(3)}%, 0)`;
      }
      if (veil) {
        veil.style.opacity = (Math.min(y / (vh * 0.9), 1) * VEIL_MAX).toFixed(3);
      }

      for (const scene of scenes) {
        const top = scene.getBoundingClientRect().top / vh;
        const enter = Math.min(Math.max(top, 0), 1);
        const leave = Math.min(Math.max(-top, 0), 1);
        scene.style.setProperty('--enter', enter.toFixed(3));
        scene.style.setProperty('--leave', leave.toFixed(3));
        scene.style.setProperty('--rise', `${(enter * RISE * vh).toFixed(1)}px`);
        scene.style.setProperty('--shrink', (1 - leave * SHRINK).toFixed(3));
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
