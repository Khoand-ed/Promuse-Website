import { getImageProps } from 'next/image';
import { getTranslations } from 'next-intl/server';
import { HeroVideo } from '@/components/motion/HeroVideo';
import { Reveal, RiseLetters } from '@/components/motion/reveal';
import { Wordmark } from '@/components/ui/Wordmark';
import { getHero, getSite } from '@/content/data';
import { hasFile, hasPublicFile, type Slot } from '@/content/images';

/** The key visual: a portrait crop for phones, a landscape crop from 768 px; blue light until the art exists. */
async function KeyVisual() {
  const hero = getHero();
  const { intro, loop } = hero.video;
  const video =
    loop && hasPublicFile(loop) ? (
      <HeroVideo
        intro={intro && hasPublicFile(intro) ? intro : null}
        loop={loop}
        poster={hasFile(hero.desktop) ? hero.desktop.src : undefined}
      />
    ) : null;
  if (!hasFile(hero.desktop)) {
    return (
      <>
        <div aria-hidden="true" className="hero-fallback absolute inset-0 -z-10" />
        {video}
      </>
    );
  }

  const t = await getTranslations();
  const alt = t('hero.visualAlt');
  const props = ({ src, width, height }: Slot) =>
    getImageProps({ src, width, height, alt, sizes: '100vw', fetchPriority: 'high' }).props;
  const desktop = props(hero.desktop);
  const mobile = hasFile(hero.mobile) ? props(hero.mobile) : null;

  return (
    <>
      <picture>
        {mobile ? <source media="(max-width: 767px)" srcSet={mobile.srcSet} /> : null}
        {/* Art direction needs <picture>, which next/image does not render (doc: getImageProps). */}
        <img {...desktop} alt={alt} className="absolute inset-0 -z-10 size-full object-cover" />
      </picture>
      {video}
    </>
  );
}

export async function Hero() {
  const t = await getTranslations();
  // On phones the music button takes the top left corner, so the wordmark moves down.
  const music = hasPublicFile(getSite().music.src);

  return (
    <section id="top" className="relative isolate h-svh min-h-[34rem] overflow-hidden">
      <KeyVisual />

      <div className={`px-[6.7%] md:px-[4vw] md:pt-[5.6rem] ${music ? 'pt-24' : 'pt-9'}`}>
        <h1 className="text-ink md:absolute md:top-[41%] md:left-[57%] md:text-white">
          <Reveal
            as="span"
            immediate
            delay={0.3}
            duration={1}
            easing="out"
            className="hero-reveal block"
          >
            <Wordmark
              sizes="(min-width: 768px) 24vw, 40vw"
              className="text-[1.75rem] md:text-[5.1vw]"
            />
          </Reveal>
        </h1>
        <p className="type-display text-ink mt-9 uppercase md:mt-0">
          <span className="sr-only">
            {t('common.brand')} · {t('hero.status')}
          </span>
          <RiseLetters
            as="span"
            aria-hidden="true"
            immediate
            duration={0.5}
            stagger={0.03}
            className="hero-reveal block text-[1rem] md:text-[1.95vw]"
          >
            {t('common.brand')}
          </RiseLetters>
          <RiseLetters
            as="span"
            aria-hidden="true"
            immediate
            delay={0.15}
            duration={0.5}
            stagger={0.03}
            className="hero-reveal mt-1 block max-w-[12em] text-[1.9rem] leading-[1.05] md:text-[3.15vw]"
          >
            {t('hero.status')}
          </RiseLetters>
        </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-[15%] left-1/2 grid -translate-x-1/2 justify-items-center gap-2 text-white"
      >
        <span className="type-label text-[10px]">{t('hero.scroll')}</span>
        <span className="scroll-cue" />
      </div>
    </section>
  );
}
