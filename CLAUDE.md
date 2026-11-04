@AGENTS.md

# Claude Code

Everything in `AGENTS.md` applies. These notes are only for Claude Code sessions.

## Running a phase

1. Read the phase in `doc/PHASES.md` and every doc section it lists under "Read first".
2. Propose a short plan (files to add or change, open questions) and wait for approval.
3. Build in small steps. Prefer extending existing files over adding new layers.
4. Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`, and fix whatever fails.
5. Report: what changed, how to check it by hand, the phase's "Done when" checklist with each item ticked or explained, and a proposed commit message.

Do not commit unless asked. Do not start the next phase on your own.

## When unsure

- Framework APIs: read the bundled docs in `node_modules/next/dist/docs/` and the official docs for the versions in `package.json`. Next.js 16 uses `proxy.ts`, not `middleware.ts`.
- Product, copy or design questions: ask instead of inventing. Leave `[TODO]` copy where text is missing.
- QA reports in `doc/qa/` come from Antigravity. When asked to fix one, address each failing item and tick it in the report.
