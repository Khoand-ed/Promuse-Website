import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Tests see the page settled; motion tests turn motion back on.
    reducedMotion: 'reduce',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    // The tests need mock mode whatever .env.local says, so Playwright always starts its own server.
    // Next.js allows one dev server per folder: stop `npm run dev` before `npm run e2e`.
    env: { NEXT_PUBLIC_BACKEND_MODE: 'mock' },
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
