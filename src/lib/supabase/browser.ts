import { createBrowserClient } from '@supabase/ssr';

/**
 * The browser's Supabase client: Google sign-in, with the session kept in cookies so route handlers
 * can read it (doc/ARCHITECTURE.md, section 7). The values are inlined at build time and were
 * validated by `src/lib/env.ts`, which stays out of the browser bundle.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured.');
  return createBrowserClient(url, key);
}
