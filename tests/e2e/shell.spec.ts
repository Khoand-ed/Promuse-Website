import { expect, test } from './fixtures';

test.use({ locale: 'en-US' });

test.describe('on a desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('header links scroll to their sections', async ({ page }) => {
    await page.goto('/en');
    const nav = page.getByRole('navigation', { name: 'Main navigation' }).first();
    await nav.getByRole('link', { name: 'Features' }).click();
    await expect(page).toHaveURL(/\/en#features$/);
    await expect(page.locator('#features-title')).toBeInViewport();
  });

  test('the footer links to the privacy page', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' }).click();
    await expect(page).toHaveURL(/\/en\/privacy$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy');
  });
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test('the page never scrolls sideways', async ({ page }) => {
    await page.goto('/en');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });

  test('the menu opens, closes with Esc and returns focus', async ({ page }) => {
    await page.goto('/en');
    const opener = page.getByRole('button', { name: 'Open menu' });
    await opener.click();
    const menu = page.getByRole('dialog', { name: 'Main navigation' });
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test('a menu link closes the menu and lands on its section', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Characters' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page).toHaveURL(/\/en#characters$/);
    await expect(page.locator('#characters-title')).toBeInViewport();
  });

  test('switching language keeps the section in view', async ({ page }) => {
    await page.goto('/en');
    await page.locator('#gameplay').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Tiếng Việt' }).click();
    await expect(page).toHaveURL(/localhost:3000\/#gameplay$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
    await expect(page.locator('#gameplay-title')).toBeInViewport();
  });
});
