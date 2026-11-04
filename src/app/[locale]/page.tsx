import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

// Temporary until the page shell is built on the chosen style tile, later in P1.
export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations();

  return (
    <main className="grid min-h-svh place-items-center text-center">
      <div className="grid gap-3">
        <h1 className="text-4xl font-bold tracking-widest">{t('common.brand')}</h1>
        <p>{t('hero.status')}</p>
      </div>
    </main>
  );
}
