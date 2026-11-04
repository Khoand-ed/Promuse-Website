import { z } from 'zod';
import en from '../../content/text/en.json';
import vi from '../../content/text/vi.json';
import type { Locale } from './schemas/index.ts';
import { textSchema, type TextContent } from './schemas/text.ts';

export type Messages = Omit<TextContent, '$schema'>;

const sources: Record<Locale, unknown> = { vi, en };
const cache = new Map<Locale, Messages>();

/** Messages for next-intl, validated against the text schema. Invalid content stops the build. */
export function loadMessages(locale: Locale): Messages {
  const cached = cache.get(locale);
  if (cached) return cached;
  const result = textSchema.safeParse(sources[locale]);
  if (!result.success) {
    throw new Error(
      `content/text/${locale}.json is invalid. Run "npm run check:content" for details.\n${z.prettifyError(result.error)}`,
    );
  }
  // `$schema` only points VS Code at the editor hints; next-intl does not need it.
  const messages: Messages & { $schema?: string } = { ...result.data };
  delete messages.$schema;
  cache.set(locale, messages);
  return messages;
}
