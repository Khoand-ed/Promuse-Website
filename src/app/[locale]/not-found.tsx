import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <main className="grid min-h-svh place-items-center text-center">
      <div className="grid gap-3">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p>{t('body')}</p>
        <Link href="/" className="underline">
          {t('home')}
        </Link>
      </div>
    </main>
  );
}
