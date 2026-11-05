import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRewardGateway } from '@/lib/reward';
import { isSignedIn, popupAllowed, reduce, type RewardState } from '@/lib/reward/machine';
import { MOCK_EMAIL, MOCK_KEY, MockRewardGateway, mockStart } from '@/lib/reward/mock';

const signedOut: RewardState = { kind: 'signedOut', cancelled: false };
const ready: RewardState = { kind: 'signedInNotRegistered', email: MOCK_EMAIL };

describe('reward state machine', () => {
  it('maps the status to a starting state', () => {
    expect(reduce({ kind: 'loading' }, { type: 'status', status: { kind: 'signedOut' } })).toEqual(
      signedOut,
    );
    expect(
      reduce(
        { kind: 'loading' },
        { type: 'status', status: { kind: 'signedOut' }, cancelled: true },
      ),
    ).toEqual({ kind: 'signedOut', cancelled: true });
    expect(
      reduce(
        { kind: 'loading' },
        { type: 'status', status: { kind: 'signedIn', email: MOCK_EMAIL, registered: false } },
      ),
    ).toEqual(ready);
    expect(
      reduce(
        { kind: 'loading' },
        {
          type: 'status',
          status: { kind: 'signedIn', email: MOCK_EMAIL, registered: true, registeredAt: 'T' },
        },
      ),
    ).toEqual({ kind: 'alreadyRegistered', email: MOCK_EMAIL, registeredAt: 'T' });
  });

  it('signs in only from signedOut', () => {
    expect(reduce(signedOut, { type: 'signIn' })).toEqual({ kind: 'redirecting' });
    expect(reduce(ready, { type: 'signIn' })).toBe(ready);
  });

  it('registers and lands on the right result', () => {
    const registering = reduce(ready, { type: 'register' });
    expect(registering).toEqual({ kind: 'registering', email: MOCK_EMAIL });
    expect(
      reduce(registering, { type: 'registered', result: { status: 'created', registeredAt: 'T' } }),
    ).toEqual({ kind: 'registered', email: MOCK_EMAIL, registeredAt: 'T' });
    expect(
      reduce(registering, {
        type: 'registered',
        result: { status: 'existing', registeredAt: 'T' },
      }),
    ).toEqual({ kind: 'alreadyRegistered', email: MOCK_EMAIL, registeredAt: 'T' });
    expect(
      reduce(registering, { type: 'registered', result: { status: 'campaign_closed' } }),
    ).toEqual({ kind: 'closed', email: MOCK_EMAIL });
  });

  it('keeps the email on a failed registration, so retrying registers again', () => {
    const failed = reduce({ kind: 'registering', email: MOCK_EMAIL }, { type: 'registerFailed' });
    expect(failed).toEqual({ kind: 'error', email: MOCK_EMAIL });
    expect(reduce(failed, { type: 'register' })).toEqual({
      kind: 'registering',
      email: MOCK_EMAIL,
    });
    expect(reduce({ kind: 'loading' }, { type: 'statusFailed' })).toEqual({
      kind: 'error',
      email: null,
    });
  });

  it('never leaves notOpen', () => {
    const notOpen: RewardState = { kind: 'notOpen' };
    expect(reduce(notOpen, { type: 'status', status: { kind: 'signedOut' } })).toBe(notOpen);
    expect(reduce(notOpen, { type: 'signIn' })).toBe(notOpen);
  });

  it('signs out from any signed-in state', () => {
    expect(reduce(ready, { type: 'signedOut' })).toEqual(signedOut);
    expect(isSignedIn(ready)).toBe(true);
    expect(isSignedIn(signedOut)).toBe(false);
    expect(isSignedIn({ kind: 'error', email: null })).toBe(false);
  });
});

describe('first-visit popup rule', () => {
  it('offers itself only before registration and only once', () => {
    expect(popupAllowed(signedOut, false)).toBe(true);
    expect(popupAllowed(ready, false)).toBe(true);
    expect(popupAllowed(signedOut, true)).toBe(false);
    expect(popupAllowed({ kind: 'notOpen' }, false)).toBe(false);
    expect(popupAllowed({ kind: 'closed', email: MOCK_EMAIL }, false)).toBe(false);
    expect(
      popupAllowed({ kind: 'alreadyRegistered', email: MOCK_EMAIL, registeredAt: 'T' }, false),
    ).toBe(false);
  });
});

describe('gateway choice', () => {
  it('has no gateway in off mode', async () => {
    expect(await createRewardGateway('off')).toBeNull();
  });
});

describe('mock gateway', () => {
  const store = new Map<string, string>();
  const assign = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    store.clear();
    assign.mockReset();
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
    });
    vi.stubGlobal('window', { location: { origin: 'http://localhost', assign } });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const settle = async <T>(promise: Promise<T>) => {
    await vi.runAllTimersAsync();
    return promise;
  };

  it('starts each scenario where SPEC section 7 expects', () => {
    expect(mockStart('signed-out')).toMatchObject({ signedIn: false, registeredAt: null });
    expect(mockStart('signed-in')).toMatchObject({ signedIn: true, registeredAt: null });
    expect(mockStart('registered').registeredAt).not.toBeNull();
  });

  it('signs in, returns to the page and registers once', async () => {
    const gateway = new MockRewardGateway('?mock=signed-out');
    expect(await settle(gateway.getStatus())).toEqual({ kind: 'signedOut' });
    await settle(gateway.signIn('/?intent=prereg#reward'));
    expect(assign).toHaveBeenCalledWith('/?intent=prereg#reward');

    // After the reload the account is still signed in.
    const back = new MockRewardGateway('');
    expect(await settle(back.getStatus())).toMatchObject({ kind: 'signedIn', registered: false });
    const first = await settle(back.register());
    expect(first.status).toBe('created');
    expect((await settle(back.register())).status).toBe('existing');
    expect(JSON.parse(store.get(MOCK_KEY) ?? '{}').registeredAt).not.toBeNull();
  });

  it('comes back cancelled without the registration intent', async () => {
    const gateway = new MockRewardGateway('?mock=cancelled');
    await settle(gateway.signIn('/en?mock=cancelled&intent=prereg#reward'));
    expect(assign).toHaveBeenCalledWith('/en?mock=cancelled&auth=cancelled#reward');
  });

  it('answers closed, existing and errors on purpose', async () => {
    expect(await settle(new MockRewardGateway('?mock=closed').register())).toEqual({
      status: 'campaign_closed',
    });
    const failing = new MockRewardGateway('?mock=error').register();
    const outcome = expect(failing).rejects.toThrow();
    await vi.runAllTimersAsync();
    await outcome;
  });

  it('switches scenario when ?mock= changes, and keeps it when it does not', () => {
    store.set(
      MOCK_KEY,
      JSON.stringify({ scenario: 'signed-in', signedIn: false, registeredAt: null }),
    );
    // Same scenario: the saved account wins (the visitor signed out).
    new MockRewardGateway('?mock=signed-in');
    expect(JSON.parse(store.get(MOCK_KEY) ?? '{}').signedIn).toBe(false);
    // Another scenario starts fresh.
    new MockRewardGateway('?mock=registered');
    expect(JSON.parse(store.get(MOCK_KEY) ?? '{}').scenario).toBe('registered');
  });
});
