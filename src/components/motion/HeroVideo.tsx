'use client';

import { useEffect, useRef, useState } from 'react';
import { afterOpening } from '@/lib/motion/opening';
import { useMotion } from './MotionProvider';

interface HeroVideoProps {
  /** Plays once before the loop, as on p3re.jp. */
  intro: string | null;
  loop: string;
  /** The desktop key visual, shown until the video has frames. */
  poster?: string;
}

/**
 * The optional hero video (doc/SPEC.md, section 5): from 768 px and with motion on, the opening clip
 * plays once after the opening, then the loop fades in. Otherwise the key visual stays.
 */
export function HeroVideo({ intro, loop, poster }: HeroVideoProps) {
  const { enabled } = useMotion();
  const [wide, setWide] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'loop'>(intro ? 'intro' : 'loop');
  const introVideo = useRef<HTMLVideoElement>(null);
  const loopVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const update = () => setWide(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled || !wide) return;
    return afterOpening(() => {
      const first = phase === 'intro' ? introVideo.current : loopVideo.current;
      first?.play().catch(() => setPhase('loop'));
    });
    // Starting playback once is enough; the phase changes through the video events.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, wide]);

  if (!enabled || !wide) return null;

  const layer = 'absolute inset-0 -z-10 size-full object-cover transition-opacity duration-500';
  return (
    <>
      {intro ? (
        <video
          ref={introVideo}
          src={intro}
          poster={poster}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onEnded={() => {
            setPhase('loop');
            void loopVideo.current?.play().catch(() => {});
          }}
          className={`${layer} ${phase === 'intro' ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : null}
      <video
        ref={loopVideo}
        src={loop}
        poster={poster}
        muted
        playsInline
        loop
        preload={intro ? 'metadata' : 'auto'}
        aria-hidden="true"
        className={`${layer} ${phase === 'loop' ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
}
