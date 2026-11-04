import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { getCharacters } from '@/content/data';

/** A character's colour, or the next colour of the palette while themeColor is still null. */
function colourOf(themeColor: string | null, index: number): string {
  return themeColor ?? `var(--color-chara-${(index % 11) + 1})`;
}

/**
 * As on p3re.jp, one row that scrolls sideways: the big title and its three lines, then a portrait
 * per character, grey and tinted with its colour until hovered. The pinned scroll scene that moves
 * this row comes with the motion system (P4); profiles open from the cards in P6.
 */
export async function Characters() {
  const t = await getTranslations('characters');
  const { items } = getCharacters();

  return (
    <section
      id="characters"
      aria-labelledby="characters-title"
      // Focusable so the row can be scrolled with the arrow keys; `relative` keeps the
      // screen-reader-only text inside the scrolling row instead of widening the page.
      tabIndex={0}
      className="chara-track bg-azure relative flex snap-x snap-mandatory items-center overflow-x-auto py-20 lg:min-h-svh lg:snap-none lg:py-16"
    >
      <div className="w-[87vw] shrink-0 snap-start pr-[4vw] pl-[6.7vw] lg:w-[73.4vw] lg:pl-[9.3vw]">
        <h2
          id="characters-title"
          className="type-display text-[16vw] leading-[0.9] lg:text-[11.5vw]"
        >
          {t('title')}
        </h2>
        <p className="mt-10 grid gap-2 text-[16px] leading-[2.1] tracking-[0.8px] lg:mt-16">
          <span>{t('line1')}</span>
          <span>{t('line2')}</span>
          <span>{t('line3')}</span>
        </p>
      </div>

      <ul className="flex shrink-0 gap-[8vw] pr-[6.7vw] lg:gap-[13.9vw] lg:pr-[9.3vw]">
        {items.map((character, index) => (
          <li
            key={character.slug}
            className="chara-card w-[72vw] shrink-0 snap-center lg:w-[37.7vw] lg:max-w-[543px]"
            style={{ '--chara-color': colourOf(character.themeColor, index) } as CSSProperties}
          >
            <div className="chara-art">
              <ImageSlot slot={character.images.card} sizes="(min-width: 1024px) 38vw, 72vw" />
            </div>
            <p className="mt-3 flex items-baseline gap-3 text-[16px]">
              {character.name}
              <span aria-hidden="true" className="text-[12px] tracking-[0.2em]">
                {'★'.repeat(character.rarity)}
              </span>
              <span className="sr-only">{t('rarity', { count: character.rarity })}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
