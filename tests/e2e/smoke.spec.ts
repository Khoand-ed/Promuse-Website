import { expect, test } from './fixtures';

test.describe('a Vietnamese browser', () => {
  test.use({ locale: 'vi-VN' });

  test('gets Vietnamese at /', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/localhost:3000\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Promuse');
    await expect(page.getByText('Sắp ra mắt trên Android', { exact: true })).toBeVisible();
  });
});

test.describe('an English browser', () => {
  test.use({ locale: 'en-US' });

  test('is sent from / to /en', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('Coming soon on Android', { exact: true })).toBeVisible();
  });
});

test('pages stay out of search results until launch', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('an unknown path shows the localized not-found page', async ({ page }) => {
  const response = await page.goto('/en/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
});
