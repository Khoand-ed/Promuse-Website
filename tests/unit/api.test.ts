import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET as health } from '@/app/api/v1/health/route';
import { preregistrationRoutes } from '@/server/http/preregistration';
import { createMemoryServices } from '@/server/services/memory';
import type { Services } from '@/server/services/types';

const ENDPOINT = 'http://localhost:3000/api/v1/preregistration';
const user = { userId: 'user-alice' };
const launch = { key: 'prereg-launch', startsAt: '2026-11-01T00:00:00.000Z' };

/** The routes with a fake sign-in: `null` means nobody is signed in. */
const routesFor = (services: Services | null) =>
  preregistrationRoutes(async () => (services ? { user, services } : null));

const get = () => new Request(ENDPOINT);
const post = (body: unknown) =>
  new Request(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('GET /api/v1/health', () => {
  it('answers ok with the API version', async () => {
    const response = health();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, version: '1' });
  });
});

describe('/api/v1/preregistration', () => {
  it('answers 401 in the error envelope when nobody is signed in', async () => {
    const routes = routesFor(null);
    for (const response of [await routes.GET(get()), await routes.POST(post({ locale: 'vi' }))]) {
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({
        error: { code: 'unauthorized', message: expect.any(String), details: {} },
      });
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.headers.get('X-Request-Id')).toMatch(/^[0-9a-f-]{36}$/);
    }
  });

  it('reports the status before and after registering', async () => {
    const routes = routesFor(createMemoryServices({ campaigns: [launch] }));
    const before = await routes.GET(get());
    expect(before.status).toBe(200);
    expect(before.headers.get('Cache-Control')).toBe('no-store');
    expect(await before.json()).toEqual({ registered: false });

    await routes.POST(post({ locale: 'vi' }));
    expect(await (await routes.GET(get())).json()).toEqual({
      registered: true,
      registeredAt: expect.any(String),
      campaignKey: 'prereg-launch',
    });
  });

  it('answers 201 created, then 200 existing, with one registration', async () => {
    const services = createMemoryServices({ campaigns: [launch] });
    const routes = routesFor(services);
    const created = await routes.POST(post({ locale: 'en' }));
    expect(created.status).toBe(201);
    const body = await created.json();
    expect(body).toEqual({
      status: 'created',
      registeredAt: expect.any(String),
      campaignKey: 'prereg-launch',
    });

    const again = await routes.POST(post({ locale: 'en' }));
    expect(again.status).toBe(200);
    expect(await again.json()).toEqual({ ...body, status: 'existing' });
    expect(services.registrations).toHaveLength(1);
  });

  it('answers 410 campaign_closed when there is no open campaign', async () => {
    const response = await routesFor(createMemoryServices()).POST(post({ locale: 'vi' }));
    expect(response.status).toBe(410);
    expect(await response.json()).toEqual({
      error: { code: 'campaign_closed', message: 'Pre-registration has ended.', details: {} },
    });
  });

  it('answers 400 validation_failed for a body it cannot use', async () => {
    const routes = routesFor(createMemoryServices({ campaigns: [launch] }));
    for (const body of [{}, { locale: 'fr' }, [], 'not json']) {
      const response = await routes.POST(post(body));
      expect(response.status).toBe(400);
      const { error } = await response.json();
      expect(error.code).toBe('validation_failed');
      expect(error.details.issues.length).toBeGreaterThan(0);
    }
  });

  it('turns an unexpected failure into 500 internal and logs no personal data', async () => {
    const failure = Object.assign(new Error('nguoi.choi@example.com: token abc'), { code: 'PGRST301' });
    const services: Services = {
      preregistration: {
        getStatus: () => Promise.reject(failure),
        register: () => Promise.reject(failure),
      },
    };
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await routesFor(services).GET(get());
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ error: { code: 'internal' } });

    const line = String(log.mock.calls[0]?.[0]);
    expect(JSON.parse(line)).toEqual({
      route: 'GET /api/v1/preregistration',
      code: 'internal',
      requestId: response.headers.get('X-Request-Id'),
      cause: 'PGRST301',
    });
    expect(line).not.toContain('example.com');
    expect(line).not.toContain('token');
  });
});
