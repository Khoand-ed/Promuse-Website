'use client';

import { useTranslations } from 'next-intl';
import { useMusic } from '@/components/motion/MusicProvider';
import { MusicNote } from './icons';

/**
 * The round music button in the top left corner (doc/SPEC.md, section 3). Hidden until the owner
 * adds the music file. While the music plays, its note spins and the button pulses on the beat.
 */
export function MusicButton() {
  const t = useTranslations('common');
  const { available, playing, toggle } = useMusic();
  if (!available) return null;

  return (
    <button
      type="button"
      aria-pressed={playing}
      aria-label={t('music')}
      title={t('music')}
      data-beat
      onClick={toggle}
      className="music-button pill fixed top-4 left-4 z-40 size-12 min-h-12 px-0 text-[22px] md:top-6 md:left-6"
    >
      <MusicNote className="music-note" />
    </button>
  );
}
