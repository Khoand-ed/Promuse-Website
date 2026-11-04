import { getTranslations } from 'next-intl/server';
import { CharacterScene } from '@/components/motion/CharacterScene';
import { RiseLetters, RiseLines } from '@/components/motion/reveal';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { getCharacters } from '@/content/data';

/** A character's colour, or the next colour of the palette while themeColor is still null. */
function colourOf(themeColor: string | null, index: number): string {
  return themeColor ?? `var(--color-chara-${(index % 11) + 1})`;
}

/**
 * As on p3re.jp, one row: the big title and its three lines, then a portrait per character, grey and
 * tinted until it is in focus. CharacterScene pins the section and moves the row with the scroll;
 * profiles open from the cards in P6.
 */
export async function Characters() {
  const t = await getTranslations('characters');
  const { items } = getCharacters();
  // Tint colours: index -1 is the section's own blue, shown before any card is in focus.
  const tints = [
    { index: -1, colour: 'var(--color-azure)' },
    ...items.map((character, index) => ({ index, colour: colourOf(character.themeColor, index) })),
  ];

  return (
    <CharacterScene
      id="characters"
      aria-labelledby="characters-title"
      // Focusable so the plain row can be scrolled with the arrow keys; `relative` keeps the
      // screen-reader-only text inside the row instead of widening the page.
      tabIndex={0}
      // data-[scene=on]: CharacterScene has taken over, so the section no longer scrolls itself.
      className="chara-track bg-azure relative isolate flex snap-x snap-mandatory items-center overflow-x-auto py-20 data-[scene=on]:min-h-svh data-[scene=on]:snap-none data-[scene=on]:overflow-hidden lg:min-h-svh lg:snap-none lg:py-16"
    >
      {items.map((character, index) => (
        <span
          key={character.slug}
          aria-hidden="true"
          data-layer={index}
          className="chara-layer -z-10"
          style={{ background: colourOf(character.themeColor, index) }}
        />
      ))}

      <div className="chara-row flex shrink-0 items-center">
        <div className="w-[87vw] shrink-0 snap-start pr-[4vw] pl-[6.7vw] lg:w-[73.4vw] lg:pl-[9.3vw]">
          <RiseLetters
            id="characters-title"
            className="type-display text-[16vw] leading-[0.9] lg:text-[11.5vw]"
          >
            {t('title')}
          </RiseLetters>
          <RiseLines
            stagger={0.3}
            className="mt-10 grid gap-2 text-[16px] leading-[2.1] tracking-[0.8px] lg:mt-16"
          >
            <span>{t('line1')}</span>
            <span>{t('line2')}</span>
            <span>{t('line3')}</span>
          </RiseLines>
        </div>

        <ul className="flex shrink-0 gap-[8vw] pr-[6.7vw] lg:gap-[13.9vw] lg:pr-[9.3vw]">
          {items.map((character, index) => (
            <li
              key={character.slug}
              className="chara-card w-[72vw] shrink-0 snap-center lg:w-[37.7vw] lg:max-w-[543px]"
            >
              <div className="chara-art">
                <ImageSlot slot={character.images.card} sizes="(min-width: 1024px) 38vw, 72vw" />
                {tints.map((tint) => (
                  <span
                    key={tint.index}
                    aria-hidden="true"
                    data-tint={tint.index}
                    // Without the scene, each card wears its own colour.
                    data-on={tint.index === index || undefined}
                    className="chara-tint"
                    style={{ background: tint.colour }}
                  />
                ))}
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
      </div>
    </CharacterScene>
  );
}
