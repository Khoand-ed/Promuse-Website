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

test.describe('character scene', () => {
  test.use({
    locale: 'vi-VN',
    reducedMotion: 'no-preference',
    viewport: { width: 1440, height: 900 },
  });

  test('pins the row and colours the card in focus', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Escape');
    await expect(page.locator('.opening')).toBeHidden();
    const section = page.locator('#characters');
    await expect(section).toHaveAttribute('data-scene', 'on');

    await section.scrollIntoViewIfNeeded();
    await page.mouse.move(720, 450);
    for (let i = 0; i < 12; i++) await page.mouse.wheel(0, 150);
    await expect(page.locator('#characters .chara-card[data-active]')).toHaveCount(1);
    await expect(page.locator('#characters [data-layer][data-on]')).toHaveCount(1);
    const box = await section.boundingBox();
    expect(Math.abs(box?.y ?? 99)).toBeLessThan(1);
  });
});

test.describe('character row with reduced motion', () => {
  test.use({ locale: 'vi-VN' });

  test('stays a plain row with each card in its own colour', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#characters');
    await expect(section).not.toHaveAttribute('data-scene', 'on');
    await expect(section.locator('[data-layer][data-on]')).toHaveCount(0);
    await expect(section.locator('.chara-tint[data-on]')).toHaveCount(4);
  });
});
