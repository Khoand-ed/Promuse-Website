import { getTranslations } from 'next-intl/server';
import type { CSSProperties, ReactNode } from 'react';
import {
  CoverReveal,
  GrowLine,
  OutlineWord,
  Reveal,
  RiseLetters,
  RiseLines,
} from '@/components/motion/reveal';
import { DetailModal } from '@/components/ui/DetailModal';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { Slider } from '@/components/ui/Slider';
import { getFeatures, getGameplay, getStory } from '@/content/data';
import type { Slot } from '@/content/images';

interface StoryBlockProps {
  id: string;
  title: string;
  image: Slot;
  /** Side of the image from 768 px; it bleeds to that edge of the screen. */
  imageSide: 'left' | 'right';
  children: ReactNode;
}

function StoryBlock({ id, title, image, imageSide, children }: StoryBlockProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="story-block" data-image={imageSide}>
      <RiseLetters
        id={`${id}-title`}
        className="story-title type-display text-center text-[3.25rem] md:pb-9 md:text-left md:text-[5.85vw] lg:text-[5.25rem]"
      >
        {title}
      </RiseLetters>
      <CoverReveal className="story-image">
        <ImageSlot slot={image} sizes="(min-width: 768px) 52vw, 87vw" />
      </CoverReveal>
      <div className="story-text type-body space-y-7">{children}</div>
    </section>
  );
}

/** Order of a panel part in its entrance, for the modal's `data-rise` stagger. */
const rise = (n: number) => ({ '--rise': n }) as CSSProperties;

/**
 * The pale blue run of the page, as on p3re.jp: Introduction, Features and Gameplay in alternating
 * columns, three slogan lines under a hairline, and the name in giant outlined letters. Features
 * and Gameplay each open a detail modal with four tabs (doc/SPEC.md, sections 5 and 6).
 */
export async function Story() {
  const t = await getTranslations();
  const story = getStory();
  const features = getFeatures();
  const gameplay = getGameplay();
  const bands = (['band1', 'band2', 'band3'] as const).slice(0, story.bands);

  // Features: "FEATURE #n", the title, a hairline, one or two sentences, then two images.
  const featureTabs = features.items.map((item, index) => ({
    key: item.key,
    label: t(`features.items.${item.key}.tab`),
    content: (
      <>
        <div className="feature-head">
          <div className="feature-heading">
            <p data-rise style={rise(0)} className="feature-number type-label">
              {t('features.number', { n: index + 1 })}
            </p>
            <h3 data-rise style={rise(0)} className="feature-title type-display">
              {t(`features.items.${item.key}.title`)}
            </h3>
          </div>
          <span aria-hidden="true" className="feature-rule" />
          <p data-rise style={rise(1)} className="feature-text">
            {t(`features.items.${item.key}.text`)}
          </p>
        </div>
        <div data-rise style={rise(2)} className="feature-images">
          {item.images.map((image) => (
            <ImageSlot key={image.src} slot={image} sizes="(min-width: 1024px) 41vw, 87vw" />
          ))}
        </div>
      </>
    ),
  }));

  // Gameplay: a slider of 16:9 images beside the title and a paragraph; the gacha tab adds its rates.
  const gameplayTabs = gameplay.tabs.map((tab) => ({
    key: tab.key,
    label: t(`gameplay.tabs.${tab.key}.tab`),
    content: (
      <div className="gameplay-panel">
        <div data-rise style={rise(2)}>
          <Slider
            label={t(`gameplay.tabs.${tab.key}.title`)}
            slides={tab.slides.map((slide) => (
              <ImageSlot key={slide.src} slot={slide} sizes="(min-width: 1024px) 46vw, 87vw" />
            ))}
            previous={t('gameplay.previous')}
            next={t('gameplay.next')}
            positions={tab.slides.map((_, index) =>
              t('gameplay.position', { current: index + 1, total: tab.slides.length }),
            )}
          />
        </div>
        <div className="gameplay-copy">
          <h3 data-rise style={rise(0)} className="gameplay-title type-display">
            {t(`gameplay.tabs.${tab.key}.title`)}
          </h3>
          <p data-rise style={rise(1)} className="gameplay-text">
            {t(`gameplay.tabs.${tab.key}.text`)}
          </p>
          {gameplay.gacha.tab === tab.key ? (
            <p data-rise style={rise(1)} className="gameplay-rates type-label">
              {t('gameplay.rates', gameplay.gacha.rates)}
            </p>
          ) : null}
        </div>
      </div>
    ),
  }));

  return (
    <div className="bg-sky overflow-hidden pt-24 md:pt-[12.2rem]">
      <div className="grid gap-24 md:gap-[6.4rem]">
        <StoryBlock id="story" title={t('story.title')} image={story.image} imageSide="right">
          <RiseLines>{t('story.p1')}</RiseLines>
          <RiseLines>{t('story.p2')}</RiseLines>
          <RiseLines>{t('story.p3')}</RiseLines>
        </StoryBlock>
        <StoryBlock
          id="features"
          title={t('features.title')}
          image={features.cover}
          imageSide="left"
        >
          <RiseLines>{t('features.summary')}</RiseLines>
          <Reveal from="none" delay={0.2} duration={1} easing="out">
            <DetailModal
              hash="features-detail"
              tabs="features"
              buttonLabel={t('features.seeDetails')}
              label={t('features.title')}
              items={featureTabs}
              scrollLabel={t('hero.scroll')}
            />
          </Reveal>
        </StoryBlock>
        <StoryBlock
          id="gameplay"
          title={t('gameplay.title')}
          image={gameplay.cover}
          imageSide="right"
        >
          <RiseLines>{t('gameplay.summary')}</RiseLines>
          <Reveal from="none" delay={0.2} duration={1} easing="out">
            <DetailModal
              hash="gameplay-detail"
              tabs="gameplay"
              buttonLabel={t('gameplay.details')}
              label={t('gameplay.title')}
              items={gameplayTabs}
              scrollLabel={t('hero.scroll')}
            />
          </Reveal>
        </StoryBlock>
      </div>

      <div className="mt-24 text-center md:mt-[5.6rem]">
        <GrowLine className="bg-ink mx-auto h-[50px] w-px" />
        <RiseLines
          delay={0.5}
          stagger={0.3}
          className="mt-5 text-[12px] leading-[24px] tracking-[0.8px]"
        >
          {bands.map((band) => (
            <span key={band} className="block">
              {t(`story.${band}`)}
            </span>
          ))}
        </RiseLines>
      </div>

      <OutlineWord className="outline-word type-display mt-20 text-center text-[21.4vw] leading-[0.74] whitespace-nowrap uppercase md:mt-24">
        {t('common.brand')}
      </OutlineWord>
    </div>
  );
}
