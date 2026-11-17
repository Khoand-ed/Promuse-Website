'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { CloseIcon } from './icons';

/**
 * A modal tied to the URL hash (doc/SPEC.md, section 6): opening adds `#id` to the history, the
 * Back button closes it, and a link to `#id` opens it on arrival.
 */
export function useHashModal(id: string) {
  const [open, setOpen] = useState(false);
  // True when this page added the history entry, so closing can step back instead of piling up.
  const pushed = useRef(false);

  useEffect(() => {
    const sync = () => {
      const here = window.location.hash === `#${id}`;
      if (!here) pushed.current = false;
      setOpen(here);
    };
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, [id]);

  useEffect(() => {
    // An entry without state is one Next.js's router never saw: a click that reached the History API
    // before the router wrapped it, right after hydration, or a same-page link to `#id`. React has
    // run the router's effects by now, so hand it the URL, or its next refresh would drop the hash.
    if (open && window.history.state === null) {
      window.history.replaceState(null, '', window.location.href);
    }
  }, [open]);

  const show = useCallback(() => {
    if (window.location.hash !== `#${id}`) {
      // With `null`, Next.js's router adopts the new URL and copies its own state onto the entry.
      // Passing that state ourselves would hide the change from it, and its next refresh or Fast
      // Refresh would write the URL back without the hash.
      window.history.pushState(null, '', `#${id}`);
      pushed.current = true;
    }
    setOpen(true);
  }, [id]);

  const hide = useCallback(() => {
    setOpen(false);
    if (window.location.hash !== `#${id}`) return;
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      // `null` again, or the router's next refresh would put the hash back.
      const { pathname, search } = window.location;
      window.history.replaceState(null, '', pathname + search);
    }
  }, [id]);

  return { open, show, hide };
}

interface ModalProps {
  open: boolean;
  onClose(): void;
  /** Id of the element that names the modal, usually its title. */
  labelledBy?: string;
  /** A name when the modal shows no title of its own. */
  label?: string;
  /**
   * `sheet` slides up like p3re.jp's modals; `lightbox` fades in over a dark backdrop; `card` fades
   * in a centred card over the dimmed page, like p3re.jp's promotion popup (a click beside it closes).
   */
  variant?: 'sheet' | 'lightbox' | 'card';
  children: ReactNode;
}

/**
 * The shared modal on a native <dialog>: Esc closes it, focus moves in and returns to the opener,
 * the page behind stays still. Content marked `data-rise` (with `--rise: n`) rises in turn as it
 * opens. With motion off it simply fades.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  label,
  variant = 'sheet',
  children,
}: ModalProps) {
  const t = useTranslations('common');
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      opener.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      element.showModal();
      // A modal that opened on its own (the reward popup) takes focus itself, so screen readers
      // land on it without a focus ring jumping onto the close button.
      if (!opener.current || opener.current === document.body) element.focus();
    } else if (!open && element.open) {
      element.close();
    }
  }, [open]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const closed = () => {
      onClose();
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    };
    element.addEventListener('close', closed);
    return () => element.removeEventListener('close', closed);
  }, [onClose]);

  const close = (
    <button
      type="button"
      aria-label={t('close')}
      onClick={() => dialog.current?.close()}
      className="modal-close"
    >
      <CloseIcon />
    </button>
  );

  return (
    <dialog
      ref={dialog}
      tabIndex={-1}
      aria-labelledby={labelledBy}
      aria-label={label}
      // Lets wheel and touch scroll the modal itself while Lenis holds the page.
      data-lenis-prevent
      className={`modal modal-${variant}`}
      onClick={(event) => {
        // In a card, the dialog itself is the dimmed area around the card.
        if (variant === 'card' && event.target === event.currentTarget) dialog.current?.close();
      }}
    >
      {variant === 'card' ? (
        // The close button sits in the card's corner, as on p3re.jp.
        <div className="modal-card-body">
          {close}
          {children}
        </div>
      ) : (
        <>
          {close}
          {children}
        </>
      )}
    </dialog>
  );
}
