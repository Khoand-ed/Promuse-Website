import type { Locale } from 'next-intl';

/** What the browser knows about the visitor (doc/ARCHITECTURE.md, section 5). */
export type PreregStatus =
  | { kind: 'signedOut' }
  | { kind: 'signedIn'; email: string; registered: false }
  | { kind: 'signedIn'; email: string; registered: true; registeredAt: string };

export type RegisterResult =
  { status: 'created' | 'existing'; registeredAt: string } | { status: 'campaign_closed' };

/**
 * Everything the reward widget needs from a backend. The widget holds no backend code: the mock
 * (P2) and Supabase (P3) are two implementations of this interface.
 */
export interface RewardGateway {
  getStatus(): Promise<PreregStatus>;
  /** Leaves the page for Google, which brings the visitor back to `returnPath`. */
  signIn(returnPath: string): Promise<void>;
  signOut(): Promise<void>;
  /** Throws on network or server errors. */
  register(locale: Locale): Promise<RegisterResult>;
}

/** Added to the return URL: run the registration once after signing in. */
export const INTENT_PARAM = 'intent';
export const INTENT_PREREG = 'prereg';
/** Added to the return URL when the visitor backed out of Google's sign-in. */
export const AUTH_PARAM = 'auth';
export const AUTH_CANCELLED = 'cancelled';
/** Added by the OAuth callback when the code exchange failed (P3). */
export const AUTH_ERROR = 'error';
