import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PixelImage } from '@/components/ui/PixelFit';
import { pixelFit } from '@/lib/pixel';

describe('pixelFit', () => {
  it('takes the largest whole number of device pixels per art pixel', () => {
    expect(pixelFit({ width: 400, height: 400 }, { width: 64, height: 64 }, 1)).toEqual({
      width: 384,
      height: 384,
      scale: 6,
    });
  });

  it('counts device pixels, so a 125% screen gets its own whole numbers', () => {
    // 537.6 CSS px are 672 device px at 1.25: exactly 7 per art pixel, despite rounding.
    const fit = pixelFit({ width: 537.6, height: 716.8 }, { width: 96, height: 128 }, 1.25);
    expect(fit.scale).toBe(7);
    expect(fit.width).toBeCloseTo(537.6, 6);
    expect(fit.height).toBeCloseTo(716.8, 6);
  });

  it('is limited by the height as well as the width', () => {
    expect(pixelFit({ width: 1000, height: 300 }, { width: 64, height: 64 }, 1).scale).toBe(4);
  });

  it('keeps one device pixel per art pixel where only that fits', () => {
    expect(pixelFit({ width: 50, height: 50 }, { width: 64, height: 64 }, 2)).toEqual({
      width: 32,
      height: 32,
      scale: 1,
    });
  });

  it('shrinks art larger than the box to fit', () => {
    const fit = pixelFit({ width: 20, height: 20 }, { width: 64, height: 64 }, 1);
    expect(fit.width).toBe(20);
    expect(fit.scale).toBeLessThan(1);
  });

  it('reads the width alone while the box has no height yet', () => {
    expect(pixelFit({ width: 100, height: 0 }, { width: 8, height: 8 }, 1).scale).toBe(12);
  });
});

describe('PixelImage', () => {
  it('serves the file as it is and draws it pixelated in a box of its own shape', () => {
    const html = renderToStaticMarkup(
      createElement(PixelImage, {
        src: '/images/characters/nova/idle.png',
        width: 96,
        height: 128,
        alt: 'NOVA',
      }),
    );
    expect(html).toContain('src="/images/characters/nova/idle.png"');
    expect(html).not.toContain('/_next/image');
    expect(html).toMatch(/<img[^>]+class="pixelated /);
    expect(html).toContain('class="pixel-fit ');
    expect(html).toContain('aspect-ratio:96 / 128');
  });
});
