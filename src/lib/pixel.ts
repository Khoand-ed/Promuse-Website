export interface Size {
  width: number;
  height: number;
}

/**
 * The size at which pixel art stays crisp (doc/SPEC.md, section 11): the largest whole number of
 * device pixels per art pixel that fits the box, so every art pixel covers the same number of
 * device pixels. Art larger than the box is shrunk to fit instead, where no whole number fits.
 * `ratio` is the screen's device pixels per CSS pixel; the result is in CSS pixels.
 */
export function pixelFit(box: Size, art: Size, ratio: number): Size & { scale: number } {
  const across = (box.width * ratio) / art.width;
  const down = box.height > 0 ? (box.height * ratio) / art.height : across;
  const fit = Math.min(across, down);
  // A hair of tolerance, so 537.6 CSS px at 1.25 counts as the 672 device px it is.
  const scale = fit >= 1 ? Math.floor(fit + 1e-6) : fit;
  return { width: (art.width * scale) / ratio, height: (art.height * scale) / ratio, scale };
}
