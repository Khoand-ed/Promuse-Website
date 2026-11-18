'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CloseIcon } from './icons';

/**
 * How long a move to another view waits before it writes the hash, so quick steps write it once.
 * Browsers limit how often a page may call the History API, and Next.js's router adds a call of its
 * own to each of ours.
 */
const SWAP_HASH_MS = 300;

/**
 * One modal with several views, each tied to its own URL hash (doc/SPEC.md, section 6), such as
 * the character profiles at `#char-<slug>`. Opening adds the hash to the history, the Back button
 * closes the modal, and a link to one of the hashes opens that view on arrival. Moving to another
 * view while open swaps the hash in place, so Back still closes the modal instead of stepping
 * through the views.
 */
export function useHashChoice(ids: readonly string[]) {
  const [current, setCurrent] = useState<string | null>(null);
  // True when this page added the history entry, so closing can step back instead of piling up.
  const pushed = useRef(false);
  // A hash swap waiting for the visitor to stop moving between views.
  const swap = useRef<number | undefined>(undefined);
  // The hooks below depend on the ids' content, not on the array the caller made this render.
  const key = ids.join(' ');
  const known = useMemo(() => new Set(key.split(' ')), [key]);

  useEffect(() => {
    // Runs only for navigations this hook did not make (its own History API calls fire no event),
    // so the entry it pushed, if any, is no longer the one closing should step back from.
    const sync = () => {
      window.clearTimeout(swap.current);
      pushed.current = false;
      const hash = window.location.hash.slice(1);
      setCurrent(known.has(hash) ? hash : null);
    };
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
      window.clearTimeout(swap.current);
    };
  }, [known]);

  useEffect(() => {
    // An entry without state is one Next.js's router never saw: a click that reached the History API
    // before the router wrapped it, right after hydration, or a same-page link to `#id`. React has
    // run the router's effects by now, so hand it the URL, or its next refresh would drop the hash.
    if (current !== null && window.history.state === null) {
      window.history.replaceState(null, '', window.location.href);
    }
  }, [current]);

  const show = useCallback(
    (id: string) => {
      window.clearTimeout(swap.current);
      const hash = window.location.hash.slice(1);
      if (hash !== id) {
        // With `null`, Next.js's router adopts the new URL and copies its own state onto the entry.
        // Passing that state ourselves would hide the change from it, and its next refresh or Fast
        // Refresh would write the URL back without the hash.
        if (known.has(hash)) {
          // Another view is open: swap the hash in place once the visitor settles.
          swap.current = window.setTimeout(() => {
            if (known.has(window.location.hash.slice(1))) {
              window.history.replaceState(null, '', `#${id}`);
            }
          }, SWAP_HASH_MS);
        } else {
          window.history.pushState(null, '', `#${id}`);
          pushed.current = true;
        }
      }
      setCurrent(id);
    },
    [known],
  );

  const hide = useCallback(() => {
    window.clearTimeout(swap.current);
    setCurrent(null);
    if (!known.has(window.location.hash.slice(1))) return;
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      // `null` again, or the router's next refresh would put the hash back.
      const { pathname, search } = window.location;
      window.history.replaceState(null, '', pathname + search);
    }
  }, [known]);

  return { current, show, hide };
}

/**
 * A modal tied to the URL hash (doc/SPEC.md, section 6): opening adds `#id` to the history, the
 * Back button closes it, and a link to `#id` opens it on arrival.
 */
export function useHashModal(id: string) {
  const ids = useMemo(() => [id], [id]);
  const { current, show, hide } = useHashChoice(ids);
  const showThis = useCallback(() => show(id), [show, id]);
  return { open: current === id, show: showThis, hide };
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
  /** Extra classes on the dialog, for a modal with a look of its own. */
  className?: string;
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
  className = '',
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
      className={`modal modal-${variant} ${className}`}
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
          {/*
           * Sticky rather than fixed: while the sheet slides, the dialog is transformed and would
           * carry a fixed button along with its scroll, so a scrolled sheet would jump as it closes.
           */}
          <div className="modal-dock">{close}</div>
          {children}
        </>
      )}
    </dialog>
  );
}
