import type { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Opening } from '@/components/motion/Opening';
import { Characters } from '@/components/sections/Characters';
import { Hero } from '@/components/sections/Hero';
import { Reward } from '@/components/sections/Reward';
import { Story } from '@/components/sections/Story';
import { Trailer } from '@/components/sections/Trailer';
import { introBootScript } from '@/lib/motion/preference';

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <>
      {/* Decides before the hero is painted whether the opening plays (doc/SPEC.md, section 5). */}
      <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
      <Opening />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Trailer />
        <Reward />
        <Story />
        <Characters />
      </main>
    </>
  );
}
