import { z } from 'zod';
import { SLUG, imageSlot, optionalUrl } from './common.ts';

const schemaRef = z.string().optional();

export const siteSchema = z.strictObject({
  $schema: schemaRef,
  music: z
    .strictObject({
      src: z
        .string()
        .regex(
          /^\/audio\/[a-z0-9/_-]+\.(mp3|m4a|ogg)$/,
          'Đường dẫn phải bắt đầu bằng /audio/, chỉ gồm chữ thường, số, "-", "_", và kết thúc bằng .mp3, .m4a hoặc .ogg.',
        )
        .describe(
          'File nhạc nền tính từ thư mục public/, ví dụ /audio/theme.mp3. Chỉ dùng nhạc Promuse có quyền phát công khai. Chưa có file thì nút nhạc bị ẩn.',
        ),
      bpm: z
        .number()
        .min(60)
        .max(200)
        .describe(
          'Nhịp của bài (số phách mỗi phút), ví dụ 120 hoặc 143.958. Khi nhạc phát, các nút đập theo nhịp này; vạch SCROLL nhỏ giọt mỗi 3 nhịp.',
        ),
      firstBeat: z
        .number()
        .min(0)
        .describe(
          'Số giây từ đầu file tới phách đầu tiên, để nút đập đúng phách (trong beatmap của game là beatPhase). 0 nếu bài vào phách ngay.',
        ),
      volume: z
        .number()
        .min(0.05)
        .max(1)
        .describe('Âm lượng khi phát, từ 0.05 đến 1. Nên khoảng 0.5.'),
    })
    .describe(
      'Nhạc nền: tắt mỗi lần vào trang, người xem bấm nút tròn ở góc trên bên trái để bật.',
    ),
  trailerId: z
    .union([
      z.literal(''),
      z.string().regex(/^[A-Za-z0-9_-]{11}$/, 'ID YouTube gồm đúng 11 ký tự.'),
    ])
    .describe(
      'ID video YouTube của trailer: 11 ký tự sau "v=" trong link. Để trống thì nút "Xem trailer" bị ẩn.',
    ),
  copyrightHolder: z
    .string()
    .regex(/\S/)
    .nullable()
    .describe('Tên chủ sở hữu bản quyền ở dòng cuối trang. null nghĩa là chưa quyết định.'),
  privacyContactEmail: z
    .email('Phải là một địa chỉ email hợp lệ.')
    .nullable()
    .describe(
      'Email nhận câu hỏi và yêu cầu xoá dữ liệu, hiện trên trang quyền riêng tư. null nghĩa là chưa có.',
    ),
  logo: imageSlot(
    'Logo. Khi chưa có file, trang dùng logo chữ "PROMUSE". Kích thước ở đây là tạm, sửa theo logo thật.',
  ),
  social: z
    .strictObject({
      x: optionalUrl('Link trang X của Promuse. Để trống thì không hiện.'),
      facebook: optionalUrl('Link trang Facebook của Promuse. Để trống thì không hiện.'),
      youtube: optionalUrl('Link kênh YouTube của Promuse. Để trống thì không hiện.'),
      tiktok: optionalUrl('Link TikTok của Promuse. Để trống thì không hiện.'),
      discord: optionalUrl('Link mời vào Discord của Promuse. Để trống thì không hiện.'),
    })
    .describe('Link mạng xã hội ở cuối trang.'),
  stores: z
    .strictObject({
      googlePlay: optionalUrl(
        'Link Google Play. Để trống thì trang hiện dòng chữ "Sắp ra mắt trên Google Play" thay cho nút.',
      ),
    })
    .describe('Link cửa hàng ứng dụng.'),
  platforms: z
    .array(
      z.strictObject({
        id: z.enum(['android', 'ios']).describe('Nền tảng.'),
        status: z
          .enum(['available', 'coming-soon', 'planned'])
          .describe(
            'available: đã phát hành; coming-soon: sắp ra mắt; planned: dự định, không hiện trên trang.',
          ),
      }),
    )
    .describe('Các nền tảng và trạng thái của từng nền tảng.'),
  shareHashtag: z
    .string()
    .regex(/^[A-Za-z0-9_]+$/, 'Chỉ gồm chữ, số và dấu gạch dưới, không có dấu #.')
    .describe('Hashtag gắn vào khi chia sẻ, không kèm dấu #.'),
});

export const heroSchema = z.strictObject({
  $schema: schemaRef,
  desktop: imageSlot(
    'Key visual ngang cho máy tính, tối thiểu 1920 × 1080 (nên dùng 2560 × 1440). Giữ sáng góc trên bên trái (dòng trạng thái) và dải trên cùng bên phải (menu); vùng giữa bên phải để trống cho logo, như bố cục hero của p3re.jp.',
  ),
  mobile: imageSlot(
    'Key visual dọc cho điện thoại, 1080 × 1920. Giữ sáng phần trên cùng cho logo và dòng trạng thái.',
  ),
  video: z
    .strictObject({
      intro: videoPath(
        'Video mở đầu, chạy một lần trước video lặp (như p3re.jp). MP4, 16:9, không tiếng. Để trống nếu không có.',
      ),
      loop: videoPath(
        'Video lặp của hero từ 768 px trở lên. MP4, 16:9, không tiếng, nhẹ (nên dưới 8 MB). Để trống thì hero dùng ảnh.',
      ),
    })
    .describe(
      'Video tuỳ chọn cho hero trên máy tính. Ảnh desktop là ảnh chờ (poster). Tắt hiệu ứng thì chỉ hiện ảnh.',
    ),
  layers: z
    .array(imageSlot('Một lớp của key visual (PNG nền trong suốt), cùng khung với bản desktop.'))
    .describe(
      'Các lớp tách rời của key visual để làm hiệu ứng chiều sâu. Không bắt buộc; để [] nếu không có.',
    ),
});

function videoPath(description: string) {
  return z
    .union([
      z.literal(''),
      z
        .string()
        .regex(
          /^\/videos\/[a-z0-9/_-]+\.(mp4|webm)$/,
          'Đường dẫn phải bắt đầu bằng /videos/, chỉ gồm chữ thường, số, "-", "_", và kết thúc bằng .mp4 hoặc .webm.',
        ),
    ])
    .describe(description);
}

export const rewardSchema = z.strictObject({
  $schema: schemaRef,
  art: imageSlot('Ảnh phần quà, 800 × 800.'),
});

export const storySchema = z.strictObject({
  $schema: schemaRef,
  image: imageSlot('Ảnh của phần giới thiệu thế giới game, 16:9 (ví dụ 1600 × 900).'),
  bands: z
    .int()
    .min(2)
    .max(3)
    .describe('Số dòng khẩu hiệu hiển thị (2 hoặc 3), lấy từ story.band1 đến story.band3.'),
});

const featureKey = z.enum(['f1', 'f2', 'f3', 'f4']);

export const featuresSchema = z.strictObject({
  $schema: schemaRef,
  cover: imageSlot('Ảnh bìa của phần Tính năng trên trang chính, 16:9 (1280 × 720).'),
  items: z
    .array(
      z.strictObject({
        key: featureKey.describe('Khoá của tính năng trong content/text (features.items.<khoá>).'),
        images: z
          .array(imageSlot('Ảnh minh hoạ tính năng, 1280 × 720.'))
          .length(2, 'Mỗi tính năng có đúng 2 ảnh.')
          .describe('Hai ảnh của tính năng, hiện trong tab của modal Tính năng.'),
      }),
    )
    .length(4, 'Phần Tính năng có đúng 4 mục.')
    .describe('Bốn tính năng, theo thứ tự hiển thị.'),
});

const gameplayKey = z.enum(['g1', 'g2', 'g3', 'g4']);

export const gameplaySchema = z.strictObject({
  $schema: schemaRef,
  cover: imageSlot('Ảnh bìa của phần Gameplay trên trang chính, 16:9 (1280 × 720).'),
  tabs: z
    .array(
      z.strictObject({
        key: gameplayKey.describe('Khoá của tab trong content/text (gameplay.tabs.<khoá>).'),
        slides: z
          .array(imageSlot('Ảnh trong slider của tab, 1280 × 720 (16:9).'))
          .min(3, 'Mỗi tab có từ 3 đến 7 ảnh.')
          .max(7, 'Mỗi tab có từ 3 đến 7 ảnh.')
          .describe('Ảnh của slider trong tab, theo thứ tự.'),
      }),
    )
    .length(4, 'Phần Gameplay có đúng 4 tab.')
    .describe('Bốn tab của modal Gameplay, theo thứ tự hiển thị.'),
  gacha: z
    .strictObject({
      tab: gameplayKey.describe('Tab hiện dòng tỉ lệ gacha.'),
      rates: z
        .strictObject({
          fiveStar: z.number().min(0).max(100).describe('Tỉ lệ ra nhân vật 5★ (%).'),
          fourStar: z.number().min(0).max(100).describe('Tỉ lệ ra nhân vật 4★ (%).'),
          threeStar: z.number().min(0).max(100).describe('Tỉ lệ ra nhân vật 3★ (%).'),
        })
        .superRefine((rates, ctx) => {
          const total = rates.fiveStar + rates.fourStar + rates.threeStar;
          if (Math.abs(total - 100) > 1e-9) {
            ctx.addIssue({ code: 'custom', message: `Tổng tỉ lệ là ${total}%, phải bằng 100%.` });
          }
        })
        .describe('Tỉ lệ gacha, lấy từ doc/GAME_FACTS.md mục 4. Tổng phải bằng 100.'),
    })
    .describe('Dữ liệu gacha hiển thị trong modal Gameplay.'),
});

export const charactersSchema = z.strictObject({
  $schema: schemaRef,
  items: z
    .array(
      z.strictObject({
        slug: z
          .string()
          .regex(SLUG)
          .describe(
            'Tên ngắn dùng trong link (#char-<slug>) và làm khoá trong content/text (characters.items.<slug>).',
          ),
        id: z
          .string()
          .regex(/^[A-Z0-9_]+$/)
          .describe('Mã nhân vật trong game.'),
        name: z.string().regex(/\S/).describe('Tên hiển thị, giữ đúng như trong game.'),
        rarity: z
          .union([z.literal(3), z.literal(4), z.literal(5)])
          .describe('Độ hiếm: 3, 4 hoặc 5 sao.'),
        stats: z
          .strictObject({
            hp: z.int().positive().describe('Máu tối đa.'),
            scoreBonus: z.number().positive().describe('Hệ số thưởng điểm, ví dụ 1.2.'),
            feverBonus: z.number().positive().describe('Hệ số thưởng Fever, ví dụ 1.2.'),
          })
          .describe('Chỉ số lấy từ doc/GAME_FACTS.md mục 3.'),
        themeColor: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/, 'Màu dạng #RRGGBB, ví dụ #6C4FD8.')
          .nullable()
          .describe(
            'Màu chủ đạo của nhân vật, dạng #RRGGBB, làm nền phần Nhân vật khi nhân vật này hiện ra. Chọn màu sáng: chữ trên nền là màu navy #1D384A và cần tương phản ít nhất 4,5:1. null nghĩa là chưa chọn (trang tạm dùng bảng màu pastel).',
          ),
        images: z
          .strictObject({
            card: imageSlot('Ảnh thẻ nhân vật, 600 × 800.'),
            idle: imageSlot('Hình nhân vật đứng yên. Kích thước tạm; chốt khi có art.'),
            battle: imageSlot('Hình nhân vật chiến đấu. Kích thước tạm; chốt khi có art.'),
            gallery: z
              .array(imageSlot('Ảnh trong thư viện ảnh của nhân vật.'))
              .describe('Thư viện ảnh trong hồ sơ nhân vật. Để [] thì thư viện bị ẩn.'),
          })
          .describe('Ảnh của nhân vật.'),
      }),
    )
    .min(1)
    .describe('Các nhân vật, theo thứ tự hiển thị.'),
});

export type SiteContent = z.infer<typeof siteSchema>;
export type HeroContent = z.infer<typeof heroSchema>;
export type RewardContent = z.infer<typeof rewardSchema>;
export type StoryContent = z.infer<typeof storySchema>;
export type FeaturesContent = z.infer<typeof featuresSchema>;
export type GameplayContent = z.infer<typeof gameplaySchema>;
export type CharactersContent = z.infer<typeof charactersSchema>;
