import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';
import { supabaseProject } from '@/lib/env';

/** Supabase keeps the session in `sb-<project-ref>-auth-token` cookies, split into `.0`, `.1`… when long. */
export function hasAuthCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some(({ name }) => /^sb-.+-auth-token/.test(name));
}

/**
 * Refreshes an expiring Supabase session on the response next-intl produced, writing the new cookies
 * and the no-cache headers Supabase asks for (doc/ARCHITECTURE.md, section 8). Visitors without a
 * session cookie skip it and cost nothing.
 */
export async function refreshSession(
  request: NextRequest,
  response: NextResponse,
): Promise<NextResponse> {
  if (!hasAuthCookie(request)) return response;
  const { url, key } = supabaseProject();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        }
        for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
      },
    },
  });
  // Nothing may run between creating the client and getClaims(), which refreshes an expired token.
  await supabase.auth.getClaims();
  return response;
}
