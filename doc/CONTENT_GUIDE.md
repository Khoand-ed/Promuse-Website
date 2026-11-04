# Hướng dẫn sửa nội dung website Promuse

Dành cho người sửa chữ, link và ảnh trên website mà không cần đọc code. Mọi thứ bạn sửa nằm trong hai chỗ: thư mục `content/` và thư mục `public/images/`.

## 1. Bắt đầu từ đâu

Mở file `CONTENT_TODO.md` ở thư mục gốc của dự án. Đó là danh sách mọi thứ còn thiếu. Mỗi dòng ghi:

- **Khoá**: tên của đoạn chữ hoặc ô dữ liệu, ví dụ `hero.status`;
- **Hiện ở đâu**: phần nào trên trang;
- **Cần gì**: nên viết gì, dài khoảng bao nhiêu;
- **Ở đâu**: file và số dòng cần sửa, ví dụ `content/text/vi.json:31`.

Sau mỗi lần sửa, chạy lệnh dưới đây trong terminal ở thư mục dự án. Lệnh kiểm tra nội dung và cập nhật lại `CONTENT_TODO.md`:

```bash
npm run check:content
```

## 2. Các file nội dung

| File | Chứa gì |
|---|---|
| `content/text/vi.json` | Toàn bộ chữ tiếng Việt |
| `content/text/en.json` | Toàn bộ chữ tiếng Anh, cùng các khoá với file tiếng Việt |
| `content/data/site.json` | Nhạc nền, trailer, link mạng xã hội, link cửa hàng, nền tảng, chủ sở hữu bản quyền, email liên hệ, logo |
| `content/data/hero.json` | Ảnh key visual (máy tính và điện thoại) |
| `content/data/reward.json` | Ảnh phần quà |
| `content/data/story.json` | Ảnh phần giới thiệu, số khẩu hiệu chữ lớn |
| `content/data/features.json` | Ảnh của 4 tính năng |
| `content/data/gameplay.json` | Ảnh slider của 4 tab, tỉ lệ gacha |
| `content/data/characters.json` | 4 nhân vật: chỉ số, màu chủ đạo, ảnh |

Đừng sửa: `content/schemas/` và `CONTENT_TODO.md` (máy tự sinh), và mọi thứ trong `src/`.

## 3. Sửa chữ

Mỗi dòng trong file chữ có dạng:

```json
"status": "Sắp ra mắt trên Android",
```

- Bên trái dấu hai chấm là **khoá**: giữ nguyên.
- Bên phải là **nội dung**: sửa thoải mái, nhưng giữ dấu ngoặc kép ở hai đầu và dấu phẩy cuối dòng. Dòng cuối cùng của một nhóm thì không có dấu phẩy.
- Cần dấu ngoặc kép bên trong nội dung thì viết `\"`, hoặc dùng dấu “ ”.
- Chữ trong ngoặc nhọn như `{email}`, `{date}`, `{count}` là **biến**: máy sẽ thay bằng giá trị thật. Giữ đúng tên biến, đặt ở chỗ hợp lý trong câu.
- Sửa ở **cả hai** file `vi.json` và `en.json`.

Hai dấu đánh dấu:

- `[TODO] …`: chưa có nội dung. Thay cả đoạn, kể cả chữ `[TODO]`.
- `[REVIEW] …`: bản nháp hoặc bản dịch cần bạn duyệt. Nếu đúng, chỉ xoá `[REVIEW] ` ở đầu.

Cả hai dấu đều hiện trên trang, nên không có gì bị sót khi ra mắt.

Nội dung về game (lối chơi, nhân vật, gacha) phải đúng với game hiện tại: xem `doc/GAME_FACTS.md`. Viết đơn giản, dễ hiểu; trang giới thiệu game, không giải thích chi tiết luật chơi.

## 4. Gợi ý trong VS Code

Mở thư mục dự án bằng VS Code. Rê chuột lên một khoá trong file nội dung, VS Code hiện mô tả tiếng Việt của khoá đó. Gõ sai tên khoá, hoặc điền sai kiểu (ví dụ màu không đúng dạng `#RRGGBB`), chỗ đó bị gạch đỏ.

## 5. Thay ảnh

1. Trong `CONTENT_TODO.md`, mục "Ảnh còn thiếu", tìm ô ảnh: đường dẫn, kích thước, định dạng.
2. Xuất ảnh đúng kích thước, hoặc ít nhất đúng tỉ lệ rộng/cao. Đặt file vào đúng đường dẫn trong thư mục `public/`.
3. Chạy lại `npm run check:content`: ô ảnh biến khỏi danh sách. Trên trang, khung giữ chỗ được thay bằng ảnh ở lần build sau.

Muốn đổi kích thước một ô ảnh: sửa `width` và `height` của ô đó trong file `content/data` tương ứng.

Muốn thêm một ảnh vào slider của tab gameplay: thêm một ô ảnh vào mảng `slides` của tab trong `content/data/gameplay.json` (tối đa 7 ảnh), rồi thêm khoá mô tả ảnh vào **cả hai** file chữ. Ví dụ ảnh thứ tư của tab 1:

```json
{ "src": "/images/gameplay/g1-4.webp", "width": 1280, "height": 720, "alt": "gameplay.tabs.g1.slides.s4" }
```

và trong `vi.json` (tương tự trong `en.json`), ở nhóm `gameplay.tabs.g1.slides`:

```json
"s4": "Mô tả ảnh thứ tư của tab 1"
```

Thư viện ảnh của nhân vật làm tương tự: ô ảnh trong `images.gallery` của nhân vật, khoá mô tả trong `characters.items.<slug>.gallery`.

Video hero (không bắt buộc, giống p3re.jp): đặt file MP4 16:9 không tiếng vào `public/videos/`, rồi ghi đường dẫn vào `content/data/hero.json`, nhóm `video`: `loop` là video lặp, `intro` (nếu có) chạy một lần trước nó. Video chỉ chạy trên màn hình từ 768 px và khi hiệu ứng bật; ảnh desktop là ảnh chờ. Để trống đường dẫn thì hero dùng ảnh.

Không dùng art, tên hay ảnh chụp lấy từ Arknights hoặc game khác, kể cả ảnh chụp bản game hiện tại (xem `doc/GAME_FACTS.md`, mục 6).

## 6. Thêm nhạc nền

Nút tròn có nốt nhạc ở góc trên bên trái chỉ hiện khi đã có file nhạc. Khi nhạc phát, nốt nhạc xoay và các nút đập theo phách của bài.

1. Chỉ dùng nhạc của Promuse mà bạn có quyền phát công khai trên web.
2. Xuất file MP3 (khoảng 128–192 kbps cho nhẹ trang), đặt vào `public/audio/theme.mp3`, hoặc đổi `music.src` cho khớp tên file.
3. Trong `content/data/site.json`, nhóm `music`:
   - `bpm`: nhịp của bài, ví dụ `143.958` (lấy từ beatmap trong game nếu bài có trong game);
   - `firstBeat`: số giây từ đầu file tới phách đầu tiên (`beatPhase` trong beatmap), để nút đập đúng phách;
   - `volume`: âm lượng từ `0.05` đến `1`, nên khoảng `0.5`.
4. Chạy `npm run check:content`, rồi `npm run dev`, bấm nút nốt nhạc và xem nút có đập đúng phách không. Lệch thì chỉnh `firstBeat`.

## 7. Sửa dữ liệu

- `null` nghĩa là chưa quyết định. Thay bằng giá trị trong ngoặc kép, ví dụ `"copyrightHolder": "Tên của bạn"`.
- Link để trống `""` thì mục đó bị ẩn trên trang.
- Màu viết dạng `"#RRGGBB"`, ví dụ `"#6C4FD8"`.
- Trailer: chỉ dán ID 11 ký tự (phần sau `v=` trong link YouTube), không dán cả link.

## 8. Xem trước

```bash
npm run dev
```

Rồi mở http://localhost:3000 (tiếng Việt) hoặc http://localhost:3000/en (tiếng Anh). Trang tự cập nhật mỗi khi bạn lưu file.

## 9. Khi kiểm tra báo lỗi

| Thông báo | Nghĩa là | Cách sửa |
|---|---|---|
| lỗi cú pháp JSON | Thiếu hoặc thừa dấu phẩy, dấu ngoặc kép, dấu ngoặc nhọn | Xem quanh vị trí được báo. Thường là thiếu dấu phẩy ở cuối dòng phía trên, hoặc thừa dấu phẩy ở dòng cuối của nhóm |
| khoá lạ "…" | Gõ sai tên khoá, hoặc thêm khoá không có trong mẫu | Sửa lại tên khoá cho đúng |
| thiếu hoặc sai kiểu dữ liệu | Thiếu một khoá, hoặc điền số vào chỗ cần chữ | Thêm lại khoá, hoặc sửa giá trị |
| Không được để trống | Để `""` ở chỗ cần chữ | Viết nội dung, hoặc để lại dòng `[TODO]` |
| biến trong {…} khác nhau giữa hai ngôn ngữ | Một file có `{email}`, file kia không | Sửa cho hai file dùng cùng các biến |
| khoá "…" không có trong content/text | Ô ảnh trỏ tới một khoá mô tả chưa có | Thêm khoá đó vào cả hai file chữ |

Build trên Vercel cũng dừng lại với các lỗi này, nên trang thật không bao giờ hiện nội dung hỏng.

## 10. Lưu thay đổi

Khi `npm run check:content` không còn lỗi, commit cả các file nội dung đã sửa lẫn `CONTENT_TODO.md`. CI trên GitHub báo lỗi nếu `CONTENT_TODO.md` chưa được cập nhật theo nội dung mới.
