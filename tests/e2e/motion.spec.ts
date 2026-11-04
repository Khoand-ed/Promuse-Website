import { expect, test } from '@playwright/test';

test.describe('effects toggle', () => {
  test.use({ locale: 'vi-VN', reducedMotion: 'reduce' });

  test('follows the system setting and remembers the visitor choice', async ({ page }) => {
    await page.goto('/dev/motion');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-motion', 'off');
    const toggle = page.getByRole('button', { name: 'Hiệu ứng' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();
    await expect(html).toHaveAttribute('data-motion', 'on');
    await expect(html).toHaveClass(/lenis/);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  });
});

test.describe('opening', () => {
  test.use({ locale: 'vi-VN', reducedMotion: 'no-preference' });

  test('plays once per tab and skips with its button', async ({ page }) => {
    await page.goto('/');
    const opening = page.getByRole('dialog', { name: /\[TODO\]/ });
    await expect(opening).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-intro', 'play');

    await page.getByRole('button', { name: 'Bỏ qua' }).click();
    await expect(opening).toBeHidden();
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'play');
    await expect(page.locator('h1')).toBeVisible();

    await page.reload();
    await expect(page.locator('.opening')).toBeHidden();
  });

  test('skips with any key', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.opening')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.opening')).toBeHidden({ timeout: 2000 });
  });

  test('ends on its own in about three seconds', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.opening')).toBeVisible();
    await expect(page.locator('.opening')).toBeHidden({ timeout: 5000 });
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'play');
  });

  test('stays off the other pages', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
    await expect(page.locator('html')).not.toHaveAttribute('data-intro', 'play');
  });
});

test.describe('opening with reduced motion', () => {
  test.use({ locale: 'vi-VN' });

  test('never plays', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
    await expect(page.locator('.opening')).toBeHidden();
  });
});

test.describe('music', () => {
  test.use({ locale: 'vi-VN', reducedMotion: 'no-preference' });

  test('the button stays hidden until the music file exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Nhạc nền' })).toHaveCount(0);
  });

  test('plays, spins its note and stops (development click track)', async ({ page }) => {
    await page.goto('/dev/motion');
    const music = page.getByRole('button', { name: 'Nhạc nền' });
    await expect(music).toHaveAttribute('aria-pressed', 'false');
    const playState = () =>
      page.locator('.music-note').evaluate((note) => getComputedStyle(note).animationPlayState);
    expect(await playState()).toBe('paused');

    await music.click();
    await expect(music).toHaveAttribute('aria-pressed', 'true');
    expect(await playState()).toBe('running');

    await music.click();
    await expect(music).toHaveAttribute('aria-pressed', 'false');
    expect(await playState()).toBe('paused');
  });
});
