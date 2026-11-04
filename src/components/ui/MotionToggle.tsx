'use client';

import { useTranslations } from 'next-intl';
import { useMotion } from '@/components/motion/MotionProvider';

/** "Effects: on / off". The state lives in MotionProvider and localStorage. */
export function MotionToggle({ className = '' }: { className?: string }) {
  const t = useTranslations('common');
  const { enabled, setEnabled } = useMotion();

  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={() => setEnabled(!enabled)}
      className={`type-label flex min-h-11 items-center gap-2 text-[12px] font-bold ${className}`}
    >
      {t('effects')}
      <span aria-hidden="true" className="font-sans text-[13px] font-semibold normal-case">
        {enabled ? t('effectsOn') : t('effectsOff')}
      </span>
    </button>
  );
}
