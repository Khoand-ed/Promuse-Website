# Promuse landing page — build phases

Build order and acceptance criteria. Work one phase at a time; each phase ends with a working, deployable site.

**Order:** P0, P1, **P4**, P2, P3, P5, P6, P7. The motion system comes right after the page shell, because the p3re.jp experience is mostly motion (owner's decision, 2026-11-05). Pre-registration follows (P2, P3); production stays in `off` mode until P3. The content-heavy sections come last, because they wait on art and copy. Phases keep their numbers so references stay valid.

| Phase | Result |
|---|---|
| P0 | Docs match the owner's decisions; Next.js project, tooling and folders; asset audit |
| P1 | Both languages, content system, visual identity, full page shell, CI, first Vercel deploy |
| P4 | Motion system, shared Modal, intro, hero, trailer lightbox |
| P2 | Pre-registration UI on the mock gateway, end-to-end tests |
| P3 | Supabase, database, API v1, real Google sign-in, privacy page: registration live in production |
| P5 | Introduction, Features and Gameplay sections with their modals |
| P6 | Characters section and profile modal |
| P7 | SEO, performance, accessibility, cross-device checks, launch decisions, portfolio README |

## How a phase runs

1. Claude Code reads the phase and its "Read first" sections, proposes a plan, waits for approval, builds on the phase branch (`phase/p<n>-<topic>`), runs the checks and reports.
2. Antigravity runs QA in its browser and writes `doc/qa/<phase>.md`. QA sessions do not edit source code.
3. Claude Code fixes the failing items and ticks them in the report.
4. When the owner asks: commit, push, open a pull request into `main`, and check CI and the Vercel preview. The owner merges.

### Definition of done (every phase)

- Lint, typecheck, test, build and `check:content` pass.
- Every "Done when" item is ticked, or explained and accepted by the owner.
- Docs are updated if a decision changed, and `CONTENT_TODO.md` is regenerated.
- The QA report has no open failures, or each deferral has a reason.
- Commits and the pull request carry no AI attribution (`AGENTS.md`, working agreement).

### QA report format

```markdown
# QA — P5 (2026-11-20)

Antigravity browser · widths 360 / 768 / 1440 · motion on and off · keyboard only

- [x] Features modal opens with Enter and closes with Esc; focus returns to the button
- [ ] FAIL — Gameplay slider dots stay on 1 after a swipe
  - Steps: open /#gameplay-detail at 360 px, swipe left twice
  - Expected: dot 3 active, "Image 3 of 5" announced
  - Actual: dot 1 active
  - Screenshot: doc/qa/img/p5-slider-dots.png
```

## P0 — Decisions, scaffold and tooling

**Read first:** `AGENTS.md`; `ARCHITECTURE.md` sections 2, 4, 10 and 16.

**Tasks**

1. Bring the docs in line with the owner's decisions of 2026-11-04: `main` as the only branch, standalone Supabase registration without a web mailbox, the content system, `GAME_FACTS.md`, `DESIGN.md`, the new phase order and the git rules.
2. This folder's name, "Landing Page", breaks npm's package-name rules, so `create-next-app .` refuses it. Scaffold into a temporary subfolder instead: `npx create-next-app@latest scaffold-tmp` with TypeScript, ESLint, Tailwind CSS, App Router, the `src/` directory, import alias `@/*`, npm, no dependency install and no git initialisation (this folder is already a repo). Check `npx create-next-app@latest --help` for the exact flags.
3. Move the generated files into the repo root. Keep the existing `AGENTS.md`, `CLAUDE.md`, `README.md` and `doc/`; discard the generated `AGENTS.md`, `CLAUDE.md` and `README.md` (ours already include the Next.js docs rule). Delete `scaffold-tmp`, the starter page content and the starter SVGs in `public/`. Set `"name": "promuse-landing"` and `"engines": { "node": "24.x" }`, add an `.nvmrc` with `24`, then run `npm install`.
4. Install `gsap @gsap/react lenis next-intl @supabase/supabase-js @supabase/ssr zod`, and as dev dependencies `vitest @playwright/test prettier prettier-plugin-tailwindcss`. Run `npx playwright install chromium`.
5. Scripts: `dev`, `build`, `start`, `lint` (the ESLint CLI; Next.js 16 removed `next lint`), `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `e2e` (`playwright test`), `format`, `check:content` (a stub until P1).
6. Turn on `noUncheckedIndexedAccess` in `tsconfig.json`.
7. Create the folders from `ARCHITECTURE.md` section 4 with minimal placeholder files, `.env.example` (section 10), `src/lib/env.ts`, and a short section in `README.md` on running the project (the portfolio README comes in P7).
8. Asset audit: compare `public/images/` with `SPEC.md` section 11 and list what is missing, the wrong size or the wrong format. Report only; change nothing.

**Done when**

- [ ] `npm run dev` shows a placeholder page at http://localhost:3000.
- [ ] Lint, typecheck, test and build pass.
- [ ] The docs match the decisions: no `master`, no mail endpoints, `GAME_FACTS.md` and `DESIGN.md` exist; `package.json` is named `promuse-landing`.
- [ ] The asset audit is in the report.

## P1 — Languages, content system, identity, page shell, first deploy

**Read first:** `SPEC.md` sections 2, 3, 8, 9, 11 and 12; `ARCHITECTURE.md` sections 4, 6, 8 and 16; `DESIGN.md`; `GAME_FACTS.md`.

**Tasks**

1. next-intl: `src/i18n/routing.ts` (`vi` default, `en`, `localePrefix: 'as-needed'`), `request.ts` (messages from `content/text`) and `navigation.ts`; `src/proxy.ts` with next-intl only (the Supabase step comes in P3); `src/app/[locale]/layout.tsx` with `<html lang>`, `generateStaticParams` and `setRequestLocale`.
2. Content system (`ARCHITECTURE.md` section 16): zod schemas and loaders in `src/content/`; the full content skeleton in `content/` for every block, modal, character and the privacy page — UI drafts from `SPEC.md` section 8, facts from `GAME_FACTS.md`, `[TODO]` everywhere else; generated JSON Schemas; a working `check:content` that writes `CONTENT_TODO.md`; `doc/CONTENT_GUIDE.md` in Vietnamese.
3. Identity: the owner chose to follow p3re.jp closely (2026-11-05) over the style-tile directions. Measure p3re.jp, add its colours to `@theme`, load Vietnamese-capable substitutes for its fonts with `next/font`, and record the decisions in `DESIGN.md` section 4.
4. Page shell laid out like p3re.jp (`SPEC.md` sections 2, 3 and 5): skip link; Header (links over the hero from 1024 px, the corner MENU button and full-screen menu below that, no animation yet); every block with its anchor, real structure and content; Footer (spec table, share links, links hidden when empty, privacy link) and a back-to-top button; LanguageSwitch that keeps the section in view; `ImageSlot` with labelled placeholders. No dead buttons: a button that opens a modal appears in the phase that builds the modal (P5, P6), the Intro overlay comes with the motion system (P4), and the reward button shows `notOpen`.
5. The privacy page (`/privacy`, `/en/privacy`) with its structure and `[TODO]` text, so the footer link works from the first deploy; and `noindex` on every page until P7.
6. `.github/workflows/ci.yml` as in `ARCHITECTURE.md` section 13 (the Playwright step is added in P2).
7. Walk me through creating the Vercel project `promuse` from this GitHub repo: framework preset, environment variables (`NEXT_PUBLIC_BACKEND_MODE=off` for production and `mock` for previews, `NEXT_PUBLIC_SITE_URL`), production branch `main`.

**Done when**

- [ ] `/` (Vietnamese) and `/en` render the full shell, every string and image slot comes from `content/`, and the language switch keeps the current section.
- [ ] `npm run check:content` validates both locales and writes `CONTENT_TODO.md`, and each entry names the file, the key, what to write and how.
- [ ] Nav links scroll to their sections, and nothing fixed on screen (the corner menu button, the back-to-top button) covers a heading.
- [ ] "Đặng Ữ Ổ Ặ ợ ừ" renders correctly in every font in use.
- [ ] CI is green on GitHub and the Vercel production URL works.

**QA focus:** layout at 360, 768 and 1440 px; mobile menu; language switch; keyboard tab order; contrast; Vietnamese diacritics.

## P4 — Motion system, Modal, intro, hero, trailer (runs right after P1)

**Read first:** `SPEC.md` section 4, section 5 (Intro, Hero), section 6 (Modal, Lightbox); `DESIGN.md`; the motion rules in `AGENTS.md`.

**Tasks**

0. Study p3re.jp's motion (opening, title and image reveals, the pinned character scene and its colour changes, menu and modal transitions, hover states) and revise `SPEC.md` section 4 to follow it. Show me the revised plan before building.
1. `src/lib/motion/gsap.ts` registers ScrollTrigger, SplitText and `useGSAP`. Add `MotionProvider` (system setting plus the visitor's toggle in `promuse:motion`), `MotionToggle` in the header, `SmoothScroll` (Lenis driven by the GSAP ticker, off when motion is off) and `BeatClock` (`--beat`, `onBeat`, pauses when the tab is hidden).
2. The motifs of the revised section 4: RiseLetters, RiseLines, CoverReveal, Reveal, TitleZoom, GrowLine, OutlineWord, SplitLabel, and the beat pulse.
3. A development-only page, `/dev/motion`, that shows each primitive with motion on and off (404 in production). Show it to me before step 4.
4. Opening and Hero as in `SPEC.md` section 5, with a poster image that loads first and the optional hero video. Then the reveals on every section the page already has (Reward, Introduction, Features, Gameplay, slogans, outline word, footer).
5. Modal: native `<dialog>` with `showModal()`, Esc, focus return, scroll lock, hash and Back button, and the transition from the revised section 4 (a fade with motion off). Lightbox on top of it (youtube-nocookie iframe added on open, removed on close).
6. The pinned character scene: the row from P1 moves sideways with the scroll and the background takes each character's colour; with motion off the row stays a plain sideways scroller.

**Done when**

- [ ] The intro plays once per session, skips by button, key or tap, and never plays with motion off.
- [ ] With motion off, the page scrolls natively, nothing parallaxes, scrubs or slides, and modals fade.
- [ ] Closing the lightbox stops the video, and the trailer button is hidden when `trailerId` is empty.
- [ ] The Modal works by keyboard alone: Esc closes it and focus returns to the opener.
- [ ] The character row pins and moves sideways with motion on (at most one pinned scene below 768 px) and stays a plain sideways scroller with motion off.
- [ ] A Chrome Performance recording of the first ten seconds shows no long tasks from animation code, and the hero scrolls smoothly on a real mid-range Android phone.

**QA focus:** every way to skip the intro; the effects toggle; hero at three widths; lightbox with the keyboard; a performance trace screenshot.

## P2 — Pre-registration UI (mock)

**Read first:** `SPEC.md` section 3, section 5 (Reward), section 6 (Modal) and section 7; `ARCHITECTURE.md` section 5 (Browser reward gateway). The Modal exists since P4.

**Tasks**

1. The `RewardGateway` interface and `MockRewardGateway` with every `?mock=` scenario, plus the `notOpen` state for `off` mode. Production stays `off`; the mock runs locally and on previews.
2. The reward popup, built on the Modal from P4 and opening with its transition.
3. The reward widget as a state machine over the gateway (`SPEC.md` section 7), the banner, the popup rules and the sign-out link.
4. The return flow: `intent=prereg` triggers one registration, scrolls to `#reward`, then is removed from the URL.
5. Unit tests for the state machine; Playwright tests for every scenario, both locales and the popup rules; add the Playwright step to CI.

**Done when**

- [ ] Every `?mock=` scenario, and `off` mode, shows the state `SPEC.md` section 7 describes, in both languages.
- [ ] The popup appears once, never after registration, and its button starts sign-in.
- [ ] The modal works by keyboard alone: Esc closes it and focus returns to the opener.
- [ ] Playwright passes locally and in CI.

**QA focus:** every scenario at 360 and 1440 px; screen-reader labels on the button states; popup rules across reloads.

## P3 — Supabase, API v1, Google sign-in, privacy page

**Read first:** `ARCHITECTURE.md` sections 5, 7, 8, 9, 10, 13 and 17; `API.md`; `SPEC.md` section 13.

**Manual setup.** Walk me through it one step at a time and wait for my confirmation after each:

1. Supabase: create the project in the Singapore region; copy the project URL and the publishable key. (It ended up in Tokyo, which is fine: `ARCHITECTURE.md`, section 3.)
2. Google Cloud: configure the OAuth consent screen (app name Promuse; scopes `openid`, email and profile; the privacy page as the privacy-policy link) and create an OAuth client of type "Web application". Add the callback URL shown on Supabase's Google provider page as an authorized redirect URI. Publish the consent screen so any Google account can sign in.
3. Supabase: enable the Google provider with the client ID and secret. Under URL configuration, set the Site URL and add redirect URLs for `http://localhost:3000/**`, the production URL and a wildcard for Vercel previews.
4. Environment variables in `.env.local` and in Vercel, with `NEXT_PUBLIC_BACKEND_MODE=supabase` (production switches from `off` to `supabase` here).

**Tasks**

5. Migrations `0001_init.sql` and `0002_prereg_campaign.sql` as in `ARCHITECTURE.md` section 9, applied to the project.
6. The clients in `src/lib/supabase/`, the session-refresh step composed into `src/proxy.ts`, and `src/app/auth/callback/route.ts`.
7. `requireUser`, the error envelope, zod schemas, the Supabase and in-memory services, and the `/api/v1` routes from `API.md`.
8. `SupabaseRewardGateway`, chosen by `NEXT_PUBLIC_BACKEND_MODE`.
9. `/dev/token` (404 in production) to copy the current access token for curl tests.
10. Finish the privacy page (`SPEC.md` section 13) with the owner's text; its structure exists since P1.
11. Unit tests for the services and the route handlers.

**Done when**

- [ ] A new Google account ends in `registered`, and the database holds one registration for it, with `google_sub` filled.
- [ ] Signing in again with that account shows `alreadyRegistered`, still with one registration.
- [ ] A second account gets its own row, and cancelling at the Google screen shows `cancelled`.
- [ ] With an account's token, `GET` and `POST /api/v1/preregistration` answer as `API.md` says, and a second `POST` returns `existing`.
- [ ] Writing to the tables directly from the browser client is rejected by RLS.
- [ ] No Supabase secret key exists in the repo, in `.env.local` or in Vercel.
- [ ] The privacy page is reachable from the footer and the reward block, and before registration goes live in production its text and contact email are the owner's, not `[TODO]`.

**QA focus:** the full sign-in loop on the Vercel preview with two accounts; cancel at the Google screen; sign out and switch accounts.

## P5 — Introduction, Features, Gameplay

**Read first:** `SPEC.md` section 5 (Introduction, Features, Gameplay), section 6 (Tabs, Slider) and section 8; `GAME_FACTS.md`.

**Tasks**

1. Confirm with the owner the four Features topics and the four Gameplay tabs proposed in `SPEC.md` section 8.
2. Tabs and Slider components as in `SPEC.md` section 6.
3. Introduction: final copy and image from `content/` (its motion exists since P4).
4. Features: the "See details" button and a modal with four tabs; deep link `#features-detail`.
5. Gameplay: the "Gameplay details" button and a modal with four tabs, each with a Slider; the gacha rate line rendered from data; deep link `#gameplay-detail`.

**Done when**

- [ ] Both modals work with the keyboard alone: open, switch tabs, move slides, close, and focus returns.
- [ ] `/#features-detail` and `/en#gameplay-detail` open the right modal, and Back closes it.
- [ ] Sliders swipe on a phone; the dots and the "Image n of m" announcement stay in sync.
- [ ] Every string and number comes from `content/`, and every game fact shown is in `GAME_FACTS.md`.

**QA focus:** a keyboard-only pass; swiping at 360 px; deep links; motion off.

## P6 — Characters

**Read first:** `SPEC.md` section 5 (Characters) and section 11; `GAME_FACTS.md` section 3; the content and UI rules in `AGENTS.md`.

**Tasks**

1. The four characters in `content/` with the stats and passives from `GAME_FACTS.md`, a theme colour each (`[TODO]` until chosen), and `[TODO]` taglines and profiles.
2. Cards grouped by rarity, mono to colour on hover and focus, the theme colour on the active card.
3. Profile modal: Change visual (a 0.3 s cross-fade between the idle and battle visuals, as on p3re.jp), stats, passive, a gallery slider hidden when empty, previous and next plus ← and →, deep link `#char-<slug>`.
4. Rendering rules for character visuals, agreed with the owner once the art exists. Pixel art gets `unoptimized`, `image-rendering: pixelated` and whole-number scaling at every breakpoint.

**Done when**

- [ ] Character visuals stay crisp at 360, 768 and 1440 px.
- [ ] Change visual, previous and next work with the mouse and the keyboard.
- [ ] `/en#char-nova` opens NOVA's profile in English.
- [ ] Replacing a character image only needs a file at its slot's path.

**QA focus:** image sharpness (zoomed screenshots); keyboard navigation inside the modal; motion off.

## P7 — Polish and launch

**Read first:** `SPEC.md` sections 9, 10 and 13; `ARCHITECTURE.md` sections 13 and 14; `CONTENT_TODO.md`.

**Tasks**

1. Per-locale metadata, `hreflang`, Open Graph and Twitter images, `sitemap.ts`, `robots.ts`, and JSON-LD `VideoGame` (platform Android).
2. An `images` config with few variants; lazy-load heavy client code; check the bundle size.
3. Lighthouse on mobile before and after; fix until the `SPEC.md` section 10 targets hold.
4. Accessibility pass: keyboard, labels, contrast, motion off. Ask before adding an audit dependency.
5. Test Chrome on Android first, then Safari on iOS (visitors may browse on iPhones even though the game is Android-only), on real devices if possible.
6. Go through `CONTENT_TODO.md` with the owner and settle the launch decisions: the display name AMIYA, the currency name, the reward wording, the privacy text and contact, the copyright holder.
7. `README.md` for the portfolio: what it is, the stack, an architecture diagram, key decisions, how to run it, screenshots.

**Done when**

- [ ] The `SPEC.md` section 10 targets are met, with the scores recorded in `doc/qa/P7.md`.
- [ ] Sharing the production URL in Messenger and X shows the right image and title.
- [ ] No `[TODO]` or `[REVIEW]` is visible except the ones the owner keeps on purpose, and every launch decision in task 6 is made.
- [ ] The README is ready for the portfolio.

**QA focus:** a final full pass of every earlier phase's "Done when" list on the production URL.
