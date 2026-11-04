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

test.describe('music', () => {
  test.use({ locale: 'vi-VN' });

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
