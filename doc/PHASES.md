# Promuse landing page — build phases

Build order and acceptance criteria. Work one phase at a time; each phase ends with a working, deployable site.

| Phase | Result |
|---|---|
| P0 | Next.js project, tooling and folders; asset audit |
| P1 | Both languages, full page shell, design tokens, CI, first Vercel deploy |
| P2 | Motion system, intro, hero, modal and trailer lightbox |
| P3 | Introduction, Features and Gameplay sections with their modals |
| P4 | Characters section and profile modal |
| P5 | Pre-registration UI on the mock gateway, end-to-end tests |
| P6 | Supabase, database, API v1, real Google sign-in |
| P7 | SEO, performance, accessibility, cross-device checks, portfolio README |
| S1 | Optional: playable two-lane beat demo |

## How a phase runs

1. Claude Code reads the phase and its "Read first" sections, proposes a plan, waits for approval, builds, runs the checks and reports.
2. Antigravity runs QA in its browser and writes `doc/qa/<phase>.md`. QA sessions do not edit source code.
3. Claude Code fixes the failing items and ticks them in the report.
4. Commit, push, and check the Vercel preview.

### Definition of done (every phase)

- Lint, typecheck, test and build pass.
- Every "Done when" item is ticked, or explained and accepted by the owner.
- Docs are updated if a decision changed.
- The QA report has no open failures, or each deferral has a reason.

### QA report format

```markdown
# QA — P3 (2026-11-12)

Antigravity browser · widths 360 / 768 / 1440 · motion on and off · keyboard only

- [x] Features modal opens with Enter and closes with Esc; focus returns to the button
- [ ] FAIL — Gameplay slider dots stay on 1 after a swipe
  - Steps: open /#gameplay-detail at 360 px, swipe left twice
  - Expected: dot 3 active, "Image 3 of 5" announced
  - Actual: dot 1 active
  - Screenshot: doc/qa/img/p3-slider-dots.png
```

## P0 — Scaffold and tooling

**Read first:** `AGENTS.md`; `ARCHITECTURE.md` sections 2, 4 and 10.

**Tasks**

1. This folder's name, "Landing Page", breaks npm's package-name rules, so `create-next-app .` refuses it. Scaffold into a temporary subfolder instead: `npx create-next-app@latest scaffold-tmp` with TypeScript, ESLint, Tailwind CSS, App Router, the `src/` directory, import alias `@/*`, npm, no dependency install and no git initialisation (this folder is already a repo). Check `npx create-next-app@latest --help` for the exact flags.
2. Move the generated files into the repo root. Keep the existing `AGENTS.md`, `CLAUDE.md`, `README.md` and `doc/`; discard the generated `AGENTS.md`, `CLAUDE.md` and `README.md` (ours already include the Next.js docs rule). Delete `scaffold-tmp`, the starter page content and the starter SVGs in `public/`. Set `"name": "promuse-landing"` and `"engines": { "node": ">=20.9" }` in `package.json`, then run `npm install`.
3. Install `gsap @gsap/react lenis next-intl @supabase/supabase-js @supabase/ssr zod`, and as dev dependencies `vitest @playwright/test prettier prettier-plugin-tailwindcss`. Run `npx playwright install chromium`.
4. Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `e2e` (`playwright test`), `format`, `check:content` (a stub until P1).
5. Turn on `noUncheckedIndexedAccess` in `tsconfig.json`.
6. Create the folders from `ARCHITECTURE.md` section 4 with minimal placeholder files, `.env.example` (section 10) and `src/lib/env.ts`.
7. Asset audit: compare `public/images/` with `SPEC.md` section 11 and list what is missing, the wrong size or the wrong format. Report only; change nothing.

**Done when**

- [ ] `npm run dev` shows a placeholder page at http://localhost:3000.
- [ ] Lint, typecheck, test and build pass.
- [ ] `AGENTS.md`, `CLAUDE.md`, `README.md` and `doc/` are unchanged, and `package.json` is named `promuse-landing`.
- [ ] The asset audit is in the report.

## P1 — Languages, page shell, tokens, first deploy

**Read first:** `SPEC.md` sections 2, 3, 9 and 11; `ARCHITECTURE.md` sections 4, 6 and 8.

**Tasks**

1. next-intl: `src/i18n/routing.ts` (`vi` default, `en`, `localePrefix: 'as-needed'`), `request.ts` and `navigation.ts`; `src/proxy.ts` with next-intl only (the Supabase step comes in P6); `src/app/[locale]/layout.tsx` with `<html lang>`, `generateStaticParams` and `setRequestLocale`.
2. `messages/vi.json` and `messages/en.json` with every key from `SPEC.md` sections 7 and 8, using `[TODO]` where copy is missing. Make `check:content` real.
3. Look at the key visual and the logo, then propose a palette (background, surface, text, muted text, one or two accents) with AA contrast ratios, and a display font that supports Vietnamese. Wait for approval, then add the tokens to `@theme` and load the fonts with `next/font`.
4. Page shell: skip link; Header (fixed, transparent to solid, active section, full-screen mobile menu, no animation yet); all nine blocks with their anchors and placeholder content; Footer (spec table, share links, back to top); LanguageSwitch that keeps the hash.
5. Placeholders with the right aspect ratio and a label for every missing image.
6. `.github/workflows/ci.yml` as in `ARCHITECTURE.md` section 13 (the Playwright step is added in P5).
7. Walk me through creating the Vercel project from this GitHub repo: framework preset, environment variables (`NEXT_PUBLIC_BACKEND_MODE=mock` for now), production branch `master`.

**Done when**

- [ ] `/` (Vietnamese) and `/en` render the full shell, and the language switch keeps the current section.
- [ ] Nav links scroll to their sections, and the fixed header never covers a heading.
- [ ] Components contain no hard-coded user-facing strings, and `npm run check:content` runs.
- [ ] CI is green on GitHub and the Vercel production URL works.

**QA focus:** layout at 360, 768 and 1440 px; mobile menu; language switch; keyboard tab order; contrast.

## P2 — Motion system, intro, hero, trailer

**Read first:** `SPEC.md` section 4, section 5 (Intro, Hero), section 6 (Modal, Lightbox); the motion rules in `AGENTS.md`.

**Tasks**

1. `src/lib/motion/gsap.ts` registers ScrollTrigger, SplitText and `useGSAP`. Add `MotionProvider` (system setting plus the visitor's toggle in `promuse:motion`), `MotionToggle` in the header, `SmoothScroll` (Lenis driven by the GSAP ticker, off when motion is off) and `BeatClock` (`--beat`, `onBeat`, pauses when the tab is hidden).
2. The motion primitives from `SPEC.md` section 4: SlashWipe, SplitHeadline, ScrollType, Marquee, Parallax, Reveal, and a first NoteLanes for the hero background.
3. A development-only page, `/dev/motion`, that shows each primitive with motion on and off (404 in production). Show it to me before step 4.
4. Intro and Hero as in `SPEC.md` section 5.
5. Modal (native `<dialog>`, SlashWipe, hash and Back button) and Lightbox (youtube-nocookie iframe added on open, removed on close).

**Done when**

- [ ] The intro plays once per session, skips by button, key or tap, and never plays with motion off.
- [ ] With motion off, the page scrolls natively and nothing parallaxes, scrubs or slides.
- [ ] Closing the lightbox stops the video, and the trailer button is hidden when `trailerId` is empty.
- [ ] A Chrome Performance recording of the first ten seconds shows no long tasks from animation code, and the hero scrolls smoothly on a real mid-range Android phone.

**QA focus:** every way to skip the intro; the effects toggle; hero at three widths; lightbox with the keyboard; a performance trace screenshot.

## P3 — Introduction, Features, Gameplay

**Read first:** `SPEC.md` section 5 (Introduction, Features, Gameplay), section 6 (Tabs, Slider), section 8.

**Tasks**

1. Tabs and Slider components as in `SPEC.md` section 6.
2. `src/content/features.ts` and `src/content/gameplay.ts` with the drafts from `SPEC.md` section 8, in both languages.
3. Introduction: image, `[TODO]` paragraphs, big-type bands with ScrollType and Marquee.
4. Features: cards that reveal on the beat; a modal with four tabs; deep link `#features-detail`.
5. Gameplay: the scroll-driven NoteLanes scene; a modal with four tabs, each with a Slider; deep link `#gameplay-detail`.

**Done when**

- [ ] Both modals work with the keyboard alone: open, switch tabs, move slides, close, and focus returns.
- [ ] `/#features-detail` and `/en#gameplay-detail` open the right modal, and Back closes it.
- [ ] Sliders swipe on a phone; the dots and the "Image n of m" announcement stay in sync.
- [ ] All copy comes from content files, in both languages.

**QA focus:** a keyboard-only pass; swiping at 360 px; deep links; motion off.

## P4 — Characters

**Read first:** `SPEC.md` section 5 (Characters) and section 11; the UI and content rules in `AGENTS.md`.

**Tasks**

1. `src/content/characters.ts` with the four characters, the stats from `SPEC.md` section 5 and `[TODO]` text.
2. Cards grouped by rarity, mono to colour on hover and focus.
3. Profile modal: Change visual (SlashWipe between the idle and battle sprites), stats, passive, a gallery slider hidden when empty, previous and next plus ← and →, deep link `#char-<id>`.
4. Pixel-perfect sprites: `unoptimized`, `image-rendering: pixelated`, whole-number scaling at every breakpoint.

**Done when**

- [ ] Sprites stay crisp at 360, 768 and 1440 px.
- [ ] Change visual, previous and next work with the mouse and the keyboard.
- [ ] `/en#char-a` opens char-a's profile in English.

**QA focus:** sprite sharpness (zoomed screenshots); keyboard navigation inside the modal; motion off.

## P5 — Pre-registration UI (mock)

**Read first:** `SPEC.md` section 3, section 5 (Reward) and section 7; `ARCHITECTURE.md` section 5 (Browser reward gateway).

**Tasks**

1. The `RewardGateway` interface and `MockRewardGateway` with every `?mock=` scenario.
2. The reward widget as a state machine over the gateway (`SPEC.md` section 7), the banner, the popup rules and the sign-out link.
3. The return flow: `intent=prereg` triggers one registration, scrolls to `#reward`, then is removed from the URL.
4. Playwright tests for every scenario and for the popup rules; add the Playwright step to CI.

**Done when**

- [ ] Every `?mock=` scenario shows the state `SPEC.md` section 7 describes, in both languages.
- [ ] The popup appears once, never after registration, and its button starts sign-in.
- [ ] Playwright passes locally and in CI.

**QA focus:** every scenario at 360 and 1440 px; screen-reader labels on the button states; popup rules across reloads.

## P6 — Supabase and API v1

**Read first:** `ARCHITECTURE.md` sections 5, 7, 8, 9, 10 and 13; `API.md`.

**Manual setup.** Walk me through it one step at a time and wait for my confirmation after each:

1. Supabase: create the project in the Singapore region; copy the project URL and the publishable key.
2. Google Cloud: configure the OAuth consent screen (app name Promuse; scopes `openid`, email and profile) and create an OAuth client of type "Web application". Add the callback URL shown on Supabase's Google provider page as an authorized redirect URI. Publish the consent screen so any Google account can sign in.
3. Supabase: enable the Google provider with the client ID and secret. Under URL configuration, set the Site URL and add redirect URLs for `http://localhost:3000/**`, the production URL and a wildcard for Vercel previews.
4. Environment variables in `.env.local` and in Vercel, with `NEXT_PUBLIC_BACKEND_MODE=supabase`.

**Tasks**

5. Migrations `0001_init.sql` and `0002_prereg_campaign.sql` as in `ARCHITECTURE.md` section 9, applied to the project.
6. The clients in `src/lib/supabase/`, the session-refresh step composed into `src/proxy.ts`, and `src/app/auth/callback/route.ts`.
7. `requireUser`, the error envelope, zod schemas, the Supabase and in-memory services, and the four `/api/v1` routes from `API.md`.
8. `SupabaseRewardGateway`, chosen by `NEXT_PUBLIC_BACKEND_MODE`.
9. `/dev/token` (404 in production) to copy the current access token for curl tests.
10. Unit tests for the services and the route handlers.

**Done when**

- [ ] A new Google account ends in `registered`, and the database holds one registration and one mail for it.
- [ ] Signing in again with that account shows `alreadyRegistered`, still with one registration and one mail.
- [ ] A second account gets its own rows.
- [ ] With an account's token, `GET /api/v1/mail` returns the reward mail; the first claim returns 200 and the second returns 409 `already_claimed` with `claimedAt`.
- [ ] Writing to the tables directly from the browser client is rejected by RLS.
- [ ] No Supabase secret key exists in the repo, in `.env.local` or in Vercel.

**QA focus:** the full sign-in loop on the Vercel preview with two accounts; cancel at the Google screen; sign out and switch accounts.

## P7 — Polish and launch

**Read first:** `SPEC.md` sections 9 and 10; `ARCHITECTURE.md` sections 13 and 14.

**Tasks**

1. Per-locale metadata, `hreflang`, Open Graph and Twitter images, `sitemap.ts`, `robots.ts`, and JSON-LD `VideoGame`.
2. An `images` config with few variants; lazy-load heavy client code; check the bundle size.
3. Lighthouse on mobile before and after; fix until the `SPEC.md` section 10 targets hold.
4. Accessibility pass: keyboard, labels, contrast, motion off. Ask before adding an audit dependency.
5. Test Chrome on Android and Safari on iOS, on real devices if possible.
6. `README.md` for the portfolio: what it is, the stack, an architecture diagram, key decisions, how to run it, screenshots.
7. Run `npm run check:content` and remove every `[TODO]` that should not ship.

**Done when**

- [ ] The `SPEC.md` section 10 targets are met, with the scores recorded in `doc/qa/P7.md`.
- [ ] Sharing the production URL in Messenger and X shows the right image and title.
- [ ] No `[TODO]` is visible except the ones the owner keeps on purpose.
- [ ] The README is ready for the portfolio.

**QA focus:** a final full pass of every earlier phase's "Done when" list on the production URL.

## S1 — Beat demo (optional, after P7)

A small playable demo in the Gameplay section: two lanes, keys F and J (or tapping the left and right halves of the screen), a 30-second loop at the site BPM, judged with the GDD's Tap Note windows (Perfect ≤ 25 ms, Great ≤ 50 ms, Hit ≤ 100 ms, otherwise Miss), with combo and HP. Timing uses `performance.now()`; no audio is required. Hidden when motion is off.

**Done when**

- [ ] Hits register within the windows above on desktop and on a phone.
- [ ] The demo never blocks scrolling, and it stops when it leaves the viewport.
