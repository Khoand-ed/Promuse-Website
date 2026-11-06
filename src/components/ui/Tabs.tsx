'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem {
  key: string;
  label: string;
  /** The panel, rendered on the server. */
  content: ReactNode;
}

interface TabsProps {
  /** Names the tabs: element ids, and `promuse:tab:<id>` in sessionStorage. */
  id: string;
  /** Names the tab list for screen readers. */
  label: string;
  items: TabItem[];
  /**
   * From 1024 px the wheel reads through the tabs, as on p3re.jp's detail modals: it scrolls a long
   * panel, and a new wheel turn at its end moves to the next tab (at its start, to the previous one).
   */
  wheel?: boolean;
  className?: string;
}

const storageKey = (id: string) => `promuse:tab:${id}`;
/** How long a tab change keeps the next one waiting, so a trackpad fling moves a single step. */
const WHEEL_REST_MS = 900;
/** A pause this long between wheel events ends one gesture and starts the next. */
const WHEEL_GESTURE_GAP_MS = 250;

/**
 * The ARIA tabs pattern (doc/SPEC.md, section 6): ← → ↑ ↓ move between tabs, Home and End jump to
 * the ends, and the last tab seen in each place comes back for the rest of the visit. Every panel
 * stays in the page, hidden when not chosen; a panel that appears plays its `data-rise` entrance.
 */
export function Tabs({ id, label, items, wheel = false, className = '' }: TabsProps) {
  const [active, setActive] = useState(items[0]?.key ?? '');
  // Once the visitor picks a tab, panels rise in at once instead of waiting for a modal's slide.
  const [touched, setTouched] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const tablist = useRef<HTMLDivElement>(null);
  const resting = useRef(0);
  const gesture = useRef({ last: 0, fromEdge: false });

  // The last tab seen this visit; read after mount, so the server and first render agree.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey(id));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring a stored choice once
      if (saved && items.some((item) => item.key === saved)) setActive(saved);
    } catch {
      // Without storage every visit starts on the first tab.
    }
  }, [id, items]);

  // On phones the tabs form a row that may run past the screen: keep the chosen one in view, also
  // when the row first appears, as its modal opens on a remembered tab.
  useEffect(() => {
    const list = tablist.current;
    if (!list) return;
    const reveal = () => {
      const index = items.findIndex((item) => item.key === active);
      buttons.current[index]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    const observer = new ResizeObserver(reveal);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active, items]);

  const choose = (key: string, focus = false) => {
    setActive(key);
    setTouched(true);
    try {
      sessionStorage.setItem(storageKey(id), key);
    } catch {
      // The choice is only lost for the next opening.
    }
    if (focus) buttons.current[items.findIndex((item) => item.key === key)]?.focus();
  };

  const step = (delta: number, focus: boolean) => {
    const index = items.findIndex((item) => item.key === active);
    const next = items[(index + delta + items.length) % items.length];
    if (next) choose(next.key, focus);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, () => void> = {
      ArrowRight: () => step(1, true),
      ArrowDown: () => step(1, true),
      ArrowLeft: () => step(-1, true),
      ArrowUp: () => step(-1, true),
      Home: () => items[0] && choose(items[0].key, true),
      End: () => items.at(-1) && choose(items.at(-1)!.key, true),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    move();
  };

  // The wheel scrolls a long panel first; a new wheel turn at its end (or start) steps to the next
  // (or previous) tab, so the whole modal can be read by scrolling, as on p3re.jp.
  useEffect(() => {
    const element = root.current;
    if (!wheel || !element) return;
    const desktop = window.matchMedia('(min-width: 64rem)');
    const scroller = element.closest('dialog') ?? document.documentElement;
    const atEdge = (down: boolean) =>
      down
        ? scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2
        : scroller.scrollTop <= 1;
    const onWheel = (event: WheelEvent) => {
      if (!desktop.matches || Math.abs(event.deltaY) < 4) return;
      const now = performance.now();
      const down = event.deltaY > 0;
      // A pause starts a new gesture; only a gesture that begins at an edge may change the tab, so a
      // fling that reaches the end of a panel stops there instead of skipping on.
      if (now - gesture.current.last > WHEEL_GESTURE_GAP_MS)
        gesture.current.fromEdge = atEdge(down);
      gesture.current.last = now;
      if (!gesture.current.fromEdge || !atEdge(down)) return;
      event.preventDefault();
      if (now < resting.current) return;
      const index = items.findIndex((item) => item.key === active);
      const target = items[index + (down ? 1 : -1)];
      if (!target) return;
      resting.current = now + WHEEL_REST_MS;
      choose(target.key);
      scroller.scrollTop = 0;
    };
    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  });

  return (
    <div ref={root} data-touched={touched || undefined} className={className}>
      <div
        ref={tablist}
        role="tablist"
        aria-label={label}
        className="tabs-list"
        onKeyDown={onKeyDown}
      >
        {items.map((item, index) => {
          const selected = item.key === active;
          return (
            <button
              key={item.key}
              ref={(button) => {
                buttons.current[index] = button;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${item.key}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${item.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(item.key)}
              className="tabs-tab"
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.key}
          role="tabpanel"
          id={`${id}-panel-${item.key}`}
          aria-labelledby={`${id}-tab-${item.key}`}
          hidden={item.key !== active}
          tabIndex={0}
          className="tabs-panel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
