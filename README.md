# Promuse — landing page

The landing page of Promuse, a 2D mobile rhythm hack-and-slash game with gacha (Android first, in development). Built with Next.js 16. The specs live in `doc/`; coding agents follow `AGENTS.md`.

## Getting started

Requirements: Node.js 24 (see `.nvmrc`) and npm.

1. Install the dependencies: `npm install`
2. Copy `.env.example` to `.env.local` (the defaults run the site in mock mode).
3. Start the development server: `npm run dev`, then open http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build`, `npm start` | Production build, and serving it |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types, then runs TypeScript |
| `npm test` | Unit tests (Vitest) |
| `npm run e2e` | End-to-end tests (Playwright, Chromium) |
| `npm run format` | Prettier |
| `npm run check:content` | Checks `content/` and lists what is missing (from P1) |

## Documentation

- `doc/SPEC.md`: what the page shows and how it behaves
- `doc/ARCHITECTURE.md`: how it is built
- `doc/API.md`: the HTTP contract
- `doc/PHASES.md`: build order and acceptance criteria
- `doc/GAME_FACTS.md`: what the site may say about the game
- `doc/DESIGN.md`: reference study and visual identity
- `doc/CONTENT_GUIDE.md`: how to edit the text, links and images (in Vietnamese)

The portfolio version of this README is written in P7.
