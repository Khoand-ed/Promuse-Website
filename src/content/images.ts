import { existsSync } from 'node:fs';
import path from 'node:path';

export interface Slot {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Whether the owner has put the file for this slot under public/. Checked at build time. */
export function hasFile(slot: Slot): boolean {
  return existsSync(path.join(process.cwd(), 'public', slot.src));
}
