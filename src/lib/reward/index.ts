import type { Env } from '@/lib/env';
import { MockRewardGateway } from './mock';
import type { RewardGateway } from './types';

export type BackendMode = Env['NEXT_PUBLIC_BACKEND_MODE'];

/**
 * The gateway for the backend mode, or null in `off` mode, where the widget shows `notOpen`.
 * Browser only: the mock reads the URL and sessionStorage. The Supabase gateway is loaded on demand,
 * so supabase-js stays out of the page's first load (doc/SPEC.md, section 10).
 */
export async function createRewardGateway(mode: BackendMode): Promise<RewardGateway | null> {
  switch (mode) {
    case 'off':
      return null;
    case 'mock':
      return new MockRewardGateway(window.location.search);
    case 'supabase': {
      const { SupabaseRewardGateway } = await import('./supabase');
      return new SupabaseRewardGateway();
    }
  }
}

export type { PreregStatus, RegisterResult, RewardGateway } from './types';
