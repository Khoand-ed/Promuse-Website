import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabaseProject } from '@/lib/env';

/**
 * A client for route handlers that acts as the visitor whose session cookie came with the request,
 * and writes refreshed cookies back to the response. Create one per request.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, key } = supabaseProject();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
      },
    },
  });
}

/** A client that acts as the holder of an access token sent as `Authorization: Bearer`. */
export function createSupabaseTokenClient(token: string) {
  const { url, key } = supabaseProject();
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
