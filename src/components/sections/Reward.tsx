import { getTranslations } from 'next-intl/server';
import { ArrowRight } from '@/components/ui/icons';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { getReward } from '@/content/data';
import { Link } from '@/i18n/navigation';

/**
 * Laid out like p3re.jp's "BUY NOW!" block. Registration is not open yet, so the button shows the
 * `notOpen` state; the sign-in flow replaces it in P2.
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
      <h2
        id="reward-title"
        className="type-display text-[3.4rem] md:text-[6.9vw] lg:text-[6.25rem]"
      >
        {t('title')}
      </h2>
      <p className="mx-auto mt-6 max-w-[40rem] text-[16px] leading-[1.9] tracking-[0.05em]">
        {t('desc')}
      </p>
      <div className="mx-auto mt-10 w-[min(18rem,64vw)]">
        <ImageSlot slot={reward.art} sizes="(min-width: 768px) 288px, 64vw" />
      </div>
      <button type="button" disabled className="pill pill-xl mt-12">
        {t('states.notOpen')}
        <ArrowRight />
      </button>
      <p className="mt-5 text-[14px] tracking-[0.5px]">
        {t('privacy')}{' '}
        <Link href="/privacy" className="underline underline-offset-4 hover:no-underline">
          {t('privacyLink')}
        </Link>
      </p>
    </section>
  );
}
