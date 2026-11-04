import { Lexend_Exa, Noto_Serif_Display, Quicksand } from 'next/font/google';

// The closest Vietnamese-capable matches for p3re.jp's type (doc/DESIGN.md, section 4):
// its display lettering → Noto Serif Display, Urbanist → Quicksand, Syncopate → Lexend Exa.
export const displayFont = Noto_Serif_Display({
  subsets: ['latin', 'vietnamese'],
  axes: ['wdth'],
  variable: '--font-noto-serif-display',
  display: 'swap',
});

export const sansFont = Quicksand({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const labelFont = Lexend_Exa({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-lexend-exa',
  display: 'swap',
});
