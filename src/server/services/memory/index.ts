import 'server-only';
import type { Locale, Services } from '../types';

export interface MemoryCampaign {
  key: string;
  startsAt: string;
  /** Null or missing: open-ended. */
  endsAt?: string | null;
}

export interface MemoryRegistration {
  userId: string;
  campaignKey: string;
  locale: Locale;
  createdAt: string;
}

export interface MemorySeed {
  campaigns?: MemoryCampaign[];
  registrations?: MemoryRegistration[];
  now?: () => Date;
}

const newestFirst = <T>(items: T[], at: (item: T) => string) =>
  [...items].sort((a, b) => Date.parse(at(b)) - Date.parse(at(a)));

/**
 * In-memory services that follow the same rules as `register_preregistration`
 * (doc/ARCHITECTURE.md, section 9), for unit tests. `registrations` exposes what was stored.
 */
export function createMemoryServices(
  seed: MemorySeed = {},
): Services & { registrations: MemoryRegistration[] } {
  const campaigns = [...(seed.campaigns ?? [])];
  const registrations = [...(seed.registrations ?? [])];
  const now = seed.now ?? (() => new Date());

  return {
    registrations,
    preregistration: {
      async getStatus(user) {
        const [latest] = newestFirst(
          registrations.filter((r) => r.userId === user.userId),
          (r) => r.createdAt,
        );
        return latest
          ? { registered: true, registeredAt: latest.createdAt, campaignKey: latest.campaignKey }
          : { registered: false };
      },

      async register(user, locale) {
        const [campaign] = newestFirst(campaigns, (c) => c.startsAt);
        if (!campaign) return { status: 'campaign_closed' };
        const existing = registrations.find(
          (r) => r.userId === user.userId && r.campaignKey === campaign.key,
        );
        if (existing) {
          return { status: 'existing', registeredAt: existing.createdAt, campaignKey: campaign.key };
        }
        const at = now();
        const ended = campaign.endsAt != null && Date.parse(campaign.endsAt) <= at.getTime();
        if (Date.parse(campaign.startsAt) > at.getTime() || ended) {
          return { status: 'campaign_closed' };
        }
        const created = {
          userId: user.userId,
          campaignKey: campaign.key,
          locale,
          createdAt: at.toISOString(),
        };
        registrations.push(created);
        return { status: 'created', registeredAt: created.createdAt, campaignKey: campaign.key };
      },
    },
  };
}
