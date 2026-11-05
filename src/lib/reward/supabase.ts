import type { SupabaseClient } from '@supabase/supabase-js';
import type { Locale } from 'next-intl';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import type { PreregStatus, RegisterResult, RewardGateway } from './types';

const ENDPOINT = '/api/v1/preregistration';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/**
 * The real backend (doc/ARCHITECTURE.md, sections 5 and 7): Google sign-in through Supabase Auth,
 * and the website's API for the registration, which reads the session cookie. Loaded only in
 * `supabase` mode, so supabase-js stays out of the first load.
 */
export class SupabaseRewardGateway implements RewardGateway {
  constructor(private readonly supabase: SupabaseClient = createSupabaseBrowserClient()) {}

  async getStatus(): Promise<PreregStatus> {
    const { data, error } = await this.supabase.auth.getClaims();
    if (error) throw error;
    if (!data) return { kind: 'signedOut' };
    const email = data.claims.email ?? '';

    const response = await fetch(ENDPOINT, { cache: 'no-store' });
    // The session ended on the server, for example after signing out on another device.
    if (response.status === 401) return { kind: 'signedOut' };
    if (!response.ok) throw new Error(`GET ${ENDPOINT} answered ${response.status}`);
    const body: unknown = await response.json();
    if (isRecord(body) && body.registered === false) {
      return { kind: 'signedIn', email, registered: false };
    }
    if (isRecord(body) && body.registered === true && typeof body.registeredAt === 'string') {
      return { kind: 'signedIn', email, registered: true, registeredAt: body.registeredAt };
    }
    throw new Error(`GET ${ENDPOINT} answered an unexpected body`);
  }

  async signIn(returnPath: string): Promise<void> {
    const redirectTo = new URL('/auth/callback', window.location.origin);
    redirectTo.searchParams.set('next', returnPath);
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo.href,
        // Always show Google's account chooser, so "Not you? Sign out" can lead to another account.
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    // This browser only; the visitor's other devices stay signed in.
    const { error } = await this.supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
  }

  async register(locale: Locale): Promise<RegisterResult> {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale }),
    });
    if (response.status === 410) return { status: 'campaign_closed' };
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`POST ${ENDPOINT} answered ${response.status}`);
    }
    const body: unknown = await response.json();
    if (
      isRecord(body) &&
      (body.status === 'created' || body.status === 'existing') &&
      typeof body.registeredAt === 'string'
    ) {
      return { status: body.status, registeredAt: body.registeredAt };
    }
    throw new Error(`POST ${ENDPOINT} answered an unexpected body`);
  }
}
