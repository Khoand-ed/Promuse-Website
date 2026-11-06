import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { env } from './lib/env';
import { refreshSession } from './lib/supabase/proxy';

const handleI18nRouting = createMiddleware(routing);

/** Locale routing, then the Supabase session refresh on the same response (doc/ARCHITECTURE.md, section 8). */
export default async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  if (env.NEXT_PUBLIC_BACKEND_MODE !== 'supabase') return response;
  return refreshSession(request, response);
}

export const config = {
  // Skip API routes, OAuth callback, dev helpers, Next.js internals and files with an extension.
  // Route handlers refresh their own session.
  matcher: '/((?!api|auth|dev|_next|_vercel|.*\\..*).*)',
};
