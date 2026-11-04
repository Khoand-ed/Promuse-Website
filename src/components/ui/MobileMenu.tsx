'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { navSections } from '@/components/sections/sections';
import { Link } from '@/i18n/navigation';
import { LanguageSwitch } from './LanguageSwitch';
import { MotionToggle } from './MotionToggle';

/** Below 1024 px: the blue corner button and the full-screen menu it opens. */
export function MobileMenu() {
  const t = useTranslations();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const followedLink = useRef(false);
  const [open, setOpen] = useState(false);
  const dialogId = useId();

  // The menu is hidden from 1024 px; close it if the window grows while it is open.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const closeWhenWide = () => {
      if (wide.matches) dialog.current?.close();
    };
    wide.addEventListener('change', closeWhenWide);
    return () => wide.removeEventListener('change', closeWhenWide);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        ref={opener}
        type="button"
        aria-label={t('common.openMenu')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => {
          dialog.current?.showModal();
          setOpen(true);
        }}
        className="fixed top-0 right-0 z-40 size-22"
      >
        <span aria-hidden="true" className="menu-corner absolute inset-0" />
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 grid justify-items-center gap-[5px] text-white"
        >
          <span className="block h-px w-7 bg-current" />
          <span className="block h-px w-7 bg-current" />
          <span className="block h-px w-7 bg-current" />
          <span className="mt-0.5 text-[11px] leading-none font-semibold uppercase">
            {t('common.menu')}
          </span>
        </span>
      </button>

      <dialog
        ref={dialog}
        id={dialogId}
        aria-label={t('common.mainNav')}
        className="menu-dialog"
        onClose={() => {
          setOpen(false);
          // Following a link moves focus to its section; otherwise focus goes back to the button.
          if (!followedLink.current) opener.current?.focus();
          followedLink.current = false;
        }}
      >
        <div className="flex min-h-full flex-col px-[6.7%] pt-28 pb-12">
          <button
            type="button"
            aria-label={t('common.closeMenu')}
            onClick={() => dialog.current?.close()}
            className="fixed top-0 right-0 size-22"
          >
            <span aria-hidden="true" className="menu-corner absolute inset-0" />
            {/* The menu button's three lines, turning into a cross as the menu opens. */}
            <span aria-hidden="true" className="menu-cross text-white">
              <span />
              <span />
              <span />
            </span>
          </button>

          <nav aria-label={t('common.mainNav')}>
            <ul className="grid gap-2">
              {navSections.map((id) => (
                <li key={id}>
                  <Link
                    href={{ pathname: '/', hash: id }}
                    onClick={() => {
                      followedLink.current = true;
                      dialog.current?.close();
                    }}
                    className="block py-3 text-[26px] font-semibold"
                  >
                    {t(`nav.${id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10">
            <LanguageSwitch variant="list" className="text-[15px]" />
            <MotionToggle />
          </div>
        </div>
      </dialog>
    </div>
  );
}
