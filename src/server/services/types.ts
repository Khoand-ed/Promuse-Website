import 'server-only';

/** The locales a registration records, as the database's check constraint allows. */
export type Locale = 'vi' | 'en';

export interface UserContext {
  userId: string;
}

export type PreregistrationStatus =
  | { registered: false }
  | { registered: true; registeredAt: string; campaignKey: string };

export type RegisterOutcome =
  | { status: 'created' | 'existing'; registeredAt: string; campaignKey: string }
  | { status: 'campaign_closed' };

export interface PreregistrationService {
  /** The visitor's latest registration. */
  getStatus(user: UserContext): Promise<PreregistrationStatus>;
  /** Registers the visitor for the current campaign, once. Timestamps are ISO 8601 in UTC. */
  register(user: UserContext, locale: Locale): Promise<RegisterOutcome>;
}

export interface Services {
  preregistration: PreregistrationService;
}
