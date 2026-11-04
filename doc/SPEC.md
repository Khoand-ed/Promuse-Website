# Promuse landing page — product and UX spec

What the page shows, how it moves and what each state looks like. How it is built is in `ARCHITECTURE.md`, the HTTP contract is in `API.md`, the build order is in `PHASES.md`, facts about the game are in `GAME_FACTS.md`, and the visual identity is in `DESIGN.md`.

## 1. Goals

- Present Promuse, a 2D mobile rhythm hack-and-slash game with gacha, with a look and feel that follows the Persona 3 Reload site closely — layout, colours, buttons, type and motion — rebuilt with Promuse's own code, art and words (owner's decision, 2026-11-05; `DESIGN.md`, section 4).
- Let visitors pre-register with Google. The site records the registration; the reward reaches the player through the game's Mailbox once the game supports Google sign-in. That delivery is future work outside this repo.
- Describe the game as it is today (`GAME_FACTS.md`). Android comes first; the site makes no claim about iOS.
- Let the owner change every text, link and image without touching code (section 12).
- Show production-grade engineering for a portfolio: validated content, a service layer, a versioned API, tests and CI.

Not in v1: news or blog pages, a CMS, an account page, a web mailbox, in-game reward delivery, sending email, background music, Sign in with Apple, iOS store links, and the Unity client.

## 2. Page map

One page per locale — `/` (Vietnamese) and `/en` (English) — plus a privacy page per locale (`/privacy`, `/en/privacy`; section 13).

| # | Block | Anchor | Contents | Pattern taken from the P3R site |
|---|---|---|---|---|
| 0 | Intro | — | Opening before the page, Skip button (P4) | Opening before the page |
| 1 | Header | — | Links over the hero and a language menu; below 1024 px a corner MENU button and a full-screen menu | Global nav, language menu, mobile MENU triangle |
| 2 | Hero | `#top` | Key visual, logo, status line, scroll cue; a trailer strip below it when `trailerId` is set (P4) | Key visual, "NOW ON SALE" line, SCROLL cue, PV strip |
| 3 | Reward | `#reward` | Big title, reward line, reward art, sign-in button, privacy line; first-visit popup (P2) | "BUY NOW!" block and the Expansion Pass overlay |
| 4 | Introduction | `#story` | Title and short paragraphs beside an image | Introduction |
| 5 | Features | `#features` | Title, summary, cover image; "See details" opens a 4-tab modal (P5) | Features block and modal |
| 6 | Gameplay | `#gameplay` | Title, summary, cover image; "Gameplay details" opens a 4-tab modal with sliders (P5) | Game System block and modal |
| — | Slogans | — | Short slogan lines under a hairline, then "PROMUSE" in giant outlined letters | Slogan lines and the giant outline word |
| 7 | Characters | `#characters` | Big title, three lines, a portrait per character in its colour; profile modal (P6) | S.E.E.S. block, pinned sideways scroll, per-character colour, profile modal |
| 8 | Footer | — | Logo, spec table, links, share, store line, privacy link, copyright | SPEC / LINKS / SHARE footer |

Backgrounds follow p3re.jp: the Reward block is white; Introduction, Features, Gameplay and the slogans share one pale blue run; Characters is mid blue, or the colour of the character in view once P4 pins the row; the footer is white.

Deep links open the matching modal: `#features-detail`, `#gameplay-detail`, `#char-<slug>` (for example `/en#char-nova`). Closing a modal restores the section's hash.

## 3. Global UI

**Header.** As on p3re.jp, and not fixed (owner's decision, 2026-11-05). From 1024 px: a row of links over the top right of the hero — Introduction, Features, Gameplay, Characters, Get reward — then a hairline and the language menu; the row scrolls away with the hero. Below 1024 px: a blue triangle in the top right corner, with three lines and "MENU", stays on screen and opens a full-screen menu (native `<dialog>` on pale blue glass) with the same links and both languages. Esc closes the menu and focus returns to the button; a link closes it and scrolls to its section. The effects toggle joins the header row and the menu in P4.

**Language switch.** "VI ▾" (the current language) opens a list of both language names; the mobile menu lists both. Switching keeps the section in view: the other language opens at the anchor of the section at the top of the screen. The choice is stored in next-intl's `NEXT_LOCALE` cookie, so the proxy does not send the visitor back to the browser's language.

**Effects toggle.** "Effects: on / off" with `aria-pressed`. The default follows the system's reduced-motion setting; the visitor's choice is stored in `localStorage` as `promuse:motion` (`on` or `off`).

**Also.** A skip link to the main content; a round back-to-top button at the bottom right after one screen of scrolling, since the header does not follow the page; and a scroll margin on the sections so the corner button never covers a title.

## 4. Motion system

**Decision (2026-11-05).** Motion follows p3re.jp. P4 opens with a study of p3re.jp's motion and rewrites this section with the owner. Until then the motifs and the per-section table below are the earlier proposal; the principles "calm reading" and "opt-out respected", the motion-off rules and the performance rules stay.

Principles (the reference study behind them is in `DESIGN.md`):

- **Rhythm first.** Decorative motion lands on the beat of one shared clock: 120 BPM (500 ms per beat), set in `content/data/site.json` (`bpm`).
- **Hack-and-slash identity.** Transitions use diagonal "slash" wipes.
- **Bold type.** Oversized display words move with the scroll.
- **Calm reading.** Body text never moves once it has appeared.
- **Opt-out respected.** With motion off, only short fades remain.

### BeatClock

One clock on the GSAP ticker. It exposes `onBeat(callback)`, the current beat index, and a CSS variable `--beat` on `<html>` that jumps to 1 on each beat and decays to 0 within about 200 ms. It pauses when the tab is hidden or motion is off.

### Motifs

| Motif | Component | What it does | Used in |
|---|---|---|---|
| Slash wipe | `SlashWipe` | A diagonal panel sweeps across using `clip-path` | Intro exit, modals, mobile menu, section entrances, visual swap |
| Two-lane notes | `NoteLanes` | Notes travel along a left and a right lane to a judgment line and burst on the beat. Decoration only: no input, no score | Hero background (subtle), Gameplay (scroll-driven) |
| Beat pulse | CSS reading `--beat` | Scale 1 → 1.04 and a glow on each beat | CTAs, scroll cue, logo |
| Big type | `ScrollType` | Outlined display words slide sideways with the scroll (scrubbed) | Section headings, Introduction bands |
| Split headline | `SplitHeadline` | Characters or lines reveal with a stagger (SplitText) | Section titles, intro lines |
| Marquee | `Marquee` | Endless band; speed and direction follow scroll velocity | Introduction bands, footer |
| Parallax | `Parallax` | Layers shift with the pointer (desktop) and the scroll | Hero, character modal |
| Mono to colour | CSS | Greyscale and dim at rest, full colour on hover or focus | Character and feature cards |
| Reveal | `Reveal` | Fade and rise once on entering the viewport | Everything else |

### By section

| Block | On enter | While scrolling | On interaction |
|---|---|---|---|
| Intro | Lines split in on beats 1–3 | — | Skip by button, key or tap; exits with a slash wipe into the hero |
| Hero | Logo assembles on the beat; layers rise | Layers parallax; notes drift behind | Pointer parallax on desktop; CTA beat pulse |
| Reward | Banner slashes in | — | Popup slashes in; the button changes state smoothly |
| Introduction | Split headline | Big-type bands scrub; marquee follows scroll speed | — |
| Features | Cards stagger in on the beat | Heading in big type | Modal opens with a slash wipe; tabs cross-fade in 200 ms |
| Gameplay | Split headline | Notes advance with the scroll and flash at the judgment line | Slider drag and swipe |
| Characters | Cards rise by rarity group | — | Mono to colour, the character's theme colour and an idle bob on hover; slash swap between idle and battle visuals |
| Footer | Fade | Marquee | Back to top |

### Motion off

When the system asks for reduced motion or the toggle is off: no intro, native scrolling instead of Lenis, no parallax, big type and marquees stand still, the notes scene shows one static frame, reveals become 150 ms fades, and modals fade instead of wiping.

### Performance rules

Animate `transform`, `opacity`, `clip-path` and `filter` only. Set `will-change` only while animating. Pause animations that are off screen. Use at most one pinned scene below 768 px. Target a steady 60 fps on desktop and smooth scrolling on a real mid-range Android phone.

## 5. Sections

### 0. Intro

- Full-screen dark overlay. Three lines appear on beats 1, 2 and 3, then a slash wipe reveals the hero. Three seconds at most.
- A Skip button is always visible; any key, click or tap also skips.
- Plays once per browser session (`sessionStorage` key `promuse:intro-seen`), never with motion off.
- The page renders underneath from the start; the hero image still loads with priority.
- Copy: `intro.line1` to `intro.line3`, `[TODO]`.

### 2. Hero (`#top`)

- Height `100svh`. Art direction with `getImageProps()` and a `<picture>`: a landscape crop for desktop, a portrait crop for mobile. A poster image shows at once; nothing waits for a video.
- If layered art exists (background, characters, effects), the layers feed `Parallax`.
- Layout as on p3re.jp: the status line in display type at the top left, with the name above it; the logo in white at the middle right (alt text "Promuse"; a text wordmark until the logo exists); "SCROLL" over a short line at the bottom centre. On phones the logo sits at the top left, above the status line.
- No buttons in the hero (owner's decision, 2026-11-05): the reward block follows right below, and the header links to it.
- Until the key visual exists, a white-to-blue gradient in p3re.jp's hero colours stands in.
- "Watch trailer" sits in a strip below the hero (P4) and is hidden when `trailerId` is empty.

### 3. Reward (`#reward`)

- Laid out like p3re.jp's "BUY NOW!" block: white, centred, the title in large display type, then the reward line, the art, the large pill button and the privacy line.
- Banner: reward art, title, one-line reward description (`[TODO]`: the amount and the currency name are not decided), the sign-in button, a privacy line that links to the privacy page and, when signed in, "Not you? Sign out".
- Popup: appears 1.5 s after the intro ends (or after load when the intro does not play), only on the first visit (`localStorage` key `promuse:reward-popup-dismissed`), never after registration and never while registration is not open (`notOpen`). Its button starts the same sign-in.
- After returning from Google, the page scrolls to `#reward` and registration runs automatically, once.
- States are in section 7.

### 4. Introduction (`#story`)

- From 768 px the title and two or three short paragraphs sit beside a 16:9 image that bleeds to the right edge of the screen; on phones the title (centred), the image and the text stack. The text is about the world and its characters. Rhythm is how the game plays, not what the world is about, so the text does not talk about music.
- After Gameplay: a hairline, two or three short slogan lines (the count is `bands` in `content/data/story.json`), then "PROMUSE" in giant outlined letters across the screen.
- Copy: `story.title`, `story.p1` to `story.p3`, `story.band1` to `story.band3`, all `[TODO]`.

### 5. Features (`#features`)

- On the page, mirrored (image on the left): title, a two-sentence summary, a cover image, and "See details" (P5).
- Modal: four tabs. Each tab shows "FEATURE #n", a title, one or two sentences and two images.
- Topics are proposed in section 8. Every title and sentence is `[TODO]` until the owner writes it.

### 6. Gameplay (`#gameplay`)

- On the page, laid out like Introduction: title, a two-sentence summary, a cover image, and "Gameplay details" (P5).
- Modal: four tabs, each with a slider of 3–7 images (16:9), a title and a paragraph. The gacha tab shows the rate line, rendered from data (`GAME_FACTS.md`, section 4).
- Topics are proposed in section 8.

### 7. Characters (`#characters`)

- One row that scrolls sideways, as on p3re.jp: the big title and three short lines (`characters.line1` to `line3`), then a 3:4 portrait per character in data order (5★, 4★, 4★, 3★) with its name and stars. Portraits are grey and tinted with the character's colour until hovered or focused. In P4 the row pins and moves with the scroll while the background takes each character's colour; with motion off it stays a plain sideways scroller.
- Each character has a theme colour (content data, `[TODO]` until chosen), used on its portrait, as the section background while it is in view, and in the profile modal, as p3re.jp does. Until it is chosen, the portraits take p3re.jp's pastels in order (`DESIGN.md`, section 4).
- Text on these backgrounds is navy, not white as on p3re.jp, to keep WCAG AA contrast (owner's decision, 2026-11-05).
- Profile modal: the idle visual on the left with "Change visual", which swaps to the battle visual with a slash wipe. On the right: name, rarity, tagline, profile, passive (name and description), stats, and a gallery slider (hidden when empty). Previous and next buttons, plus ← and →, move between characters.
- No voice-actor credits or per-character trailers in v1.

| id | Slug | Rarity | HP | Score bonus | Fever bonus | Passive (name in the game) |
|---|---|---|---|---|---|---|
| AMIYA | `amiya` | 5★ | 300 | ×1.2 | ×1.2 | Field Medic |
| NOVA | `nova` | 4★ | 275 | ×1.1 | ×1.1 | Overdrive |
| ECHO | `echo` | 4★ | 275 | ×1.1 | ×1.1 | Resonance |
| PULSE | `pulse` | 3★ | 250 | ×1.0 | ×1.0 | Steady Beat |

Stats and passives come from the game (`GAME_FACTS.md`, section 3). Names are kept as in the game; AMIYA is an Arknights character name and is settled before launch (P7). Taglines, profiles, theme colours and art are `[TODO]`.

### 8. Footer

- Laid out like p3re.jp's footer: the logo, the SPEC table, LINKS and SHARE in a row (stacked on phones), a hairline, the store line, then the privacy link and the copyright centred at the bottom.
- Logo and spec table: Title Promuse · Release Coming soon · Genre Rhythm hack-and-slash, gacha · Players 1 · Platform Android.
- Social links from `content/data/site.json` (hidden when empty). Share to X and Facebook through intent URLs with `#Promuse`.
- "Coming soon on Google Play" as text; no store badge until a store link exists.
- A link to the privacy page.
- Copyright: `© 2026 Promuse · [TODO copyright holder]`.

## 6. Shared components

| Component | Behaviour | Keyboard and accessibility |
|---|---|---|
| Modal | Native `<dialog>` with `showModal()`. Opens with `SlashWipe` (a fade when motion is off). Locks page scroll and stops Lenis. Opening sets the hash; the browser Back button closes it | Esc closes; focus moves inside and returns to the opener; labelled by its title |
| Tabs | Switches panels without closing the modal; remembers the last tab per modal (`sessionStorage` key `promuse:tab:<modal>`) | ARIA tabs pattern; ← → Home End |
| Slider | CSS scroll snap with previous and next buttons, dots and swipe; images load lazily | Labelled buttons; announces "Image 2 of 5" politely |
| Lightbox | Inserts a `youtube-nocookie.com` iframe only when opened and removes it on close, so playback stops | Built on Modal |
| ImageSlot | Renders the image a content slot declares, through `next/image`. When the file is missing, renders a box with the slot's aspect ratio, its name and the size it needs | Real images take their alt text from content; placeholders are hidden from assistive technology |

## 7. Pre-registration states

| State | When | Button (vi / en) | Notes |
|---|---|---|---|
| `signedOut` | No session | Đăng nhập Google để nhận quà / Sign in with Google to claim | Default |
| `redirecting` | After the click, before leaving | Đang chuyển tới Google… / Redirecting to Google… | Disabled |
| `registering` | Back from Google, request in flight | Đang ghi nhận… / Registering… | Disabled |
| `registered` | Server answered `created` | `[TODO]` in both locales; may use `{email}` | Popup never shows again. Must not promise in-game delivery the game cannot do yet: it has no Google sign-in today |
| `alreadyRegistered` | Server answered `existing` | Bạn đã đăng ký từ {date} / You pre-registered on {date} | Popup never shows again |
| `signedInNotRegistered` | Session, but no registration | Nhận quà đăng ký sớm / Claim the pre-registration reward | One click, no new sign-in |
| `cancelled` | The visitor closed the Google window | Back to `signedOut` with "Bạn đã huỷ đăng nhập." / "Sign-in was cancelled." | — |
| `error` | Any failure | Có lỗi, thử lại / Something went wrong, try again | Retry keeps the context |
| `closed` | Server answered `campaign_closed` | Đã hết thời gian đăng ký sớm / Pre-registration has ended | Disabled |
| `notOpen` | `NEXT_PUBLIC_BACKEND_MODE` is `off`: registration is not open yet | `[TODO]` in both locales | Disabled; the popup never shows. Production uses it until P3, so the live site never simulates a registration |

Privacy line under the button, linking to the privacy page: "Email chỉ dùng để gắn quà với tài khoản game." / "We only use your email to link the reward to your game account."

Copy keys live under `reward.*` in `content/text/*.json`; `{email}` comes from the session.

## 8. Copy and content status

### Rules

- UI labels and state messages have drafts (here and in section 7); the owner may rewrite them.
- Numbers and rules about the game come from `content/data`, which follows `GAME_FACTS.md`.
- Everything else is `[TODO] <what to write>`. Nothing is invented: no slogans, story, taglines, profiles, amounts or names.
- Official game text that needs translating (passive names and descriptions) appears in English as in the game; the Vietnamese version is a translation marked `[REVIEW]` until the owner confirms it.
- Names the owner has not chosen — the gacha currency, the gacha itself, systems whose in-game names come from Arknights (`GAME_FACTS.md`, section 6) — are placeholders. Plain descriptive words ("nhân vật", "gacha", "nâng cấp") are fine where no name is needed.

### Navigation, hero and reward

| Key | vi | en |
|---|---|---|
| `nav.story` | Giới thiệu | Introduction |
| `nav.features` | Tính năng | Features |
| `nav.gameplay` | Gameplay | Gameplay |
| `nav.characters` | Nhân vật | Characters |
| `nav.reward` | Nhận quà | Get reward |
| `common.menu` | Menu | Menu |
| `intro.line1` to `intro.line3` | `[TODO]` | `[TODO]` |
| `hero.status` | Sắp ra mắt trên Android | Coming soon on Android |
| `hero.trailer` | Xem trailer | Watch trailer |
| `hero.scroll` | Cuộn | Scroll |
| `reward.title` | Quà đăng ký sớm | Pre-registration reward |
| `reward.desc` | `[TODO]` | `[TODO]` |

`reward.desc` names the amount and the currency; it must match the `prereg-launch` campaign row (`ARCHITECTURE.md`, section 9).

### Features topics (proposed; confirmed at the start of P5)

| # | Topic | Facts it may use (`GAME_FACTS.md`) |
|---|---|---|
| 1 | Two lanes, three kinds of notes | Section 2 |
| 2 | Each character changes how you play | Section 3: passives |
| 3 | Collect and grow your characters | Sections 4 and 5: the gacha, levelling up and upgrading |
| 4 | Always something to play | Section 5: events, the story campaign, leaderboards |

### Gameplay tabs (proposed; confirmed at the start of P5)

| # | Topic | Facts it may use (`GAME_FACTS.md`) |
|---|---|---|
| 1 | Rhythm combat | Section 2: lanes, notes, HP, finishing a song |
| 2 | Combo and Fever | Section 2 |
| 3 | Gacha | Section 4: the chances and the 30-pull guarantee |
| 4 | Missions and sign-in | Section 5 |

Titles and text of every card and tab are `[TODO]`; the content skeleton carries, for each, a description of the facts it may use. The site introduces the game in plain words and does not explain its rules in detail.

## 9. Languages

- Locales `vi` (default, `/`) and `en` (`/en`) with next-intl and `localePrefix: 'as-needed'`. Keep next-intl's locale detection (browser language, then cookie).
- Text comes from `content/text/vi.json` and `content/text/en.json`.
- `<html lang>`, title, description and Open Graph tags follow the locale; add `hreflang` alternates.
- Both locales must have every key. `check:content` and the build stop with a message naming a missing or misspelled key, so a half-translated page never ships.
- `npm run check:content` lists keys missing from either locale, mismatched placeholders, and every `[TODO]` and `[REVIEW]`.

## 10. Performance and SEO targets

- Lighthouse, mobile: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Lab metrics: LCP ≤ 2.5 s, TBT ≤ 200 ms, CLS ≤ 0.1.
- First-load JavaScript for the page ≤ 250 KB gzipped. Load the Supabase client, modals and sliders lazily.
- Hero image with `priority`; everything else lazy. Fonts with `display: swap`.
- Per-locale title and description, Open Graph and Twitter cards, `sitemap.xml`, `robots.txt`, and JSON-LD `VideoGame` data (platform Android).
- Until launch (P7), every page sends `noindex`, because the site still shows placeholders.

## 11. Assets

Put web-ready files in `public/images/` at the paths their content slots declare. Missing files get a placeholder box with the right aspect ratio and a label.

| Asset | Size | Format | Path | Needed by |
|---|---|---|---|---|
| Logo | Vector, or ≥ 1200 px wide | SVG, or PNG with transparency | `public/images/brand/logo.svg` (or `.png`) | P1 (a text wordmark until then) |
| Key visual, desktop | ≥ 1920 × 1080 (2560 × 1440 preferred) | WebP or PNG | `public/images/hero/hero-desktop.webp` | P4 |
| Key visual, mobile | 1080 × 1920 | WebP or PNG | `public/images/hero/hero-mobile.webp` | P4 |
| Hero layers (optional, recommended for parallax) | Same canvas as the desktop key visual | PNG with transparency | `public/images/hero/layer-*.png` | P4 |
| Reward art | 800 × 800 | WebP or PNG | `public/images/reward/reward.webp` | P2 |
| Introduction image | Set with the P1 layout | WebP | `public/images/story/story.webp` | P5 |
| Feature images | 1280 × 720, two per tab; a card uses its tab's first image | WebP | `public/images/features/` | P5 |
| Gameplay screenshots | 1280 × 720, 3–7 per tab | WebP | `public/images/gameplay/` | P5 |
| Character card art | 600 × 800, four | WebP | `public/images/characters/<slug>/card.webp` | P6 |
| Character visuals, idle and battle | Set when the art exists; pixel art keeps its original pixel size | PNG | `public/images/characters/<slug>/idle.png`, `battle.png` | P6 |
| Share image | 1200 × 630 | PNG or JPG | `src/app/[locale]/opengraph-image.png` (file convention) | P7 |
| App icon | 512 × 512 | PNG | `src/app/icon.png` (file convention) | P7 |
| Trailer | YouTube video ID | — | `trailerId` in `content/data/site.json` | Any time |

No Arknights art, and no screenshots of the current game build: it shows Arknights art and interface (`GAME_FACTS.md`, section 6). Gameplay screenshots wait until the build shows Promuse-owned art.

## 12. Content editing

- Everything the owner edits lives in `content/` (`ARCHITECTURE.md`, section 16): `text/vi.json` and `text/en.json` for words; `data/*.json` for links, numbers, colours and image slots.
- Replacing an image means putting the file at the path its slot declares; the placeholder disappears on the next build.
- `npm run check:content` validates everything and rewrites `CONTENT_TODO.md`: one entry per missing item, with its file, key, what to write and how to fill it.
- `doc/CONTENT_GUIDE.md` (in Vietnamese) explains editing step by step. It is written in P1.

## 13. Privacy page

- Routes `/privacy` and `/en/privacy`, linked from the footer and from the privacy line in the reward block. It is also the privacy-policy link on the Google consent screen.
- It states what the site stores for a registration — email, Google account id, locale, campaign and time of registration (`ARCHITECTURE.md`, section 9) — why (to give the reward to the same Google account in the game later), which services process it (Supabase, Vercel, Google sign-in), how long it is kept, and how to ask for deletion.
- The wording, the retention period and the contact email are the owner's: `[TODO]`. The list of stored fields must stay in sync with the data model.
- It must be complete before registration goes live in production (P3).
