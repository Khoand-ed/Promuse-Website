import type { SupabaseClient } from '@supabase/supabase-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SupabaseRewardGateway } from '@/lib/reward/supabase';

const EMAIL = 'nguoi.choi@example.com';

/** A stand-in for the browser's Supabase client. `claims: null` means signed out. */
function fakeSupabase(claims: Record<string, unknown> | null, error: Error | null = null) {
  return {
    auth: {
      getClaims: vi.fn(async () => ({ data: claims ? { claims } : null, error })),
      signInWithOAuth: vi.fn(async () => ({ data: {}, error: null })),
      signOut: vi.fn(async () => ({ error: null })),
    },
  };
}

const gatewayFor = (client: ReturnType<typeof fakeSupabase>) =>
  new SupabaseRewardGateway(client as unknown as SupabaseClient);

const answer = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  vi.stubGlobal('window', { location: { origin: 'http://localhost:3000' } });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SupabaseRewardGateway.getStatus', () => {
  it('is signed out without a session, and asks the API nothing', async () => {
    expect(await gatewayFor(fakeSupabase(null)).getStatus()).toEqual({ kind: 'signedOut' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('combines the session email with the API status', async () => {
    const gateway = gatewayFor(fakeSupabase({ sub: 'user-alice', email: EMAIL }));
    fetchMock.mockResolvedValueOnce(answer(200, { registered: false }));
    expect(await gateway.getStatus()).toEqual({ kind: 'signedIn', email: EMAIL, registered: false });

    fetchMock.mockResolvedValueOnce(
      answer(200, {
        registered: true,
        registeredAt: '2026-11-05T08:00:00.000Z',
        campaignKey: 'prereg-launch',
      }),
    );
    expect(await gateway.getStatus()).toEqual({
      kind: 'signedIn',
      email: EMAIL,
      registered: true,
      registeredAt: '2026-11-05T08:00:00.000Z',
    });
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/preregistration', { cache: 'no-store' });
  });

  it('is signed out when the server no longer knows the session', async () => {
    fetchMock.mockResolvedValueOnce(answer(401, { error: { code: 'unauthorized' } }));
    expect(await gatewayFor(fakeSupabase({ email: EMAIL })).getStatus()).toEqual({
      kind: 'signedOut',
    });
  });

  it('throws on failures, so the widget offers a retry', async () => {
    await expect(gatewayFor(fakeSupabase(null, new Error('offline'))).getStatus()).rejects.toThrow(
      'offline',
    );
    fetchMock.mockResolvedValueOnce(answer(500, { error: { code: 'internal' } }));
    await expect(gatewayFor(fakeSupabase({ email: EMAIL })).getStatus()).rejects.toThrow('500');
  });
});

describe('SupabaseRewardGateway sign-in and sign-out', () => {
  it('leaves for Google with the return path, through the OAuth callback', async () => {
    const client = fakeSupabase(null);
    await gatewayFor(client).signIn('/en?intent=prereg#reward');
    expect(client.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo:
          'http://localhost:3000/auth/callback?next=%2Fen%3Fintent%3Dprereg%23reward',
        queryParams: { prompt: 'select_account' },
      },
    });
  });

  it('signs out of this browser only', async () => {
    const client = fakeSupabase({ email: EMAIL });
    await gatewayFor(client).signOut();
    expect(client.auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });
});

describe('SupabaseRewardGateway.register', () => {
  const registeredAt = '2026-11-05T08:00:00.000Z';

  it('posts the locale and maps the answers', async () => {
    const gateway = gatewayFor(fakeSupabase({ email: EMAIL }));
    fetchMock.mockResolvedValueOnce(
      answer(201, { status: 'created', registeredAt, campaignKey: 'prereg-launch' }),
    );
    expect(await gateway.register('vi')).toEqual({ status: 'created', registeredAt });
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/preregistration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"locale":"vi"}',
    });

    fetchMock.mockResolvedValueOnce(
      answer(200, { status: 'existing', registeredAt, campaignKey: 'prereg-launch' }),
    );
    expect(await gateway.register('en')).toEqual({ status: 'existing', registeredAt });

    fetchMock.mockResolvedValueOnce(answer(410, { error: { code: 'campaign_closed' } }));
    expect(await gateway.register('vi')).toEqual({ status: 'campaign_closed' });
  });

  it('throws on other answers', async () => {
    const gateway = gatewayFor(fakeSupabase({ email: EMAIL }));
    fetchMock.mockResolvedValueOnce(answer(401, { error: { code: 'unauthorized' } }));
    await expect(gateway.register('vi')).rejects.toThrow('401');
    fetchMock.mockResolvedValueOnce(answer(200, { status: 'maybe' }));
    await expect(gateway.register('vi')).rejects.toThrow('unexpected');
  });
});
