import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import {
  CoverReveal,
  GrowLine,
  OutlineWord,
  RiseLetters,
  RiseLines,
} from '@/components/motion/reveal';
import { ImageSlot } from '@/components/ui/ImageSlot';
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

/**
 * The pale blue run of the page, as on p3re.jp: Introduction, Features and Gameplay in alternating
 * columns, three slogan lines under a hairline, and the name in giant outlined letters.
 * The "See details" buttons arrive with their modals (P5, P6).
 */
export async function Story() {
  const t = await getTranslations();
  const story = getStory();
  const bands = (['band1', 'band2', 'band3'] as const).slice(0, story.bands);

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
          image={getFeatures().cover}
          imageSide="left"
        >
          <RiseLines>{t('features.summary')}</RiseLines>
        </StoryBlock>
        <StoryBlock
          id="gameplay"
          title={t('gameplay.title')}
          image={getGameplay().cover}
          imageSide="right"
        >
          <RiseLines>{t('gameplay.summary')}</RiseLines>
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
