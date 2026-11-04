/** Fired on window when the opening has finished or was skipped. */
export const OPENING_DONE = 'promuse:opening-done';

/** Runs `start` once the opening is over, or at once when it is not playing. Returns a cleanup. */
export function afterOpening(start: () => void): () => void {
  if (document.documentElement.dataset.intro !== 'play') {
    start();
    return () => {};
  }
  window.addEventListener(OPENING_DONE, start, { once: true });
  return () => window.removeEventListener(OPENING_DONE, start);
}
