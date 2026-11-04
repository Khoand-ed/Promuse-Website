<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Promuse landing page — rules for coding agents

Shared by every agent in this repo. Claude Code loads this file through `CLAUDE.md`; Antigravity loads it directly. Keep it short: Antigravity truncates rule files over 24 KB.

## Project

Promuse is a 2D mobile rhythm hack-and-slash game with gacha (Unity, Android first, in development). This repo is its landing page, built as a portfolio and graduation-project piece. Its look follows the Persona 3 Reload website (https://p3re.jp/en/) closely — layout, colours, buttons, type and motion — rebuilt with our own code, and never uses that site's assets, code, text, logos or branding (`doc/DESIGN.md`, section 4).

Visitors sign in with Google to pre-register, and the website records the registration in its own Supabase project. Delivering the reward through the game's Mailbox is future work for the game's .NET backend (`doc/ARCHITECTURE.md`, section 17); this repo does not build it.

## Source of truth

Read the relevant part before changing anything:

- `doc/SPEC.md`: what to build (sections, motion, content rules, UX states, assets).
- `doc/ARCHITECTURE.md`: how it is built (layers, content system, data model, auth, environment, CI).
- `doc/API.md`: the website's HTTP contract. Treat it as public.
- `doc/PHASES.md`: build order and acceptance criteria.
- `doc/GAME_FACTS.md`: the only facts about the game the site may state, each with its source in the game repo.
- `doc/DESIGN.md`: the reference study and the Promuse visual identity.

If code and docs disagree, stop and ask. When a decision changes, update the doc in the same change.

## Stack

- Next.js 16 (App Router, `src/` directory, Turbopack), React 19, TypeScript in strict mode, Node.js 24 LTS.
- Tailwind CSS v4; design tokens live in `src/app/globals.css` under `@theme`.
- GSAP with `@gsap/react` (`useGSAP`), ScrollTrigger and SplitText; Lenis for smooth scrolling.
- next-intl: `vi` is the default locale with no URL prefix; `en` lives under `/en`.
- Supabase: Auth (Google) and Postgres with row-level security, through `@supabase/supabase-js` and `@supabase/ssr`.
- zod validates every API input, every environment variable and every content file.
- Vitest for unit tests, Playwright for end-to-end tests (mock mode).
- Hosting on Vercel (Hobby plan). Package manager: npm.

Ask before adding any dependency that is not on this list.

## Commands

- `npm run dev`: local server at http://localhost:3000
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run e2e`, `npm run build`
- `npm run check:content`: validates `content/`, compares the locales, lists every `[TODO]`, `[REVIEW]` and missing image, and rewrites `CONTENT_TODO.md`. It fails on invalid content, never on a TODO.

A change is finished only when lint, typecheck, test, build and `check:content` all pass.

## Layout

```text
content/                   everything the owner edits: text/{vi,en}.json, data/*.json, generated schemas/
CONTENT_TODO.md            generated: every TODO with its file, key, what to write and how
src/app/[locale]/          the page and the privacy page, statically rendered per locale
src/app/auth/callback/     OAuth code exchange (not localized)
src/app/api/v1/            route handlers: parse, authenticate, call a service, map errors
src/app/dev/               development-only helpers; return 404 in production
src/components/sections/   one component per page section
src/components/ui/         Modal, Tabs, Slider, Lightbox, LanguageSwitch, MobileMenu, MotionToggle,
                           MusicButton, BackToTop, SkipLink, Wordmark, ImageSlot, icons
src/components/motion/     MotionProvider, MusicProvider, SmoothScroll, BeatClock, Opening, CharacterScene, and the
                           reveals in reveal.tsx (RiseLetters, RiseLines, CoverReveal, Reveal, ...)
src/content/               zod schemas and loaders for content/ (no copy lives here)
src/i18n/                  next-intl routing, request config, navigation helpers
src/lib/                   env, Supabase clients, reward gateway (browser side), motion helpers
src/server/                services (interfaces and implementations), HTTP helpers, zod schemas
src/proxy.ts               next-intl routing plus Supabase session refresh
scripts/                   content check and schema generation
supabase/migrations/       SQL migrations, the only way to change the database
doc/                       specs; QA reports go in doc/qa/
```

## Architecture rules

- Route handler → service interface → implementation. UI components never import Supabase; the browser-side reward gateway in `src/lib/reward/` owns sign-in, sign-out and API calls.
- One endpoint per responsibility, versioned under `/api/v1`. Never break `doc/API.md`: add fields, never rename or remove them.
- Writes happen only through Postgres functions (`security definer`, empty `search_path`). Every table has RLS on, with "read own rows" policies only.
- The app never uses the Supabase secret (service-role) key. It needs only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- On the server, trust `supabase.auth.getClaims()` (or `getUser()`), never `getSession()`.
- Errors use the envelope in `doc/API.md`. Never return raw database errors.
- No coupling with the game backend: the website never calls it and never reads its database. The only planned link is the integration in `doc/ARCHITECTURE.md`, section 17, built when the owner asks.

## Content rules

- No hard-coded user-facing text. Every string lives in `content/text/{vi,en}.json`; links, numbers, colours and image slots live in `content/data/*.json`. Components get validated content from the loaders in `src/content/`, never by importing JSON.
- Never invent copy, names, amounts or game facts. Where official information is missing, write a placeholder that explains itself — `[TODO] <what to write, with limits>` — in both locales.
- Facts about the game come only from `doc/GAME_FACTS.md`. Drafts and translations of official game text carry `[REVIEW]` until the owner confirms them.
- Never pick a name for the owner (currency, gacha, systems). Use a placeholder.
- Every image comes from a slot declared in `content/data`; a missing file renders a labelled placeholder with the right aspect ratio, so replacing an image never needs a code change.
- After changing content or its schemas, run `npm run check:content` and keep the regenerated `CONTENT_TODO.md`.

## UI rules

- Server Components by default. Use `"use client"` only for interaction, motion and the reward widget.
- Images go through `next/image` with `sizes`. Pixel-art sprites use `unoptimized` and `image-rendering: pixelated` at whole-number scales.
- Fonts come from `next/font` with the `vietnamese` subset; check that "Đặng Ữ Ổ Ặ ợ ừ" renders.
- Mobile first. Check every change at 360, 768 and 1440 px wide.

## Motion rules

- GSAP code lives only in client components and uses `useGSAP` for automatic cleanup. Register plugins once, in `src/lib/motion/gsap.ts`.
- Animate only `transform`, `opacity`, `clip-path` and `filter`. Never animate layout properties.
- Every effect obeys `MotionProvider`. When the system asks for reduced motion, or the visitor turns effects off, there is no smooth scroll, opening, reveal, pinned scene or beat pulse: everything is shown at once.
- Motion follows p3re.jp's timings (`doc/SPEC.md`, section 4). Above-the-fold motion waits for the opening (`afterOpening` in `src/lib/motion/opening.ts`).
- Beat-synced effects follow the shared `BeatClock`, which reads the background music's position; with the music off nothing pulses. Never start separate timers for beats.
- Call `ScrollTrigger.refresh()` after fonts and above-the-fold images load. Use at most one pinned scene below 768 px.

## Accessibility

Semantic landmarks, a skip link, visible focus, native `<dialog>` for modals (Esc closes, focus returns to the opener), the ARIA tabs pattern, labelled controls, WCAG AA contrast, and touch targets of at least 44 × 44 px.

## Security and IP

- Never commit `.env*` files other than `.env.example`. Never log secrets, tokens or email addresses.
- OAuth redirects accept only relative `next` paths.
- Use only Promuse assets. No images, logos, text, fonts, code or audio from Persona 3 Reload, Arknights or any other product.
- The game's current build borrows Arknights art, names and terms (`doc/GAME_FACTS.md`, section 6). None of them may appear here, screenshots of the build included. The character name AMIYA is kept during development by the owner's decision and must be settled before launch (`doc/PHASES.md`, P7).

## Working agreement

- One phase at a time, each on its own branch (`phase/p<n>-<topic>`) merged into `main` through a pull request. Meet a phase's acceptance criteria before starting the next.
- Commit, push or open a pull request only when the owner asks.
- Small, focused commits with Conventional Commit messages (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
- No AI attribution anywhere in git: no `Co-Authored-By` line naming an AI and no "Generated with/by …" line, in commits or pull requests. Never change the git author; commit with the identity configured in the repo.
- Ask before deleting files, changing the data model or changing the API contract.
- QA sessions write their findings to `doc/qa/<phase>.md` as a checklist and do not edit source code.
