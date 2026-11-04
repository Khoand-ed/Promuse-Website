# Promuse landing page — product and UX spec

What the page shows, how it moves and what each state looks like. How it is built is in `ARCHITECTURE.md`, the HTTP contract is in `API.md`, and the build order is in `PHASES.md`.

## 1. Goals

- Present Promuse, a 2D mobile rhythm hack-and-slash game with gacha, with motion as strong as the Persona 3 Reload site.
- Let visitors pre-register with Google and receive the reward in the in-game Mail of the same account.
- Show production-grade engineering for a portfolio: typed content, a service layer, a versioned API, tests and CI.

Not in v1: news or blog pages, a CMS, an account page, a web mailbox, sending email, background music, Sign in with Apple, and the Unity client.

## 2. Page map

One page, one route per locale: `/` (Vietnamese) and `/en` (English).

| # | Block | Anchor | Contents | Pattern taken from the P3R site |
|---|---|---|---|---|
| 0 | Intro | — | Three slogan lines on the beat, Skip button | Opening lines before the page |
| 1 | Header | — | Logo, nav, VI/EN, effects toggle, "Get reward" | Global nav with a language menu |
| 2 | Hero | `#top` | Layered key visual, logo, status line, reward CTA, trailer button, scroll cue | Key visual, PV buttons, SCROLL cue |
| 3 | Reward | `#reward` | Pre-registration banner with Google sign-in; first-visit popup | DLC banner and Expansion Pass overlay |
| 4 | Introduction | `#story` | World introduction and big-type slogan bands | Introduction and slogan bands |
| 5 | Features | `#features` | Four feature cards; "See details" opens a 4-tab modal | Features modal with four tabs |
| 6 | Gameplay | `#gameplay` | Two-lane note scene and summary; 4-tab modal with image sliders | Game System modal with sliders |
| 7 | Characters | `#characters` | Four cards grouped by rarity; profile modal with a visual swap | Character list and profile modal with "Change visual" |
| 8 | Footer | — | Spec table, share, links, platforms, copyright, back to top | SPEC / LINKS / SHARE footer |

Deep links open the matching modal: `#features-detail`, `#gameplay-detail`, `#char-<id>` (for example `/en#char-a`). Closing a modal restores the section's hash.

## 3. Global UI

**Header.** Fixed. Transparent over the hero, solid after 80 px of scroll. Highlights the section in view. Items: Introduction, Features, Gameplay, Characters, and "Get reward" in the accent colour. Right side: language switch and effects toggle. Below 768 px: logo, "Get reward" and a menu button that opens a full-screen menu with a slash wipe.

**Language switch.** VI and EN buttons with `aria-pressed`. Switching keeps the current hash.

**Effects toggle.** "Effects: on / off" with `aria-pressed`. The default follows the system's reduced-motion setting; the visitor's choice is stored in `localStorage` as `promuse:motion` (`on` or `off`).

**Also.** A skip link to the main content, `scroll-margin-top` on sections so the header never covers a heading, and a back-to-top button after one screen of scrolling.

## 4. Motion system

Principles:

- **Rhythm first.** Decorative motion lands on the beat of one shared clock: 120 BPM (500 ms per beat), set in `src/content/site.ts`.
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
| Two-lane notes | `NoteLanes` | Notes travel along a left and a right lane to a judgment line and burst on the beat | Hero background (subtle), Gameplay (scroll-driven) |
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
| Characters | Cards rise by rarity group | — | Mono to colour and an idle bob on hover; slash swap between idle and battle sprites |
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
- Copy: `intro.line1` to `intro.line3`.

### 2. Hero (`#top`)

- Height `100svh`. Art direction with `getImageProps()` and a `<picture>`: a landscape crop for desktop, a portrait crop for mobile.
- If layered art exists (background, characters, effects), the layers feed `Parallax`.
- Content: logo (alt text "Promuse"), status line, primary CTA (scrolls to `#reward`), "Watch trailer" (opens the lightbox; hidden when `trailerId` is empty), scroll cue.

### 3. Reward (`#reward`)

- Banner: reward art, title, one-line reward description, the sign-in button, a privacy line and, when signed in, "Not you? Sign out".
- Popup: appears 1.5 s after the intro ends (or after load when the intro does not play), only on the first visit (`localStorage` key `promuse:reward-popup-dismissed`), never after registration. Its button starts the same sign-in.
- After returning from Google, the page scrolls to `#reward` and registration runs automatically, once.
- States are in section 7.

### 4. Introduction (`#story`)

- Two columns (one on mobile): an image and two or three short paragraphs about the world and its characters. Rhythm is how the game plays, not what the world is about, so the text does not talk about music.
- Below: two or three big-type bands with Promuse slogans.
- Copy: `story.title`, `story.p1` to `story.p3`, `story.band1` to `story.band3`, all `[TODO]`.

### 5. Features (`#features`)

- On the page: title, a two-sentence summary, four cards (title, one line, image), "See details".
- Modal: four tabs. Each tab shows "FEATURE #n", a title, one or two sentences and two images. Copy is in section 8.

### 6. Gameplay (`#gameplay`)

- On the page: the `NoteLanes` scene, title, a two-sentence summary, "Gameplay details".
- Modal: four tabs, each with a slider of 3–7 images (16:9), a title and a paragraph. The Recruitment tab shows the rate line. Copy is in section 8.

### 7. Characters (`#characters`)

- Four large cards grouped as 5★ (one), 4★ (two), 3★ (one). Each card shows art, name and stars.
- Profile modal: the idle sprite on the left with "Change visual", which swaps to the battle sprite with a slash wipe. On the right: name, rarity, tagline, profile, passive (name and description), stats, and a gallery slider (hidden when empty). Previous and next buttons, plus ← and →, move between characters.
- No voice-actor credits or per-character trailers in v1.

| id | Rarity | Max HP | Score multiplier | Fever multiplier |
|---|---|---|---|---|
| char-a | 5★ | 300 | ×1.2 | ×1.2 |
| char-b | 4★ | 275 | ×1.1 | ×1.1 |
| char-c | 4★ | 275 | ×1.1 | ×1.1 |
| char-d | 3★ | 250 | ×1.0 | ×1.0 |

Stats come from the GDD. Names, taglines, profiles and passives are `[TODO]`. Replace the ids once the names are final.

### 8. Footer

- Logo and spec table: Title Promuse · Release Coming soon · Genre Rhythm hack-and-slash, gacha · Players 1 · Platforms Android, iOS.
- Social links from `src/content/site.ts` (hidden when empty). Share to X and Facebook through intent URLs with `#Promuse`.
- "Coming soon on Google Play and the App Store" as text; no store badges until store links exist.
- Copyright: `© 2026 Promuse · [TODO studio or author name]`.

## 6. Shared components

| Component | Behaviour | Keyboard and accessibility |
|---|---|---|
| Modal | Native `<dialog>` with `showModal()`. Opens with `SlashWipe` (a fade when motion is off). Locks page scroll and stops Lenis. Opening sets the hash; the browser Back button closes it | Esc closes; focus moves inside and returns to the opener; labelled by its title |
| Tabs | Switches panels without closing the modal; remembers the last tab per modal (`sessionStorage` key `promuse:tab:<modal>`) | ARIA tabs pattern; ← → Home End |
| Slider | CSS scroll snap with previous and next buttons, dots and swipe; images load lazily | Labelled buttons; announces "Image 2 of 5" politely |
| Lightbox | Inserts a `youtube-nocookie.com` iframe only when opened and removes it on close, so playback stops | Built on Modal |

## 7. Pre-registration states

| State | When | Button (vi / en) | Notes |
|---|---|---|---|
| `signedOut` | No session | Đăng nhập Google để nhận quà / Sign in with Google to claim | Default |
| `redirecting` | After the click, before leaving | Đang chuyển tới Google… / Redirecting to Google… | Disabled |
| `registering` | Back from Google, request in flight | Đang ghi nhận… / Registering… | Disabled |
| `registered` | Server answered `created` | Đã đăng ký! Quà sẽ nằm trong Hộp thư khi bạn vào game bằng {email} / You're in! Your reward will be in your in-game Mail when you sign in with {email} | Popup never shows again |
| `alreadyRegistered` | Server answered `existing` | Bạn đã đăng ký từ {date} / You pre-registered on {date} | Popup never shows again |
| `signedInNotRegistered` | Session, but no registration | Nhận quà đăng ký sớm / Claim the pre-registration reward | One click, no new sign-in |
| `cancelled` | The visitor closed the Google window | Back to `signedOut` with "Bạn đã huỷ đăng nhập." / "Sign-in was cancelled." | — |
| `error` | Any failure | Có lỗi, thử lại / Something went wrong, try again | Retry keeps the context |
| `closed` | Server answered `campaign_closed` | Đã hết thời gian đăng ký sớm / Pre-registration has ended | Disabled |

Privacy line under the button: "Email chỉ dùng để gắn quà với tài khoản game." / "We only use your email to link the reward to your game account."

Copy keys live under `reward.*` in `messages/*.json`.

## 8. Copy drafts

Drafted from the GDD; the owner may rewrite them. `[TODO]` marks placeholders.

### Navigation, intro, hero and reward

| Key | vi | en |
|---|---|---|
| `nav.story` | Giới thiệu | Introduction |
| `nav.features` | Tính năng | Features |
| `nav.gameplay` | Gameplay | Gameplay |
| `nav.characters` | Nhân vật | Characters |
| `nav.reward` | Nhận quà | Get reward |
| `intro.line1` | [TODO] Theo nhịp. | [TODO] Feel the beat. |
| `intro.line2` | [TODO] Chém đúng phách. | [TODO] Slash on the beat. |
| `intro.line3` | [TODO] Sống sót tới nốt cuối. | [TODO] Survive to the final note. |
| `hero.status` | Sắp ra mắt · Android & iOS | Coming soon · Android & iOS |
| `hero.cta` | Nhận quà đăng ký sớm | Claim the pre-registration reward |
| `hero.trailer` | Xem trailer | Watch trailer |
| `hero.scroll` | Cuộn | Scroll |
| `reward.title` | Quà đăng ký sớm | Pre-registration reward |
| `reward.desc` | [TODO] 1.800 Gem — đủ một lượt triệu hồi x10 | [TODO] 1,800 Gems — one 10-pull |

The reward amount must match the `prereg-launch` campaign row in the database (`ARCHITECTURE.md`, section 9).

### Features modal

| Tab | Title (vi / en) | Text (vi) | Text (en) |
|---|---|---|---|
| 1 | Rhythm dễ chơi / Easy-to-learn rhythm | Hai làn trái phải, chỉ chạm và giữ. Hiểu luật trong vài chục giây; độ khó đến từ bản nhạc, không từ số nút. | Two lanes, tap and hold. Learn it in under a minute; the challenge comes from the chart, not the controls. |
| 2 | Mỗi nhân vật một lối chơi / Every character plays differently | Nhân vật không chỉ tăng chỉ số: mỗi người có một passive thay đổi cách bạn chơi. | Characters do more than raise stats: each brings a passive that changes how you play. |
| 3 | Pixel art giữa thế giới low-poly / Pixel art in a low-poly world | Nhân vật pixel art chiến đấu trong màn chơi 3D low-poly; mỗi cú chạm đúng nhịp là một nhát chém. | Pixel-art fighters battle through low-poly 3D stages; every on-beat tap lands a slash. |
| 4 | Chơi là tiến bộ / Every run moves you forward | Mỗi lần chơi đều có giá trị: Gem từ màn chơi và nhiệm vụ, triệu hồi nhân vật mới, đột phá bằng bản sao. | Every session counts: earn Gems from stages and missions, recruit new characters and rank them up with duplicates. |

### Gameplay modal

| Tab | Title (vi / en) | Text (vi) | Text (en) |
|---|---|---|---|
| 1 | Chiến đấu theo nhịp / Rhythm combat | Quái lao tới theo hai làn. Tap Note: chạm. Hold Note: giữ. Twin Note: chạm hai bên cùng lúc. Qua màn khi hết bài mà HP vẫn còn. | Enemies charge down two lanes. Tap Notes: tap. Hold Notes: hold. Twin Notes: hit both sides at once. Clear the stage by finishing the song with HP left. |
| 2 | Triệu hồi / Recruitment | Dùng Gem để triệu hồi nhân vật 3★ đến 5★. 30 lượt liền không ra 5★ thì lượt thứ 31 chắc chắn ra. Tỉ lệ: 5★ 2% · 4★ 10% · 3★ 88%. | Spend Gems to recruit 3★ to 5★ characters. Go 30 pulls without a 5★ and pull 31 is guaranteed. Rates: 5★ 2% · 4★ 10% · 3★ 88%. |
| 3 | Đột phá bản sao / Duplicate Break | Triệu hồi trùng nhân vật sẽ thành Tiềm năng; đủ Tiềm năng thì thăng bậc, tối đa Bậc 5, tăng chỉ số. | Duplicate pulls become Potential. Collect enough to rank a character up, to a maximum of Rank 5, raising their stats. |
| 4 | Nhiệm vụ hằng ngày / Daily missions | Đăng nhập và hoàn thành một màn mỗi ngày để nhận Gem; thắng một màn lần đầu được thêm Gem. | Log in and clear a stage each day for Gems; first clears give bonus Gems. |

## 9. Languages

- Locales `vi` (default, `/`) and `en` (`/en`) with next-intl and `localePrefix: 'as-needed'`. Keep next-intl's locale detection (browser language, then cookie).
- `<html lang>`, title, description and Open Graph tags follow the locale; add `hreflang` alternates.
- A missing English key falls back to Vietnamese and logs a warning in development.
- `npm run check:content` lists `[TODO]` strings and keys missing from either locale.

## 10. Performance and SEO targets

- Lighthouse, mobile: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Lab metrics: LCP ≤ 2.5 s, TBT ≤ 200 ms, CLS ≤ 0.1.
- First-load JavaScript for the page ≤ 250 KB gzipped. Load the Supabase client, modals and sliders lazily.
- Hero image with `priority`; everything else lazy. Fonts with `display: swap`.
- Per-locale title and description, Open Graph and Twitter cards, `sitemap.xml`, `robots.txt`, and JSON-LD `VideoGame` data.

## 11. Assets

Put web-ready files in `public/images/` at these paths. Missing files get a placeholder box with the right aspect ratio and a label.

| Asset | Size | Format | Path | Needed by |
|---|---|---|---|---|
| Logo | Vector, or ≥ 1200 px wide | SVG, or PNG with transparency | `public/images/brand/logo.svg` (or `.png`) | P1 |
| Key visual, desktop | ≥ 1920 × 1080 (2560 × 1440 preferred) | WebP or PNG | `public/images/hero/hero-desktop.webp` | P1 |
| Key visual, mobile | 1080 × 1920 | WebP or PNG | `public/images/hero/hero-mobile.webp` | P1 |
| Hero layers (optional, recommended for parallax) | Same canvas as the desktop key visual | PNG with transparency | `public/images/hero/layer-*.png` | P2 |
| Feature images | 1280 × 720, two per tab | WebP | `public/images/features/` | P3 |
| Gameplay screenshots | 1280 × 720, 3–7 per tab | WebP | `public/images/gameplay/` | P3 |
| Character card art | 600 × 800, four | WebP | `public/images/characters/<id>/card.webp` | P4 |
| Sprites, idle and battle | Original pixel size, never resized | PNG | `public/images/characters/<id>/idle.png`, `battle.png` | P4 |
| Reward art | 800 × 800 | WebP or PNG | `public/images/reward/reward.webp` | P5 |
| Share image | 1200 × 630 | PNG or JPG | `src/app/[locale]/opengraph-image.png` | P7 |
| App icon | 512 × 512 | PNG | `src/app/icon.png` | P7 |
| Trailer | YouTube video ID | — | `trailerId` in `src/content/site.ts` | Any time |
