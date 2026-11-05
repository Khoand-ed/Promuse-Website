import type { PreregStatus, RegisterResult, RewardGateway } from './types';
import { AUTH_CANCELLED, AUTH_PARAM } from './types';

/** `?mock=` scenarios (doc/ARCHITECTURE.md, section 5). */
export const MOCK_SCENARIOS = [
  'signed-out',
  'signed-in',
  'registered',
  'existing',
  'cancelled',
  'error',
  'closed',
] as const;
export type MockScenario = (typeof MOCK_SCENARIOS)[number];

/** sessionStorage: the mock "account", kept across the fake trip to Google and back. */
export const MOCK_KEY = 'promuse:mock';
/** A made-up address; the mock never sees a real one. */
export const MOCK_EMAIL = 'nguoi.choi@example.com';
const EARLIER = '2026-11-01T08:00:00.000Z';

interface MockAccount {
  scenario: MockScenario;
  signedIn: boolean;
  registeredAt: string | null;
}

/** How each scenario starts. */
export function mockStart(scenario: MockScenario): MockAccount {
  switch (scenario) {
    case 'signed-in':
    case 'error':
    case 'closed':
      return { scenario, signedIn: true, registeredAt: null };
    case 'registered':
      return { scenario, signedIn: true, registeredAt: EARLIER };
    default:
      // signed-out, existing and cancelled all start at the sign-in button.
      return { scenario, signedIn: false, registeredAt: null };
  }
}

function isScenario(value: string | null): value is MockScenario {
  return MOCK_SCENARIOS.includes(value as MockScenario);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A backend without network for development and previews. `?mock=<scenario>` picks how it behaves;
 * the choice and the fake account live in sessionStorage, so they survive the fake trip to Google,
 * which takes 800 ms and reloads the page as the real one would.
 */
export class MockRewardGateway implements RewardGateway {
  private account: MockAccount;

  constructor(search: string) {
    const asked = new URLSearchParams(search).get('mock');
    const saved = this.load();
    const scenario: MockScenario = isScenario(asked) ? asked : (saved?.scenario ?? 'signed-out');
    this.account = saved && saved.scenario === scenario ? saved : mockStart(scenario);
    this.save();
  }

  async getStatus(): Promise<PreregStatus> {
    await wait(300);
    const { signedIn, registeredAt } = this.account;
    if (!signedIn) return { kind: 'signedOut' };
    if (registeredAt)
      return { kind: 'signedIn', email: MOCK_EMAIL, registered: true, registeredAt };
    return { kind: 'signedIn', email: MOCK_EMAIL, registered: false };
  }

  async signIn(returnPath: string): Promise<void> {
    await wait(800);
    if (this.account.scenario === 'cancelled') {
      const url = new URL(returnPath, window.location.origin);
      url.searchParams.delete('intent');
      url.searchParams.set(AUTH_PARAM, AUTH_CANCELLED);
      window.location.assign(url.pathname + url.search + url.hash);
      return;
    }
    this.account = {
      ...this.account,
      signedIn: true,
      registeredAt: this.account.scenario === 'existing' ? EARLIER : this.account.registeredAt,
    };
    this.save();
    window.location.assign(returnPath);
  }

  async signOut(): Promise<void> {
    await wait(300);
    this.account = { ...this.account, signedIn: false };
    this.save();
  }

  async register(): Promise<RegisterResult> {
    await wait(600);
    const { scenario, signedIn, registeredAt } = this.account;
    if (!signedIn || scenario === 'error') throw new Error('The mock backend failed on purpose.');
    if (scenario === 'closed') return { status: 'campaign_closed' };
    if (registeredAt) return { status: 'existing', registeredAt };
    const now = new Date().toISOString();
    this.account = { ...this.account, registeredAt: now };
    this.save();
    return { status: 'created', registeredAt: now };
  }

  private load(): MockAccount | null {
    try {
      const raw = sessionStorage.getItem(MOCK_KEY);
      const parsed = raw ? (JSON.parse(raw) as MockAccount) : null;
      return parsed && isScenario(parsed.scenario) ? parsed : null;
    } catch {
      return null;
    }
  }

  private save() {
    try {
      sessionStorage.setItem(MOCK_KEY, JSON.stringify(this.account));
    } catch {
      // Without storage the mock forgets the account on reload, like signing out.
    }
  }
}
