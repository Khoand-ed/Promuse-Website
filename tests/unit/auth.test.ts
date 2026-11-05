import { beforeEach, describe, expect, it, vi } from 'vitest';

const clients = vi.hoisted(() => ({
  token: { auth: { getClaims: vi.fn() } },
  cookie: { auth: { getClaims: vi.fn() } },
}));

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseTokenClient: vi.fn(() => clients.token),
  createSupabaseServerClient: vi.fn(async () => clients.cookie),
}));

const { bearerToken, requireUser } = await import('@/server/http/auth');

const signedIn = { sub: 'user-alice', role: 'authenticated', email: 'nguoi.choi@example.com' };
const claimsResult = (claims: Record<string, unknown> | null, error: Error | null = null) => ({
  data: claims ? { claims } : null,
  error,
});
const request = (authorization?: string) =>
  new Request('http://localhost:3000/api/v1/preregistration', {
    headers: authorization ? { Authorization: authorization } : {},
  });

beforeEach(() => {
  clients.token.auth.getClaims.mockReset();
  clients.cookie.auth.getClaims.mockReset();
});

describe('bearerToken', () => {
  it('reads the token from an Authorization header', () => {
    expect(bearerToken('Bearer abc.def.ghi')).toBe('abc.def.ghi');
    expect(bearerToken('bearer   abc ')).toBe('abc');
    expect(bearerToken('Basic abc')).toBeNull();
    expect(bearerToken('Bearer')).toBeNull();
    expect(bearerToken(null)).toBeNull();
  });
});

describe('requireUser', () => {
  it('verifies a Bearer token and acts as its holder', async () => {
    clients.token.auth.getClaims.mockResolvedValue(claimsResult(signedIn));
    const caller = await requireUser(request('Bearer abc.def.ghi'));
    expect(clients.token.auth.getClaims).toHaveBeenCalledWith('abc.def.ghi');
    expect(clients.cookie.auth.getClaims).not.toHaveBeenCalled();
    expect(caller).toEqual({ user: { userId: 'user-alice' }, db: clients.token });
  });

  it('uses the session cookie without a Bearer token', async () => {
    clients.cookie.auth.getClaims.mockResolvedValue(claimsResult(signedIn));
    const caller = await requireUser(request());
    expect(clients.cookie.auth.getClaims).toHaveBeenCalledWith(undefined);
    expect(caller?.user).toEqual({ userId: 'user-alice' });
  });

  it('rejects missing, invalid, anonymous and non-user tokens', async () => {
    const rejected = [
      claimsResult(null),
      claimsResult(null, new Error('invalid JWT')),
      claimsResult({ ...signedIn, role: 'anon' }),
      claimsResult({ ...signedIn, is_anonymous: true }),
      claimsResult({ role: 'authenticated' }),
    ];
    for (const result of rejected) {
      clients.cookie.auth.getClaims.mockResolvedValueOnce(result);
      expect(await requireUser(request())).toBeNull();
    }
  });
});
