import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Services } from '../types';

const registrationRow = z.object({ campaign_key: z.string(), created_at: z.string() });

const registerResult = z.discriminatedUnion('status', [
  z.object({
    status: z.enum(['created', 'existing']),
    registeredAt: z.string(),
    campaignKey: z.string(),
  }),
  z.object({ status: z.literal('campaign_closed') }),
]);

/** Postgres timestamps (`2026-11-04T08:00:00.123456+00:00`) as ISO 8601 in UTC, as doc/API.md says. */
const toIso = (value: string) => new Date(value).toISOString();

/**
 * The services for one request, over a Supabase client that acts as the signed-in visitor, so RLS
 * and `auth.uid()` apply to every query (doc/ARCHITECTURE.md, section 5). Reads go through RLS;
 * the registration goes through `register_preregistration` (section 9).
 */
export function createSupabaseServices(db: SupabaseClient): Services {
  return {
    preregistration: {
      async getStatus(user) {
        const { data, error } = await db
          .from('preregistrations')
          .select('campaign_key, created_at')
          .eq('user_id', user.userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        if (!data) return { registered: false };
        const row = registrationRow.parse(data);
        return { registered: true, registeredAt: toIso(row.created_at), campaignKey: row.campaign_key };
      },

      async register(_user, locale) {
        const { data, error } = await db.rpc('register_preregistration', { p_locale: locale });
        if (error) throw error;
        const result = registerResult.parse(data);
        return result.status === 'campaign_closed'
          ? result
          : { ...result, registeredAt: toIso(result.registeredAt) };
      },
    },
  };
}
