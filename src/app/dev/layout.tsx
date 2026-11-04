import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { BeatClock } from '@/components/motion/BeatClock';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { MusicProvider } from '@/components/motion/MusicProvider';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { MusicButton } from '@/components/ui/MusicButton';
import { getSite } from '@/content/data';
import { hasPublicFile } from '@/content/images';
import { motionBootScript } from '@/lib/motion/preference';
import { displayFont, labelFont, sansFont } from '../fonts';
import '../globals.css';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Development-only pages (each returns 404 in production). Vietnamese content. */
export default function DevLayout({ children }: LayoutProps<'/dev'>) {
  const { music } = getSite();
  return (
    <html
      lang="vi"
      className={`${displayFont.variable} ${sansFont.variable} ${labelFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <MotionProvider>
            {/* Without the owner's file, a click track stands in so the beat can be checked. */}
            <MusicProvider
              src={hasPublicFile(music.src) ? music.src : null}
              bpm={music.bpm}
              firstBeat={music.firstBeat}
              volume={music.volume}
              clickTrackFallback
            >
              <SmoothScroll />
              <BeatClock />
              <MusicButton />
              {children}
            </MusicProvider>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
