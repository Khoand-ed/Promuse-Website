import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BeatClock } from '@/components/motion/BeatClock';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { MusicProvider } from '@/components/motion/MusicProvider';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { Footer } from '@/components/sections/Footer';
import { Header } from '@/components/sections/Header';
import { BackToTop } from '@/components/ui/BackToTop';
import { MusicButton } from '@/components/ui/MusicButton';
import { SkipLink } from '@/components/ui/SkipLink';
import { getSite } from '@/content/data';
import { hasPublicFile } from '@/content/images';
import { routing } from '@/i18n/routing';
import { env } from '@/lib/env';
import { motionBootScript } from '@/lib/motion/preference';
import { displayFont, labelFont, sansFont } from '../fonts';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: t('title'), template: `%s · ${t('title')}` },
    description: t('description'),
    // The site still shows placeholders, so it stays out of search results until launch (P7).
    robots: { index: false, follow: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const { music } = getSite();

  return (
    <html
      lang={locale}
      // In-page links scroll smoothly; Next.js still jumps instantly between pages.
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${sansFont.variable} ${labelFont.variable}`}
      // The boot script adds data-motion and data-intro before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <MotionProvider>
            <MusicProvider
              src={hasPublicFile(music.src) ? music.src : null}
              bpm={music.bpm}
              firstBeat={music.firstBeat}
              volume={music.volume}
            >
              <SmoothScroll />
              <BeatClock />
              <SkipLink />
              <MusicButton />
              <Header />
              {children}
              <Footer />
              <BackToTop />
            </MusicProvider>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
