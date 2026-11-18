import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// The expected words come from the content files, so editing the copy never breaks these tests.
const vi = JSON.parse(readFileSync('content/text/vi.json', 'utf8'));
const en = JSON.parse(readFileSync('content/text/en.json', 'utf8'));
const characters: { slug: string; name: string }[] = JSON.parse(
  readFileSync('content/data/characters.json', 'utf8'),
).items;
const character = (index: number) => characters[index]!;
const last = characters.length - 1;

/** The panel of the character on the sheet; the others stay in the page, hidden. */
const shown = (page: Page) => page.locator('.modal-profile .profile-panel:not([hidden])');

test.describe('character profiles by keyboard', () => {
  test.use({
    locale: 'vi-VN',
    reducedMotion: 'no-preference',
    viewport: { width: 1440, height: 900 },
  });

  test('a card reached with Tab comes to the centre and opens its profile, which works from the keyboard', async ({
    page,
  }) => {
    await page.goto('/');
    await page.keyboard.press('Escape');
    await expect(page.locator('.opening')).toBeHidden();
    const section = page.locator('#characters');
    await expect(section).toHaveAttribute('data-scene', 'on');

    // The section takes focus first (it scrolls the plain row with the arrows), then each card.
    await section.focus();
    for (let i = 0; i <= 2; i++) await page.keyboard.press('Tab');
    const card = section.getByRole('button', { name: character(2).name });
    await expect(card).toBeFocused();
    // Navy, not the default blue, which has too little contrast on the character colours.
    await expect(card).toHaveCSS('outline-color', 'rgb(29, 56, 74)');
    // The pinned row has moved the card to the middle of the window.
    await expect
      .poll(async () => {
        const box = await card.boundingBox();
        return box ? Math.abs(box.x + box.width / 2 - 720) : Infinity;
      })
      .toBeLessThan(30);

    await page.keyboard.press('Enter');
    const profile = page.getByRole('dialog', { name: character(2).name });
    await expect(profile).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`#char-${character(2).slug}$`));

    const change = shown(page).getByRole('button', { name: vi.characters.changeVisual });
    await change.focus();
    await page.keyboard.press('Enter');
    await expect(change).toHaveAttribute('aria-pressed', 'true');

    // → moves on, focus follows, and the next character starts on its idle visual.
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('dialog', { name: character(3).name })).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`#char-${character(3).slug}$`));
    const nextChange = shown(page).getByRole('button', { name: vi.characters.changeVisual });
    await expect(nextChange).toBeFocused();
    await expect(nextChange).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('.profile [aria-live="polite"]')).toHaveText(
      vi.characters.position
        .replace('{current}', '4')
        .replace('{total}', String(characters.length))
        .replace('{name}', character(3).name),
    );

    // The last character leads round to the first, and ← goes back.
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('dialog', { name: character(0).name })).toBeVisible();
    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(new RegExp(`#char-${character(last).slug}$`));

    // Holding a key moves one step, not one per repeat.
    for (let i = 0; i < 6; i++) await page.keyboard.down('ArrowLeft');
    await page.keyboard.up('ArrowLeft');
    await expect(page.getByRole('dialog', { name: character(last - 1).name })).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`#char-${character(last - 1).slug}$`));

    await page.keyboard.press('Escape');
    await expect(page.locator('.modal-profile')).toBeHidden();
    await expect(page).not.toHaveURL(/#char-/);
    await expect(card).toBeFocused();
  });

  test('focus handed back by a closing profile leaves the page where it was', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Escape');
    await expect(page.locator('.opening')).toBeHidden();
    const section = page.locator('#characters');
    await expect(section).toHaveAttribute('data-scene', 'on');
    await section.evaluate((element) =>
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY,
        behavior: 'instant',
      }),
    );
    // The first card is only partly in view at the start of the pinned row.
    await section.getByRole('button', { name: character(0).name }).click();
    await expect(page.getByRole('dialog', { name: character(0).name })).toBeVisible();
    const before = await page.evaluate(() => window.scrollY);
    await page.keyboard.press('Escape');
    await expect(page.locator('.modal-profile')).toBeHidden();
    await page.waitForTimeout(300);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(2);
  });
});

test.describe('character profiles with the mouse', () => {
  test.use({ locale: 'vi-VN', viewport: { width: 1440, height: 900 } });

  test('a card opens its profile; Change visual, previous, next and close work', async ({
    page,
  }) => {
    await page.goto('/');
    const card = page.locator('#characters').getByRole('button', { name: character(1).name });
    await card.click();
    await expect(page.getByRole('dialog', { name: character(1).name })).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`#char-${character(1).slug}$`));

    // With motion off the visuals swap at once.
    const poses = shown(page).locator('.profile-pose');
    await expect(poses.nth(0)).toHaveCSS('opacity', '1');
    await expect(poses.nth(1)).toHaveCSS('opacity', '0');
    await shown(page).getByRole('button', { name: vi.characters.changeVisual }).click();
    await expect(poses.nth(0)).toHaveCSS('opacity', '0');
    await expect(poses.nth(1)).toHaveCSS('opacity', '1');
    await expect(poses.nth(0)).toHaveAttribute('aria-hidden', 'true');

    const dialog = page.locator('.modal-profile');
    await dialog.getByRole('button', { name: vi.characters.next }).click();
    await expect(page.getByRole('dialog', { name: character(2).name })).toBeVisible();
    await dialog.getByRole('button', { name: vi.characters.previous }).click();
    await expect(page.getByRole('dialog', { name: character(1).name })).toBeVisible();
    await expect(shown(page).locator('.profile-pose').nth(0)).toHaveCSS('opacity', '1');

    await dialog.getByRole('button', { name: vi.common.close }).click();
    await expect(dialog).toBeHidden();
    await expect(page).not.toHaveURL(/#char-/);
    await expect(card).toBeFocused();
  });

  test('with motion off everything shows at once', async ({ page }) => {
    await page.goto(`/#char-${character(0).slug}`);
    await expect(page.getByRole('dialog', { name: character(0).name })).toBeVisible();
    for (const part of await shown(page).locator('[data-fade]').all()) {
      await expect(part).toHaveCSS('opacity', '1', { timeout: 300 });
    }
  });

  test('Vietnamese writes the bonuses with a decimal comma', async ({ page }) => {
    await page.goto(`/#char-${character(0).slug}`);
    await expect(shown(page).locator('.profile-stats')).toContainText('×1,2');
  });

  test('a profile opened again through Forward starts on the idle visual', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.history.state?.__NA === true);
    await page
      .locator('#characters')
      .getByRole('button', { name: character(1).name })
      .click();
    const change = shown(page).getByRole('button', { name: vi.characters.changeVisual });
    await change.click();
    await expect(change).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Escape');
    await expect(page.locator('.modal-profile')).toBeHidden();
    await page.goForward();
    await expect(page.getByRole('dialog', { name: character(1).name })).toBeVisible();
    await expect(
      shown(page).getByRole('button', { name: vi.characters.changeVisual }),
    ).toHaveAttribute('aria-pressed', 'false');
  });
});

test.describe('profile deep links', () => {
  test.use({ locale: 'en-US' });

  test('/en#char-nova opens NOVA in English', async ({ page }) => {
    const nova = characters.find((item) => item.slug === 'nova')!;
    await page.goto('/en#char-nova');
    await expect(page.getByRole('dialog', { name: nova.name })).toBeVisible();
    await expect(shown(page)).toContainText(en.characters.items.nova.passiveDescription);
    await expect(shown(page).locator('.profile-stats')).toContainText('×1.1');
    await expect(
      shown(page).getByRole('button', { name: en.characters.changeVisual }),
    ).toBeVisible();
  });

  test('moving between characters keeps one history entry, so Back closes the profile', async ({
    page,
  }) => {
    await page.goto('/en');
    // Wait until Next.js has written its own history entry (see details.spec.ts).
    await page.waitForFunction(() => window.history.state?.__NA === true);
    await page
      .locator('#characters')
      .getByRole('button', { name: character(0).name })
      .click();
    await expect(page).toHaveURL(new RegExp(`/en#char-${character(0).slug}$`));
    const next = page.locator('.modal-profile').getByRole('button', { name: en.characters.next });
    await next.click();
    await next.click();
    await expect(page).toHaveURL(new RegExp(`/en#char-${character(2).slug}$`));
    await page.goBack();
    await expect(page.locator('.modal-profile')).toBeHidden();
    await expect(page).toHaveURL(/\/en$/);
  });
});

test.describe('profile and the first-visit popup', () => {
  test.use({ locale: 'vi-VN', rewardPopup: true });

  test('the popup waits until a profile opened from a link closes', async ({ page }) => {
    await page.goto(`/?mock=signed-out#char-${character(0).slug}`);
    const profile = page.getByRole('dialog', { name: character(0).name });
    await expect(profile).toBeVisible();
    const popup = page.getByRole('dialog', { name: vi.reward.title });
    await page.waitForTimeout(2500);
    await expect(popup).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(profile).toBeHidden();
    await expect(popup).toBeVisible({ timeout: 6000 });
  });
});

test.describe('profile on a phone', () => {
  test.use({ locale: 'vi-VN', viewport: { width: 360, height: 780 }, hasTouch: true });

  test('fits the width, starts the text under the visual, and its controls are easy to tap', async ({
    page,
  }) => {
    await page.goto(`/#char-${character(2).slug}`);
    const profile = page.getByRole('dialog', { name: character(2).name });
    await expect(profile).toBeVisible();
    const overflow = await page
      .locator('.modal-profile')
      .evaluate((dialog) => dialog.scrollWidth - dialog.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    const visual = await shown(page).locator('.profile-visual').boundingBox();
    const name = await shown(page).locator('.profile-name').boundingBox();
    expect(name?.y ?? 0).toBeGreaterThanOrEqual((visual?.y ?? 0) + (visual?.height ?? 0));

    for (const label of [
      vi.characters.changeVisual,
      vi.characters.previous,
      vi.characters.next,
      vi.common.close,
    ]) {
      const box = await profile.getByRole('button', { name: label }).boundingBox();
      expect(box?.width ?? 0, label).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0, label).toBeGreaterThanOrEqual(44);
    }
  });

  test('the arrows stay at the foot of the screen, and the next character starts at the top', async ({
    page,
  }) => {
    await page.goto(`/#char-${character(0).slug}`);
    await expect(page.getByRole('dialog', { name: character(0).name })).toBeVisible();
    const dialog = page.locator('.modal-profile');
    const next = dialog.getByRole('button', { name: vi.characters.next });
    for (const top of [0, 400]) {
      await dialog.evaluate((element, y) => element.scrollTo({ top: y }), top);
      const box = await next.boundingBox();
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(780);
      expect(box?.y ?? 0).toBeGreaterThan(780 - 120);
    }
    await next.click();
    await expect(page.getByRole('dialog', { name: character(1).name })).toBeVisible();
    await expect.poll(() => dialog.evaluate((element) => element.scrollTop)).toBe(0);

    // Opened again after closing (here by a link to it), a profile starts at the top too.
    await dialog.evaluate((element) => element.scrollTo({ top: 400 }));
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await page.evaluate((slug) => {
      window.location.hash = `char-${slug}`;
    }, character(1).slug);
    await expect(page.getByRole('dialog', { name: character(1).name })).toBeVisible();
    await expect.poll(() => dialog.evaluate((element) => element.scrollTop)).toBe(0);
  });
});

// The owner's art does not exist yet: /dev/pixel draws a test sprite through the same PixelFit.
for (const scale of [1, 1.25, 2]) {
  test.describe(`pixel art at ${scale}×`, () => {
    test.use({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: scale });

    test('each art pixel covers a whole number of device pixels', async ({ page }) => {
      await page.goto('/dev/pixel');
      await expect(page.locator('[data-scale="whole"]')).toHaveCount(4);
      const images = await page.locator('[data-box] img').evaluateAll((list) =>
        list.map((image) => ({
          devicePixels: image.getBoundingClientRect().width * window.devicePixelRatio,
          rendering: getComputedStyle(image).imageRendering,
        })),
      );
      expect(images).toHaveLength(4);
      for (const { devicePixels, rendering } of images) {
        expect(rendering).toBe('pixelated');
        const perArtPixel = devicePixels / 8;
        expect(Math.round(perArtPixel)).toBeGreaterThanOrEqual(1);
        expect(Math.abs(perArtPixel - Math.round(perArtPixel))).toBeLessThan(0.01);
      }
    });
  });
}
