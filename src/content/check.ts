// Pure helpers behind `npm run check:content` (scripts/check-content.mts). No file system access here,
// so the rules can be unit tested.

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export interface Leaf {
  path: string;
  value: Json;
}

/** Every scalar in a JSON document with its dotted path, in document order. `$schema` is skipped. */
export function leaves(value: Json, prefix = ''): Leaf[] {
  if (value !== null && typeof value === 'object') {
    const entries: Array<[string, Json]> = Array.isArray(value)
      ? value.map((child, index) => [String(index), child])
      : Object.entries(value);
    return entries.flatMap(([key, child]) =>
      key === '$schema' ? [] : leaves(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [{ path: prefix, value }];
}

export type Marker = 'TODO' | 'REVIEW';

export function markerOf(value: Json): Marker | null {
  if (typeof value !== 'string') return null;
  const match = /\[(TODO|REVIEW)\]/.exec(value);
  return match ? (match[1] as Marker) : null;
}

const PLACEHOLDER = /\{\s*([A-Za-z0-9_]+)\s*[,}]/g;

/** ICU argument names used in a message, sorted: "Hi {name}" → ["name"]. */
export function placeholders(message: string): string[] {
  return [...new Set([...message.matchAll(PLACEHOLDER)].map((match) => match[1] ?? ''))].sort();
}

export interface PlaceholderMismatch {
  path: string;
  first: string[];
  second: string[];
}

/** Keys whose ICU arguments differ between two locales. Both inputs come from the same schema. */
export function placeholderMismatches(first: Leaf[], second: Leaf[]): PlaceholderMismatch[] {
  const other = new Map(second.map((leaf) => [leaf.path, leaf.value]));
  const mismatches: PlaceholderMismatch[] = [];
  for (const { path, value } of first) {
    const counterpart = other.get(path);
    if (typeof value !== 'string' || typeof counterpart !== 'string') continue;
    const a = placeholders(value);
    const b = placeholders(counterpart);
    if (a.join(',') !== b.join(',')) mismatches.push({ path, first: a, second: b });
  }
  return mismatches;
}

/**
 * Line numbers (1-based) of each leaf in a JSON source. Leaves come in document order, so the search
 * moves forward from the previous match (line and column), which also tells repeated keys apart and
 * finds several keys written on one line.
 */
export function locate(source: string, items: Leaf[]): Map<string, number> {
  const lines = source.split(/\r?\n/);
  const found = new Map<string, number>();
  let line = 0;
  let column = 0;
  for (const { path, value } of items) {
    const key = path.split('.').at(-1) ?? path;
    const needle = /^\d+$/.test(key)
      ? JSON.stringify(value)
      : `${JSON.stringify(key)}: ${JSON.stringify(value)}`;
    for (let index = line; index < lines.length; index++) {
      const at = (lines[index] ?? '').indexOf(needle, index === line ? column : 0);
      if (at !== -1) {
        found.set(path, index + 1);
        line = index;
        column = at + needle.length;
        break;
      }
    }
  }
  return found;
}

export interface SchemaNode {
  description?: string;
  properties?: Record<string, SchemaNode>;
  additionalProperties?: SchemaNode | boolean;
  items?: SchemaNode | SchemaNode[];
  anyOf?: SchemaNode[];
}

function childOf(node: SchemaNode, segment: string): SchemaNode | undefined {
  const target =
    node.anyOf?.find(
      (option) =>
        option.properties || option.items || typeof option.additionalProperties === 'object',
    ) ?? node;
  if (target.properties && segment in target.properties) return target.properties[segment];
  if (/^\d+$/.test(segment) && target.items) {
    return Array.isArray(target.items) ? target.items[Number(segment)] : target.items;
  }
  if (typeof target.additionalProperties === 'object') return target.additionalProperties;
  return undefined;
}

/** The description the JSON Schema gives the field at a dotted path, if any. */
export function descriptionAt(schema: SchemaNode, path: string): string | undefined {
  let node: SchemaNode | undefined = schema;
  for (const segment of path.split('.')) {
    if (!node) return undefined;
    node = childOf(node, segment);
  }
  if (!node) return undefined;
  return node.description ?? node.anyOf?.find((option) => option.description)?.description;
}

export interface ImageSlotRef {
  path: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

function isSlot(value: Json): value is { src: string; width: number; height: number; alt: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof value.src === 'string' &&
    typeof value.width === 'number' &&
    typeof value.height === 'number' &&
    typeof value.alt === 'string'
  );
}

/** Every image slot in a data document, with its dotted path. */
export function imageSlots(value: Json, prefix = ''): ImageSlotRef[] {
  if (isSlot(value)) {
    return [
      { path: prefix, src: value.src, width: value.width, height: value.height, alt: value.alt },
    ];
  }
  if (value !== null && typeof value === 'object') {
    const entries: Array<[string, Json]> = Array.isArray(value)
      ? value.map((child, index) => [String(index), child])
      : Object.entries(value);
    return entries.flatMap(([key, child]) => imageSlots(child, prefix ? `${prefix}.${key}` : key));
  }
  return [];
}

/** Where a text key shows on the page, by its first segment. */
export const textBlocks: Record<string, string> = {
  meta: 'Tab trình duyệt, kết quả tìm kiếm',
  common: 'Nhiều nơi trên trang',
  nav: 'Thanh điều hướng',
  intro: 'Màn mở đầu',
  hero: 'Hero (màn đầu tiên)',
  reward: 'Khối nhận quà',
  story: 'Giới thiệu',
  features: 'Tính năng',
  gameplay: 'Gameplay',
  characters: 'Nhân vật',
  footer: 'Footer',
  privacy: 'Trang quyền riêng tư',
  notFound: 'Trang 404',
};

const blockOrder = Object.keys(textBlocks);

export type TodoKind = 'text' | 'review' | 'data' | 'image' | 'file';

export interface TodoEntry {
  kind: TodoKind;
  key: string;
  where: string;
  need: string;
  locations: string[];
}

function cell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

/** Groups entries by page block; inside a block they keep file order, so the list reads top to bottom. */
function sortEntries(entries: TodoEntry[]): TodoEntry[] {
  const rank = (entry: TodoEntry) => {
    const index = blockOrder.indexOf(entry.key.split('.')[0] ?? '');
    return index === -1 ? blockOrder.length : index;
  };
  return [...entries].sort((a, b) => rank(a) - rank(b));
}

const sections: Array<{ kind: TodoKind; title: string; how: string; columns: [string, string] }> = [
  {
    kind: 'text',
    title: 'Chữ cần viết',
    how: 'Mở file ở cột "Ở đâu", tới đúng dòng, thay cả đoạn `[TODO] …` bằng nội dung thật. Sửa ở cả hai file (tiếng Việt và tiếng Anh), giữ nguyên dấu ngoặc kép và các biến trong `{…}`.',
    columns: ['Khoá', 'Cần viết gì'],
  },
  {
    kind: 'review',
    title: 'Chữ cần bạn duyệt',
    how: 'Đọc bản nháp hoặc bản dịch. Nếu đúng, chỉ xoá chữ `[REVIEW] ` ở đầu; nếu chưa đúng, sửa lại rồi xoá dấu.',
    columns: ['Khoá', 'Nội dung'],
  },
  {
    kind: 'data',
    title: 'Dữ liệu chưa quyết định',
    how: 'Mở file, thay `null` bằng giá trị thật trong dấu ngoặc kép, ví dụ `"#6C4FD8"`. Rê chuột lên tên trường trong VS Code để xem mô tả.',
    columns: ['Trường', 'Cần gì'],
  },
  {
    kind: 'image',
    title: 'Ảnh còn thiếu',
    how: 'Xuất ảnh đúng kích thước và định dạng, đặt vào đúng đường dẫn trong thư mục `public/`. Khung giữ chỗ tự biến mất ở lần build sau, không cần sửa code.',
    columns: ['Ô ảnh', 'Cần gì'],
  },
  {
    kind: 'file',
    title: 'File đặc biệt còn thiếu',
    how: 'Đặt file đúng tên và đúng thư mục ghi trong cột "Ở đâu".',
    columns: ['File', 'Cần gì'],
  },
];

/** CONTENT_TODO.md: everything still missing, grouped, with where it lives and how to fill it. */
export function renderReport(entries: TodoEntry[]): string {
  const counts = sections.map(
    ({ kind, title }) =>
      `${title.toLowerCase()}: ${entries.filter((entry) => entry.kind === kind).length}`,
  );
  const out: string[] = [
    '# Nội dung còn thiếu',
    '',
    'File này do `npm run check:content` tự sinh. Đừng sửa tay: sửa nội dung trong `content/` rồi chạy lại lệnh. Hướng dẫn đầy đủ ở `doc/CONTENT_GUIDE.md`.',
    '',
    `Tổng cộng ${entries.length} mục (${counts.join(', ')}).`,
  ];
  for (const section of sections) {
    const rows = sortEntries(entries.filter((entry) => entry.kind === section.kind));
    out.push('', `## ${section.title} (${rows.length})`, '');
    if (rows.length === 0) {
      out.push('Không còn mục nào.');
      continue;
    }
    out.push(`Cách sửa: ${section.how}`, '');
    out.push(
      `| ${section.columns[0]} | Hiện ở đâu | ${section.columns[1]} | Ở đâu |`,
      '|---|---|---|---|',
    );
    for (const row of rows) {
      out.push(
        `| \`${cell(row.key)}\` | ${cell(row.where)} | ${cell(row.need)} | ${row.locations.map((location) => `\`${cell(location)}\``).join('<br>')} |`,
      );
    }
  }
  out.push('');
  return out.join('\n');
}
