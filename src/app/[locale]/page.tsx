import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Characters } from '@/components/sections/Characters';
import { Hero } from '@/components/sections/Hero';
import { Reward } from '@/components/sections/Reward';
import { Story } from '@/components/sections/Story';

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <Hero />
      <Reward />
      <Story />
      <Characters />
    </main>
  );
}
