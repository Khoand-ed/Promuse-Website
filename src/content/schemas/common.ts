import { z } from 'zod';

/** Lowercase words joined by hyphens: character slugs, slide keys. */
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** A visible string. `[TODO]` and `[REVIEW]` markers are allowed; empty or blank strings are not. */
export function text(description: string) {
  return z.string().regex(/\S/, 'Không được để trống.').describe(description);
}

/** A group of alt texts the owner can extend without code changes (one key per image). */
export function altGroup(description: string) {
  return z
    .record(
      z.string().regex(SLUG, 'Tên khoá chỉ gồm chữ thường, số và dấu gạch ngang.'),
      text(description),
    )
    .describe(description);
}

const slotShape = {
  src: z
    .string()
    .regex(
      /^\/images\/[a-z0-9/_-]+\.(webp|png|jpg|jpeg|svg|avif)$/,
      'Đường dẫn phải bắt đầu bằng /images/, chỉ gồm chữ thường, số, "-", "_", và kết thúc bằng .webp, .png, .jpg, .svg hoặc .avif.',
    )
    .describe(
      'Đường dẫn ảnh tính từ thư mục public/, ví dụ /images/hero/hero-desktop.webp. Đặt file đúng chỗ này là ảnh thay cho khung giữ chỗ.',
    ),
  width: z.int().positive().describe('Chiều rộng ảnh (px). Khung giữ chỗ dùng tỉ lệ rộng/cao này.'),
  height: z.int().positive().describe('Chiều cao ảnh (px).'),
  alt: z
    .string()
    .regex(
      /^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*$/,
      'Phải là một khoá trong content/text, ví dụ hero.visualAlt.',
    )
    .describe(
      'Khoá trong content/text/*.json chứa mô tả ảnh cho người dùng trình đọc màn hình, ví dụ hero.visualAlt.',
    ),
};

export function imageSlot(description: string) {
  return z.strictObject(slotShape).describe(description);
}

/** A slot for character art, which may be pixel art (doc/SPEC.md, section 11). */
export function artSlot(description: string) {
  return z
    .strictObject({
      ...slotShape,
      pixelated: z
        .boolean()
        .optional()
        .describe(
          'Ghi true nếu ảnh là pixel art: trang giữ nguyên từng điểm ảnh và phóng to đúng số nguyên lần (2×, 3×…), nên ảnh sắc nét. Khi đó width và height là kích thước gốc của file, không phóng to trước, và ảnh nên rộng không quá 256 px; ảnh lớn hơn khung hiển thị sẽ bị thu nhỏ và mất nét. Ảnh vẽ thường thì bỏ khoá này.',
        ),
    })
    .describe(description);
}

export function optionalUrl(description: string) {
  return z
    .union([z.literal(''), z.url('Phải là một link đầy đủ, bắt đầu bằng https://.')])
    .describe(description);
}
