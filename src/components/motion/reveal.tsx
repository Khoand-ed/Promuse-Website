'use client';

import { createElement, useRef, type HTMLAttributes, type ReactNode, type RefObject } from 'react';
import { ease, gsap, revealStart, ScrollTrigger, SplitText, useGSAP } from '@/lib/motion/gsap';
import { afterOpening } from '@/lib/motion/opening';
import { useMotion } from './MotionProvider';

// The reveal motifs of doc/SPEC.md, section 4, timed after p3re.jp. Each one renders its own
// element, plays once when that element enters the viewport (or, with `immediate`, as soon as the
// opening is over), and does nothing with motion off: the content is then simply there.

type Tag = 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'ul' | 'dl' | 'li';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: Tag;
  children?: ReactNode;
  /** Seconds before the motion starts. */
  delay?: number;
  /** Play when the opening is over instead of on scroll (above-the-fold content). */
  immediate?: boolean;
}

type Build = (element: HTMLElement) => gsap.core.Animation;

/** Builds the animation paused, then plays it on scroll or after the opening. */
function useReveal<T extends HTMLElement = HTMLElement>(build: Build, immediate = false) {
  const ref = useRef<T>(null);
  const { enabled } = useMotion();

  useGSAP(
    () => {
      const element = ref.current;
      if (!enabled || !element) return;
      const animation = build(element).pause();
      if (immediate) return afterOpening(() => void animation.play());
      // Plays at once if the page already sits past this point.
      ScrollTrigger.create({
        trigger: element,
        start: revealStart,
        once: true,
        animation,
        toggleActions: 'play none none none',
      });
    },
    { dependencies: [enabled], revertOnUpdate: true },
  );

  return ref;
}

function render(
  as: Tag,
  ref: RefObject<HTMLElement | null>,
  props: HTMLAttributes<HTMLElement>,
  children: ReactNode,
) {
  return createElement(as, { ...props, ref }, children);
}

/** Rises 50 px (or slides in 30 px from the right) and fades in. */
export function Reveal({
  as = 'div',
  delay = 0,
  immediate,
  from = 'below',
  duration = 0.6,
  children,
  ...props
}: RevealProps & { from?: 'below' | 'right' | 'none'; duration?: number }) {
  const ref = useReveal(
    (element) =>
      gsap.from(element, {
        y: from === 'below' ? 50 : 0,
        x: from === 'right' ? 30 : 0,
        opacity: 0,
        duration,
        delay,
        ease: from === 'below' ? ease.inOut : ease.out,
      }),
    immediate,
  );
  return render(as, ref, props, children);
}

/** Display titles: each letter rises 80 px and fades in, one after another. */
export function RiseLetters({ as = 'h2', delay = 0, immediate, children, ...props }: RevealProps) {
  const ref = useReveal((element) => {
    const split = SplitText.create(element, { type: 'words,chars', aria: 'auto' });
    return gsap.from(split.chars, {
      y: 80,
      opacity: 0,
      duration: 1,
      delay,
      ease: ease.out,
      stagger: 0.05,
    });
  }, immediate);
  return render(as, ref, props, children);
}

/** Text: each line slides up out of a mask and fades in; `stagger` spaces the lines. */
export function RiseLines({
  as = 'p',
  delay = 0,
  stagger = 0,
  immediate,
  children,
  ...props
}: RevealProps & { stagger?: number }) {
  const ref = useReveal((element) => {
    // Lines keep their words whole, so the text reads normally without extra ARIA.
    const split = SplitText.create(element, { type: 'lines', mask: 'lines', aria: 'none' });
    return gsap.from(split.lines, {
      yPercent: 100,
      opacity: 0,
      duration: 1,
      delay,
      stagger,
      ease: ease.out,
    });
  }, immediate);
  return render(as, ref, props, children);
}

/** Images: uncovered from the bottom while fading in. */
export function CoverReveal({ as = 'div', delay = 0, immediate, children, ...props }: RevealProps) {
  const ref = useReveal(
    (element) =>
      gsap
        .timeline({ delay })
        .fromTo(
          element,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: ease.linear, delay: 0.2 },
        )
        .from(element, { opacity: 0, duration: 0.5, ease: ease.inOut }, 0),
    immediate,
  );
  return render(as, ref, props, children);
}

/** The reward title: waits small and low, then grows into place (1.5 s in all). */
export function TitleZoom({ as = 'h2', delay = 0, immediate, children, ...props }: RevealProps) {
  const ref = useReveal(
    (element) =>
      gsap
        .timeline({ delay })
        .from(element, { opacity: 0, duration: 0.8, ease: ease.out })
        .from(element, { y: 100, scale: 0.7, duration: 0.825, ease: ease.inOut }, 0.675),
    immediate,
  );
  return render(as, ref, props, children);
}

/** A hairline that grows to its full length. */
export function GrowLine({
  axis = 'y',
  delay = 0,
  className = '',
}: {
  axis?: 'x' | 'y';
  delay?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLSpanElement>((element) =>
    gsap.from(element, {
      [axis === 'y' ? 'scaleY' : 'scaleX']: 0,
      transformOrigin: axis === 'y' ? 'top center' : 'left center',
      duration: 1,
      delay,
      ease: axis === 'y' ? ease.inOut : ease.linear,
    }),
  );
  return <span ref={ref} aria-hidden="true" className={`block ${className}`} />;
}

/** The giant outlined word: its letters appear one by one. Decorative, so hidden from screen readers. */
export function OutlineWord({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLParagraphElement>((element) => {
    const split = SplitText.create(element, { type: 'chars', aria: 'none' });
    return gsap.from(split.chars, {
      clipPath: 'inset(0% 100% 0% 0%)',
      opacity: 0,
      duration: 0.5,
      ease: 'sine.in',
      stagger: 0.12,
    });
  });
  return (
    <p ref={ref} aria-hidden="true" className={className}>
      {children}
    </p>
  );
}

/** Small labels such as SPEC: the letters slide up into place. */
export function SplitLabel({ as = 'h2', delay = 0, children, ...props }: RevealProps) {
  const ref = useReveal((element) => {
    const split = SplitText.create(element, { type: 'chars', mask: 'chars', aria: 'auto' });
    return gsap.from(split.chars, {
      yPercent: 100,
      duration: 1,
      delay,
      ease: ease.out,
      stagger: 0.04,
    });
  });
  return render(as, ref, props, children);
}
