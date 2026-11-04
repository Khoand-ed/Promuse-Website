# Promuse landing page — architecture

How the site is built. What it shows is in `SPEC.md`; the HTTP contract is in `API.md`.

## 1. Overview

```text
Browser ──(static page)──────────▶ Vercel · Next.js 16
   │                                 ├─ /[locale]        static page per locale
   │                                 ├─ /auth/callback   OAuth code exchange
   │                                 └─ /api/v1/*        route handlers → services ──(RPC as the user)──▶ Supabase Postgres (RLS)
   └──(Google sign-in, PKCE)───────▶ Supabase Auth ◀──▶ Google OAuth
Unity game (later) ──(Bearer access token)──▶ /api/v1/*
```

- The page is static per locale and served from Vercel's CDN. Interactive parts are client islands.
- The browser signs in with Google through Supabase Auth. The session lives in cookies managed by `@supabase/ssr`.
- `/api/v1` is the only way any client reads or changes data. The Unity game will call the same API with a Bearer token.
- Postgres enforces ownership: row-level security for reads, `security definer` functions for writes. The app holds no secret key.

## 2. Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router), TypeScript strict | Static pages and API routes in one codebase, room for more pages later |
| Styling | Tailwind CSS v4 | Tokens in CSS, fast iteration |
| Motion | GSAP (ScrollTrigger, SplitText), Lenis | Scroll-driven timelines and text effects for a P3R-level page |
| Languages | next-intl | Locale routing, static rendering per locale, typed messages |
| Auth and data | Supabase: Auth with Google, Postgres | Free plan; Postgres matches the GDD's backend direction; RLS |
| Validation | zod | One way to validate API input, environment and content |
| Tests | Vitest, Playwright | Unit tests for services and handlers; end-to-end tests in mock mode |
| Hosting | Vercel Hobby | Free for personal projects; a preview for every branch |

## 3. Environments

| Environment | URL | `NEXT_PUBLIC_BACKEND_MODE` | Supabase |
|---|---|---|---|
| Local | http://localhost:3000 | `mock` until P6, then `supabase` | The single cloud project |
| Preview | One Vercel URL per branch | `supabase` | Same project |
| Production | `https://<project>.vercel.app` | `supabase` | Same project |

One Supabase project is enough for a portfolio (the Free plan allows two active projects). Create it in the Singapore region, the closest to Vietnam, and pick the matching Vercel Functions region if the plan offers the choice.

## 4. Directory structure

```text
.
├─ AGENTS.md · CLAUDE.md · README.md
├─ doc/                         SPEC, ARCHITECTURE, API, PHASES; qa/ for QA reports
├─ messages/vi.json, en.json    UI strings
├─ public/images/               web-ready assets (paths in SPEC.md, section 11)
├─ supabase/migrations/         0001_init.sql, 0002_prereg_campaign.sql, …
├─ tests/unit/                  Vitest
├─ tests/e2e/                   Playwright (mock mode)
└─ src/
   ├─ proxy.ts                  next-intl routing + Supabase session refresh
   ├─ app/
   │  ├─ globals.css            Tailwind v4 + @theme tokens
   │  ├─ icon.png
   │  ├─ [locale]/              layout.tsx, page.tsx, not-found.tsx, opengraph-image.png
   │  ├─ auth/callback/route.ts
   │  ├─ api/v1/health/route.ts
   │  ├─ api/v1/preregistration/route.ts
   │  ├─ api/v1/mail/route.ts
   │  ├─ api/v1/mail/[mailId]/claim/route.ts
   │  └─ dev/                   motion/ and token/ helpers, 404 in production
   ├─ components/
   │  ├─ sections/              Intro, Header, Hero, Reward, Story, Features, Gameplay, Characters, Footer
   │  ├─ ui/                    Button, Modal, Tabs, Slider, Lightbox, LanguageSwitch, MotionToggle
   │  └─ motion/                MotionProvider, SmoothScroll, BeatClock, Reveal, SplitHeadline,
   │                            ScrollType, Marquee, SlashWipe, Parallax, NoteLanes
   ├─ content/                  site.ts, characters.ts, features.ts, gameplay.ts (typed, { vi, en })
   ├─ i18n/                     routing.ts, request.ts, navigation.ts
   ├─ lib/
   │  ├─ env.ts                 zod-validated environment
   │  ├─ motion/                gsap.ts (plugin registration), helpers
   │  ├─ supabase/              browser.ts, server.ts, proxy.ts (session refresh)
   │  └─ reward/                RewardGateway interface, supabase and mock gateways
   └─ server/
      ├─ http/                  requireUser, error envelope, responses
      ├─ schemas/               zod schemas shared by handlers
      └─ services/              types.ts, supabase/, memory/
```

## 5. Layers

```text
UI component ─▶ RewardGateway (browser) ─▶ fetch /api/v1/* ─▶ route handler ─▶ service interface ─▶ Supabase implementation ─▶ Postgres function or RLS read
```

- Everything under `src/server/` imports `server-only`.
- Route handlers parse input with zod, call `requireUser()`, call one service method and map its result to HTTP as `API.md` says. No business logic in handlers.
- Services return typed results (discriminated unions) for expected outcomes. Only unexpected failures throw; the handler turns them into `internal`.

### Server services

```ts
// src/server/services/types.ts
export type Locale = 'vi' | 'en';
export type Reward = { type: 'gem'; amount: number };

export interface UserContext {
  userId: string;
}

export interface PreregistrationService {
  getStatus(user: UserContext): Promise<
    { registered: false } | { registered: true; registeredAt: string; campaignKey: string }
  >;
  register(user: UserContext, locale: Locale): Promise<
    | { status: 'created' | 'existing'; registeredAt: string; campaignKey: string }
    | { status: 'campaign_closed' }
  >;
}

export interface MailItem {
  id: string;
  campaignKey: string | null;
  title: string;
  body: string;
  rewards: Reward[];
  createdAt: string;
  expiresAt: string | null;
  claimedAt: string | null;
}

export interface MailService {
  list(user: UserContext, locale: Locale): Promise<MailItem[]>;
  claim(user: UserContext, mailId: string): Promise<
    | { status: 'claimed' | 'already_claimed'; mailId: string; rewards: Reward[]; claimedAt: string }
    | { status: 'expired' }
    | { status: 'not_found' }
  >;
}
```

- `createSupabaseServices(db)` builds both services for one request from a user-scoped Supabase client, so every query runs as that user and RLS and `auth.uid()` apply.
- `createMemoryServices(seed)` builds in-memory versions with the same behaviour for unit tests.

### Browser reward gateway

```ts
// src/lib/reward/types.ts
export type PreregStatus =
  | { kind: 'signedOut' }
  | { kind: 'signedIn'; email: string; registered: false }
  | { kind: 'signedIn'; email: string; registered: true; registeredAt: string };

export interface RewardGateway {
  getStatus(): Promise<PreregStatus>;
  signIn(returnPath: string): Promise<void>; // leaves the page for Google
  signOut(): Promise<void>;
  register(locale: Locale): Promise<
    { status: 'created' | 'existing'; registeredAt: string } | { status: 'campaign_closed' }
  >; // throws on network or server errors
}
```

- `SupabaseRewardGateway`: Supabase browser auth plus `fetch` to `/api/v1/preregistration`.
- `MockRewardGateway`: no network. `?mock=` picks a scenario: `signed-out` (default; sign-in "succeeds" after 800 ms and registration returns `created`), `signed-in`, `registered`, `existing`, `cancelled`, `error`, `closed`.
- `NEXT_PUBLIC_BACKEND_MODE` chooses the gateway. The reward widget is a state machine over this interface and holds no Supabase code.

## 6. Rendering

- `src/app/[locale]/page.tsx` renders statically for each locale (`generateStaticParams` and `setRequestLocale`). Page code never reads cookies or headers, which keeps it static.
- Sections are Server Components that receive typed content. Motion wrappers, modals, sliders and the reward widget are client components.
- Heavy client code (Supabase client, modals, sliders) loads with `next/dynamic` or on first interaction.
- The reward widget asks the gateway for status after mount; the static HTML shows the signed-out state.

## 7. Authentication

### Web sign-in (PKCE)

1. The widget calls `gateway.signIn('/en?intent=prereg')` (the current locale path), which calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/auth/callback?next=' + encodeURIComponent(path) } })`.
2. Google returns to Supabase, which redirects to `/auth/callback?code=…&next=…`.
3. `src/app/auth/callback/route.ts`: if the URL has `error` (the visitor cancelled), redirect to `next` with `auth=cancelled`; otherwise call `exchangeCodeForSession(code)` and redirect to `next`, or to `next` with `auth=error` on failure. Only relative `next` values are accepted; anything else becomes `/`.
4. The page loads. The widget sees a session and `intent=prereg`, scrolls to `#reward`, calls `POST /api/v1/preregistration`, shows the result, then removes `intent` from the URL with `history.replaceState`.

### Session handling

- Browser: `createBrowserClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)`.
- Server: `createServerClient` with Next.js cookies.
- `src/proxy.ts` refreshes the session with `getClaims()` and writes refreshed cookies, as in the Supabase guide for Next.js.

### API authentication: `requireUser(request)`

1. If `Authorization: Bearer <token>` is present, create a client that sends that header and verify the token with `getClaims(token)`.
2. Otherwise use the cookie-based server client and `getClaims()`.
3. On failure, respond `401 unauthorized`.
4. Return `{ user: { userId }, db }`, where `db` sends the user's JWT so RLS and `auth.uid()` apply.

### Game (later)

The game signs in to the same Supabase project with the same Google account (a native Google ID token exchanged through Supabase's ID-token sign-in), then calls `/api/v1` with `Authorization: Bearer <access token>`. At that point the Supabase Google provider must also list the game's OAuth client IDs: comma-separated, web client ID first.

## 8. Proxy

```text
request ─▶ next-intl middleware (locale routing) ─▶ response
        └▶ Supabase session refresh on that same response (getClaims, set cookies)
```

- One `src/proxy.ts`, composed of `createMiddleware(routing)` and the Supabase refresh helper in `src/lib/supabase/proxy.ts`.
- Matcher: skip `api`, `auth`, `dev`, `_next`, `_vercel` and any path with a dot. Route handlers refresh their own session.
- Skip the Supabase step when the request carries no Supabase auth cookie.

## 9. Data model

`supabase/migrations/0001_init.sql`:

```sql
create table public.campaigns (
  key                text primary key,                    -- 'prereg-launch'
  kind               text not null check (kind in ('preregistration')),
  title              jsonb not null,                      -- {"vi": "...", "en": "..."}
  body               jsonb not null,
  rewards            jsonb not null,                      -- [{"type": "gem", "amount": 1800}]
  starts_at          timestamptz not null default now(),
  ends_at            timestamptz,                         -- null: open-ended
  mail_expires_after interval                             -- null: mail never expires
);

create table public.preregistrations (
  user_id      uuid not null references auth.users (id) on delete cascade,
  campaign_key text not null references public.campaigns (key),
  email        text not null,
  locale       text not null check (locale in ('vi', 'en')),
  created_at   timestamptz not null default now(),
  primary key (user_id, campaign_key)
);

create table public.mail (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  campaign_key text references public.campaigns (key),
  title        jsonb not null,
  body         jsonb not null,
  rewards      jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz,
  claimed_at   timestamptz,
  unique (user_id, campaign_key)                          -- one campaign mail per user
);

create index mail_user_created_at_idx on public.mail (user_id, created_at desc);

alter table public.campaigns        enable row level security;
alter table public.preregistrations enable row level security;
alter table public.mail             enable row level security;

create policy "read own preregistrations" on public.preregistrations
  for select to authenticated using (user_id = (select auth.uid()));

create policy "read own mail" on public.mail
  for select to authenticated using (user_id = (select auth.uid()));

-- No insert, update or delete policies: writes go through the functions below.
revoke insert, update, delete on public.campaigns, public.preregistrations, public.mail
  from anon, authenticated;
```

### Functions

Both are `language plpgsql`, `security definer`, `set search_path = ''` (fully qualified names inside), and executable only by `authenticated`:

```sql
revoke all on function public.register_preregistration(text) from public, anon;
grant execute on function public.register_preregistration(text) to authenticated;
revoke all on function public.claim_mail(uuid) from public, anon;
grant execute on function public.claim_mail(uuid) to authenticated;
```

`register_preregistration(p_locale text) returns jsonb`

1. `auth.uid()` is null → raise an exception.
2. `p_locale` is not `vi` or `en` → raise an exception (the API validates first).
3. Take the latest campaign of kind `preregistration` by `starts_at`. None → `{"status": "campaign_closed"}`.
4. The user already has a registration for it → `{"status": "existing", "registeredAt": …, "campaignKey": …}`.
5. The campaign is outside its window (`starts_at > now()` or `ends_at <= now()`) → `{"status": "campaign_closed"}`.
6. In one transaction, insert the registration (email read from `auth.users`) and the mail (title, body and rewards copied from the campaign; `expires_at = now() + mail_expires_after`, or null), both `on conflict do nothing` → `{"status": "created", …}`. If a parallel request won the insert, return `existing`.

`claim_mail(p_mail_id uuid) returns jsonb`

1. `auth.uid()` is null → raise an exception.
2. Select the mail `where id = p_mail_id and user_id = auth.uid()` with `for update`. None → `{"status": "not_found"}`.
3. `claimed_at` is set → `{"status": "already_claimed", "mailId": …, "rewards": …, "claimedAt": …}`.
4. `expires_at <= now()` → `{"status": "expired"}`.
5. Set `claimed_at = now()` → `{"status": "claimed", "mailId": …, "rewards": …, "claimedAt": …}`.

### Campaign data

`supabase/migrations/0002_prereg_campaign.sql` (a migration, not `seed.sql`, so production gets the row too):

```sql
insert into public.campaigns (key, kind, title, body, rewards)
values (
  'prereg-launch',
  'preregistration',
  '{"vi": "Quà đăng ký sớm", "en": "Pre-registration reward"}',
  '{"vi": "[TODO] Cảm ơn bạn đã đăng ký sớm Promuse!", "en": "[TODO] Thanks for pre-registering for Promuse!"}',
  '[{"type": "gem", "amount": 1800}]'   -- [TODO] confirm the amount; keep reward.desc in sync
);
```

Never edit a migration that has been applied. Add a new one.

## 10. Environment variables

| Name | Needed in | Example | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | All | `http://localhost:3000` | Canonical URL for metadata, sitemap and Open Graph |
| `NEXT_PUBLIC_BACKEND_MODE` | All | `mock` or `supabase` | Chooses the reward gateway |
| `NEXT_PUBLIC_SUPABASE_URL` | `supabase` mode | `https://<project-ref>.supabase.co` | |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `supabase` mode | `sb_publishable_…` | Safe in the browser; RLS protects the data |

`src/lib/env.ts` validates these with zod. The build fails when the mode is `supabase` and a Supabase variable is missing. OAuth redirects use `location.origin`, so preview deployments work without extra configuration. Commit only `.env.example`.

## 11. Errors and logging

- Every API error uses the envelope in `API.md`.
- Server logs carry the route, the error code and a request id. Never log tokens, cookies or email addresses.

## 12. Testing

- Unit (Vitest): services against the in-memory implementations; route handlers against fake services (status codes and envelopes); zod schemas; the reward widget's state machine against `MockRewardGateway`.
- End-to-end (Playwright, `NEXT_PUBLIC_BACKEND_MODE=mock`): both locales load; modals work by keyboard; deep links; every `?mock=` scenario; motion off via `page.emulateMedia({ reducedMotion: 'reduce' })`.
- Manual (P6): two real Google accounts, plus `curl` against the API with an access token from `/dev/token`.

## 13. CI and deployment

- `.github/workflows/ci.yml` runs on every push and pull request: `npm ci`, lint, typecheck, unit tests, build in mock mode, then Playwright on Chromium.
- Vercel's Git integration builds a preview for every branch and deploys `master` to production.
- Database: apply `supabase/migrations/*.sql` in order with the Supabase CLI (`supabase link`, then `supabase db push`) or paste them into the SQL Editor.

## 14. Free-plan limits

| Service | Limit that matters | What we do |
|---|---|---|
| Supabase Free | Paused after a week of low activity; 500 MB database; 50,000 monthly active users; 2 active projects | Before a demo, open the dashboard and resume the project if it is paused; data is kept |
| Vercel Hobby | Personal, non-commercial use only; 5,000 image transformations a month; after hitting a limit, wait 30 days | Fine for a portfolio. Keep few image variants (`images.deviceSizes`, one modern format); sprites are `unoptimized` |
| Google consent screen | Shows `<project-ref>.supabase.co` without a custom domain | Accept for the demo; a custom domain or Google brand verification later |

## 15. Extension points

- More languages: add the locale to `src/i18n/routing.ts` and a messages file.
- More pages (news, media kit): new routes under `src/app/[locale]/`.
- A CMS: replace the loaders in `src/content/`; components already take typed content.
- A web mailbox or account page: reuse `MailService` and the API.
- New campaign kinds (events, compensation): extend `campaigns.kind` and add a function.
- Sign in with Apple: add the provider in Supabase and a button in the reward gateway. Needed before an iOS release, because App Store guideline 4.8 asks apps with a social login to also offer a privacy-focused option.
- Rate limiting and analytics, once traffic is real.
