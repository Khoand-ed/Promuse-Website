import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Locale routing only; the Supabase session refresh joins in P3 (doc/ARCHITECTURE.md, section 8).
export default createMiddleware(routing);

export const config = {
  // Skip API routes, OAuth callback, dev helpers, Next.js internals and files with an extension.
  matcher: '/((?!api|auth|dev|_next|_vercel|.*\\..*).*)',
};
