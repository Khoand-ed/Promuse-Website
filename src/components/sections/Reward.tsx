import { getTranslations } from 'next-intl/server';
import { CoverReveal, Reveal, RiseLines, TitleZoom } from '@/components/motion/reveal';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { getReward } from '@/content/data';
import { Link } from '@/i18n/navigation';
import { env } from '@/lib/env';
import { RewardActions } from './RewardActions';

/**
 * Laid out and animated like p3re.jp's "BUY NOW!" block. RewardActions holds the sign-in and
 * registration states and the first-visit popup; with NEXT_PUBLIC_BACKEND_MODE=off (production
 * until P3) it shows `notOpen`.
 */
export async function Reward() {
  const t = await getTranslations('reward');
  const reward = getReward();

  return (
    <section
      id="reward"
      aria-labelledby="reward-title"
      className="bg-white px-[6.7%] pt-24 pb-28 text-center md:pt-[11.25rem] md:pb-[6.7rem]"
    >
      <TitleZoom
        id="reward-title"
        className="type-display text-[3.4rem] md:text-[6.9vw] lg:text-[6.25rem]"
      >
        {t('title')}
      </TitleZoom>
      <RiseLines className="mx-auto mt-6 max-w-[40rem] text-[16px] leading-[1.9] tracking-[0.05em]">
        {t('desc')}
      </RiseLines>
      <CoverReveal className="mx-auto mt-10 w-[min(18rem,64vw)]">
        <ImageSlot slot={reward.art} sizes="(min-width: 768px) 288px, 64vw" />
      </CoverReveal>
      <Reveal from="none" delay={0.4} duration={1} easing="out" className="mt-12">
        <RewardActions
          mode={env.NEXT_PUBLIC_BACKEND_MODE}
          popupArt={<ImageSlot slot={reward.art} sizes="(min-width: 768px) 34rem, 90vw" />}
        />
      </Reveal>
      <Reveal
        from="none"
        delay={0.6}
        duration={1}
        easing="out"
        as="p"
        className="mt-5 text-[14px] tracking-[0.5px]"
      >
        {t('privacy')}{' '}
        <Link href="/privacy" className="underline underline-offset-4 hover:no-underline">
          {t('privacyLink')}
        </Link>
      </Reveal>
    </section>
  );
}
