import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// The expected words come from the content files, so editing the copy never breaks these tests.
const copy = {
  vi: JSON.parse(readFileSync('content/text/vi.json', 'utf8')),
  en: JSON.parse(readFileSync('content/text/en.json', 'utf8')),
} as const;
const EMAIL = 'nguoi.choi@example.com';

const locales = [
  { locale: 'vi', path: '/', browser: 'vi-VN' },
  { locale: 'en', path: '/en', browser: 'en-US' },
] as const;

for (const { locale, path, browser } of locales) {
  const states = copy[locale].reward.states;
  const reward = (page: Page) => page.locator('#reward');
  const action = (page: Page, name: string) => reward(page).getByRole('button', { name });
  const result = (page: Page) => reward(page).locator('[aria-live] [data-reward-result]');
  const registeredText = states.registered.replace('{email}', EMAIL);
  const alreadyPrefix = states.alreadyRegistered.split('{date}')[0];

  test.describe(`reward (${locale})`, () => {
    test.use({ locale: browser });

    test('signed-out: Google sign-in, back with intent, registered once', async ({ page }) => {
      await page.goto(`${path}?mock=signed-out`);
      await action(page, states.signedOut).click();
      await expect(action(page, states.redirecting)).toBeDisabled();
      await expect(result(page)).toHaveText(registeredText, { timeout: 10_000 });
      await expect(page).not.toHaveURL(/intent=/);
      await expect(page).toHaveURL(/#reward$/);
      await expect(reward(page)).toBeInViewport();
    });

    test('signed-in: one click registers', async ({ page }) => {
      await page.goto(`${path}?mock=signed-in`);
      await expect(reward(page).getByText(EMAIL)).toBeVisible();
      await action(page, states.signedInNotRegistered).click();
      await expect(action(page, states.registering)).toBeDisabled();
      await expect(result(page)).toHaveText(registeredText);
    });

    test('registered: shows the date, no button', async ({ page }) => {
      await page.goto(`${path}?mock=registered`);
      await expect(result(page)).toContainText(alreadyPrefix.trim());
      await expect(result(page)).toContainText('2026');
      await expect(reward(page).getByRole('button', { name: states.signedOut })).toHaveCount(0);
    });

    test('existing: signing in again finds the earlier registration', async ({ page }) => {
      await page.goto(`${path}?mock=existing`);
      await action(page, states.signedOut).click();
      await expect(result(page)).toContainText(alreadyPrefix.trim(), { timeout: 10_000 });
    });

    test('cancelled: back at the sign-in button with a notice', async ({ page }) => {
      await page.goto(`${path}?mock=cancelled`);
      await action(page, states.signedOut).click();
      await expect(reward(page).getByText(states.cancelled)).toBeVisible({ timeout: 10_000 });
      await expect(action(page, states.signedOut)).toBeEnabled();
      await expect(page).not.toHaveURL(/auth=/);
    });

    test('error: offers a retry that keeps the account', async ({ page }) => {
      await page.goto(`${path}?mock=error`);
      await action(page, states.signedInNotRegistered).click();
      await expect(action(page, states.error)).toBeEnabled();
      await action(page, states.error).click();
      await expect(action(page, states.error)).toBeEnabled();
      await expect(reward(page).getByText(EMAIL)).toBeVisible();
    });

    test('closed: the button ends disabled', async ({ page }) => {
      await page.goto(`${path}?mock=closed`);
      await action(page, states.signedInNotRegistered).click();
      await expect(action(page, states.closed)).toBeDisabled();
    });

    test('sign out returns to the sign-in button', async ({ page }) => {
      await page.goto(`${path}?mock=signed-in`);
      await reward(page).getByRole('button', { name: copy[locale].reward.signOut }).click();
      await expect(action(page, states.signedOut)).toBeEnabled();
      await expect(reward(page).getByText(EMAIL)).toHaveCount(0);
    });
  });
}

test.describe('reward by keyboard', () => {
  test.use({ locale: 'vi-VN' });

  test('the button works with Enter', async ({ page }) => {
    const states = copy.vi.reward.states;
    await page.goto('/?mock=signed-in');
    const button = page
      .locator('#reward')
      .getByRole('button', { name: states.signedInNotRegistered });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#reward [aria-live] [data-reward-result]')).toHaveText(
      states.registered.replace('{email}', EMAIL),
    );
  });
});

test.describe('first-visit popup', () => {
  test.use({ locale: 'vi-VN', rewardPopup: true });
  const title = copy.vi.reward.title;

  test('appears once, closes with Esc and stays away after a reload', async ({ page }) => {
    await page.goto('/?mock=signed-out');
    const popup = page.getByRole('dialog', { name: title });
    await expect(popup).toBeVisible({ timeout: 6000 });
    await expect(
      popup.getByRole('button', { name: copy.vi.reward.states.signedOut }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(popup).toBeHidden();
    await page.reload();
    await page.waitForTimeout(2500);
    await expect(popup).toBeHidden();
  });

  test('its button starts the same sign-in', async ({ page }) => {
    const states = copy.vi.reward.states;
    await page.goto('/?mock=signed-out');
    const popup = page.getByRole('dialog', { name: title });
    await popup.getByRole('button', { name: states.signedOut }).click();
    await expect(page.locator('#reward [aria-live] [data-reward-result]')).toHaveText(
      states.registered.replace('{email}', EMAIL),
      { timeout: 10_000 },
    );
    await expect(popup).toBeHidden();
  });

  test('a click beside the card closes it', async ({ page }) => {
    await page.goto('/?mock=signed-out');
    const popup = page.getByRole('dialog', { name: title });
    await expect(popup).toBeVisible({ timeout: 6000 });
    await page.mouse.click(5, 5);
    await expect(popup).toBeHidden();
  });

  test('never shows after registration', async ({ page }) => {
    await page.goto('/?mock=registered');
    await page.waitForTimeout(3000);
    await expect(page.getByRole('dialog', { name: title })).toBeHidden();
  });

  test('waits for the opening when motion is on', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/?mock=signed-out');
    await expect(page.locator('.opening')).toBeVisible();
    await expect(page.getByRole('dialog', { name: title })).toBeHidden();
    await expect(page.getByRole('dialog', { name: title })).toBeVisible({ timeout: 8000 });
  });
});
