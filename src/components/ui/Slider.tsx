'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useMotion } from '@/components/motion/MotionProvider';
import { ArrowRight } from './icons';

interface SliderProps {
  /** Names the slider for screen readers. */
  label: string;
  /** The slides, rendered on the server; each is a 16:9 image. */
  slides: ReactNode[];
  previous: string;
  next: string;
  /** "Image {current} of {total}", already translated for each position. */
  positions: string[];
}

/**
 * A row of 16:9 slides on CSS scroll snap (doc/SPEC.md, section 6): swipe on touch screens, the
 * previous and next buttons, a square dot per slide as on p3re.jp, ← and → when it has focus. The
 * position is announced politely ("Image 2 of 5"), and with motion off the slides jump.
 */
export function Slider({ label, slides, previous, next, positions }: SliderProps) {
  const { enabled } = useMotion();
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = slides.length - 1;

  // The slide in view decides the index, whichever way it got there: buttons, dots, swipe or keys.
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const width = element.clientWidth || 1;
      setIndex(Math.min(last, Math.max(0, Math.round(element.scrollLeft / width))));
    };
    element.addEventListener('scroll', update, { passive: true });
    return () => element.removeEventListener('scroll', update);
  }, [last]);

  const go = (target: number) => {
    const element = track.current;
    if (!element) return;
    const clamped = Math.min(last, Math.max(0, target));
    element.scrollTo({
      left: clamped * element.clientWidth,
      behavior: enabled ? 'smooth' : 'auto',
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    go(index + (event.key === 'ArrowRight' ? 1 : -1));
  };

  return (
    <div role="group" aria-roledescription="carousel" aria-label={label} className="slider">
      <div ref={track} tabIndex={0} onKeyDown={onKeyDown} className="slider-track">
        {slides.map((slide, position) => (
          <div
            key={position}
            role="group"
            aria-roledescription="slide"
            aria-label={positions[position]}
            className="slider-slide"
          >
            {slide}
          </div>
        ))}
      </div>
      <div className="slider-controls">
        <button
          type="button"
          aria-label={previous}
          disabled={index === 0}
          onClick={() => go(index - 1)}
          className="slider-arrow"
        >
          <ArrowRight className="rotate-180" />
        </button>
        <div className="slider-dots">
          {slides.map((_, position) => (
            <button
              key={position}
              type="button"
              aria-label={positions[position]}
              aria-current={position === index || undefined}
              onClick={() => go(position)}
              className="slider-dot"
            />
          ))}
        </div>
        <button
          type="button"
          aria-label={next}
          disabled={index === last}
          onClick={() => go(index + 1)}
          className="slider-arrow"
        >
          <ArrowRight />
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {positions[index]}
      </p>
    </div>
  );
}
