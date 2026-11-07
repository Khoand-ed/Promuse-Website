import { z } from 'zod';
import { altGroup, text } from './common.ts';

const feature = (n: number) =>
  z.strictObject({
    tab: text(
      `Nhãn ngắn của tính năng ${n} trong danh sách tab của modal Tính năng (bên trái trên máy tính, hàng ngang trên điện thoại). Một hoặc hai từ, như "GRAPHICS" trên p3re.jp.`,
    ),
    title: text(
      `Tên tính năng ${n}, tiêu đề lớn trong tab ${n} của modal Tính năng. Khoảng 30 ký tự.`,
    ),
    text: text(
      `Một hoặc hai câu giải thích tính năng ${n}, hiện trong tab ${n} của modal. Viết đơn giản, chỉ dùng dữ kiện trong doc/GAME_FACTS.md.`,
    ),
    image1Alt: text(`Mô tả ảnh thứ nhất của tính năng ${n} cho người dùng trình đọc màn hình.`),
    image2Alt: text(`Mô tả ảnh thứ hai của tính năng ${n} cho người dùng trình đọc màn hình.`),
  });

const gameplayTab = (n: number) =>
  z.strictObject({
    tab: text(`Nhãn ngắn của tab ${n} trong danh sách tab của modal Gameplay. Một hoặc hai từ.`),
    title: text(`Tiêu đề lớn trong tab ${n} của modal Gameplay. Khoảng 30 ký tự.`),
    text: text(
      `Đoạn giải thích ngắn cho tab ${n}, viết đơn giản và dễ hiểu, không đi vào chi tiết luật chơi. Chỉ dùng dữ kiện trong doc/GAME_FACTS.md.`,
    ),
    slides: altGroup(
      `Mô tả từng ảnh trong slider của tab ${n}. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây.`,
    ),
  });

const character = z.strictObject({
  tagline: text('Một câu giới thiệu ngắn về nhân vật, hiện dưới tên trong hồ sơ. Khoảng 60 ký tự.'),
  profile: text('Đoạn hồ sơ nhân vật, 2–4 câu.'),
  passiveName: text('Tên passive đúng như trong game (giữ nguyên tiếng Anh ở cả hai ngôn ngữ).'),
  passiveDescription: text(
    'Mô tả passive. Bản tiếng Anh là nguyên văn trong game; bản tiếng Việt là bản dịch, bỏ chữ [REVIEW] khi bạn đã duyệt.',
  ),
  cardAlt: text('Mô tả ảnh thẻ nhân vật cho người dùng trình đọc màn hình.'),
  idleAlt: text('Mô tả hình nhân vật ở tư thế đứng yên.'),
  battleAlt: text('Mô tả hình nhân vật ở tư thế chiến đấu.'),
  gallery: altGroup(
    'Mô tả từng ảnh trong thư viện ảnh của nhân vật. Mỗi ảnh khai báo trong content/data/characters.json.',
  ),
});

export const textSchema = z.strictObject({
  $schema: z.string().optional(),
  meta: z.strictObject({
    title: text('Tiêu đề trang trên tab trình duyệt và trong kết quả tìm kiếm.'),
    description: text(
      'Mô tả ngắn của trang cho kết quả tìm kiếm và khi chia sẻ link. Khoảng 120–160 ký tự.',
    ),
  }),
  common: z.strictObject({
    brand: text('Tên game hiển thị trên trang. Giữ là Promuse.'),
    logoAlt: text('Mô tả logo cho người dùng trình đọc màn hình. Giữ là Promuse.'),
    skipToContent: text('Link ẩn cho người dùng bàn phím, hiện ra khi bấm Tab lần đầu.'),
    backToTop: text('Nhãn nút quay lên đầu trang.'),
    openMenu: text('Nhãn nút mở menu trên điện thoại.'),
    closeMenu: text('Nhãn nút đóng menu trên điện thoại.'),
    menu: text('Chữ nhỏ dưới ba vạch trên nút menu ở góc phải trên điện thoại.'),
    effects: text('Nhãn nút bật/tắt hiệu ứng chuyển động, ở header và trong menu điện thoại.'),
    effectsOn: text('Chữ trạng thái khi hiệu ứng đang bật, hiện cạnh nhãn nút.'),
    effectsOff: text('Chữ trạng thái khi hiệu ứng đang tắt, hiện cạnh nhãn nút.'),
    music: text(
      'Tên nút tròn bật/tắt nhạc nền ở góc trên bên trái, cho trình đọc màn hình và khi rê chuột.',
    ),
    mainNav: text('Tên vùng điều hướng chính, dành cho trình đọc màn hình.'),
    language: text('Tên nhóm nút chọn ngôn ngữ, dành cho trình đọc màn hình.'),
    languageNames: z.strictObject({
      vi: text('Chữ trên nút chọn tiếng Việt.'),
      en: text('Chữ trên nút chọn tiếng Anh.'),
    }),
    close: text('Nhãn chung của nút đóng hộp thoại.'),
    imagePlaceholder: text(
      'Chữ trên khung giữ chỗ khi chưa có ảnh. Giữ nguyên {name}, {width} và {height}.',
    ),
  }),
  nav: z.strictObject({
    story: text('Mục "Giới thiệu" trên thanh điều hướng.'),
    features: text('Mục "Tính năng" trên thanh điều hướng.'),
    gameplay: text('Mục "Gameplay" trên thanh điều hướng.'),
    characters: text('Mục "Nhân vật" trên thanh điều hướng.'),
    reward: text('Nút "Nhận quà" nổi bật trên thanh điều hướng.'),
  }),
  intro: z.strictObject({
    title: text(
      'Tiêu đề lớn của màn mở đầu (lúc mặt nước rút xuống), như "Memento Mori" trên p3re.jp: một câu ngắn kiểu khẩu hiệu, khoảng 20 ký tự.',
    ),
    line1: text('Dòng nhỏ thứ 1 dưới tiêu đề màn mở đầu. Khoảng 30 ký tự.'),
    line2: text('Dòng mở đầu thứ 2. Khoảng 30 ký tự.'),
    line3: text('Dòng mở đầu thứ 3. Khoảng 30 ký tự.'),
    skip: text('Nhãn nút bỏ qua màn mở đầu.'),
  }),
  hero: z.strictObject({
    status: text(
      'Dòng trạng thái ở màn đầu tiên, ví dụ "Sắp ra mắt trên Android". Không nhắc iOS.',
    ),
    trailer: text('Nút mở trailer. Nút tự ẩn khi chưa có ID trailer.'),
    scroll: text('Chữ nhỏ gợi ý cuộn xuống.'),
    visualAlt: text('Mô tả ảnh key visual cho người dùng trình đọc màn hình.'),
  }),
  reward: z.strictObject({
    title: text('Tiêu đề khối nhận quà đăng ký sớm.'),
    desc: text(
      'Một dòng mô tả phần quà: 1800 và tên tiền tệ. Tên tiền tệ chưa chốt. Số lượng phải khớp với chiến dịch trong cơ sở dữ liệu (supabase/migrations/0002_prereg_campaign.sql).',
    ),
    artAlt: text('Mô tả ảnh phần quà cho người dùng trình đọc màn hình.'),
    privacy: text('Dòng nhỏ dưới nút đăng ký, nói email dùng để làm gì.'),
    privacyLink: text('Chữ của link tới trang quyền riêng tư.'),
    notYou: text('Câu hỏi hiện khi đã đăng nhập, trước link đăng xuất.'),
    signOut: text('Nhãn link đăng xuất.'),
    states: z.strictObject({
      signedOut: text('Nút khi chưa đăng nhập.'),
      redirecting: text('Nút trong lúc chuyển sang trang đăng nhập Google.'),
      registering: text('Nút trong lúc đang ghi nhận đăng ký.'),
      registered: text(
        'Thông báo đăng ký thành công; có thể dùng {email}. Không được hứa nhận quà trong game, vì game chưa có đăng nhập Google.',
      ),
      alreadyRegistered: text('Thông báo khi tài khoản đã đăng ký từ trước. Giữ nguyên {date}.'),
      signedInNotRegistered: text('Nút khi đã đăng nhập nhưng chưa đăng ký.'),
      cancelled: text('Thông báo khi người dùng huỷ đăng nhập Google.'),
      error: text('Thông báo khi có lỗi, kèm lời mời thử lại.'),
      closed: text('Thông báo khi chương trình đăng ký sớm đã kết thúc.'),
      notOpen: text(
        'Thông báo khi chưa mở đăng ký (website thật dùng trạng thái này cho tới khi có đăng ký thật).',
      ),
    }),
  }),
  story: z.strictObject({
    title: text('Tiêu đề phần giới thiệu thế giới game.'),
    p1: text('Đoạn giới thiệu thứ 1, 2–3 câu. Nói về thế giới và nhân vật, không nói về âm nhạc.'),
    p2: text('Đoạn giới thiệu thứ 2, 2–3 câu.'),
    p3: text('Đoạn giới thiệu thứ 3, 2–3 câu.'),
    band1: text('Khẩu hiệu thứ 1: dòng chữ nhỏ ở giữa trang, sau phần Gameplay. Vài chữ.'),
    band2: text('Khẩu hiệu thứ 2, dòng dưới khẩu hiệu 1. Vài chữ.'),
    band3: text('Khẩu hiệu thứ 3, dòng cuối. Vài chữ.'),
    imageAlt: text('Mô tả ảnh của phần giới thiệu.'),
  }),
  features: z.strictObject({
    title: text('Tiêu đề phần Tính năng.'),
    summary: text('Hai câu tóm tắt dưới tiêu đề phần Tính năng.'),
    coverAlt: text('Mô tả ảnh bìa của phần Tính năng.'),
    seeDetails: text('Nút mở modal chi tiết tính năng.'),
    number: text('Nhãn nhỏ trên mỗi tab, ví dụ "TÍNH NĂNG #1". Giữ nguyên {n}.'),
    items: z.strictObject({ f1: feature(1), f2: feature(2), f3: feature(3), f4: feature(4) }),
  }),
  gameplay: z.strictObject({
    title: text('Tiêu đề phần Gameplay.'),
    summary: text('Hai câu tóm tắt cách chơi dưới tiêu đề phần Gameplay.'),
    coverAlt: text('Mô tả ảnh bìa của phần Gameplay.'),
    details: text('Nút mở modal chi tiết gameplay.'),
    rates: text(
      'Dòng tỉ lệ gacha. Giữ nguyên {fiveStar}, {fourStar}, {threeStar}: các con số lấy từ dữ liệu.',
    ),
    previous: text('Nhãn nút ảnh trước trong slider.'),
    next: text('Nhãn nút ảnh sau trong slider.'),
    position: text(
      'Câu đọc cho trình đọc màn hình khi chuyển ảnh. Giữ nguyên {current} và {total}.',
    ),
    tabs: z.strictObject({
      g1: gameplayTab(1),
      g2: gameplayTab(2),
      g3: gameplayTab(3),
      g4: gameplayTab(4),
    }),
  }),
  characters: z.strictObject({
    title: text('Tiêu đề phần Nhân vật, chữ rất lớn bên trái. Ngắn, một hoặc hai từ.'),
    line1: text('Dòng giới thiệu 1 dưới tiêu đề phần Nhân vật. Khoảng 40 ký tự.'),
    line2: text('Dòng giới thiệu 2. Khoảng 40 ký tự.'),
    line3: text('Dòng giới thiệu 3. Khoảng 40 ký tự.'),
    rarity: text('Câu đọc độ hiếm cho trình đọc màn hình, ví dụ "5 sao". Giữ nguyên {count}.'),
    changeVisual: text('Nút đổi giữa hình đứng yên và hình chiến đấu.'),
    previous: text('Nút sang nhân vật trước trong hồ sơ.'),
    next: text('Nút sang nhân vật sau trong hồ sơ.'),
    profile: text('Nhãn mục hồ sơ.'),
    passive: text('Nhãn mục passive.'),
    stats: text('Nhãn mục chỉ số.'),
    hp: text('Tên chỉ số máu.'),
    scoreBonus: text('Tên chỉ số thưởng điểm.'),
    feverBonus: text('Tên chỉ số thưởng Fever.'),
    gallery: text('Nhãn thư viện ảnh của nhân vật.'),
    items: z
      .record(z.string().regex(/^[a-z0-9-]+$/), character)
      .describe('Nội dung riêng của từng nhân vật, theo slug trong content/data/characters.json.'),
  }),
  footer: z.strictObject({
    specHeading: text('Tiêu đề bảng thông tin game ở cuối trang.'),
    linksHeading: text('Tiêu đề nhóm link mạng xã hội.'),
    shareHeading: text('Tiêu đề nhóm nút chia sẻ.'),
    spec: z.strictObject({
      titleLabel: text('Nhãn dòng tên game.'),
      titleValue: text('Tên game.'),
      releaseLabel: text('Nhãn dòng phát hành.'),
      releaseValue: text('Trạng thái phát hành.'),
      genreLabel: text('Nhãn dòng thể loại.'),
      genreValue: text('Thể loại game.'),
      playersLabel: text('Nhãn dòng số người chơi.'),
      playersValue: text('Số người chơi.'),
      platformLabel: text('Nhãn dòng nền tảng.'),
      platformValue: text('Nền tảng. Chỉ ghi Android cho tới khi có bản iOS.'),
    }),
    store: text('Dòng chữ thay cho nút cửa hàng khi chưa có link Google Play.'),
    shareX: text('Nhãn nút chia sẻ lên X.'),
    shareFacebook: text('Nhãn nút chia sẻ lên Facebook.'),
    shareText: text('Câu đi kèm link khi chia sẻ lên X.'),
    social: z.strictObject({
      x: text('Nhãn link trang X của Promuse.'),
      facebook: text('Nhãn link trang Facebook của Promuse.'),
      youtube: text('Nhãn link kênh YouTube của Promuse.'),
      tiktok: text('Nhãn link TikTok của Promuse.'),
      discord: text('Nhãn link Discord của Promuse.'),
    }),
    privacy: text('Chữ của link tới trang quyền riêng tư.'),
    copyright: text('Dòng bản quyền. Giữ nguyên {holder}: tên lấy từ content/data/site.json.'),
  }),
  privacy: z.strictObject({
    title: text('Tiêu đề trang quyền riêng tư.'),
    intro: text('Đoạn mở đầu: trang này nói về dữ liệu nào và vì sao.'),
    storedHeading: text('Tiêu đề mục dữ liệu được lưu.'),
    storedEmail: text('Dòng: email tài khoản Google. Phải khớp với dữ liệu thật được lưu.'),
    storedGoogleId: text('Dòng: mã tài khoản Google.'),
    storedLocale: text('Dòng: ngôn ngữ dùng trên trang.'),
    storedCampaign: text('Dòng: chương trình đăng ký sớm.'),
    storedTime: text('Dòng: thời điểm đăng ký.'),
    whyHeading: text('Tiêu đề mục lý do lưu dữ liệu.'),
    why: text('Lý do lưu dữ liệu.'),
    processorsHeading: text('Tiêu đề mục các dịch vụ xử lý dữ liệu.'),
    processors: text('Các dịch vụ xử lý dữ liệu: Supabase, Vercel, Google.'),
    retentionHeading: text('Tiêu đề mục thời gian lưu.'),
    retention: text('Dữ liệu được giữ trong bao lâu.'),
    deletionHeading: text('Tiêu đề mục yêu cầu xoá dữ liệu.'),
    deletion: text('Cách yêu cầu xoá dữ liệu.'),
    contactHeading: text('Tiêu đề mục liên hệ.'),
    contact: text('Câu mời liên hệ. Giữ nguyên {email}: địa chỉ lấy từ content/data/site.json.'),
  }),
  notFound: z.strictObject({
    title: text('Tiêu đề trang không tìm thấy (404).'),
    body: text('Một câu giải thích trên trang 404.'),
    home: text('Nút quay về trang chủ trên trang 404.'),
  }),
});

export type TextContent = z.infer<typeof textSchema>;
