# Promuse landing page — design

The reference study behind the page, and the decisions that follow from it. On 2026-11-05 the owner chose to follow p3re.jp closely instead of the earlier style-tile directions; section 4 records the result.

## 1. Reference: p3re.jp/en

Studied on 2026-11-04 and measured on 2026-11-05 at 1440 px and 390 px wide. We rebuild its look with our own code; we never take its assets, code, wording, logos or font files.

| Aspect | What p3re.jp does | What Promuse does |
|---|---|---|
| Layout | One long page: hero, trailer strip, buy block, DLC, Introduction, Features, Game System, slogan lines, a giant outline word, Characters, footer. The page summarises; details open in full-screen modals | The same order without DLC: hero, reward block, Introduction, Features, Gameplay, slogan lines, outline word, Characters, footer; details in modals (P5, P6) |
| Composition | Zig-zag: an image bleeding off one edge, text on the other, swapping sides from section to section | The same, with the same proportions |
| Theme | "Sinking into water": backgrounds deepen from white to pale and mid blue as you scroll; wave-shaped dividers in modals | The same run of backgrounds |
| Type | Three voices: a high-contrast serif for big titles (drawn as SVG), a wide uppercase sans for small labels ("FEATURE #1", "SCROLL"), a light geometric sans for body text. Titles around 84–250 px against 14 px body text | The same three voices and sizes, as real text, in fonts that support Vietnamese |
| Colour | Navy text instead of black; pill buttons with a blue gradient; one pastel per character that drives the section background | The same colours; navy instead of white text on coloured backgrounds |
| Imagery | Wide stills revealed by a sliding panel. Character portraits in mono that turn to colour on hover (two images per character). Profile modal: full-body art, the name set vertically, a profile, a media grid and "Change visual" | The same, with Promuse art |
| Motion | Titles rise letter by letter from a clipped baseline; images wipe in; the character section stays pinned for a long scroll while its background colour changes in 0.5 s; body text never moves once shown | The same patterns, studied frame by frame at the start of P4 |
| Navigation | Nav items open the Features and Game System modals directly; Character scrolls to its section; a language menu. On mobile, a MENU triangle in the corner opens a blurred full-screen menu | The same header and corner menu; nav items scroll to their sections |
| Depth | Layers: art over gradients, outline words behind content, pinned scenes, frosted glass | The same tools |

## 2. Where Promuse does better

- Esc closes every modal and focus returns to the opener. On p3re.jp, Esc does nothing and the close buttons have no accessible name.
- Titles are real text: translatable, searchable, and set in fonts with Vietnamese support. p3re.jp draws its titles as SVG.
- The hero shows a poster image at once. On p3re.jp's mobile layout the hero stays blank while the video loads.
- Text on coloured backgrounds is navy, so it keeps WCAG AA contrast; p3re.jp sets white on pastels.
- A back-to-top button stands in for the header, which scrolls away as on p3re.jp.
- Reduced motion and the effects toggle turn every large effect off (`SPEC.md`, section 4).

## 3. What stays Promuse's own

- The name, the logo (a text wordmark, "PROMUSE", until the owner provides one), the art, the copy and the character colours.
- Real text in fonts with Vietnamese support, instead of titles drawn as images.
- The accessibility and reduced-motion behaviour in section 2.

The earlier proposal, "a song and a slash" (beat-synced pulses, diagonal slash transitions, the two note lanes as guide lines), is set aside, except one accent the owner kept on 2026-11-05: background music behind a round button in the top left corner, whose note spins while it plays, and pill buttons that pulse on its beats.

## 4. Decisions

Decided on 2026-11-05: the look follows p3re.jp (`SPEC.md`, section 1). The tokens live in `src/app/globals.css` under `@theme`.

**Colours** (measured on p3re.jp)

| Token | Value | Use | Contrast with navy text |
|---|---|---|---|
| `ink` | #1D384A | Text, hairlines, icons | — |
| white | #FFFFFF | Hero top, reward block, footer | 12.2:1 |
| `mist` | #E5EEF6 | Image placeholders, privacy and 404 pages | 10.4:1 |
| `sky` | #C0D5E8 | Introduction to slogans | 8.1:1 |
| `azure` | #5BA4D7 | Characters | 4.5:1 |
| `cta-from` → `cta-to` | #0072B9 → #002CB8 | Pill buttons (white text: 5.1:1 to 10.2:1), corner menu | — |
| `rule` | #DCE4EC | Footer hairline | — |
| `menu` | rgb(206 228 246 / 0.9) | Mobile menu glass, with a 14 px blur | — |
| `hero-1` to `hero-5` | #0BE9F9, #0A77D6, #0041B9, #001DAE, #0004A8 | Hero gradient until the key visual exists | — |
| `chara-1` to `chara-11` | #86EDFC, #FC93FF, #989FFB, #D3DADA, #F68CA8, #95F5DC, #F2F4F2, #FAF6A6, #FABA80, #CE8998, #93CC96 | A character's colour while its `themeColor` is `null`, in order | 4.5:1 or more, except #CE8998 (4.46:1, large text only) |

**Fonts** (all with the `vietnamese` subset, loaded with `next/font`). p3re.jp's fonts have no Vietnamese, so each role takes the closest match that does:

| Role | p3re.jp | Promuse |
|---|---|---|
| Display titles | High-contrast serif (SVG) | Noto Serif Display, width 87.5, weight 400 |
| Body, nav, buttons | Urbanist | Quicksand |
| Small labels | Syncopate | Lexend Exa |

**Type scale** (desktop at 1440 px → phone): section titles 84 px → 52 px; reward title 100 px → 54 px; characters title 11.5vw → 16vw; hero status 45 px → 30 px with the name at 28 px → 16 px above it; body 14/28 px with 0.8 px tracking; slogan lines 12/24 px; nav 19 px semibold; labels 10–16 px uppercase.

**Buttons.** One style, as on p3re.jp: a pill with the blue gradient, white bold text and an arrow. The large variant is 76 px tall with wide uppercase tracking.

**Layout.** Bleeding images are 52vw wide at 16:9; text columns start 6.25vw from the left edge, or 5.7vw past a left image. On phones titles are centred and images keep a 6.7% margin. Character portraits are 3:4 and sized by the window's height, as on p3re.jp: 80.5% of it tall (60.4svh wide), 200 px apart, centred in the section. So the card in focus and its name always fit, also in a browser window that is not full-screen (measured on p3re.jp at 780, 864, 900, 1080 and 1366 px tall windows, 2026-11-06).
