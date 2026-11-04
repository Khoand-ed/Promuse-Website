'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { MOTION_KEY, resolveMotion } from '@/lib/motion/preference';

interface MotionState {
  /** Whether effects run. False on the server and until the page has hydrated. */
  enabled: boolean;
  setEnabled(on: boolean): void;
}

const MotionContext = createContext<MotionState>({ enabled: false, setEnabled: () => {} });

export function useMotion(): MotionState {
  return useContext(MotionContext);
}

function readStored(): string | null {
  try {
    return localStorage.getItem(MOTION_KEY);
  } catch {
    return null;
  }
}

/** Follows the system's reduced-motion setting and the visitor's effects toggle (doc/SPEC.md, section 4). */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [enabled, setState] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      const on = resolveMotion(readStored(), reduced.matches);
      document.documentElement.dataset.motion = on ? 'on' : 'off';
      setState(on);
    };
    sync();
    reduced.addEventListener('change', sync);
    return () => reduced.removeEventListener('change', sync);
  }, []);

  const setEnabled = useCallback((on: boolean) => {
    try {
      localStorage.setItem(MOTION_KEY, on ? 'on' : 'off');
    } catch {
      // Private windows may refuse storage; the choice then lasts until the page closes.
    }
    document.documentElement.dataset.motion = on ? 'on' : 'off';
    if (!on) delete document.documentElement.dataset.intro;
    setState(on);
  }, []);

  return <MotionContext value={{ enabled, setEnabled }}>{children}</MotionContext>;
}
