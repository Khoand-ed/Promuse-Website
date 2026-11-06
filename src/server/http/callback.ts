import 'server-only';
import { AUTH_CANCELLED, AUTH_ERROR, AUTH_PARAM, INTENT_PARAM } from '@/lib/reward/types';

export type SignInOutcome = 'signedIn' | 'cancelled' | 'failed';

/**
 * Where the OAuth callback sends the visitor (doc/ARCHITECTURE.md, section 7): the `next` path, which
 * must stay on this site (anything else becomes `/`), plus `auth=cancelled` or `auth=error` when the
 * sign-in did not complete. Those drop `intent`, since there is no session to register with.
 */
export function returnUrl(next: string | null, outcome: SignInOutcome, origin: string): URL {
  let url = new URL('/', origin);
  if (next?.startsWith('/') && !next.startsWith('//')) {
    // `/\evil.example` and the like resolve to another host; the origin check catches them.
    const candidate = new URL(next, origin);
    if (candidate.origin === origin) url = candidate;
  }
  if (outcome !== 'signedIn') {
    url.searchParams.delete(INTENT_PARAM);
    url.searchParams.set(AUTH_PARAM, outcome === 'cancelled' ? AUTH_CANCELLED : AUTH_ERROR);
  }
  return url;
}
