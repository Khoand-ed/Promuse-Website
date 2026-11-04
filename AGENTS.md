<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# Promuse landing page — rules for coding agents

Shared by every agent in this repo. Claude Code loads this file through `CLAUDE.md`; Antigravity loads it directly. Keep it short: Antigravity truncates rule files over 24 KB.

## Project

Promuse is a 2D mobile rhythm hack-and-slash game with gacha (Unity, Android and iOS, in development). This repo is its landing page, built as a portfolio and graduation-project piece. It borrows the page structure and interaction patterns of the Persona 3 Reload website, never its assets or branding. Visitors sign in with Google to pre-register; the reward appears later in the in-game Mail of the same Google account.

## Source of truth

Read the relevant part before changing anything:

- `doc/SPEC.md`: what to build (sections, motion, copy, UX states, assets).
- `doc/ARCHITECTURE.md`: how it is built (layers, data model, auth, environment, CI).
- `doc/API.md`: the HTTP contract the Unity game will use. Treat it as public.
- `doc/PHASES.md`: build order and acceptance criteria.

If code and docs disagree, stop and ask. When a decision changes, update the doc in the same change.

## Stack

- Next.js 16 (App Router, `src/` directory, Turbopack), React 19, TypeScript in strict mode.
- Tailwind CSS v4; design tokens live in `src/app/globals.css` under `@theme`.
- GSAP with `@gsap/react` (`useGSAP`), ScrollTrigger and SplitText; Lenis for smooth scrolling.
- next-intl: `vi` is the default locale with no URL prefix; `en` lives under `/en`.
- Supabase: Auth (Google) and Postgres with row-level security, through `@supabase/supabase-js` and `@supabase/ssr`.
- zod validates every API input and every environment variable.
- Vitest for unit tests, Playwright for end-to-end tests (mock mode).
- Hosting on Vercel (Hobby plan). Package manager: npm.

Ask before adding any dependency that is not on this list.

## Commands

- `npm run dev`: local server at http://localhost:3000
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run e2e`, `npm run build`
- `npm run check:content`: lists `[TODO]` copy and keys missing from a locale

A change is finished only when lint, typecheck, test and build all pass.

## Layout

```text
src/app/[locale]/          the page, statically rendered per locale
src/app/auth/callback/     OAuth code exchange (not localized)
src/app/api/v1/            route handlers: parse, authenticate, call a service, map errors
src/app/dev/               development-only helpers; return 404 in production
src/components/sections/   one component per page section
src/components/ui/         Button, Modal, Tabs, Slider, Lightbox, LanguageSwitch, MotionToggle
src/components/motion/     MotionProvider, SmoothScroll, BeatClock, Reveal, SplitHeadline,
                           ScrollType, Marquee, SlashWipe, Parallax, NoteLanes
src/content/               typed, localized content: site config, characters, features, gameplay
src/i18n/                  next-intl routing, request config, navigation helpers
src/lib/                   env, Supabase clients, reward gateway (browser side), motion helpers
src/server/                services (interfaces and implementations), HTTP helpers, zod schemas
src/proxy.ts               next-intl routing plus Supabase session refresh
supabase/migrations/       SQL migrations, the only way to change the database
messages/{vi,en}.json      UI strings
doc/                       specs; QA reports go in doc/qa/
```

## Architecture rules

- Route handler → service interface → implementation. UI components never import Supabase; the browser-side reward gateway in `src/lib/reward/` owns sign-in, sign-out and API calls.
- One endpoint per responsibility, versioned under `/api/v1`. Never break `doc/API.md`: add fields, never rename or remove them.
- Writes happen only through Postgres functions (`security definer`, empty `search_path`). Every table has RLS on, with "read own rows" policies only.
- The app never uses the Supabase secret (service-role) key. It needs only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- On the server, trust `supabase.auth.getClaims()` (or `getUser()`), never `getSession()`.
- Errors use the envelope in `doc/API.md`. Never return raw database errors.

## UI and content rules

- Server Components by default. Use `"use client"` only for interaction, motion and the reward widget.
- No hard-coded user-facing text. UI strings go in `messages/*.json`; structured content goes in `src/content/*` with `{ vi, en }` fields.
- Placeholder copy starts with `[TODO]` in both locales.
- Images go through `next/image` with `sizes`. Pixel-art sprites use `unoptimized` and `image-rendering: pixelated` at whole-number scales.
- Fonts come from `next/font` with the `vietnamese` subset; check that "Đặng Ữ Ổ Ặ ợ ừ" renders.
- Mobile first. Check every change at 360, 768 and 1440 px wide.

## Motion rules

- GSAP code lives only in client components and uses `useGSAP` for automatic cleanup. Register plugins once, in `src/lib/motion/gsap.ts`.
- Animate only `transform`, `opacity`, `clip-path` and `filter`. Never animate layout properties.
- Every effect obeys `MotionProvider`. When the system asks for reduced motion, or the visitor turns effects off, there is no smooth scroll, intro, parallax, scrubbed or pinned scene, or moving marquee.
- Beat-synced effects follow the shared `BeatClock` (120 BPM by default). Never start separate timers for beats.
- Call `ScrollTrigger.refresh()` after fonts and above-the-fold images load. Use at most one pinned scene below 768 px.

## Accessibility

Semantic landmarks, a skip link, visible focus, native `<dialog>` for modals (Esc closes, focus returns to the opener), the ARIA tabs pattern, labelled controls, WCAG AA contrast, and touch targets of at least 44 × 44 px.

## Security and IP

- Never commit `.env*` files other than `.env.example`. Never log secrets, tokens or email addresses.
- OAuth redirects accept only relative `next` paths.
- Use only Promuse assets. No images, logos, text, fonts or audio from Persona 3 Reload or any other product.

## Working agreement

- One phase at a time. Meet its acceptance criteria before starting the next.
- Small, focused commits with Conventional Commit messages (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
- Ask before deleting files, changing the data model or changing the API contract.
- QA sessions write their findings to `doc/qa/<phase>.md` as a checklist and do not edit source code.
