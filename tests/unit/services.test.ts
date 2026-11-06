import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';
import { createMemoryServices } from '@/server/services/memory';
import { createSupabaseServices } from '@/server/services/supabase';

const alice = { userId: 'user-alice' };
const bob = { userId: 'user-bob' };
const launch = { key: 'prereg-launch', startsAt: '2026-11-01T00:00:00.000Z' };
const at = (iso: string) => () => new Date(iso);

describe('preregistration service, in memory', () => {
  it('registers once, then reports the same registration', async () => {
    const services = createMemoryServices({
      campaigns: [launch],
      now: at('2026-11-05T08:00:00.000Z'),
    });
    const first = await services.preregistration.register(alice, 'vi');
    expect(first).toEqual({
      status: 'created',
      registeredAt: '2026-11-05T08:00:00.000Z',
      campaignKey: 'prereg-launch',
    });
    expect(await services.preregistration.register(alice, 'en')).toEqual({
      ...first,
      status: 'existing',
    });
    expect(services.registrations).toEqual([
      {
        userId: 'user-alice',
        campaignKey: 'prereg-launch',
        locale: 'vi',
        createdAt: '2026-11-05T08:00:00.000Z',
      },
    ]);
  });

  it('keeps each visitor to their own registration and status', async () => {
    const services = createMemoryServices({ campaigns: [launch] });
    await services.preregistration.register(alice, 'vi');
    expect(await services.preregistration.getStatus(bob)).toEqual({ registered: false });
    expect(await services.preregistration.register(bob, 'en')).toMatchObject({ status: 'created' });
    expect(services.registrations.map((r) => r.userId)).toEqual(['user-alice', 'user-bob']);
    expect(await services.preregistration.getStatus(alice)).toEqual({
      registered: true,
      registeredAt: services.registrations[0]?.createdAt,
      campaignKey: 'prereg-launch',
    });
  });

  it('is closed without a campaign, before it starts and once it ends', async () => {
    const now = at('2026-11-05T08:00:00.000Z');
    const cases = [
      [],
      [{ key: 'later', startsAt: '2026-12-01T00:00:00.000Z' }],
      [{ ...launch, endsAt: '2026-11-05T08:00:00.000Z' }],
    ];
    for (const campaigns of cases) {
      const services = createMemoryServices({ campaigns, now });
      expect(await services.preregistration.register(alice, 'vi')).toEqual({
        status: 'campaign_closed',
      });
      expect(services.registrations).toEqual([]);
    }
  });

  it('still reports an existing registration once the campaign has ended', async () => {
    const services = createMemoryServices({
      campaigns: [{ ...launch, endsAt: '2026-11-03T00:00:00.000Z' }],
      registrations: [
        {
          userId: 'user-alice',
          campaignKey: 'prereg-launch',
          locale: 'en',
          createdAt: '2026-11-02T00:00:00.000Z',
        },
      ],
      now: at('2026-11-05T08:00:00.000Z'),
    });
    expect(await services.preregistration.register(alice, 'vi')).toEqual({
      status: 'existing',
      registeredAt: '2026-11-02T00:00:00.000Z',
      campaignKey: 'prereg-launch',
    });
  });

  it('registers for the latest campaign', async () => {
    const services = createMemoryServices({
      campaigns: [launch, { key: 'prereg-season-2', startsAt: '2026-11-04T00:00:00.000Z' }],
      now: at('2026-11-05T08:00:00.000Z'),
    });
    expect(await services.preregistration.register(alice, 'vi')).toMatchObject({
      campaignKey: 'prereg-season-2',
    });
  });
});

/** A stand-in for the user-scoped Supabase client that records what the service asks for. */
function fakeDb(answers: { row?: unknown; rpc?: unknown; error?: unknown }) {
  const calls: unknown[][] = [];
  const query = {
    select: (...args: unknown[]) => (calls.push(['select', ...args]), query),
    eq: (...args: unknown[]) => (calls.push(['eq', ...args]), query),
    order: (...args: unknown[]) => (calls.push(['order', ...args]), query),
    limit: () => query,
    maybeSingle: async () => ({ data: answers.row ?? null, error: answers.error ?? null }),
  };
  const db = {
    from: (table: string) => (calls.push(['from', table]), query),
    rpc: async (fn: string, args: unknown) => {
      calls.push(['rpc', fn, args]);
      return { data: answers.rpc ?? null, error: answers.error ?? null };
    },
  };
  return { calls, services: createSupabaseServices(db as unknown as SupabaseClient) };
}

describe('preregistration service, on Supabase', () => {
  it('reads the latest own registration, with timestamps in UTC ISO 8601', async () => {
    const { calls, services } = fakeDb({
      row: { campaign_key: 'prereg-launch', created_at: '2026-11-05T08:00:00.123456+00:00' },
    });
    expect(await services.preregistration.getStatus(alice)).toEqual({
      registered: true,
      registeredAt: '2026-11-05T08:00:00.123Z',
      campaignKey: 'prereg-launch',
    });
    expect(calls).toContainEqual(['from', 'preregistrations']);
    expect(calls).toContainEqual(['eq', 'user_id', 'user-alice']);
  });

  it('reports no registration', async () => {
    const { services } = fakeDb({});
    expect(await services.preregistration.getStatus(alice)).toEqual({ registered: false });
  });

  it('registers through register_preregistration', async () => {
    const { calls, services } = fakeDb({
      rpc: {
        status: 'created',
        registeredAt: '2026-11-05T08:00:00.123456+00:00',
        campaignKey: 'prereg-launch',
      },
    });
    expect(await services.preregistration.register(alice, 'en')).toEqual({
      status: 'created',
      registeredAt: '2026-11-05T08:00:00.123Z',
      campaignKey: 'prereg-launch',
    });
    expect(calls).toContainEqual(['rpc', 'register_preregistration', { p_locale: 'en' }]);
  });

  it('passes campaign_closed through', async () => {
    const { services } = fakeDb({ rpc: { status: 'campaign_closed' } });
    expect(await services.preregistration.register(alice, 'vi')).toEqual({
      status: 'campaign_closed',
    });
  });

  it('throws on database errors and on answers it does not expect', async () => {
    const failing = fakeDb({ error: { code: '42501', message: 'permission denied' } }).services;
    await expect(failing.preregistration.getStatus(alice)).rejects.toMatchObject({ code: '42501' });
    await expect(failing.preregistration.register(alice, 'vi')).rejects.toMatchObject({
      code: '42501',
    });
    const odd = fakeDb({ rpc: { status: 'maybe' } }).services;
    await expect(odd.preregistration.register(alice, 'vi')).rejects.toThrow();
  });
});
