# Promuse landing page — design

The reference study behind the page, and the Promuse identity. Colours, fonts and the type scale are recorded in section 4 once the owner approves them in P1.

## 1. Reference: p3re.jp/en

Studied on 2026-11-04 at 1440 px and 375 px wide. We take patterns, never assets, code or wording.

| Aspect | What p3re.jp does | What Promuse takes |
|---|---|---|
| Layout | One long page: hero, trailer strip, buy block, DLC, Introduction, Features, Game System, slogan lines, a giant outline word, Characters, footer. The page summarises; details open in full-screen modals | The same rhythm: short summaries on the page, details in modals (`SPEC.md`, section 2) |
| Composition | Zig-zag: an image bleeding off one edge, text on the other, swapping sides from section to section | The same, with diagonal cuts instead of straight edges |
| Theme | "Sinking into water": backgrounds deepen from white to pale and mid blue as you scroll; wave-shaped dividers in modals | One idea carried by colour and dividers; ours is in section 3 |
| Type | Three voices: a high-contrast serif for big titles (drawn as SVG), a wide uppercase sans for small labels ("FEATURE #1", "SCROLL"), a light geometric sans for body text. Titles around 120–200 px against roughly 14 px body text | Three voices too, as real text, in fonts that support Vietnamese |
| Colour | Navy text instead of black; pill buttons with a blue gradient; one colour per character that drives the section background | Ink-coloured text, accent buttons, a theme colour per character (content data) |
| Imagery | Wide stills revealed by a sliding panel. Character portraits in mono that turn to colour on hover (two images per character). Profile modal: full-body art, the name set vertically, a profile, a media grid and "Change visual" | Slash-wipe reveals, mono-to-colour cards, the same profile layout |
| Motion | Titles rise letter by letter from a clipped baseline; images wipe in; the character section stays pinned for a long scroll while its background colour changes in 0.5 s; body text never moves once shown | The same restraint: motion on titles, images and transitions, never on body text |
| Navigation | Nav items open the Features and Game System modals directly; Character scrolls to its section; a language menu. On mobile, a MENU triangle in the corner opens a blurred full-screen menu | Fixed header, anchors, modals with deep links, a full-screen mobile menu |
| Depth | Layers: art over gradients, outline words behind content, pinned scenes, frosted glass | The same tools, used sparingly |

## 2. Where Promuse does better

- Esc closes every modal and focus returns to the opener. On p3re.jp, Esc does nothing and the close buttons have no accessible name.
- Titles are real text: translatable, searchable, and set in fonts with Vietnamese support. p3re.jp draws its titles as SVG.
- The hero shows a poster image at once. On p3re.jp's mobile layout the hero stays blank while the video loads.
- The header stays available while scrolling.
- Reduced motion and the effects toggle turn every large effect off (`SPEC.md`, section 4).

## 3. Promuse identity — proposal, decided in P1

- **Idea: a song and a slash.** Scrolling is the song's timeline, from intro to final note; each section is a part of the song. Transitions are diagonal slashes instead of waves; the two note lanes are the guide lines; the 120 BPM beat is the pulse of the buttons.
- **Colour.** Two palettes in the P1 style tile, each with WCAG AA contrast ratios. No art exists yet, so the palette has to stand on its own.
- **Type.** Three voices, each with the `vietnamese` subset: a display face for titles, a wide face for labels, a sans for body text. Candidates are checked for complete Vietnamese support before they reach the style tile.
- **Logo.** A text wordmark, "PROMUSE", until the owner provides a logo.

## 4. Decisions

Filled in P1, after the owner chooses a style tile.

- Palette: —
- Fonts: —
- Type scale: —
