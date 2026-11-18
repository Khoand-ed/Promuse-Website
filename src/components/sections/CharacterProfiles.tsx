'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { ArrowRight, SwapIcon } from '@/components/ui/icons';
import { Modal, useHashChoice } from '@/components/ui/Modal';

export interface ProfileItem {
  slug: string;
  name: string;
  /** The character's colour, worn by the wave band behind the profile. */
  colour: string;
  /** Width over height of the idle visual, so the visual fits the window's height too. */
  ratio: number;
  /** The visible count, "2 / 4". */
  count: string;
  /** "Character 2 of 4: NOVA", for screen readers, and announced when the profile moves here. */
  position: string;
  /** The idle and battle visuals, rendered on the server. */
  idle: ReactNode;
  battle: ReactNode;
  /** The right-hand column, rendered on the server: name, rarity, tagline, profile, passive, stats, gallery. */
  info: ReactNode;
}

interface CharacterProfilesProps {
  items: ProfileItem[];
  changeVisual: string;
  previous: string;
  next: string;
  /** The section; its cards open the profiles through ProfileButton. */
  children: ReactNode;
}

/** The hash of a character's profile: `#char-nova`. */
const hashOf = (slug: string) => `char-${slug}`;

/** Order of a part in the profile's entrance (doc/SPEC.md, section 4). */
const fade = (n: number) => ({ '--fade': n }) as CSSProperties;

/** Wave crest on top of the colour band; drawn for Promuse. */
const WAVE = 'M0 75C160 40 320 18 480 20S840 92 1040 95S1320 52 1440 30V120H0Z';

function Wave() {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="profile-wave">
      <path d={WAVE} fill="currentColor" />
    </svg>
  );
}

const OpenProfile = createContext<(slug: string) => void>(() => {});

interface ProfileButtonProps {
  slug: string;
  /** Id of the element that names the button: the character's name and rarity. */
  labelledBy: string;
  /** Id of the card art, once it exists, so its description follows the name. */
  describedBy?: string;
  className?: string;
  children: ReactNode;
}

/** A character card: opens that character's profile. */
export function ProfileButton({
  slug,
  labelledBy,
  describedBy,
  className,
  children,
}: ProfileButtonProps) {
  const open = useContext(OpenProfile);
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClick={() => open(slug)}
      className={className}
    >
      {children}
    </button>
  );
}

/**
 * The character profiles, as p3re.jp's profile modal (doc/SPEC.md, section 5): a white sheet with
 * the name set vertically, the visual and "Change visual" on the left, the profile on the right and
 * a band in the character's colour at the foot. Unlike p3re.jp, previous and next (and ← →) move
 * between characters, `#char-<slug>` opens a profile, and Esc or Back closes it.
 */
export function CharacterProfiles({
  items,
  changeVisual,
  previous,
  next,
  children,
}: CharacterProfilesProps) {
  const hashes = useMemo(() => items.map((item) => hashOf(item.slug)), [items]);
  const { current, show, hide } = useHashChoice(hashes);
  const index = current === null ? -1 : hashes.indexOf(current);
  const open = index >= 0;

  // The character on the sheet stays while the sheet slides away, so it does not empty as it closes.
  const [lastShown, setLastShown] = useState(0);
  if (open && index !== lastShown) setLastShown(index);
  const shown = open ? index : lastShown;

  // The character whose battle visual is showing, if any; the others show their idle one.
  const [battle, setBattle] = useState<string | null>(null);
  // After the first move to another character, the next one fades in at once.
  const [touched, setTouched] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  // However it opens (a card, a link, Forward), a profile starts afresh: idle visual, full entrance.
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setBattle(null);
      setTouched(false);
      setAnnouncement('');
    }
  }

  const panels = useRef<(HTMLElement | null)[]>([]);
  // Whether focus was on "Change visual" when the character changed, so it can follow.
  const refocus = useRef(false);

  const openProfile = useCallback((slug: string) => show(hashOf(slug)), [show]);

  const step = useCallback(
    (delta: number) => {
      const target = items[(shown + delta + items.length) % items.length];
      if (!target) return;
      const focused = document.activeElement;
      refocus.current = focused instanceof HTMLElement && focused.matches('[data-change-visual]');
      setBattle(null);
      setTouched(true);
      setAnnouncement(target.position);
      show(hashOf(target.slug));
    },
    [items, shown, show],
  );

  // Every opening and every move to another character starts at the top of the sheet. (Browsers
  // may keep a scroll position through the dialog's display: none.)
  useEffect(() => {
    if (open) panels.current[shown]?.closest('dialog')?.scrollTo({ top: 0 });
  }, [open, shown]);

  // Focus on "Change visual" follows to the next character's button.
  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    panels.current[shown]?.querySelector<HTMLElement>('[data-change-visual]')?.focus();
  }, [shown]);

  // ← and → move between characters wherever focus is in the profile, one step per key press.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      )
        return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable]'))
        return;
      event.preventDefault();
      if (event.repeat) return;
      step(event.key === 'ArrowRight' ? 1 : -1);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, step]);

  const active = items[shown];

  return (
    <OpenProfile value={openProfile}>
      {children}
      <Modal
        open={open}
        onClose={hide}
        labelledBy={active ? `${active.slug}-profile-name` : undefined}
        variant="sheet"
        className="modal-profile"
      >
        <div data-touched={touched || undefined} className="profile">
          {items.map((item, position) => {
            const on = position === shown;
            const battleOn = on && battle === item.slug;
            return (
              <article
                key={item.slug}
                ref={(panel) => {
                  panels.current[position] = panel;
                }}
                hidden={!on}
                aria-labelledby={`${item.slug}-profile-name`}
                className="profile-panel"
                style={{ '--ratio': item.ratio } as CSSProperties}
              >
                <div className="profile-stage">
                  <p aria-hidden="true" className="profile-vname type-display">
                    {[...item.name].map((letter, n) => (
                      <span key={n} style={{ '--i': n } as CSSProperties}>
                        {letter}
                      </span>
                    ))}
                  </p>
                  <div
                    data-fade
                    data-battle={battleOn || undefined}
                    style={fade(1)}
                    className="profile-visual"
                  >
                    <div aria-hidden={battleOn || undefined} className="profile-pose">
                      {item.idle}
                    </div>
                    <div aria-hidden={!battleOn || undefined} className="profile-pose">
                      {item.battle}
                    </div>
                  </div>
                  <button
                    type="button"
                    data-change-visual
                    aria-pressed={battleOn}
                    onClick={() => setBattle(battleOn ? null : item.slug)}
                    className="profile-change"
                  >
                    {/* The plate fades in; the button itself slides on hover, focus ring and all. */}
                    <span data-fade style={fade(1)} className="profile-change-plate">
                      <span className="profile-change-label">{changeVisual}</span>
                      <SwapIcon className="profile-change-icon" />
                    </span>
                  </button>
                </div>
                {/* On phones the band runs under the visual, behind the whole text. */}
                <span aria-hidden="true" className="profile-band" style={{ color: item.colour }}>
                  <Wave />
                </span>
                <div className="profile-info">{item.info}</div>
              </article>
            );
          })}
          {/*
           * From 1024 px the band sits at the foot of the window, one layer per character so they
           * cross-fade. Like the pager it is sticky, not fixed, so the sheet's slide and scroll
           * cannot move it apart from the sheet.
           */}
          <div aria-hidden="true" className="profile-foot">
            {items.map((item, position) => (
              <span
                key={item.slug}
                data-on={position === shown || undefined}
                className="profile-foot-band"
                style={{ color: item.colour }}
              >
                <Wave />
              </span>
            ))}
          </div>
          <div data-fade style={fade(0)} className="profile-pager">
            <button
              type="button"
              aria-label={previous}
              onClick={() => step(-1)}
              className="profile-arrow"
            >
              <ArrowRight className="rotate-180" />
            </button>
            <p className="profile-count type-label">
              <span aria-hidden="true">{active?.count}</span>
              <span className="sr-only">{active?.position}</span>
            </p>
            <button
              type="button"
              aria-label={next}
              onClick={() => step(1)}
              className="profile-arrow"
            >
              <ArrowRight />
            </button>
          </div>
          <p aria-live="polite" className="sr-only">
            {announcement}
          </p>
        </div>
      </Modal>
    </OpenProfile>
  );
}
