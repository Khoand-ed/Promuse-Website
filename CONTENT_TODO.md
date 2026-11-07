# Nội dung còn thiếu

File này do `npm run check:content` tự sinh. Đừng sửa tay: sửa nội dung trong `content/` rồi chạy lại lệnh. Hướng dẫn đầy đủ ở `doc/CONTENT_GUIDE.md`.

Tổng cộng 140 mục (chữ cần viết: 63, chữ cần bạn duyệt: 30, dữ liệu chưa quyết định: 5, ảnh còn thiếu: 39, file đặc biệt còn thiếu: 3).

## Chữ cần viết (63)

Cách sửa: Mở file ở cột "Ở đâu", tới đúng dòng, thay cả đoạn `[TODO] …` bằng nội dung thật. Sửa ở cả hai file (tiếng Việt và tiếng Anh), giữ nguyên dấu ngoặc kép và các biến trong `{…}`.

| Khoá | Hiện ở đâu | Cần viết gì | Ở đâu |
|---|---|---|---|
| `meta.description` | Tab trình duyệt, kết quả tìm kiếm | Mô tả ngắn của trang cho kết quả tìm kiếm và khi chia sẻ link. Khoảng 120–160 ký tự. | `content/text/vi.json:5`<br>`content/text/en.json:5` |
| `intro.title` | Màn mở đầu | Tiêu đề lớn của màn mở đầu (lúc mặt nước rút xuống), như "Memento Mori" trên p3re.jp: một câu ngắn kiểu khẩu hiệu, khoảng 20 ký tự. | `content/text/vi.json:36`<br>`content/text/en.json:36` |
| `intro.line1` | Màn mở đầu | Dòng nhỏ thứ 1 dưới tiêu đề màn mở đầu. Khoảng 30 ký tự. | `content/text/vi.json:37`<br>`content/text/en.json:37` |
| `intro.line2` | Màn mở đầu | Dòng mở đầu thứ 2. Khoảng 30 ký tự. | `content/text/vi.json:38`<br>`content/text/en.json:38` |
| `intro.line3` | Màn mở đầu | Dòng mở đầu thứ 3. Khoảng 30 ký tự. | `content/text/vi.json:39`<br>`content/text/en.json:39` |
| `hero.visualAlt` | Hero (màn đầu tiên) | Mô tả ảnh key visual cho người dùng trình đọc màn hình. | `content/text/vi.json:46`<br>`content/text/en.json:46` |
| `reward.desc` | Khối nhận quà | Một dòng mô tả phần quà: 1800 và tên tiền tệ. Tên tiền tệ chưa chốt. Số lượng phải khớp với chiến dịch trong cơ sở dữ liệu (supabase/migrations/0002_prereg_campaign.sql). | `content/text/vi.json:50`<br>`content/text/en.json:50` |
| `reward.artAlt` | Khối nhận quà | Mô tả ảnh phần quà cho người dùng trình đọc màn hình. | `content/text/vi.json:51`<br>`content/text/en.json:51` |
| `reward.states.notOpen` | Khối nhận quà | Thông báo khi chưa mở đăng ký (website thật dùng trạng thái này cho tới khi có đăng ký thật). | `content/text/vi.json:66`<br>`content/text/en.json:66` |
| `story.title` | Giới thiệu | Tiêu đề phần giới thiệu thế giới game. | `content/text/vi.json:70`<br>`content/text/en.json:70` |
| `story.p1` | Giới thiệu | Đoạn giới thiệu thứ 1, 2–3 câu. Nói về thế giới và nhân vật, không nói về âm nhạc. | `content/text/vi.json:71`<br>`content/text/en.json:71` |
| `story.p2` | Giới thiệu | Đoạn giới thiệu thứ 2, 2–3 câu. | `content/text/vi.json:72`<br>`content/text/en.json:72` |
| `story.p3` | Giới thiệu | Đoạn giới thiệu thứ 3, 2–3 câu. | `content/text/vi.json:73`<br>`content/text/en.json:73` |
| `story.band1` | Giới thiệu | Khẩu hiệu thứ 1: dòng chữ nhỏ ở giữa trang, sau phần Gameplay. Vài chữ. | `content/text/vi.json:74`<br>`content/text/en.json:74` |
| `story.band2` | Giới thiệu | Khẩu hiệu thứ 2, dòng dưới khẩu hiệu 1. Vài chữ. | `content/text/vi.json:75`<br>`content/text/en.json:75` |
| `story.band3` | Giới thiệu | Khẩu hiệu thứ 3, dòng cuối. Vài chữ. | `content/text/vi.json:76`<br>`content/text/en.json:76` |
| `story.imageAlt` | Giới thiệu | Mô tả ảnh của phần giới thiệu. | `content/text/vi.json:77`<br>`content/text/en.json:77` |
| `features.coverAlt` | Tính năng | Mô tả ảnh bìa của phần Tính năng. | `content/text/vi.json:82`<br>`content/text/en.json:82` |
| `features.items.f1.image1Alt` | Tính năng | Mô tả ảnh thứ nhất của tính năng 1 cho người dùng trình đọc màn hình. | `content/text/vi.json:90`<br>`content/text/en.json:90` |
| `features.items.f1.image2Alt` | Tính năng | Mô tả ảnh thứ hai của tính năng 1 cho người dùng trình đọc màn hình. | `content/text/vi.json:91`<br>`content/text/en.json:91` |
| `features.items.f2.image1Alt` | Tính năng | Mô tả ảnh thứ nhất của tính năng 2 cho người dùng trình đọc màn hình. | `content/text/vi.json:97`<br>`content/text/en.json:97` |
| `features.items.f2.image2Alt` | Tính năng | Mô tả ảnh thứ hai của tính năng 2 cho người dùng trình đọc màn hình. | `content/text/vi.json:98`<br>`content/text/en.json:98` |
| `features.items.f3.image1Alt` | Tính năng | Mô tả ảnh thứ nhất của tính năng 3 cho người dùng trình đọc màn hình. | `content/text/vi.json:104`<br>`content/text/en.json:104` |
| `features.items.f3.image2Alt` | Tính năng | Mô tả ảnh thứ hai của tính năng 3 cho người dùng trình đọc màn hình. | `content/text/vi.json:105`<br>`content/text/en.json:105` |
| `features.items.f4.image1Alt` | Tính năng | Mô tả ảnh thứ nhất của tính năng 4 cho người dùng trình đọc màn hình. | `content/text/vi.json:111`<br>`content/text/en.json:111` |
| `features.items.f4.image2Alt` | Tính năng | Mô tả ảnh thứ hai của tính năng 4 cho người dùng trình đọc màn hình. | `content/text/vi.json:112`<br>`content/text/en.json:112` |
| `gameplay.coverAlt` | Gameplay | Mô tả ảnh bìa của phần Gameplay. | `content/text/vi.json:119`<br>`content/text/en.json:119` |
| `gameplay.tabs.g1.slides.s1` | Gameplay | Mô tả từng ảnh trong slider của tab 1. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:131`<br>`content/text/en.json:131` |
| `gameplay.tabs.g1.slides.s2` | Gameplay | Mô tả từng ảnh trong slider của tab 1. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:132`<br>`content/text/en.json:132` |
| `gameplay.tabs.g1.slides.s3` | Gameplay | Mô tả từng ảnh trong slider của tab 1. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:133`<br>`content/text/en.json:133` |
| `gameplay.tabs.g2.slides.s1` | Gameplay | Mô tả từng ảnh trong slider của tab 2. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:141`<br>`content/text/en.json:141` |
| `gameplay.tabs.g2.slides.s2` | Gameplay | Mô tả từng ảnh trong slider của tab 2. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:142`<br>`content/text/en.json:142` |
| `gameplay.tabs.g2.slides.s3` | Gameplay | Mô tả từng ảnh trong slider của tab 2. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:143`<br>`content/text/en.json:143` |
| `gameplay.tabs.g3.slides.s1` | Gameplay | Mô tả từng ảnh trong slider của tab 3. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:151`<br>`content/text/en.json:151` |
| `gameplay.tabs.g3.slides.s2` | Gameplay | Mô tả từng ảnh trong slider của tab 3. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:152`<br>`content/text/en.json:152` |
| `gameplay.tabs.g3.slides.s3` | Gameplay | Mô tả từng ảnh trong slider của tab 3. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:153`<br>`content/text/en.json:153` |
| `gameplay.tabs.g4.slides.s1` | Gameplay | Mô tả từng ảnh trong slider của tab 4. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:161`<br>`content/text/en.json:161` |
| `gameplay.tabs.g4.slides.s2` | Gameplay | Mô tả từng ảnh trong slider của tab 4. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:162`<br>`content/text/en.json:162` |
| `gameplay.tabs.g4.slides.s3` | Gameplay | Mô tả từng ảnh trong slider của tab 4. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:163`<br>`content/text/en.json:163` |
| `characters.line1` | Nhân vật | Dòng giới thiệu 1 dưới tiêu đề phần Nhân vật. Khoảng 40 ký tự. | `content/text/vi.json:170`<br>`content/text/en.json:170` |
| `characters.line2` | Nhân vật | Dòng giới thiệu 2. Khoảng 40 ký tự. | `content/text/vi.json:171`<br>`content/text/en.json:171` |
| `characters.line3` | Nhân vật | Dòng giới thiệu 3. Khoảng 40 ký tự. | `content/text/vi.json:172`<br>`content/text/en.json:172` |
| `characters.items.amiya.tagline` | Nhân vật | Một câu giới thiệu ngắn về nhân vật, hiện dưới tên trong hồ sơ. Khoảng 60 ký tự. | `content/text/vi.json:186`<br>`content/text/en.json:186` |
| `characters.items.amiya.profile` | Nhân vật | Đoạn hồ sơ nhân vật, 2–4 câu. | `content/text/vi.json:187`<br>`content/text/en.json:187` |
| `characters.items.amiya.cardAlt` | Nhân vật | Mô tả ảnh thẻ nhân vật cho người dùng trình đọc màn hình. | `content/text/vi.json:190`<br>`content/text/en.json:190` |
| `characters.items.amiya.idleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế đứng yên. | `content/text/vi.json:191`<br>`content/text/en.json:191` |
| `characters.items.amiya.battleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế chiến đấu. | `content/text/vi.json:192`<br>`content/text/en.json:192` |
| `characters.items.nova.tagline` | Nhân vật | Một câu giới thiệu ngắn về nhân vật, hiện dưới tên trong hồ sơ. Khoảng 60 ký tự. | `content/text/vi.json:196`<br>`content/text/en.json:196` |
| `characters.items.nova.profile` | Nhân vật | Đoạn hồ sơ nhân vật, 2–4 câu. | `content/text/vi.json:197`<br>`content/text/en.json:197` |
| `characters.items.nova.cardAlt` | Nhân vật | Mô tả ảnh thẻ nhân vật cho người dùng trình đọc màn hình. | `content/text/vi.json:200`<br>`content/text/en.json:200` |
| `characters.items.nova.idleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế đứng yên. | `content/text/vi.json:201`<br>`content/text/en.json:201` |
| `characters.items.nova.battleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế chiến đấu. | `content/text/vi.json:202`<br>`content/text/en.json:202` |
| `characters.items.echo.tagline` | Nhân vật | Một câu giới thiệu ngắn về nhân vật, hiện dưới tên trong hồ sơ. Khoảng 60 ký tự. | `content/text/vi.json:206`<br>`content/text/en.json:206` |
| `characters.items.echo.profile` | Nhân vật | Đoạn hồ sơ nhân vật, 2–4 câu. | `content/text/vi.json:207`<br>`content/text/en.json:207` |
| `characters.items.echo.cardAlt` | Nhân vật | Mô tả ảnh thẻ nhân vật cho người dùng trình đọc màn hình. | `content/text/vi.json:210`<br>`content/text/en.json:210` |
| `characters.items.echo.idleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế đứng yên. | `content/text/vi.json:211`<br>`content/text/en.json:211` |
| `characters.items.echo.battleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế chiến đấu. | `content/text/vi.json:212`<br>`content/text/en.json:212` |
| `characters.items.pulse.tagline` | Nhân vật | Một câu giới thiệu ngắn về nhân vật, hiện dưới tên trong hồ sơ. Khoảng 60 ký tự. | `content/text/vi.json:216`<br>`content/text/en.json:216` |
| `characters.items.pulse.profile` | Nhân vật | Đoạn hồ sơ nhân vật, 2–4 câu. | `content/text/vi.json:217`<br>`content/text/en.json:217` |
| `characters.items.pulse.cardAlt` | Nhân vật | Mô tả ảnh thẻ nhân vật cho người dùng trình đọc màn hình. | `content/text/vi.json:220`<br>`content/text/en.json:220` |
| `characters.items.pulse.idleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế đứng yên. | `content/text/vi.json:221`<br>`content/text/en.json:221` |
| `characters.items.pulse.battleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế chiến đấu. | `content/text/vi.json:222`<br>`content/text/en.json:222` |
| `footer.shareText` | Footer | Câu đi kèm link khi chia sẻ lên X. | `content/text/vi.json:246`<br>`content/text/en.json:246` |

## Chữ cần bạn duyệt (30)

Cách sửa: Đọc bản nháp hoặc bản dịch. Nếu đúng, chỉ xoá chữ `[REVIEW] ` ở đầu; nếu chưa đúng, sửa lại rồi xoá dấu.

| Khoá | Hiện ở đâu | Nội dung | Ở đâu |
|---|---|---|---|
| `features.summary` | Tính năng | [REVIEW] Đánh theo điệu nhạc trên hai làn với ba loại nốt, cùng những nhân vật mang khả năng riêng. Thu thập, nâng cấp đội hình và luôn có nhiệm vụ, sự kiện mới để chơi. | `content/text/vi.json:81`<br>`content/text/en.json:81` |
| `features.items.f1.tab` | Tính năng | [REVIEW] Hai làn | `content/text/vi.json:87`<br>`content/text/en.json:87` |
| `features.items.f1.title` | Tính năng | [REVIEW] Hai làn, ba loại nốt | `content/text/vi.json:88`<br>`content/text/en.json:88` |
| `features.items.f1.text` | Tính năng | [REVIEW] Nốt nhạc rơi xuống hai làn trái và phải theo điệu nhạc. Chạm, giữ, hoặc chạm cả hai làn cùng lúc. | `content/text/vi.json:89`<br>`content/text/en.json:89` |
| `features.items.f2.tab` | Tính năng | [REVIEW] Nhân vật | `content/text/vi.json:94`<br>`content/text/en.json:94` |
| `features.items.f2.title` | Tính năng | [REVIEW] Mỗi nhân vật một cách chơi | `content/text/vi.json:95`<br>`content/text/en.json:95` |
| `features.items.f2.text` | Tính năng | [REVIEW] Mỗi nhân vật có một kỹ năng bị động riêng, như giữ combo sau lần Miss đầu tiên hay hồi HP đều đặn. | `content/text/vi.json:96`<br>`content/text/en.json:96` |
| `features.items.f3.tab` | Tính năng | [REVIEW] Phát triển | `content/text/vi.json:101`<br>`content/text/en.json:101` |
| `features.items.f3.title` | Tính năng | [REVIEW] Thu thập và nâng cấp | `content/text/vi.json:102`<br>`content/text/en.json:102` |
| `features.items.f3.text` | Tính năng | [REVIEW] Nhận nhân vật mới từ gacha, rồi tăng cấp và nâng cấp để họ mạnh hơn. | `content/text/vi.json:103`<br>`content/text/en.json:103` |
| `features.items.f4.tab` | Tính năng | [REVIEW] Hoạt động | `content/text/vi.json:108`<br>`content/text/en.json:108` |
| `features.items.f4.title` | Tính năng | [REVIEW] Luôn có thứ để chơi | `content/text/vi.json:109`<br>`content/text/en.json:109` |
| `features.items.f4.text` | Tính năng | [REVIEW] Nhiệm vụ hằng ngày và hằng tuần, sự kiện giới hạn thời gian, chiến dịch cốt truyện và bảng xếp hạng được máy chủ kiểm tra để luôn công bằng. | `content/text/vi.json:110`<br>`content/text/en.json:110` |
| `gameplay.summary` | Gameplay | [REVIEW] Đánh trúng nốt theo nhịp để giữ combo, nạp Fever và đi tới cuối bài trước khi hết HP. Ngoài các bài nhạc, bạn thu thập nhân vật mới và làm nhiệm vụ mỗi ngày. | `content/text/vi.json:118`<br>`content/text/en.json:118` |
| `gameplay.tabs.g1.tab` | Gameplay | [REVIEW] Chiến đấu | `content/text/vi.json:127`<br>`content/text/en.json:127` |
| `gameplay.tabs.g1.title` | Gameplay | [REVIEW] Chiến đấu theo nhịp | `content/text/vi.json:128`<br>`content/text/en.json:128` |
| `gameplay.tabs.g1.text` | Gameplay | [REVIEW] Nốt rơi xuống hai làn và mỗi lần đánh được chấm Perfect, Great hoặc Hit; nốt bỏ lỡ là Miss. Mỗi lần Miss làm mất HP, nên hãy đi tới cuối bài trước khi hết HP. | `content/text/vi.json:129`<br>`content/text/en.json:129` |
| `gameplay.tabs.g2.tab` | Gameplay | [REVIEW] Combo & Fever | `content/text/vi.json:137`<br>`content/text/en.json:137` |
| `gameplay.tabs.g2.title` | Gameplay | [REVIEW] Combo và Fever | `content/text/vi.json:138`<br>`content/text/en.json:138` |
| `gameplay.tabs.g2.text` | Gameplay | [REVIEW] Đánh liên tục không trượt để tăng combo. Những cú đánh tốt nạp đầy thanh Fever; khi đầy, Fever bắt đầu và điểm tăng nhanh hơn. | `content/text/vi.json:139`<br>`content/text/en.json:139` |
| `gameplay.tabs.g3.tab` | Gameplay | [REVIEW] Gacha | `content/text/vi.json:147`<br>`content/text/en.json:147` |
| `gameplay.tabs.g3.title` | Gameplay | [REVIEW] Nhân vật mới từ gacha | `content/text/vi.json:148`<br>`content/text/en.json:148` |
| `gameplay.tabs.g3.text` | Gameplay | [REVIEW] Nhân vật mới đến từ gacha. Nếu 30 lượt liên tiếp chưa ra nhân vật 5★, lượt tiếp theo chắc chắn là 5★. | `content/text/vi.json:149`<br>`content/text/en.json:149` |
| `gameplay.tabs.g4.tab` | Gameplay | [REVIEW] Nhiệm vụ | `content/text/vi.json:157`<br>`content/text/en.json:157` |
| `gameplay.tabs.g4.title` | Gameplay | [REVIEW] Nhiệm vụ và điểm danh | `content/text/vi.json:158`<br>`content/text/en.json:158` |
| `gameplay.tabs.g4.text` | Gameplay | [REVIEW] Hoàn thành nhiệm vụ hằng ngày và hằng tuần, và nhận quà điểm danh mỗi tháng. | `content/text/vi.json:159`<br>`content/text/en.json:159` |
| `characters.items.amiya.passiveDescription` | Nhân vật | [REVIEW] Lần Miss đầu tiên trong mỗi lượt chơi không làm mất combo. | `content/text/vi.json:189` |
| `characters.items.nova.passiveDescription` | Nhân vật | [REVIEW] Mỗi lần Great có cơ hội được tính là Perfect. | `content/text/vi.json:199` |
| `characters.items.echo.passiveDescription` | Nhân vật | [REVIEW] Combo cao giúp Fever kéo dài hơn. | `content/text/vi.json:209` |
| `characters.items.pulse.passiveDescription` | Nhân vật | [REVIEW] Hồi một ít HP sau mỗi khoảng thời gian đều đặn. | `content/text/vi.json:219` |

## Dữ liệu chưa quyết định (5)

Cách sửa: Mở file, thay `null` bằng giá trị thật trong dấu ngoặc kép, ví dụ `"#6C4FD8"`. Rê chuột lên tên trường trong VS Code để xem mô tả.

| Trường | Hiện ở đâu | Cần gì | Ở đâu |
|---|---|---|---|
| `characters.items[amiya].themeColor` | Nhân vật | Màu chủ đạo của nhân vật, dạng #RRGGBB, làm nền phần Nhân vật khi nhân vật này hiện ra. Chọn màu sáng: chữ trên nền là màu navy #1D384A và cần tương phản ít nhất 4,5:1. null nghĩa là chưa chọn (trang tạm dùng bảng màu pastel). | `content/data/characters.json:10` |
| `characters.items[nova].themeColor` | Nhân vật | Màu chủ đạo của nhân vật, dạng #RRGGBB, làm nền phần Nhân vật khi nhân vật này hiện ra. Chọn màu sáng: chữ trên nền là màu navy #1D384A và cần tương phản ít nhất 4,5:1. null nghĩa là chưa chọn (trang tạm dùng bảng màu pastel). | `content/data/characters.json:39` |
| `characters.items[echo].themeColor` | Nhân vật | Màu chủ đạo của nhân vật, dạng #RRGGBB, làm nền phần Nhân vật khi nhân vật này hiện ra. Chọn màu sáng: chữ trên nền là màu navy #1D384A và cần tương phản ít nhất 4,5:1. null nghĩa là chưa chọn (trang tạm dùng bảng màu pastel). | `content/data/characters.json:68` |
| `characters.items[pulse].themeColor` | Nhân vật | Màu chủ đạo của nhân vật, dạng #RRGGBB, làm nền phần Nhân vật khi nhân vật này hiện ra. Chọn màu sáng: chữ trên nền là màu navy #1D384A và cần tương phản ít nhất 4,5:1. null nghĩa là chưa chọn (trang tạm dùng bảng màu pastel). | `content/data/characters.json:97` |
| `site.copyrightHolder` | Toàn trang (header, footer, chia sẻ) | Tên chủ sở hữu bản quyền ở dòng cuối trang. null nghĩa là chưa quyết định. | `content/data/site.json:10` |

## Ảnh còn thiếu (39)

Cách sửa: Xuất ảnh đúng kích thước và định dạng, đặt vào đúng đường dẫn trong thư mục `public/`. Khung giữ chỗ tự biến mất ở lần build sau, không cần sửa code.

| Ô ảnh | Hiện ở đâu | Cần gì | Ở đâu |
|---|---|---|---|
| `hero.desktop` | Hero (màn đầu tiên) | 2560 × 1440 px, WEBP | `public/images/hero/hero-desktop.webp` |
| `hero.mobile` | Hero (màn đầu tiên) | 1080 × 1920 px, WEBP | `public/images/hero/hero-mobile.webp` |
| `reward.art` | Khối nhận quà | 800 × 800 px, WEBP | `public/images/reward/reward.webp` |
| `story.image` | Giới thiệu | 1600 × 900 px, WEBP | `public/images/story/story.webp` |
| `features.cover` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/cover.webp` |
| `features.items[f1].images[0]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f1-1.webp` |
| `features.items[f1].images[1]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f1-2.webp` |
| `features.items[f2].images[0]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f2-1.webp` |
| `features.items[f2].images[1]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f2-2.webp` |
| `features.items[f3].images[0]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f3-1.webp` |
| `features.items[f3].images[1]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f3-2.webp` |
| `features.items[f4].images[0]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f4-1.webp` |
| `features.items[f4].images[1]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f4-2.webp` |
| `gameplay.cover` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/cover.webp` |
| `gameplay.tabs[g1].slides[0]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g1-1.webp` |
| `gameplay.tabs[g1].slides[1]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g1-2.webp` |
| `gameplay.tabs[g1].slides[2]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g1-3.webp` |
| `gameplay.tabs[g2].slides[0]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g2-1.webp` |
| `gameplay.tabs[g2].slides[1]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g2-2.webp` |
| `gameplay.tabs[g2].slides[2]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g2-3.webp` |
| `gameplay.tabs[g3].slides[0]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g3-1.webp` |
| `gameplay.tabs[g3].slides[1]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g3-2.webp` |
| `gameplay.tabs[g3].slides[2]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g3-3.webp` |
| `gameplay.tabs[g4].slides[0]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g4-1.webp` |
| `gameplay.tabs[g4].slides[1]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g4-2.webp` |
| `gameplay.tabs[g4].slides[2]` | Gameplay | 1280 × 720 px, WEBP | `public/images/gameplay/g4-3.webp` |
| `characters.items[amiya].images.card` | Nhân vật | 600 × 800 px, WEBP | `public/images/characters/amiya/card.webp` |
| `characters.items[amiya].images.idle` | Nhân vật | 600 × 800 px, PNG | `public/images/characters/amiya/idle.png` |
| `characters.items[amiya].images.battle` | Nhân vật | 600 × 800 px, PNG | `public/images/characters/amiya/battle.png` |
| `characters.items[nova].images.card` | Nhân vật | 600 × 800 px, WEBP | `public/images/characters/nova/card.webp` |
| `characters.items[nova].images.idle` | Nhân vật | 600 × 800 px, PNG | `public/images/characters/nova/idle.png` |
| `characters.items[nova].images.battle` | Nhân vật | 600 × 800 px, PNG | `public/images/characters/nova/battle.png` |
| `characters.items[echo].images.card` | Nhân vật | 600 × 800 px, WEBP | `public/images/characters/echo/card.webp` |
| `characters.items[echo].images.idle` | Nhân vật | 600 × 800 px, PNG | `public/images/characters/echo/idle.png` |
| `characters.items[echo].images.battle` | Nhân vật | 600 × 800 px, PNG | `public/images/characters/echo/battle.png` |
| `characters.items[pulse].images.card` | Nhân vật | 600 × 800 px, WEBP | `public/images/characters/pulse/card.webp` |
| `characters.items[pulse].images.idle` | Nhân vật | 600 × 800 px, PNG | `public/images/characters/pulse/idle.png` |
| `characters.items[pulse].images.battle` | Nhân vật | 600 × 800 px, PNG | `public/images/characters/pulse/battle.png` |
| `site.logo` | Toàn trang (header, footer, chia sẻ) | 1200 × 400 px, SVG | `public/images/brand/logo.svg` |

## File đặc biệt còn thiếu (3)

Cách sửa: Đặt file đúng tên và đúng thư mục ghi trong cột "Ở đâu".

| File | Hiện ở đâu | Cần gì | Ở đâu |
|---|---|---|---|
| `opengraph-image.png` | Ảnh hiện khi chia sẻ link | 1200 × 630 px, PNG hoặc JPG | `src/app/[locale]/opengraph-image.png` |
| `icon.png` | Biểu tượng trên tab trình duyệt | 512 × 512 px, PNG | `src/app/icon.png` |
| `theme.mp3` | Nhạc nền (nút tròn ở góc trên bên trái chỉ hiện khi có file) | MP3 nhạc của Promuse, có quyền phát công khai; sửa bpm và firstBeat trong content/data/site.json cho đúng bài | `public/audio/theme.mp3` |
