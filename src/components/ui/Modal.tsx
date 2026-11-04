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

  const show = useCallback(() => {
    if (window.location.hash !== `#${id}`) {
      // Keep Next.js's own history state, so its router treats this as the same page.
      window.history.pushState(window.history.state, '', `#${id}`);
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
      const { pathname, search } = window.location;
      window.history.replaceState(window.history.state, '', pathname + search);
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
  /** `sheet` slides up like p3re.jp's modals; `lightbox` fades in over a dark backdrop. */
  variant?: 'sheet' | 'lightbox';
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

  return (
    <dialog
      ref={dialog}
      aria-labelledby={labelledBy}
      aria-label={label}
      // Lets wheel and touch scroll the modal itself while Lenis holds the page.
      data-lenis-prevent
      className={`modal modal-${variant}`}
    >
      <button
        type="button"
        aria-label={t('close')}
        onClick={() => dialog.current?.close()}
        className="modal-close"
      >
        <CloseIcon />
      </button>
      {children}
    </dialog>
  );
}
