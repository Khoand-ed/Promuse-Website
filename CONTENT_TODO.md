# Nội dung còn thiếu

File này do `npm run check:content` tự sinh. Đừng sửa tay: sửa nội dung trong `content/` rồi chạy lại lệnh. Hướng dẫn đầy đủ ở `doc/CONTENT_GUIDE.md`.

Tổng cộng 140 mục (chữ cần viết: 86, chữ cần bạn duyệt: 9, dữ liệu chưa quyết định: 6, ảnh còn thiếu: 37, file đặc biệt còn thiếu: 2).

## Chữ cần viết (86)

Cách sửa: Mở file ở cột "Ở đâu", tới đúng dòng, thay cả đoạn `[TODO] …` bằng nội dung thật. Sửa ở cả hai file (tiếng Việt và tiếng Anh), giữ nguyên dấu ngoặc kép và các biến trong `{…}`.

| Khoá | Hiện ở đâu | Cần viết gì | Ở đâu |
|---|---|---|---|
| `meta.description` | Tab trình duyệt, kết quả tìm kiếm | Mô tả ngắn của trang cho kết quả tìm kiếm và khi chia sẻ link. Khoảng 120–160 ký tự. | `content/text/vi.json:5`<br>`content/text/en.json:5` |
| `intro.line1` | Màn mở đầu | Dòng mở đầu thứ 1 (trong 3 dòng hiện theo nhịp trước khi vào trang). Khoảng 30 ký tự. | `content/text/vi.json:31`<br>`content/text/en.json:31` |
| `intro.line2` | Màn mở đầu | Dòng mở đầu thứ 2. Khoảng 30 ký tự. | `content/text/vi.json:32`<br>`content/text/en.json:32` |
| `intro.line3` | Màn mở đầu | Dòng mở đầu thứ 3. Khoảng 30 ký tự. | `content/text/vi.json:33`<br>`content/text/en.json:33` |
| `hero.visualAlt` | Hero (màn đầu tiên) | Mô tả ảnh key visual cho người dùng trình đọc màn hình. | `content/text/vi.json:41`<br>`content/text/en.json:41` |
| `reward.desc` | Khối nhận quà | Một dòng mô tả phần quà: số lượng và tên tiền tệ. Tên tiền tệ chưa chốt; số lượng phải khớp với chiến dịch trong cơ sở dữ liệu. | `content/text/vi.json:45`<br>`content/text/en.json:45` |
| `reward.artAlt` | Khối nhận quà | Mô tả ảnh phần quà cho người dùng trình đọc màn hình. | `content/text/vi.json:46`<br>`content/text/en.json:46` |
| `reward.states.registered` | Khối nhận quà | Thông báo đăng ký thành công; có thể dùng {email}. Không được hứa nhận quà trong game, vì game chưa có đăng nhập Google. | `content/text/vi.json:55`<br>`content/text/en.json:55` |
| `reward.states.notOpen` | Khối nhận quà | Thông báo khi chưa mở đăng ký (website thật dùng trạng thái này cho tới khi có đăng ký thật). | `content/text/vi.json:61`<br>`content/text/en.json:61` |
| `story.title` | Giới thiệu | Tiêu đề phần giới thiệu thế giới game. | `content/text/vi.json:65`<br>`content/text/en.json:65` |
| `story.p1` | Giới thiệu | Đoạn giới thiệu thứ 1, 2–3 câu. Nói về thế giới và nhân vật, không nói về âm nhạc. | `content/text/vi.json:66`<br>`content/text/en.json:66` |
| `story.p2` | Giới thiệu | Đoạn giới thiệu thứ 2, 2–3 câu. | `content/text/vi.json:67`<br>`content/text/en.json:67` |
| `story.p3` | Giới thiệu | Đoạn giới thiệu thứ 3, 2–3 câu. | `content/text/vi.json:68`<br>`content/text/en.json:68` |
| `story.band1` | Giới thiệu | Khẩu hiệu thứ 1, chữ rất lớn chạy ngang màn hình. Vài chữ. | `content/text/vi.json:69`<br>`content/text/en.json:69` |
| `story.band2` | Giới thiệu | Khẩu hiệu thứ 2. Vài chữ. | `content/text/vi.json:70`<br>`content/text/en.json:70` |
| `story.band3` | Giới thiệu | Khẩu hiệu thứ 3. Vài chữ. | `content/text/vi.json:71`<br>`content/text/en.json:71` |
| `story.imageAlt` | Giới thiệu | Mô tả ảnh của phần giới thiệu. | `content/text/vi.json:72`<br>`content/text/en.json:72` |
| `features.summary` | Tính năng | Hai câu tóm tắt dưới tiêu đề phần Tính năng. | `content/text/vi.json:76`<br>`content/text/en.json:76` |
| `features.items.f1.title` | Tính năng | Tên tính năng 1: hiện trên thẻ ở trang chính và trên tab 1 của modal Tính năng. Khoảng 30 ký tự. | `content/text/vi.json:81`<br>`content/text/en.json:81` |
| `features.items.f1.line` | Tính năng | Một dòng mô tả dưới tên thẻ tính năng 1 trên trang chính. Khoảng 80 ký tự. | `content/text/vi.json:82`<br>`content/text/en.json:82` |
| `features.items.f1.text` | Tính năng | Một hoặc hai câu giải thích tính năng 1, hiện trong tab 1 của modal. Viết đơn giản, chỉ dùng dữ kiện trong doc/GAME_FACTS.md. | `content/text/vi.json:83`<br>`content/text/en.json:83` |
| `features.items.f1.image1Alt` | Tính năng | Mô tả ảnh thứ nhất của tính năng 1 cho người dùng trình đọc màn hình. | `content/text/vi.json:84`<br>`content/text/en.json:84` |
| `features.items.f1.image2Alt` | Tính năng | Mô tả ảnh thứ hai của tính năng 1 cho người dùng trình đọc màn hình. | `content/text/vi.json:85`<br>`content/text/en.json:85` |
| `features.items.f2.title` | Tính năng | Tên tính năng 2: hiện trên thẻ ở trang chính và trên tab 2 của modal Tính năng. Khoảng 30 ký tự. | `content/text/vi.json:88`<br>`content/text/en.json:88` |
| `features.items.f2.line` | Tính năng | Một dòng mô tả dưới tên thẻ tính năng 2 trên trang chính. Khoảng 80 ký tự. | `content/text/vi.json:89`<br>`content/text/en.json:89` |
| `features.items.f2.text` | Tính năng | Một hoặc hai câu giải thích tính năng 2, hiện trong tab 2 của modal. Viết đơn giản, chỉ dùng dữ kiện trong doc/GAME_FACTS.md. | `content/text/vi.json:90`<br>`content/text/en.json:90` |
| `features.items.f2.image1Alt` | Tính năng | Mô tả ảnh thứ nhất của tính năng 2 cho người dùng trình đọc màn hình. | `content/text/vi.json:91`<br>`content/text/en.json:91` |
| `features.items.f2.image2Alt` | Tính năng | Mô tả ảnh thứ hai của tính năng 2 cho người dùng trình đọc màn hình. | `content/text/vi.json:92`<br>`content/text/en.json:92` |
| `features.items.f3.title` | Tính năng | Tên tính năng 3: hiện trên thẻ ở trang chính và trên tab 3 của modal Tính năng. Khoảng 30 ký tự. | `content/text/vi.json:95`<br>`content/text/en.json:95` |
| `features.items.f3.line` | Tính năng | Một dòng mô tả dưới tên thẻ tính năng 3 trên trang chính. Khoảng 80 ký tự. | `content/text/vi.json:96`<br>`content/text/en.json:96` |
| `features.items.f3.text` | Tính năng | Một hoặc hai câu giải thích tính năng 3, hiện trong tab 3 của modal. Viết đơn giản, chỉ dùng dữ kiện trong doc/GAME_FACTS.md. | `content/text/vi.json:97`<br>`content/text/en.json:97` |
| `features.items.f3.image1Alt` | Tính năng | Mô tả ảnh thứ nhất của tính năng 3 cho người dùng trình đọc màn hình. | `content/text/vi.json:98`<br>`content/text/en.json:98` |
| `features.items.f3.image2Alt` | Tính năng | Mô tả ảnh thứ hai của tính năng 3 cho người dùng trình đọc màn hình. | `content/text/vi.json:99`<br>`content/text/en.json:99` |
| `features.items.f4.title` | Tính năng | Tên tính năng 4: hiện trên thẻ ở trang chính và trên tab 4 của modal Tính năng. Khoảng 30 ký tự. | `content/text/vi.json:102`<br>`content/text/en.json:102` |
| `features.items.f4.line` | Tính năng | Một dòng mô tả dưới tên thẻ tính năng 4 trên trang chính. Khoảng 80 ký tự. | `content/text/vi.json:103`<br>`content/text/en.json:103` |
| `features.items.f4.text` | Tính năng | Một hoặc hai câu giải thích tính năng 4, hiện trong tab 4 của modal. Viết đơn giản, chỉ dùng dữ kiện trong doc/GAME_FACTS.md. | `content/text/vi.json:104`<br>`content/text/en.json:104` |
| `features.items.f4.image1Alt` | Tính năng | Mô tả ảnh thứ nhất của tính năng 4 cho người dùng trình đọc màn hình. | `content/text/vi.json:105`<br>`content/text/en.json:105` |
| `features.items.f4.image2Alt` | Tính năng | Mô tả ảnh thứ hai của tính năng 4 cho người dùng trình đọc màn hình. | `content/text/vi.json:106`<br>`content/text/en.json:106` |
| `gameplay.summary` | Gameplay | Hai câu tóm tắt cách chơi dưới tiêu đề phần Gameplay. | `content/text/vi.json:112`<br>`content/text/en.json:112` |
| `gameplay.tabs.g1.title` | Gameplay | Tiêu đề tab 1 trong modal Gameplay. Khoảng 30 ký tự. | `content/text/vi.json:120`<br>`content/text/en.json:120` |
| `gameplay.tabs.g1.text` | Gameplay | Đoạn giải thích ngắn cho tab 1, viết đơn giản và dễ hiểu, không đi vào chi tiết luật chơi. Chỉ dùng dữ kiện trong doc/GAME_FACTS.md. | `content/text/vi.json:121`<br>`content/text/en.json:121` |
| `gameplay.tabs.g1.slides.s1` | Gameplay | Mô tả từng ảnh trong slider của tab 1. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:123`<br>`content/text/en.json:123` |
| `gameplay.tabs.g1.slides.s2` | Gameplay | Mô tả từng ảnh trong slider của tab 1. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:124`<br>`content/text/en.json:124` |
| `gameplay.tabs.g1.slides.s3` | Gameplay | Mô tả từng ảnh trong slider của tab 1. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:125`<br>`content/text/en.json:125` |
| `gameplay.tabs.g2.title` | Gameplay | Tiêu đề tab 2 trong modal Gameplay. Khoảng 30 ký tự. | `content/text/vi.json:129`<br>`content/text/en.json:129` |
| `gameplay.tabs.g2.text` | Gameplay | Đoạn giải thích ngắn cho tab 2, viết đơn giản và dễ hiểu, không đi vào chi tiết luật chơi. Chỉ dùng dữ kiện trong doc/GAME_FACTS.md. | `content/text/vi.json:130`<br>`content/text/en.json:130` |
| `gameplay.tabs.g2.slides.s1` | Gameplay | Mô tả từng ảnh trong slider của tab 2. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:132`<br>`content/text/en.json:132` |
| `gameplay.tabs.g2.slides.s2` | Gameplay | Mô tả từng ảnh trong slider của tab 2. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:133`<br>`content/text/en.json:133` |
| `gameplay.tabs.g2.slides.s3` | Gameplay | Mô tả từng ảnh trong slider của tab 2. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:134`<br>`content/text/en.json:134` |
| `gameplay.tabs.g3.title` | Gameplay | Tiêu đề tab 3 trong modal Gameplay. Khoảng 30 ký tự. | `content/text/vi.json:138`<br>`content/text/en.json:138` |
| `gameplay.tabs.g3.text` | Gameplay | Đoạn giải thích ngắn cho tab 3, viết đơn giản và dễ hiểu, không đi vào chi tiết luật chơi. Chỉ dùng dữ kiện trong doc/GAME_FACTS.md. | `content/text/vi.json:139`<br>`content/text/en.json:139` |
| `gameplay.tabs.g3.slides.s1` | Gameplay | Mô tả từng ảnh trong slider của tab 3. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:141`<br>`content/text/en.json:141` |
| `gameplay.tabs.g3.slides.s2` | Gameplay | Mô tả từng ảnh trong slider của tab 3. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:142`<br>`content/text/en.json:142` |
| `gameplay.tabs.g3.slides.s3` | Gameplay | Mô tả từng ảnh trong slider của tab 3. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:143`<br>`content/text/en.json:143` |
| `gameplay.tabs.g4.title` | Gameplay | Tiêu đề tab 4 trong modal Gameplay. Khoảng 30 ký tự. | `content/text/vi.json:147`<br>`content/text/en.json:147` |
| `gameplay.tabs.g4.text` | Gameplay | Đoạn giải thích ngắn cho tab 4, viết đơn giản và dễ hiểu, không đi vào chi tiết luật chơi. Chỉ dùng dữ kiện trong doc/GAME_FACTS.md. | `content/text/vi.json:148`<br>`content/text/en.json:148` |
| `gameplay.tabs.g4.slides.s1` | Gameplay | Mô tả từng ảnh trong slider của tab 4. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:150`<br>`content/text/en.json:150` |
| `gameplay.tabs.g4.slides.s2` | Gameplay | Mô tả từng ảnh trong slider của tab 4. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:151`<br>`content/text/en.json:151` |
| `gameplay.tabs.g4.slides.s3` | Gameplay | Mô tả từng ảnh trong slider của tab 4. Mỗi ảnh khai báo trong content/data/gameplay.json trỏ tới một khoá ở đây. | `content/text/vi.json:152`<br>`content/text/en.json:152` |
| `characters.items.amiya.tagline` | Nhân vật | Một câu giới thiệu ngắn về nhân vật, hiện dưới tên trong hồ sơ. Khoảng 60 ký tự. | `content/text/vi.json:172`<br>`content/text/en.json:172` |
| `characters.items.amiya.profile` | Nhân vật | Đoạn hồ sơ nhân vật, 2–4 câu. | `content/text/vi.json:173`<br>`content/text/en.json:173` |
| `characters.items.amiya.cardAlt` | Nhân vật | Mô tả ảnh thẻ nhân vật cho người dùng trình đọc màn hình. | `content/text/vi.json:176`<br>`content/text/en.json:176` |
| `characters.items.amiya.idleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế đứng yên. | `content/text/vi.json:177`<br>`content/text/en.json:177` |
| `characters.items.amiya.battleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế chiến đấu. | `content/text/vi.json:178`<br>`content/text/en.json:178` |
| `characters.items.nova.tagline` | Nhân vật | Một câu giới thiệu ngắn về nhân vật, hiện dưới tên trong hồ sơ. Khoảng 60 ký tự. | `content/text/vi.json:182`<br>`content/text/en.json:182` |
| `characters.items.nova.profile` | Nhân vật | Đoạn hồ sơ nhân vật, 2–4 câu. | `content/text/vi.json:183`<br>`content/text/en.json:183` |
| `characters.items.nova.cardAlt` | Nhân vật | Mô tả ảnh thẻ nhân vật cho người dùng trình đọc màn hình. | `content/text/vi.json:186`<br>`content/text/en.json:186` |
| `characters.items.nova.idleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế đứng yên. | `content/text/vi.json:187`<br>`content/text/en.json:187` |
| `characters.items.nova.battleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế chiến đấu. | `content/text/vi.json:188`<br>`content/text/en.json:188` |
| `characters.items.echo.tagline` | Nhân vật | Một câu giới thiệu ngắn về nhân vật, hiện dưới tên trong hồ sơ. Khoảng 60 ký tự. | `content/text/vi.json:192`<br>`content/text/en.json:192` |
| `characters.items.echo.profile` | Nhân vật | Đoạn hồ sơ nhân vật, 2–4 câu. | `content/text/vi.json:193`<br>`content/text/en.json:193` |
| `characters.items.echo.cardAlt` | Nhân vật | Mô tả ảnh thẻ nhân vật cho người dùng trình đọc màn hình. | `content/text/vi.json:196`<br>`content/text/en.json:196` |
| `characters.items.echo.idleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế đứng yên. | `content/text/vi.json:197`<br>`content/text/en.json:197` |
| `characters.items.echo.battleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế chiến đấu. | `content/text/vi.json:198`<br>`content/text/en.json:198` |
| `characters.items.pulse.tagline` | Nhân vật | Một câu giới thiệu ngắn về nhân vật, hiện dưới tên trong hồ sơ. Khoảng 60 ký tự. | `content/text/vi.json:202`<br>`content/text/en.json:202` |
| `characters.items.pulse.profile` | Nhân vật | Đoạn hồ sơ nhân vật, 2–4 câu. | `content/text/vi.json:203`<br>`content/text/en.json:203` |
| `characters.items.pulse.cardAlt` | Nhân vật | Mô tả ảnh thẻ nhân vật cho người dùng trình đọc màn hình. | `content/text/vi.json:206`<br>`content/text/en.json:206` |
| `characters.items.pulse.idleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế đứng yên. | `content/text/vi.json:207`<br>`content/text/en.json:207` |
| `characters.items.pulse.battleAlt` | Nhân vật | Mô tả hình nhân vật ở tư thế chiến đấu. | `content/text/vi.json:208`<br>`content/text/en.json:208` |
| `footer.shareText` | Footer | Câu đi kèm link khi chia sẻ lên X. | `content/text/vi.json:232`<br>`content/text/en.json:232` |
| `privacy.intro` | Trang quyền riêng tư | Đoạn mở đầu: trang này nói về dữ liệu nào và vì sao. | `content/text/vi.json:245`<br>`content/text/en.json:245` |
| `privacy.why` | Trang quyền riêng tư | Lý do lưu dữ liệu. | `content/text/vi.json:253`<br>`content/text/en.json:253` |
| `privacy.processors` | Trang quyền riêng tư | Các dịch vụ xử lý dữ liệu: Supabase, Vercel, Google. | `content/text/vi.json:255`<br>`content/text/en.json:255` |
| `privacy.retention` | Trang quyền riêng tư | Dữ liệu được giữ trong bao lâu. | `content/text/vi.json:257`<br>`content/text/en.json:257` |
| `privacy.deletion` | Trang quyền riêng tư | Cách yêu cầu xoá dữ liệu. | `content/text/vi.json:259`<br>`content/text/en.json:259` |
| `privacy.contact` | Trang quyền riêng tư | Câu mời liên hệ. Giữ nguyên {email}: địa chỉ lấy từ content/data/site.json. | `content/text/vi.json:261`<br>`content/text/en.json:261` |

## Chữ cần bạn duyệt (9)

Cách sửa: Đọc bản nháp hoặc bản dịch. Nếu đúng, chỉ xoá chữ `[REVIEW] ` ở đầu; nếu chưa đúng, sửa lại rồi xoá dấu.

| Khoá | Hiện ở đâu | Nội dung | Ở đâu |
|---|---|---|---|
| `characters.items.amiya.passiveDescription` | Nhân vật | [REVIEW] Lần Miss đầu tiên trong mỗi lượt chơi không làm mất combo. | `content/text/vi.json:175` |
| `characters.items.nova.passiveDescription` | Nhân vật | [REVIEW] Mỗi lần Great có cơ hội được tính là Perfect. | `content/text/vi.json:185` |
| `characters.items.echo.passiveDescription` | Nhân vật | [REVIEW] Combo cao giúp Fever kéo dài hơn. | `content/text/vi.json:195` |
| `characters.items.pulse.passiveDescription` | Nhân vật | [REVIEW] Hồi một ít HP sau mỗi khoảng thời gian đều đặn. | `content/text/vi.json:205` |
| `privacy.storedEmail` | Trang quyền riêng tư | [REVIEW] Địa chỉ email của tài khoản Google | `content/text/vi.json:247`<br>`content/text/en.json:247` |
| `privacy.storedGoogleId` | Trang quyền riêng tư | [REVIEW] Mã tài khoản Google (không phải mật khẩu) | `content/text/vi.json:248`<br>`content/text/en.json:248` |
| `privacy.storedLocale` | Trang quyền riêng tư | [REVIEW] Ngôn ngữ bạn dùng trên trang | `content/text/vi.json:249`<br>`content/text/en.json:249` |
| `privacy.storedCampaign` | Trang quyền riêng tư | [REVIEW] Chương trình đăng ký sớm bạn tham gia | `content/text/vi.json:250`<br>`content/text/en.json:250` |
| `privacy.storedTime` | Trang quyền riêng tư | [REVIEW] Thời điểm đăng ký | `content/text/vi.json:251`<br>`content/text/en.json:251` |

## Dữ liệu chưa quyết định (6)

Cách sửa: Mở file, thay `null` bằng giá trị thật trong dấu ngoặc kép, ví dụ `"#6C4FD8"`. Rê chuột lên tên trường trong VS Code để xem mô tả.

| Trường | Hiện ở đâu | Cần gì | Ở đâu |
|---|---|---|---|
| `characters.items[amiya].themeColor` | Nhân vật | Màu chủ đạo của nhân vật, dạng #RRGGBB. null nghĩa là chưa chọn. | `content/data/characters.json:10` |
| `characters.items[nova].themeColor` | Nhân vật | Màu chủ đạo của nhân vật, dạng #RRGGBB. null nghĩa là chưa chọn. | `content/data/characters.json:39` |
| `characters.items[echo].themeColor` | Nhân vật | Màu chủ đạo của nhân vật, dạng #RRGGBB. null nghĩa là chưa chọn. | `content/data/characters.json:68` |
| `characters.items[pulse].themeColor` | Nhân vật | Màu chủ đạo của nhân vật, dạng #RRGGBB. null nghĩa là chưa chọn. | `content/data/characters.json:97` |
| `site.copyrightHolder` | Toàn trang (header, footer, chia sẻ) | Tên chủ sở hữu bản quyền ở dòng cuối trang. null nghĩa là chưa quyết định. | `content/data/site.json:5` |
| `site.privacyContactEmail` | Toàn trang (header, footer, chia sẻ) | Email nhận câu hỏi và yêu cầu xoá dữ liệu, hiện trên trang quyền riêng tư. null nghĩa là chưa có. | `content/data/site.json:6` |

## Ảnh còn thiếu (37)

Cách sửa: Xuất ảnh đúng kích thước và định dạng, đặt vào đúng đường dẫn trong thư mục `public/`. Khung giữ chỗ tự biến mất ở lần build sau, không cần sửa code.

| Ô ảnh | Hiện ở đâu | Cần gì | Ở đâu |
|---|---|---|---|
| `hero.desktop` | Hero (màn đầu tiên) | 2560 × 1440 px, WEBP | `public/images/hero/hero-desktop.webp` |
| `hero.mobile` | Hero (màn đầu tiên) | 1080 × 1920 px, WEBP | `public/images/hero/hero-mobile.webp` |
| `reward.art` | Khối nhận quà | 800 × 800 px, WEBP | `public/images/reward/reward.webp` |
| `story.image` | Giới thiệu | 1600 × 1000 px, WEBP | `public/images/story/story.webp` |
| `features.items[f1].images[0]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f1-1.webp` |
| `features.items[f1].images[1]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f1-2.webp` |
| `features.items[f2].images[0]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f2-1.webp` |
| `features.items[f2].images[1]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f2-2.webp` |
| `features.items[f3].images[0]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f3-1.webp` |
| `features.items[f3].images[1]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f3-2.webp` |
| `features.items[f4].images[0]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f4-1.webp` |
| `features.items[f4].images[1]` | Tính năng | 1280 × 720 px, WEBP | `public/images/features/f4-2.webp` |
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

## File đặc biệt còn thiếu (2)

Cách sửa: Đặt file đúng tên và đúng thư mục ghi trong cột "Ở đâu".

| File | Hiện ở đâu | Cần gì | Ở đâu |
|---|---|---|---|
| `opengraph-image.png` | Ảnh hiện khi chia sẻ link | 1200 × 630 px, PNG hoặc JPG | `src/app/[locale]/opengraph-image.png` |
| `icon.png` | Biểu tượng trên tab trình duyệt | 512 × 512 px, PNG | `src/app/icon.png` |
