// npm run check:content: validates content/, compares the two locales, regenerates content/schemas/
// and writes CONTENT_TODO.md (doc/ARCHITECTURE.md, section 16). Node 24 runs it as TypeScript directly.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import {
  descriptionAt,
  imageSlots,
  leaves,
  locate,
  markerOf,
  placeholderMismatches,
  renderReport,
  textBlocks,
  type Json,
  type Leaf,
  type SchemaNode,
  type TodoEntry,
} from '../src/content/check.ts';
import {
  dataFiles,
  generatedSchemas,
  textFiles,
  textSchema,
} from '../src/content/schemas/index.ts';

const root = process.cwd();
const errors: string[] = [];

// 1. JSON Schemas, so VS Code explains every field and underlines mistakes.
const jsonSchemas = new Map<string, SchemaNode>();
mkdirSync(path.join(root, 'content/schemas'), { recursive: true });
for (const { name, schema } of generatedSchemas) {
  const json = z.toJSONSchema(schema, { target: 'draft-7' });
  jsonSchemas.set(name, json as SchemaNode);
  writeFileSync(
    path.join(root, `content/schemas/${name}.schema.json`),
    `${JSON.stringify(json, null, 2)}\n`,
  );
}

// 2. Read and validate every file.
interface Loaded {
  file: string;
  source: string;
  value: Json;
}

function read(file: string): Loaded | null {
  const full = path.join(root, file);
  if (!existsSync(full)) {
    errors.push(`${file}: không tìm thấy file.`);
    return null;
  }
  const source = readFileSync(full, 'utf8');
  try {
    return { file, source, value: JSON.parse(source) as Json };
  } catch (error) {
    errors.push(
      `${file}: lỗi cú pháp JSON (${(error as Error).message}). Kiểm tra dấu phẩy, dấu ngoặc kép và dấu ngoặc nhọn quanh chỗ đó.`,
    );
    return null;
  }
}

function explain(issue: z.core.$ZodIssue): string {
  if (issue.code === 'unrecognized_keys') {
    return `khoá lạ ${issue.keys.map((key) => `"${key}"`).join(', ')}. Kiểm tra lỗi gõ tên khoá.`;
  }
  if (issue.code === 'invalid_type') return `thiếu hoặc sai kiểu dữ liệu (cần ${issue.expected}).`;
  return issue.message;
}

function validate<T extends z.ZodType>(loaded: Loaded, schema: T): z.infer<T> | null {
  const result = schema.safeParse(loaded.value);
  if (result.success) return result.data;
  for (const issue of result.error.issues) {
    errors.push(`${loaded.file} › ${issue.path.join('.') || '(cả file)'}: ${explain(issue)}`);
  }
  return null;
}

const texts = new Map<string, Loaded & { leaves: Leaf[] }>();
for (const { locale, file } of textFiles) {
  const loaded = read(file);
  if (loaded && validate(loaded, textSchema))
    texts.set(locale, { ...loaded, leaves: leaves(loaded.value) });
}

const data = new Map<string, Loaded & { where: string; parsed: unknown }>();
for (const { name, file, schema, where } of dataFiles) {
  const loaded = read(file);
  const parsed = loaded ? validate(loaded, schema) : null;
  if (loaded && parsed) data.set(name, { ...loaded, where, parsed });
}

// 3. Cross-file rules.
const vi = texts.get('vi');
const en = texts.get('en');
const show = (names: string[]) =>
  names.length ? names.map((name) => `{${name}}`).join(' ') : 'không có';

if (vi && en) {
  for (const mismatch of placeholderMismatches(vi.leaves, en.leaves)) {
    errors.push(
      `${mismatch.path}: biến trong {…} khác nhau giữa hai ngôn ngữ (vi: ${show(mismatch.first)}; en: ${show(mismatch.second)}).`,
    );
  }
}

for (const entry of data.values()) {
  for (const slot of imageSlots(entry.value)) {
    for (const text of [vi, en]) {
      if (text && !text.leaves.some((leaf) => leaf.path === slot.alt)) {
        errors.push(
          `${entry.file} › ${slot.path}.alt: khoá "${slot.alt}" không có trong ${text.file}.`,
        );
      }
    }
  }
}

const characters = data.get('characters')?.parsed as { items: Array<{ slug: string }> } | undefined;
if (characters && vi) {
  const slugs = characters.items.map((item) => item.slug);
  const textSlugs = new Set(
    vi.leaves
      .filter((leaf) => leaf.path.startsWith('characters.items.'))
      .map((leaf) => leaf.path.split('.')[2] ?? ''),
  );
  if (new Set(slugs).size !== slugs.length)
    errors.push('content/data/characters.json: có slug bị trùng.');
  for (const slug of slugs) {
    if (!textSlugs.has(slug))
      errors.push(
        `characters.items.${slug}: thiếu nội dung trong content/text cho nhân vật "${slug}".`,
      );
  }
  for (const slug of textSlugs) {
    if (!slugs.includes(slug))
      errors.push(
        `characters.items.${slug}: content/text có nhân vật "${slug}" nhưng content/data/characters.json không có.`,
      );
  }
}

const features = data.get('features')?.parsed as { items: Array<{ key: string }> } | undefined;
if (features && new Set(features.items.map((item) => item.key)).size !== features.items.length) {
  errors.push('content/data/features.json: mỗi khoá f1–f4 chỉ được dùng một lần.');
}

const gameplay = data.get('gameplay')?.parsed as { tabs: Array<{ key: string }> } | undefined;
if (gameplay && new Set(gameplay.tabs.map((tab) => tab.key)).size !== gameplay.tabs.length) {
  errors.push('content/data/gameplay.json: mỗi khoá g1–g4 chỉ được dùng một lần.');
}

if (errors.length > 0) {
  console.error(`check:content: ${errors.length} lỗi cần sửa trước khi build:\n`);
  for (const error of errors) console.error(`  - ${error}`);
  console.error('\nCONTENT_TODO.md chưa được cập nhật. Hướng dẫn sửa lỗi: doc/CONTENT_GUIDE.md.');
  process.exit(1);
}

// 4. Everything still missing.
const entries: TodoEntry[] = [];

/** "items.0.themeColor" → "items[amiya].themeColor", using the element's slug or key. */
function friendly(value: Json, dotted: string): string {
  let node: Json = value;
  let out = '';
  for (const segment of dotted.split('.')) {
    if (Array.isArray(node) && /^\d+$/.test(segment)) {
      const element: Json = node[Number(segment)] ?? null;
      const label =
        element && typeof element === 'object' && !Array.isArray(element)
          ? (element.slug ?? element.key ?? segment)
          : segment;
      out += `[${String(label)}]`;
      node = element;
    } else {
      out += out ? `.${segment}` : segment;
      node =
        node && typeof node === 'object' && !Array.isArray(node) ? (node[segment] ?? null) : null;
    }
  }
  return out;
}

if (vi && en) {
  const textSchemaJson = jsonSchemas.get('text') ?? {};
  const lines = { vi: locate(vi.source, vi.leaves), en: locate(en.source, en.leaves) };
  const english = new Map(en.leaves.map((leaf) => [leaf.path, leaf.value]));
  for (const leaf of vi.leaves) {
    const englishValue = english.get(leaf.path) ?? null;
    const markers = [markerOf(leaf.value), markerOf(englishValue)];
    if (!markers[0] && !markers[1]) continue;
    const kind = markers.includes('TODO') ? 'text' : 'review';
    const locations: string[] = [];
    if (markers[0]) locations.push(`${vi.file}:${lines.vi.get(leaf.path) ?? '?'}`);
    if (markers[1]) locations.push(`${en.file}:${lines.en.get(leaf.path) ?? '?'}`);
    entries.push({
      kind,
      key: leaf.path,
      where: textBlocks[leaf.path.split('.')[0] ?? ''] ?? '',
      need:
        kind === 'review'
          ? String(markers[0] ? leaf.value : englishValue)
          : (descriptionAt(textSchemaJson, leaf.path) ?? ''),
      locations,
    });
  }
}

for (const [name, entry] of data) {
  const all = leaves(entry.value);
  const lines = locate(entry.source, all);
  for (const leaf of all) {
    if (leaf.value !== null) continue;
    entries.push({
      kind: 'data',
      key: `${name}.${friendly(entry.value, leaf.path)}`,
      where: entry.where,
      need: descriptionAt(jsonSchemas.get(name) ?? {}, leaf.path) ?? '',
      locations: [`${entry.file}:${lines.get(leaf.path) ?? '?'}`],
    });
  }
  for (const slot of imageSlots(entry.value)) {
    if (existsSync(path.join(root, 'public', slot.src))) continue;
    const extension = path.extname(slot.src).slice(1).toUpperCase();
    entries.push({
      kind: 'image',
      key: `${name}.${friendly(entry.value, slot.path)}`,
      where: entry.where,
      need: `${slot.width} × ${slot.height} px, ${extension}`,
      locations: [`public${slot.src}`],
    });
  }
}

const conventionFiles = [
  {
    file: 'src/app/[locale]/opengraph-image.png',
    where: 'Ảnh hiện khi chia sẻ link',
    need: '1200 × 630 px, PNG hoặc JPG',
  },
  { file: 'src/app/icon.png', where: 'Biểu tượng trên tab trình duyệt', need: '512 × 512 px, PNG' },
];
const site = data.get('site')?.parsed as { music?: { src?: string } } | undefined;
const musicSrc = site?.music?.src;
if (musicSrc && !existsSync(path.join(root, 'public', musicSrc))) {
  conventionFiles.push({
    file: `public${musicSrc}`,
    where: 'Nhạc nền (nút tròn ở góc trên bên trái chỉ hiện khi có file)',
    need: 'MP3 nhạc của Promuse, có quyền phát công khai; sửa bpm và firstBeat trong content/data/site.json cho đúng bài',
  });
}
const hero = data.get('hero')?.parsed as { video?: Record<string, string> } | undefined;
for (const [key, src] of Object.entries(hero?.video ?? {})) {
  if (src && !existsSync(path.join(root, 'public', src))) {
    conventionFiles.push({
      file: `public${src}`,
      where: `Video hero (${key === 'intro' ? 'mở đầu' : 'lặp'}), khai báo trong content/data/hero.json`,
      need: 'MP4 16:9 không tiếng; hoặc để trống đường dẫn nếu không dùng video',
    });
  }
}
for (const { file, where, need } of conventionFiles) {
  if (!existsSync(path.join(root, file))) {
    entries.push({ kind: 'file', key: path.basename(file), where, need, locations: [file] });
  }
}

writeFileSync(path.join(root, 'CONTENT_TODO.md'), renderReport(entries));

const count = (kind: TodoEntry['kind']) => entries.filter((entry) => entry.kind === kind).length;
console.log(
  `check:content: nội dung hợp lệ. Còn ${entries.length} mục: ${count('text')} chữ cần viết, ${count('review')} chữ cần duyệt, ${count('data')} dữ liệu chưa quyết, ${count('image')} ảnh, ${count('file')} file đặc biệt. Chi tiết: CONTENT_TODO.md`,
);
