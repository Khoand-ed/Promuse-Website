import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { TrailerButton } from '@/components/ui/TrailerButton';
import { getSite } from '@/content/data';

/** p3re.jp's trailer strip under the hero. Absent until content/data/site.json has a trailerId. */
export async function Trailer() {
  const { trailerId } = getSite();
  if (!trailerId) return null;
  const t = await getTranslations('hero');

  return (
    <div className="grid place-items-center bg-white py-16 md:py-24">
      <Reveal from="none" duration={1} easing="out">
        <TrailerButton videoId={trailerId} label={t('trailer')} />
      </Reveal>
    </div>
  );
}
