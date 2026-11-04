'use client';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { useMotion } from './MotionProvider';

/**
 * Lenis smooth scrolling driven by the GSAP ticker, as on p3re.jp. Off with motion off. It pauses
 * while a dialog is open or the opening plays, and ScrollTrigger is refreshed once fonts and images
 * have loaded.
 */
export function SmoothScroll() {
  const { enabled } = useMotion();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    void document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const sync = () => {
      const held =
        document.documentElement.dataset.intro === 'play' || document.querySelector('dialog[open]');
      if (held) lenis.stop();
      else lenis.start();
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      subtree: true,
      attributeFilter: ['open', 'data-intro'],
    });

    return () => {
      observer.disconnect();
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [enabled]);

  return null;
}
