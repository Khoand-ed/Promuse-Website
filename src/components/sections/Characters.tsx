import { getFormatter, getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { CharacterScene } from '@/components/motion/CharacterScene';
import { RiseLetters, RiseLines } from '@/components/motion/reveal';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { getCharacters } from '@/content/data';
import { hasFile } from '@/content/images';
import { CharacterProfiles, ProfileButton, type ProfileItem } from './CharacterProfiles';

/** A character's colour, or the next colour of the palette while themeColor is still null. */
function colourOf(themeColor: string | null, index: number): string {
  return themeColor ?? `var(--color-chara-${(index % 11) + 1})`;
}

/** Order of a part in the profile's entrance (doc/SPEC.md, section 4). */
const fade = (n: number) => ({ '--fade': n }) as CSSProperties;

/**
 * As on p3re.jp, one row: the big title and its three lines, then a portrait per character, grey and
 * tinted until it is in focus. CharacterScene pins the section and moves the row with the scroll;
 * each card opens the character's profile (doc/SPEC.md, section 5).
 */
export async function Characters() {
  const t = await getTranslations();
  const format = await getFormatter();
  const { items } = getCharacters();
  const colours = items.map((character, index) => colourOf(character.themeColor, index));
  // Tint colours: index -1 is the section's own blue, shown before any card is in focus.
  const tints = [
    { index: -1, colour: 'var(--color-azure)' },
    ...colours.map((colour, index) => ({ index, colour })),
  ];

  const profiles: ProfileItem[] = items.map((character, index) => {
    const key = `characters.items.${character.slug}` as const;
    const text = (field: string) => t(`${key}.${field}` as Parameters<typeof t>[0]);
    const { idle, battle, gallery } = character.images;
    return {
      slug: character.slug,
      name: character.name,
      colour: colours[index] ?? colourOf(null, index),
      ratio: idle.width / idle.height,
      count: t('characters.count', { current: index + 1, total: items.length }),
      position: t('characters.position', {
        current: index + 1,
        total: items.length,
        name: character.name,
      }),
      idle: <ImageSlot slot={idle} sizes="(min-width: 1024px) 28vw, 76vw" />,
      battle: <ImageSlot slot={battle} sizes="(min-width: 1024px) 28vw, 76vw" />,
      info: (
        <>
          <div data-fade style={fade(2)}>
            <h2 id={`${character.slug}-profile-name`} className="profile-name">
              {character.name}
            </h2>
            <p className="profile-meta">
              <span aria-hidden="true" className="profile-stars">
                {'★'.repeat(character.rarity)}
              </span>
              <span className="sr-only">{t('characters.rarity', { count: character.rarity })}</span>
              <span>{text('tagline')}</span>
            </p>
          </div>
          <div data-fade style={fade(3)} className="profile-sections">
            <section>
              <h3 className="profile-label type-label">{t('characters.profile')}</h3>
              <p className="profile-text">{text('profile')}</p>
            </section>
            <section>
              <h3 className="profile-label type-label">{t('characters.passive')}</h3>
              <p className="profile-passive">{text('passiveName')}</p>
              <p className="profile-text">{text('passiveDescription')}</p>
            </section>
            <section>
              <h3 className="profile-label type-label">{t('characters.stats')}</h3>
              <dl className="profile-stats">
                <div>
                  <dt className="type-label">{t('characters.hp')}</dt>
                  <dd>{format.number(character.stats.hp)}</dd>
                </div>
                <div>
                  <dt className="type-label">{t('characters.scoreBonus')}</dt>
                  <dd>{t('characters.multiplier', { value: character.stats.scoreBonus })}</dd>
                </div>
                <div>
                  <dt className="type-label">{t('characters.feverBonus')}</dt>
                  <dd>{t('characters.multiplier', { value: character.stats.feverBonus })}</dd>
                </div>
              </dl>
            </section>
          </div>
          {gallery.length > 0 ? (
            <section data-fade style={fade(4)} className="profile-gallery">
              <h3 className="sr-only">{t('characters.gallery')}</h3>
              <ul className="profile-grid">
                {gallery.map((slot, n) => (
                  <li key={slot.src}>
                    <figure>
                      <figcaption className="profile-caption type-label">
                        {t('characters.picture', { n: n + 1 })}
                      </figcaption>
                      <ImageSlot slot={slot} sizes="(min-width: 1024px) 25vw, 87vw" />
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ),
    };
  });

  return (
    <CharacterProfiles
      items={profiles}
      changeVisual={t('characters.changeVisual')}
      previous={t('characters.previous')}
      next={t('characters.next')}
    >
      <CharacterScene
        id="characters"
        aria-labelledby="characters-title"
        // Focusable so the plain row can be scrolled with the arrow keys; `relative` keeps the
        // screen-reader-only text inside the row instead of widening the page.
        tabIndex={0}
        // data-[scene=on]: CharacterScene has taken over, so the section no longer scrolls itself,
        // not even to show a card that takes focus (clip, unlike hidden, allows no scrolling).
        className="chara-track bg-azure relative isolate flex snap-x snap-mandatory items-center overflow-x-auto py-20 data-[scene=on]:min-h-svh data-[scene=on]:snap-none data-[scene=on]:overflow-clip lg:min-h-svh lg:snap-none lg:py-0"
      >
        {items.map((character, index) => (
          <span
            key={character.slug}
            aria-hidden="true"
            data-layer={index}
            className="chara-layer -z-10"
            style={{ background: colours[index] }}
          />
        ))}

        <div className="chara-row flex shrink-0 items-center">
          <div className="w-[87vw] shrink-0 snap-start pr-[4vw] pl-[6.7vw] lg:w-[73.4vw] lg:pl-[9.3vw]">
            <RiseLetters
              id="characters-title"
              className="type-display text-[16vw] leading-[0.9] lg:text-[11.5vw]"
            >
              {t('characters.title')}
            </RiseLetters>
            <RiseLines
              stagger={0.3}
              className="mt-10 grid gap-2 text-[16px] leading-[2.1] tracking-[0.8px] lg:mt-16"
            >
              <span>{t('characters.line1')}</span>
              <span>{t('characters.line2')}</span>
              <span>{t('characters.line3')}</span>
            </RiseLines>
          </div>

          <ul className="flex shrink-0 gap-[8vw] pr-[6.7vw] lg:gap-[200px] lg:pr-[9.3vw]">
            {items.map((character, index) => (
              <li
                key={character.slug}
                className="chara-card w-[72vw] shrink-0 snap-center lg:w-[60.4svh]"
              >
                {/* Named by the name and rarity; the card art's description, once it exists, follows. */}
                <ProfileButton
                  slug={character.slug}
                  labelledBy={`${character.slug}-card-name`}
                  describedBy={
                    hasFile(character.images.card) ? `${character.slug}-card-art` : undefined
                  }
                  className="chara-open"
                >
                  <span className="chara-art">
                    <ImageSlot
                      slot={character.images.card}
                      sizes="(min-width: 1024px) 45vw, 72vw"
                      id={`${character.slug}-card-art`}
                    />
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
                  </span>
                  <span
                    id={`${character.slug}-card-name`}
                    className="chara-name mt-3 flex items-baseline gap-3 text-[16px]"
                  >
                    {character.name}
                    <span aria-hidden="true" className="text-[12px] tracking-[0.2em]">
                      {'★'.repeat(character.rarity)}
                    </span>
                    <span className="sr-only">
                      {t('characters.rarity', { count: character.rarity })}
                    </span>
                  </span>
                </ProfileButton>
              </li>
            ))}
          </ul>
        </div>
      </CharacterScene>
    </CharacterProfiles>
  );
}
