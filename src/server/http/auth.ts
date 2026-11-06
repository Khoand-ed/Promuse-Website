import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseServerClient, createSupabaseTokenClient } from '@/lib/supabase/server';
import { createSupabaseServices } from '@/server/services/supabase';
import type { Services, UserContext } from '@/server/services/types';

/** `Authorization: Bearer <token>` → the token. */
export function bearerToken(header: string | null): string | null {
  return header?.match(/^Bearer\s+(\S+)\s*$/i)?.[1] ?? null;
}

/**
 * Who is calling (doc/ARCHITECTURE.md, section 7): the access token in `Authorization: Bearer` when
 * present (curl, first-party clients), otherwise the session cookie. The token is verified with
 * `getClaims()`. Returns null for anyone but a signed-in, non-anonymous user; the handler answers
 * 401. `db` sends the user's token, so RLS and `auth.uid()` apply.
 */
export async function requireUser(
  request: Request,
): Promise<{ user: UserContext; db: SupabaseClient } | null> {
  const token = bearerToken(request.headers.get('authorization'));
  const db = token ? createSupabaseTokenClient(token) : await createSupabaseServerClient();
  const { data, error } = await db.auth.getClaims(token ?? undefined);
  const claims = data?.claims;
  if (error || !claims?.sub || claims.role !== 'authenticated' || claims.is_anonymous) return null;
  return { user: { userId: claims.sub }, db };
}

/** The caller and the services that act as them, or null when nobody is signed in. */
export async function authenticate(
  request: Request,
): Promise<{ user: UserContext; services: Services } | null> {
  const caller = await requireUser(request);
  return caller && { user: caller.user, services: createSupabaseServices(caller.db) };
}
