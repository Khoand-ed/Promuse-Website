import type { PreregStatus, RegisterResult } from './types';

/** The reward widget's states (doc/SPEC.md, section 7). */
export type RewardState =
  | { kind: 'loading' }
  | { kind: 'notOpen' }
  | { kind: 'signedOut'; cancelled: boolean }
  | { kind: 'redirecting' }
  | { kind: 'signedInNotRegistered'; email: string }
  | { kind: 'registering'; email: string }
  | { kind: 'registered'; email: string; registeredAt: string }
  | { kind: 'alreadyRegistered'; email: string; registeredAt: string }
  | { kind: 'closed'; email: string }
  /** `email` is null when even the status could not be read; retrying then reads it again. */
  | { kind: 'error'; email: string | null };

export type RewardEvent =
  | { type: 'status'; status: PreregStatus; cancelled?: boolean }
  | { type: 'statusFailed' }
  | { type: 'reload' }
  | { type: 'signIn' }
  | { type: 'register' }
  | { type: 'registered'; result: RegisterResult }
  | { type: 'registerFailed' }
  | { type: 'signedOut' };

function emailOf(state: RewardState): string | null {
  return 'email' in state ? state.email : null;
}

/** Pure transitions; the widget runs the gateway calls that lead to these events. */
export function reduce(state: RewardState, event: RewardEvent): RewardState {
  if (state.kind === 'notOpen') return state;
  switch (event.type) {
    case 'status': {
      const { status } = event;
      if (status.kind === 'signedOut')
        return { kind: 'signedOut', cancelled: Boolean(event.cancelled) };
      if (status.registered) {
        return {
          kind: 'alreadyRegistered',
          email: status.email,
          registeredAt: status.registeredAt,
        };
      }
      return { kind: 'signedInNotRegistered', email: status.email };
    }
    case 'statusFailed':
      return { kind: 'error', email: null };
    case 'reload':
      return { kind: 'loading' };
    case 'signIn':
      return state.kind === 'signedOut' ? { kind: 'redirecting' } : state;
    case 'register': {
      const email = emailOf(state);
      const ready = state.kind === 'signedInNotRegistered' || state.kind === 'error';
      return ready && email ? { kind: 'registering', email } : state;
    }
    case 'registered': {
      if (state.kind !== 'registering') return state;
      const { result } = event;
      if (result.status === 'campaign_closed') return { kind: 'closed', email: state.email };
      const kind = result.status === 'created' ? 'registered' : 'alreadyRegistered';
      return { kind, email: state.email, registeredAt: result.registeredAt };
    }
    case 'registerFailed':
      return state.kind === 'registering' ? { kind: 'error', email: state.email } : state;
    case 'signedOut':
      return { kind: 'signedOut', cancelled: false };
  }
}

/** Whether the first-visit popup may open (doc/SPEC.md, section 5). */
export function popupAllowed(state: RewardState, dismissed: boolean): boolean {
  if (dismissed) return false;
  return state.kind === 'signedOut' || state.kind === 'signedInNotRegistered';
}

/** Whether the visitor is signed in, so "Not you? Sign out" applies. */
export function isSignedIn(state: RewardState): boolean {
  return emailOf(state) !== null;
}
