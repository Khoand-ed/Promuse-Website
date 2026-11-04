'use client';

import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { ease, gsap, useGSAP } from '@/lib/motion/gsap';
import { OPENING_DONE } from '@/lib/motion/opening';
import { INTRO_KEY } from '@/lib/motion/preference';

/** One wave band, wider than the screen so it can drift by one period (400 units) and loop. */
function wavePath(amplitude: number, base: number) {
  const crest = base - amplitude;
  let d = `M-400 ${base} Q-300 ${crest} -200 ${base}`;
  for (let x = 0; x <= 2000; x += 200) d += ` T${x} ${base}`;
  return `${d} V160 H-400Z`;
}

const waves = [
  { alpha: 0.3, amplitude: 26, base: 70, seconds: 23 },
  { alpha: 0.5, amplitude: 20, base: 86, seconds: 17 },
  { alpha: 0.7, amplitude: 16, base: 104, seconds: 13 },
  { alpha: 0.85, amplitude: 12, base: 122, seconds: 9 },
];

/**
 * The opening, after p3re.jp's loading screen (doc/SPEC.md, section 5): blue water covers the
 * screen, drains with waves on its surface to show the title and three lines, then fades into the
 * hero. Shown by CSS before the first paint when the boot script set `data-intro="play"`.
 */
export function Opening() {
  const t = useTranslations('intro');
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const water = useRef<HTMLDivElement>(null);
  const skipButton = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const html = document.documentElement;
    if (html.dataset.intro !== 'play') {
      setDone(true);
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem(INTRO_KEY, '1');
      } catch {
        // Without storage the opening simply plays again next time.
      }
      delete html.dataset.intro;
      window.dispatchEvent(new Event(OPENING_DONE));
      setDone(true);
    };

    // Focus lets screen readers land on the opening; no ring, since nobody asked for it by keyboard.
    // `focusVisible` is in the HTML standard but not yet in TypeScript's DOM types.
    skipButton.current?.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
    const timeline = gsap
      .timeline({ onComplete: finish })
      .to(water.current, { yPercent: 100, y: 170, duration: 2.5, ease: ease.drain }, 0.5)
      .to(root.current, { opacity: 0, duration: 0.5, ease: ease.out }, 2.5);

    const skip = () => {
      if (finished || timeline.progress() > 0.9) return;
      timeline.kill();
      gsap.to(root.current, { opacity: 0, duration: 0.3, ease: ease.out, onComplete: finish });
    };
    const overlay = root.current;
    window.addEventListener('keydown', skip);
    overlay?.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      overlay?.removeEventListener('pointerdown', skip);
    };
  });

  if (done) return null;

  return (
    <div
      ref={root}
      className="opening"
      role="dialog"
      aria-modal="true"
      aria-labelledby="opening-title"
    >
      <div className="grid h-full content-center justify-items-center px-[6.7%] text-center">
        <p id="opening-title" className="type-display text-[2.25rem] md:text-[2.75rem]">
          {t('title')}
        </p>
        <p className="mt-6 text-[11px] leading-[1.7] tracking-[0.04em] md:text-[12px]">
          <span className="block">{t('line1')}</span>
          <span className="block">{t('line2')}</span>
          <span className="block">{t('line3')}</span>
        </p>
      </div>

      <div ref={water} className="opening-water" aria-hidden="true">
        <svg className="opening-waves" viewBox="0 0 1600 160" preserveAspectRatio="none">
          {waves.map((wave) => (
            <path
              key={wave.alpha}
              d={wavePath(wave.amplitude, wave.base)}
              fill={`rgb(2 158 235 / ${wave.alpha})`}
              style={{ animationDuration: `${wave.seconds}s` }}
            />
          ))}
        </svg>
      </div>

      <button ref={skipButton} type="button" className="opening-skip pill type-label">
        {t('skip')}
      </button>
    </div>
  );
}
