/** localStorage: the visitor's effects choice, `on` or `off`. */
export const MOTION_KEY = 'promuse:motion';
/** sessionStorage: set once the opening has played in this tab. */
export const INTRO_KEY = 'promuse:intro-seen';

/** The visitor's stored choice wins; without one, follow the system's reduced-motion setting. */
export function resolveMotion(stored: string | null, prefersReduced: boolean): boolean {
  if (stored === 'on') return true;
  if (stored === 'off') return false;
  return !prefersReduced;
}

/**
 * Runs in <head> before the first paint: marks <html> with `data-motion` (on or off), so motion
 * never flashes in or out. Keep it in sync with `resolveMotion`.
 */
export const motionBootScript = `(function(){try{var d=document.documentElement,s=localStorage.getItem('${MOTION_KEY}'),r=window.matchMedia('(prefers-reduced-motion: reduce)').matches,on=s==='on'||(s!=='off'&&!r);d.dataset.motion=on?'on':'off';}catch(e){}})();`;

/**
 * Runs at the top of the home page, before the hero is parsed: marks <html> with
 * `data-intro="play"` when the opening should play (motion on, not yet seen in this tab).
 */
export const introBootScript = `(function(){try{var d=document.documentElement;if(d.dataset.motion==='on'&&!sessionStorage.getItem('${INTRO_KEY}'))d.dataset.intro='play';}catch(e){}})();`;
