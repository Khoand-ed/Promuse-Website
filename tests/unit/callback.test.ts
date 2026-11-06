import { afterEach, describe, expect, it, vi } from 'vitest';

const exchange = vi.hoisted(() => vi.fn());

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: async () => ({ auth: { exchangeCodeForSession: exchange } }),
}));

const { NextRequest } = await import('next/server');
const { GET } = await import('@/app/auth/callback/route');
const { returnUrl } = await import('@/server/http/callback');

const ORIGIN = 'http://localhost:3000';
const NEXT = encodeURIComponent('/en?intent=prereg#reward');

afterEach(() => {
  exchange.mockReset();
  vi.restoreAllMocks();
});

describe('returnUrl', () => {
  it('keeps the path, the intent and the hash after a sign-in', () => {
    expect(returnUrl('/en?intent=prereg#reward', 'signedIn', ORIGIN).href).toBe(
      'http://localhost:3000/en?intent=prereg#reward',
    );
  });

  it('drops the intent and says why when the sign-in did not complete', () => {
    expect(returnUrl('/en?intent=prereg#reward', 'cancelled', ORIGIN).href).toBe(
      'http://localhost:3000/en?auth=cancelled#reward',
    );
    expect(returnUrl('/?intent=prereg#reward', 'failed', ORIGIN).href).toBe(
      'http://localhost:3000/?auth=error#reward',
    );
  });

  it('sends anything but a path on this site to /', () => {
    const unsafe = [
      null,
      '',
      'en',
      'https://evil.example/',
      '//evil.example/',
      '/\\evil.example/',
      'javascript:alert(1)',
    ];
    for (const next of unsafe) {
      expect(returnUrl(next, 'signedIn', ORIGIN).href).toBe('http://localhost:3000/');
    }
  });
});

describe('GET /auth/callback', () => {
  const call = (query: string) => GET(new NextRequest(`${ORIGIN}/auth/callback?${query}`));

  it('exchanges the code for a session and goes back to the page', async () => {
    exchange.mockResolvedValue({ error: null });
    const response = await call(`code=abc&next=${NEXT}`);
    expect(exchange).toHaveBeenCalledWith('abc');
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/en?intent=prereg#reward');
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('reports a sign-in cancelled at Google', async () => {
    const response = await call(`error=access_denied&error_description=denied&next=${NEXT}`);
    expect(exchange).not.toHaveBeenCalled();
    expect(response.headers.get('location')).toBe('http://localhost:3000/en?auth=cancelled#reward');
  });

  it('reports a failed sign-in and logs only the error key', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    exchange.mockResolvedValue({ error: { code: 'flow_state_not_found', name: 'AuthApiError' } });
    const failures = [`code=abc&next=${NEXT}`, `next=${NEXT}`, `error=server_error&next=${NEXT}`];
    for (const query of failures) {
      const response = await call(query);
      expect(response.headers.get('location')).toBe('http://localhost:3000/en?auth=error#reward');
    }
    const causes = warn.mock.calls.map(([line]) => JSON.parse(String(line)).cause);
    expect(causes).toEqual(['flow_state_not_found', 'missing_code', 'server_error']);
    expect(warn.mock.calls.join(' ')).not.toContain('abc');
  });
});
