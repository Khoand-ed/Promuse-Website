// The only place GSAP plugins are registered. Import GSAP from here, in client components only.
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/** p3re.jp's CSS easings (`ease-out`, `ease-in-out`, `linear`) in GSAP terms. */
export const ease = {
  out: 'power1.out',
  inOut: 'power1.inOut',
  linear: 'none',
} as const;

/** Where a reveal starts: when the element's top passes 85% of the viewport height. */
export const revealStart = 'top 85%';

export { gsap, ScrollTrigger, SplitText, useGSAP };
