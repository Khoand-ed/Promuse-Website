'use client';

import { useRef, type HTMLAttributes, type ReactNode } from 'react';
import { ease, gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap';
import { useMotion } from './MotionProvider';

/** p3re.jp's pinned scroll: about 1.07 px of scrolling per pixel the row moves. */
const SCROLL_PER_PIXEL = 1.07;

interface CharacterSceneProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

/**
 * The characters section as p3re.jp's pinned scene (doc/SPEC.md, section 4). With motion on, the
 * section pins and its `.chara-row` moves sideways with the scroll. The card nearest the centre turns
 * to colour, the background fades to its colour, and the other cards take that tint; cards slide in
 * as they come into view. With motion off it stays a plain sideways scroller, each card in its own
 * colour.
 */
export function CharacterScene({ children, ...props }: CharacterSceneProps) {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotion();

  useGSAP(
    () => {
      const section = ref.current;
      const row = section?.querySelector<HTMLElement>('.chara-row');
      if (!enabled || !section || !row) return;

      const cards = [...section.querySelectorAll<HTMLElement>('.chara-card')];
      const layers = [...section.querySelectorAll<HTMLElement>('[data-layer]')];
      const tints = [...section.querySelectorAll<HTMLElement>('[data-tint]')];
      const ownTints = tints.filter((tint) => tint.dataset.on !== undefined);

      const show = (active: number) => {
        for (const layer of layers)
          layer.toggleAttribute('data-on', Number(layer.dataset.layer) === active);
        cards.forEach((card, index) => card.toggleAttribute('data-active', index === active));
        for (const tint of tints)
          tint.toggleAttribute('data-on', Number(tint.dataset.tint) === active);
      };
      let active = Number.NaN;
      const update = () => {
        const centre = window.innerWidth / 2;
        let nearest = -1;
        let distance = Infinity;
        cards.forEach((card, index) => {
          const box = card.getBoundingClientRect();
          const gap = Math.abs(box.left + box.width / 2 - centre);
          if (gap < distance && gap < box.width * 0.75) {
            nearest = index;
            distance = gap;
          }
        });
        if (nearest !== active) {
          active = nearest;
          show(nearest);
        }
      };

      // Cards slide in from 30 px to the right as they come into view (1 s, ease-out).
      const entrances = cards.map((card) =>
        gsap.fromTo(
          card,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: ease.out, paused: true },
        ),
      );
      const enter = () => {
        cards.forEach((card, index) => {
          const entrance = entrances[index];
          if (
            entrance &&
            entrance.progress() === 0 &&
            card.getBoundingClientRect().left < window.innerWidth * 0.95
          ) {
            entrance.play();
          }
        });
      };

      section.dataset.scene = 'on';
      const travel = () => Math.max(0, row.scrollWidth - section.clientWidth);
      const move = gsap.to(row, { x: () => -travel(), ease: 'none' });
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${travel() * SCROLL_PER_PIXEL}`,
        pin: true,
        scrub: true,
        animation: move,
        invalidateOnRefresh: true,
        onUpdate: () => {
          update();
          enter();
        },
      });
      ScrollTrigger.create({ trigger: section, start: 'top 70%', once: true, onEnter: enter });
      show(-1);

      return () => {
        delete section.dataset.scene;
        // Back to the motion-off look: no active card, each card tinted with its own colour.
        for (const layer of layers) layer.removeAttribute('data-on');
        for (const card of cards) card.removeAttribute('data-active');
        for (const tint of tints) tint.toggleAttribute('data-on', ownTints.includes(tint));
      };
    },
    { dependencies: [enabled], revertOnUpdate: true },
  );

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
