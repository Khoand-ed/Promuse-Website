import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  descriptionAt,
  imageSlots,
  leaves,
  locate,
  markerOf,
  placeholderMismatches,
  placeholders,
  renderReport,
  type Json,
  type SchemaNode,
} from '@/content/check';
import { getCharacters, getGameplay, getSite } from '@/content/data';
import { dataFiles, textSchema } from '@/content/schemas';
import { loadMessages } from '@/content/text';

const readJson = (file: string) => JSON.parse(readFileSync(file, 'utf8')) as Json;

describe('content files', () => {
  it('both locales pass the text schema', () => {
    expect(loadMessages('vi').hero.status).toBe('Sắp ra mắt trên Android');
    expect(loadMessages('en').hero.status).toBe('Coming soon on Android');
  });

  it.each(dataFiles.map((entry) => [entry.file, entry]))('%s passes its schema', (_file, entry) => {
    expect(entry.schema.safeParse(readJson(entry.file)).success).toBe(true);
  });

  it('keeps the game facts from doc/GAME_FACTS.md', () => {
    const rarities = Object.fromEntries(
      getCharacters().items.map((item) => [item.name, item.rarity]),
    );
    expect(rarities).toEqual({ AMIYA: 5, NOVA: 4, ECHO: 4, PULSE: 3 });
    expect(getGameplay().gacha.rates).toEqual({ fiveStar: 2, fourStar: 10, threeStar: 88 });
    expect(getSite().platforms.find((platform) => platform.id === 'ios')?.status).toBe('planned');
  });

  it('uses the same ICU placeholders in both locales', () => {
    expect(
      placeholderMismatches(
        leaves(readJson('content/text/vi.json')),
        leaves(readJson('content/text/en.json')),
      ),
    ).toEqual([]);
  });
});

describe('text schema', () => {
  const valid = readJson('content/text/vi.json') as Record<string, Json>;

  it('rejects a misspelled key', () => {
    const broken = { ...valid, heroo: {} };
    const result = textSchema.safeParse(broken);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.code).toBe('unrecognized_keys');
  });

  it('rejects a blank string', () => {
    const broken = { ...valid, hero: { ...(valid.hero as Record<string, Json>), cta: '   ' } };
    expect(textSchema.safeParse(broken).success).toBe(false);
  });
});

describe('check helpers', () => {
  it('finds ICU placeholders', () => {
    expect(placeholders('Ảnh {current}/{total}')).toEqual(['current', 'total']);
    expect(placeholders('{count, plural, one {# sao} other {# sao}}')).toEqual(['count']);
    expect(placeholders('No placeholders')).toEqual([]);
  });

  it('reports placeholder differences', () => {
    const vi = leaves({ a: 'Xin chào {name}', b: 'Không đổi' });
    const en = leaves({ a: 'Hello', b: 'Unchanged' });
    expect(placeholderMismatches(vi, en)).toEqual([{ path: 'a', first: ['name'], second: [] }]);
  });

  it('reads TODO and REVIEW markers', () => {
    expect(markerOf('[TODO] Viết gì đó')).toBe('TODO');
    expect(markerOf('[REVIEW] Bản dịch')).toBe('REVIEW');
    expect(markerOf('Xong')).toBeNull();
    expect(markerOf(null)).toBeNull();
  });

  it('skips $schema when listing leaves', () => {
    expect(leaves({ $schema: 'x', a: { b: 1 }, list: [null] })).toEqual([
      { path: 'a.b', value: 1 },
      { path: 'list.0', value: null },
    ]);
  });

  it('locates repeated keys and several keys on one line', () => {
    const source = [
      '{',
      '  "items": [',
      '    { "slug": "a", "color": null },',
      '    { "slug": "b", "color": null },',
      '    { "slug": "c",',
      '      "color": null }',
      '  ]',
      '}',
    ].join('\n');
    const value = JSON.parse(source) as Json;
    const lines = locate(source, leaves(value));
    expect(lines.get('items.0.color')).toBe(3);
    expect(lines.get('items.1.color')).toBe(4);
    expect(lines.get('items.2.color')).toBe(6);
  });

  it('finds image slots with their paths', () => {
    const slot = { src: '/images/a.webp', width: 1, height: 2, alt: 'x.y' };
    expect(imageSlots({ hero: slot, list: [slot] }).map((found) => found.path)).toEqual([
      'hero',
      'list.0',
    ]);
  });

  it('reads descriptions from a generated JSON Schema', () => {
    const schema = z.toJSONSchema(
      z.object({
        items: z.array(z.object({ color: z.string().nullable().describe('Màu') })),
        names: z.record(z.string(), z.string().describe('Tên')),
      }),
      { target: 'draft-7' },
    ) as SchemaNode;
    expect(descriptionAt(schema, 'items.3.color')).toBe('Màu');
    expect(descriptionAt(schema, 'names.anything')).toBe('Tên');
  });

  it('renders an empty section as done', () => {
    expect(renderReport([])).toContain('Không còn mục nào.');
  });
});
