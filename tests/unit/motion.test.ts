import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { beatIndex } from '@/components/motion/BeatClock';
import { INTRO_KEY, MOTION_KEY, motionBootScript, resolveMotion } from '@/lib/motion/preference';

describe('resolveMotion', () => {
  it('lets the visitor choice win over the system setting', () => {
    expect(resolveMotion('on', true)).toBe(true);
    expect(resolveMotion('off', false)).toBe(false);
  });

  it('follows the system setting without a choice', () => {
    expect(resolveMotion(null, false)).toBe(true);
    expect(resolveMotion(null, true)).toBe(false);
    expect(resolveMotion('junk', true)).toBe(false);
  });
});

describe('beatIndex', () => {
  it('counts beats at the given tempo', () => {
    expect(beatIndex(0.49, 0, 120)).toBe(0);
    expect(beatIndex(0.5, 0, 120)).toBe(1);
    expect(beatIndex(11.75, 10, 120)).toBe(3);
    expect(beatIndex(1, 0, 60)).toBe(1);
  });

  it('starts counting at the first beat of the music', () => {
    expect(beatIndex(0.1, 0.201, 143.958)).toBe(-1);
    expect(beatIndex(0.201, 0.201, 143.958)).toBe(0);
    expect(beatIndex(0.201 + 60 / 143.958, 0.201, 143.958)).toBe(1);
  });
});

describe('motionBootScript', () => {
  function boot(stored: string | null, reduced: boolean, introSeen: boolean) {
    const dataset: Record<string, string> = {};
    const store = (values: Record<string, string>) => ({
      getItem: (key: string) => values[key] ?? null,
    });
    runInNewContext(motionBootScript, {
      document: { documentElement: { dataset } },
      window: { matchMedia: () => ({ matches: reduced }) },
      localStorage: store(stored ? { [MOTION_KEY]: stored } : {}),
      sessionStorage: store(introSeen ? { [INTRO_KEY]: '1' } : {}),
    });
    return dataset;
  }

  it('agrees with resolveMotion', () => {
    for (const stored of [null, 'on', 'off']) {
      for (const reduced of [false, true]) {
        expect(boot(stored, reduced, false).motion).toBe(
          resolveMotion(stored, reduced) ? 'on' : 'off',
        );
      }
    }
  });

  it('plays the opening once per session, and only with motion on', () => {
    expect(boot(null, false, false).intro).toBe('play');
    expect(boot(null, false, true).intro).toBeUndefined();
    expect(boot(null, true, false).intro).toBeUndefined();
  });
});
