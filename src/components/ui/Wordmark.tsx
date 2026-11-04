import { getTranslations } from 'next-intl/server';
import { getSite } from '@/content/data';
import { hasFile } from '@/content/images';
import { ImageSlot } from './ImageSlot';

interface WordmarkProps {
  /** Width hints for the logo file, as in `next/image`. */
  sizes: string;
  className?: string;
}

/** The logo from content/data/site.json, or the name set in type until the file exists. */
export async function Wordmark({ sizes, className = '' }: WordmarkProps) {
  const site = getSite();
  if (hasFile(site.logo)) return <ImageSlot slot={site.logo} sizes={sizes} className={className} />;

  const t = await getTranslations('common');
  return (
    <span
      className={`font-label leading-none font-extrabold tracking-[0.02em] uppercase ${className}`}
    >
      {t('brand')}
    </span>
  );
}
