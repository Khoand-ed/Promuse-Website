import { existsSync } from 'node:fs';
import path from 'node:path';

export interface Slot {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Whether a file exists under public/, for a path such as /audio/theme.mp3. Checked at build time. */
export function hasPublicFile(src: string): boolean {
  return existsSync(path.join(process.cwd(), 'public', src));
}

/** Whether the owner has put the file for this slot under public/. Checked at build time. */
export function hasFile(slot: Slot): boolean {
  return hasPublicFile(slot.src);
}
