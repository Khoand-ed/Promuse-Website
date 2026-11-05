import { test as base } from '@playwright/test';

/**
 * Tests start with the first-visit reward popup already dismissed, so it never covers what they
 * click. Popup tests opt back in with `test.use({ rewardPopup: true })`.
 */
export const test = base.extend<{ rewardPopup: boolean }>({
  rewardPopup: [false, { option: true }],
  // `provide` is Playwright's fixture callback, named so React's hook lint does not mistake it.
  page: async ({ page, rewardPopup }, provide) => {
    if (!rewardPopup) {
      await page.addInitScript(() => {
        try {
          localStorage.setItem('promuse:reward-popup-dismissed', '1');
        } catch {
          // Pages without storage show the popup; such tests would say so.
        }
      });
    }
    await provide(page);
  },
});

export { expect } from '@playwright/test';
