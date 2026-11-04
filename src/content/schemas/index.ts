import type { z } from 'zod';
import {
  charactersSchema,
  featuresSchema,
  gameplaySchema,
  heroSchema,
  rewardSchema,
  siteSchema,
  storySchema,
} from './data.ts';
import { textSchema } from './text.ts';

export { textSchema } from './text.ts';
export * from './data.ts';

export const locales = ['vi', 'en'] as const;
export type Locale = (typeof locales)[number];

export const textFiles: ReadonlyArray<{ locale: Locale; file: string }> = [
  { locale: 'vi', file: 'content/text/vi.json' },
  { locale: 'en', file: 'content/text/en.json' },
];

/** Every data file, its schema, and where its content shows on the page (for the TODO report). */
export const dataFiles: ReadonlyArray<{
  name: string;
  file: string;
  schema: z.ZodType;
  where: string;
}> = [
  {
    name: 'site',
    file: 'content/data/site.json',
    schema: siteSchema,
    where: 'Toàn trang (header, footer, chia sẻ)',
  },
  {
    name: 'hero',
    file: 'content/data/hero.json',
    schema: heroSchema,
    where: 'Hero (màn đầu tiên)',
  },
  {
    name: 'reward',
    file: 'content/data/reward.json',
    schema: rewardSchema,
    where: 'Khối nhận quà',
  },
  { name: 'story', file: 'content/data/story.json', schema: storySchema, where: 'Giới thiệu' },
  {
    name: 'features',
    file: 'content/data/features.json',
    schema: featuresSchema,
    where: 'Tính năng',
  },
  {
    name: 'gameplay',
    file: 'content/data/gameplay.json',
    schema: gameplaySchema,
    where: 'Gameplay',
  },
  {
    name: 'characters',
    file: 'content/data/characters.json',
    schema: charactersSchema,
    where: 'Nhân vật',
  },
];

/** Schemas written to content/schemas/<name>.schema.json for editor hints. */
export const generatedSchemas: ReadonlyArray<{ name: string; schema: z.ZodType }> = [
  { name: 'text', schema: textSchema },
  ...dataFiles.map(({ name, schema }) => ({ name, schema })),
];
