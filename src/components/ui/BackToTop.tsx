'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ArrowUp } from './icons';

/** Appears after one screen of scrolling; the header does not follow the page, so this is the way back. */
export function BackToTop() {
  const t = useTranslations('common');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#top"
      aria-label={t('backToTop')}
      data-beat
      className="pill fixed right-5 bottom-5 z-30 size-14 px-0 text-xl"
    >
      <ArrowUp />
    </a>
  );
}
