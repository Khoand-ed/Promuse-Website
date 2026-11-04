import { useTranslations } from 'next-intl';
import { ArrowRight } from '@/components/ui/icons';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <main
      id="main"
      tabIndex={-1}
      className="bg-mist grid min-h-svh place-items-center px-[6.7%] py-32 text-center outline-none"
    >
      <div>
        <h1 className="type-display text-[3.25rem] md:text-[5.25rem]">{t('title')}</h1>
        <p className="mt-6 text-[16px] leading-[1.9]">{t('body')}</p>
        <Link href="/" className="pill mt-12">
          {t('home')}
          <ArrowRight />
        </Link>
      </div>
    </main>
  );
}
