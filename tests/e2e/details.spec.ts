import { readFileSync } from 'node:fs';
import { expect, test } from './fixtures';

// The expected words come from the content files, so editing the copy never breaks these tests.
const vi = JSON.parse(readFileSync('content/text/vi.json', 'utf8'));
const en = JSON.parse(readFileSync('content/text/en.json', 'utf8'));
const gameplayData = JSON.parse(readFileSync('content/data/gameplay.json', 'utf8'));

test.describe('features modal by keyboard', () => {
  test.use({ locale: 'vi-VN', viewport: { width: 1440, height: 1100 } });

  test('opens, switches tabs with the arrows, Home and End, closes and returns focus', async ({
    page,
  }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: vi.features.seeDetails });
    await button.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: vi.features.title });
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/#features-detail$/);

    const tabs = dialog.getByRole('tab');
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(dialog.getByRole('tabpanel')).toContainText(vi.features.items.f2.title);
    await page.keyboard.press('End');
    await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
    await expect(page).not.toHaveURL(/#features-detail/);
  });

  test('a wheel turn moves to the next tab, as on p3re.jp', async ({ page }) => {
    await page.goto('/#features-detail');
    const dialog = page.getByRole('dialog', { name: vi.features.title });
    await expect(dialog).toBeVisible();
    await page.mouse.move(720, 500);
    await page.mouse.wheel(0, 200);
    await expect(dialog.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('remembers the last tab when it opens again', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: vi.features.seeDetails });
    await button.click();
    const dialog = page.getByRole('dialog', { name: vi.features.title });
    await dialog.getByRole('tab').nth(2).click();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await button.click();
    await expect(dialog.getByRole('tab').nth(2)).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('deep links', () => {
  test.use({ locale: 'en-US' });

  test('/#features-detail opens the features modal, in English for an English browser', async ({
    page,
  }) => {
    await page.goto('/#features-detail');
    await expect(page.getByRole('dialog', { name: en.features.title })).toBeVisible();
  });

  test('/en#gameplay-detail opens the gameplay modal in English, and Back closes it', async ({
    page,
  }) => {
    await page.goto('/en');
    // Wait until Next.js has written its own history entry: it rewrites the URL once as it starts,
    // which would drop a hash set before then.
    await page.waitForFunction(() => window.history.state?.__NA === true);
    // As a link on the page would: the hash joins the history, so Back closes the modal.
    await page.evaluate(() => {
      window.location.hash = 'gameplay-detail';
    });
    const dialog = page.getByRole('dialog', { name: en.gameplay.title });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('tab').first()).toHaveText(en.gameplay.tabs.g1.tab);
    await page.goBack();
    await expect(dialog).toBeHidden();
  });
});

test.describe('gameplay slider on a phone', () => {
  test.use({ locale: 'vi-VN', viewport: { width: 360, height: 780 }, hasTouch: true });

  test('swiping, the arrows and the dots stay in step with the announcement', async ({ page }) => {
    await page.goto('/#gameplay-detail');
    const dialog = page.getByRole('dialog', { name: vi.gameplay.title });
    const panel = dialog.locator('[role="tabpanel"]:not([hidden])');
    const total = gameplayData.tabs[0].slides.length;
    const position = (n: number) =>
      vi.gameplay.position.replace('{current}', String(n)).replace('{total}', String(total));

    // A swipe is a scroll of the snapping track by one slide.
    await panel.locator('.slider-track').evaluate((track) => {
      track.scrollBy({ left: track.clientWidth });
    });
    await expect(panel.locator('[aria-live="polite"]')).toHaveText(position(2));
    await expect(panel.locator('.slider-dot').nth(1)).toHaveAttribute('aria-current', 'true');

    await panel.getByRole('button', { name: vi.gameplay.next }).click();
    await expect(panel.locator('[aria-live="polite"]')).toHaveText(position(3));
    await expect(panel.getByRole('button', { name: vi.gameplay.next })).toBeDisabled();

    await panel.getByRole('button', { name: position(1) }).click();
    await expect(panel.locator('[aria-live="polite"]')).toHaveText(position(1));
    await expect(panel.getByRole('button', { name: vi.gameplay.previous })).toBeDisabled();
  });

  test('the gacha tab shows the rates from the data', async ({ page }) => {
    await page.goto('/#gameplay-detail');
    const dialog = page.getByRole('dialog', { name: vi.gameplay.title });
    const gacha = gameplayData.gacha;
    const index = gameplayData.tabs.findIndex((tab: { key: string }) => tab.key === gacha.tab);
    await dialog.getByRole('tab').nth(index).click();
    await expect(dialog.locator('[role="tabpanel"]:not([hidden])')).toContainText(
      `5★ ${gacha.rates.fiveStar}%`,
    );
  });
});

test.describe('gameplay modal by keyboard', () => {
  test.use({ locale: 'vi-VN', viewport: { width: 1440, height: 1100 } });

  test('opens, moves the slides with the arrow keys, closes and returns focus', async ({
    page,
  }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: vi.gameplay.details });
    await button.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: vi.gameplay.title });
    await expect(dialog).toBeVisible();

    const panel = dialog.locator('[role="tabpanel"]:not([hidden])');
    const total = gameplayData.tabs[0].slides.length;
    await panel.locator('.slider-track').focus();
    await page.keyboard.press('ArrowRight');
    await expect(panel.locator('[aria-live="polite"]')).toHaveText(
      vi.gameplay.position.replace('{current}', '2').replace('{total}', String(total)),
    );
    await page.keyboard.press('ArrowLeft');
    await expect(panel.locator('[aria-live="polite"]')).toHaveText(
      vi.gameplay.position.replace('{current}', '1').replace('{total}', String(total)),
    );

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
  });
});
