import type { Env } from '@/lib/env';
import { MockRewardGateway } from './mock';
import type { RewardGateway } from './types';

export type BackendMode = Env['NEXT_PUBLIC_BACKEND_MODE'];

/**
 * The gateway for the backend mode, or null in `off` mode, where the widget shows `notOpen`.
 * Browser only: the mock reads the URL and sessionStorage.
 */
export function createRewardGateway(mode: BackendMode): RewardGateway | null {
  switch (mode) {
    case 'off':
      return null;
    case 'mock':
      return new MockRewardGateway(window.location.search);
    case 'supabase':
      // SupabaseRewardGateway arrives with the real sign-in (P3).
      throw new Error('The Supabase reward gateway is built in P3.');
  }
}

export type { PreregStatus, RegisterResult, RewardGateway } from './types';
