'use client';

import { useLocale, useTranslations, type Locale } from 'next-intl';
import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { getPathname, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { ChevronDown } from './icons';

/** The anchor of the section in view, so the other language opens at the same place. */
function sectionInView(): string {
  let id = '';
  for (const section of document.querySelectorAll<HTMLElement>('main section[id]')) {
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) id = section.id;
  }
  return id && id !== 'top' ? `#${id}` : '';
}

function useSwitch() {
  const pathname = usePathname();
  return (locale: Locale) => ({
    href: getPathname({ href: pathname, locale }),
    onClick(event: MouseEvent<HTMLAnchorElement>) {
      event.preventDefault();
      // The proxy reads this cookie (next-intl's default name) before the browser's languages.
      document.cookie = `NEXT_LOCALE=${locale}; path=/; samesite=lax`;
      window.location.assign(getPathname({ href: pathname, locale }) + sectionInView());
    },
  });
}

interface LanguageSwitchProps {
  /** `menu`: a compact "VI ▾" button with a drop-down, as in the desktop header. `list`: both languages as links. */
  variant: 'menu' | 'list';
  className?: string;
}

export function LanguageSwitch({ variant, className = '' }: LanguageSwitchProps) {
  const t = useTranslations('common');
  const current = useLocale();
  const linkTo = useSwitch();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  const links = routing.locales.map((locale) => (
    <li key={locale}>
      <a
        {...linkTo(locale)}
        lang={locale}
        hrefLang={locale}
        aria-current={locale === current ? 'true' : undefined}
        className="block py-2 underline-offset-4 hover:underline aria-[current=true]:font-bold"
      >
        {t(`languageNames.${locale}`)}
      </a>
    </li>
  ));

  if (variant === 'list') {
    return (
      <nav aria-label={t('language')} className={className}>
        <ul className="flex gap-6">{links}</ul>
      </nav>
    );
  }

  return (
    <div
      ref={root}
      className={`relative ${className}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className="type-label flex min-h-11 items-center gap-1 text-[14px] font-bold"
      >
        <span className="sr-only">{t('language')}: </span>
        {current.toUpperCase()}
        <ChevronDown />
      </button>
      <ul
        id={listId}
        hidden={!open}
        className="absolute top-full right-0 min-w-36 bg-white px-5 py-2 text-[14px] shadow-[0_8px_24px_rgb(29_56_74/0.12)]"
      >
        {links}
      </ul>
    </div>
  );
}
