'use client';

import { useEffect } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useMotion } from './MotionProvider';
import { useMusic } from './MusicProvider';

/** The beat a moment of the music falls on: 0 from `firstBeat` (seconds), negative before it. */
export function beatIndex(time: number, firstBeat: number, bpm: number): number {
  return Math.floor(((time - firstBeat) * bpm) / 60);
}

function inView(element: Element): boolean {
  const box = element.getBoundingClientRect();
  return box.bottom > 0 && box.top < window.innerHeight && box.width > 0;
}

/**
 * The site's one beat (doc/SPEC.md, section 4), read from the music's playback position so pulses
 * land on the music's beats. While the music plays and motion is on, each beat pulses the
 * `[data-beat]` elements in view. It also sets `--beat-ms` on <html> for CSS loops (the scroll cue,
 * the spinning note). Never start another timer for beats.
 */
export function BeatClock() {
  const { enabled } = useMotion();
  const { playing, time, bpm, firstBeat } = useMusic();

  useEffect(() => {
    document.documentElement.style.setProperty('--beat-ms', `${60000 / bpm}ms`);
  }, [bpm]);

  useEffect(() => {
    if (!enabled || !playing) return;
    let last = Number.NaN;
    const tick = () => {
      const now = time();
      if (now === null || now < firstBeat) return;
      const beat = beatIndex(now, firstBeat, bpm);
      if (beat === last) return;
      last = beat;
      const targets = [...document.querySelectorAll('[data-beat]')].filter(inView);
      if (targets.length === 0) return;
      gsap.fromTo(
        targets,
        { scale: 1.05 },
        { scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto', clearProps: 'scale' },
      );
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [enabled, playing, time, bpm, firstBeat]);

  return null;
}
