# PROJECT_STATUS — Telegram Vietsub Movie Catalog

Cập nhật sau mỗi phase, theo format báo cáo của Master Prompt §11.

---

## PHASE: 0 – PREFLIGHT
STATUS: PASS

COMPLETED:
- Kiểm tra công cụ: Node v24.22.1, npm 10.9.4, git 2.43.0
- GitHub đã kết nối (HelenT93 qua connector `/opt/hatch/bin/github`); `gh` CLI
  chưa đăng nhập — không dùng
- Xác nhận giới hạn miễn phí: Vite/React/Tailwind (0đ), GitHub Free (0đ)
- Tạo TASKS.md, DECISIONS.md, PROJECT_STATUS.md

TEST RESULTS:
- Không có test ở phase này; kiểm tra thủ công bằng lệnh version

FILES CHANGED:
- TASKS.md, DECISIONS.md, PROJECT_STATUS.md (mới)

DEPLOYMENT STATUS:
- Chưa deploy (không thuộc phạm vi Phase 0)

NEXT ACTION:
- Phase 1: scaffold repo

USER ACTION REQUIRED:
- Không. Cloudflare auth và Bot Telegram để Phase 7 / Phase 4 (sẽ hỏi khi tới).

---

## PHASE: 1 – PROJECT INITIALIZATION
STATUS: PARTIAL (code xong, push GitHub bị chặn ở phía provider)

COMPLETED:
- Scaffold Vite 8 + React 19 + TypeScript strict + Tailwind v4
  (`@tailwindcss/vite`), react-router-dom 7
- Cấu trúc src/components, src/pages, src/lib
- Vitest 5 + jsdom; oxlint
- Scripts: dev, build, preview, test, test:watch, lint
- .env.example (VITE_BOT_USERNAME, VITE_API_BASE_URL), .gitignore (node_modules, dist)
- README.md, TASKS.md, DECISIONS.md
- Sửa lỗi build TS2769: `vite.config.ts` dùng `defineConfig` từ `vitest/config`
- Commit local: `9a52ea9` trên branch main (35 files) — code đã sẵn sàng để push

TEST RESULTS:
- `npm test`: 25/25 PASS (api.test.ts 18, format.test.ts 7)
- `npm run build`: PASS (tsc + vite, 31 modules, dist 2.2 MB gồm poster)

FILES CHANGED:
- package.json, vite.config.ts, tsconfig*, index.html, src/**, public/**
- README.md, TASKS.md, DECISIONS.md, PROJECT_STATUS.md, .env.example

DEPLOYMENT STATUS:
- Repo GitHub: **ĐÃ TẠO** 2026-11-16 14:19 qua trình duyệt (Helen đăng nhập
  GitHub, tạo public repo trống): https://github.com/HelenT93/telegram-vietsub-catalog
  — xác minh trống (list_commits: 409 Git Repository is empty).
- **Push API bị chặn (đã xác minh 2 lần):** `push_files` trả 403 "Resource not
  accessible by integration" khi tạo git tree (POST git/trees), dù App đã được
  chị thêm đúng repo (kiểm tra trên trang cài đặt App 14:28: "Only select
  repositories", đúng 1 repo telegram-vietsub-catalog, quyền Read+write code)
  và dù đã thử lại sau khi refresh trạng thái. Đường ghi Contents API thì
  HOẠT ĐỘNG (create_or_update_file đã tạo .env.example, commit 4d9476a) — chỉ
  riêng endpoint git/trees của push_files bị từ chối. LƯU Ý: lần test đó em
  gõ tay base64 nên file .env.example trên remote bị ghi sai nội dung (chứa
  chuỗi base64 thay vì text thật); đã sửa bằng cách upload lại file đúng qua
  trình duyệt (xác minh SHA b12b1524 khớp local).
- **ĐÃ ĐẨY ĐỦ CODE BẰNG TRÌNH DUYỆT (14:29–14:37):** 36 file qua giao diện
  Upload của GitHub, từng thư mục, commit thẳng lên main (11 commit). Xác minh
  qua API: commit mới nhất 0192a7d; .env.example đã đúng nội dung.
- **LƯU Ý ĐỒNG BỘ:** local git (3 commit) KHÔNG khớp remote (11 commit do
  upload web + commit khởi tạo của provider). Lần đẩy code sau: clone mới
  từ remote rồi làm việc trên đó, không push_files từ local này khi chưa
  đồng bộ (xem DECISIONS.md).
- Vite base đã sửa `/telegram-vietsub-catalog/` + workflow
  `.github/workflows/deploy.yml` (test 25/25 PASS, build PASS, asset trong
  dist đã đúng base).

NEXT ACTION:
- Helen tạo repo trống `HelenT93/telegram-vietsub-catalog` (public, không
  README khởi tạo) trên github.com, hoặc cấp lại quyền tạo repo cho GitHub App;
  sau đó chạy lại push (source UTF-8 qua `push_files`, poster qua
  `create_or_update_file`)

USER ACTION REQUIRED:
- Tạo repo trống trên GitHub (hoặc cấp quyền tạo repo cho GitHub App) — xem trên.

---

## PHASE: 2 – FRONTEND MVP
STATUS: PASS

COMPLETED:
- Home: header "Kho Phim Vietsub", search (không phân biệt dấu/hoa-thường),
  genre chips, sort (mới nhất / tên A–Z / nhiều tập nhất), sections: Phim mới
  cập nhật, Phim nổi bật, Phim miễn phí, Phim đang Vietsub, Tất cả phim
- MovieCard: poster 2:3, title_vi, genre, tập đã phát/tổng, badge trạng thái,
  nhãn MIỄN PHÍ hoặc giá VND
- MovieDetail `/movie/:slug`: poster, title_vi, title_original, synopsis,
  genre, tập, trạng thái, giá; CTA "XEM PHIM NGAY" (free) / "LIÊN HỆ ADMIN"
  (paid, deep link `t.me/<bot>?start=movie_<id>`)
- CTA an toàn demo: phim miễn phí chưa có public_url -> thông báo demo (không
  bịa link); bot chưa cấu hình -> thông báo hướng dẫn (không link chết)
- Loading (skeleton), empty (không kết quả / chưa có phim), error (kèm nút thử lại)
- Telegram WebApp SDK qua CDN + fallback: ngoài Telegram vẫn chạy đầy đủ, hiện
  banner "Mở trong Telegram để có trải nghiệm đầy đủ"; nút Back Telegram ở trang chi tiết
- Banner demo: "Bản demo — dữ liệu mẫu, chưa phải phim thật"
- Seed 3 phim mẫu hư cấu (1 miễn phí, 1 trả phí 49.000 ₫, 1 đang Vietsub
  69.000 ₫, 2 phim nổi bật) + 3 poster AI 1280×1920 (2:3), không dùng phim/diễn viên thật
- `public/404.html` SPA fallback cho static host
- Mobile-first, dark theme, responsive

TEST RESULTS:
- `npm test`: 25/25 PASS (search/filter/sort/format/api load + error cases)
- `npm run build`: PASS — dist/index.html 0.90 kB, JS 274 kB (gzip 86 kB),
  CSS 20 kB (gzip 4.8 kB)
- `npm run preview` + curl: `/` HTTP 200 (title đúng), `/movie/mua-he-khong-tro-lai`
  HTTP 200, `/data/movies.json` HTTP 200 (3 phim, đúng slug),
  `/posters/poster-mua-he-khong-tro-lai.webp` HTTP 200, bundle JS HTTP 200
  (chứa "Kho Phim Vietsub", "XEM PHIM NGAY"), CSS HTTP 200, route lạ HTTP 200
  (SPA fallback)
- Chưa làm: Playwright E2E, kiểm thử Telegram iOS/Android thật (cần bot + deploy)

FILES CHANGED:
- src/lib/{types,format,api,telegram,useMovies}.ts (+ 2 file test)
- src/components/{MovieCard,MovieRow}.tsx
- src/pages/{Home,MovieDetail}.tsx
- src/App.tsx, src/index.css, index.html, public/data/movies.json,
  public/posters/*.webp, public/404.html

DEPLOYMENT STATUS:
- **LIVE — GitHub Pages: https://helent93.github.io/telegram-vietsub-catalog/**
  (Pages source: GitHub Actions, bật 14:29 qua trình duyệt; workflow Deploy to
  GitHub Pages tự chạy theo mỗi lần đẩy code).
- Xác minh bằng curl 14:38: `/` HTTP 200 (title "Kho Phim Vietsub — Thư viện
  phim Vietsub"); `/data/movies.json` HTTP 200 (3 phim đúng dữ liệu);
  poster .webp HTTP 200 (766 KB); bundle JS HTTP 200 (274 KB); route chi tiết
  `/movie/mua-he-khong-tro-lai` trả HTTP 404 nhưng body là app shell (do
  GitHub Pages phục vụ 404.html — SPA vẫn tải và render bình thường, chỉ mã
  trạng thái là 404; deep link chia sẻ vẫn mở được app).
- Kiểm thử hiển thị thực tế trên trình duyệt: đang chạy (xem kết quả trong
  PHASE 7).

---

## PHASE: 7 – DEPLOYMENT
STATUS: PASS (chờ kết quả kiểm thử hiển thị thực tế)

COMPLETED:
- Bật GitHub Pages, source GitHub Actions (qua trình duyệt, 14:29)
- Đẩy đủ 36 file lên main qua giao diện web GitHub (14:29–14:37, 11 commit)
- Workflow Deploy to GitHub Pages chạy và triển khai thành công (site trả 200)

TEST RESULTS:
- curl: home 200, movies.json 200 (3 phim), poster 200, JS bundle 200
- **Lỗi phát hiện khi kiểm thử hiển thị thực tế 14:38 (browser):** (1) mở
  thẳng URL sub-path thì app hiện trang 404 nội bộ thay vì danh mục — do
  `BrowserRouter` thiếu `basename`; (2) tất cả poster 404 — do `poster_url`
  trong movies.json là đường dẫn tuyệt đối từ gốc (`/posters/...`) trong khi
  app chạy dưới sub-path; (3) `public/404.html` là bản copy tĩnh của
  index.html nguồn (`/src/main.tsx` không tồn tại ở production) nên link
  chia sẻ trang chi tiết sẽ trắng trang. **ĐÃ SỬA 14:39–14:41:** basename =
  `import.meta.env.BASE_URL`; `resolvePosterUrl()` gắn BASE_URL cho poster
  trong `loadMovies()` (+ 4 test mới, tổng 29/29 PASS); `postbuild` copy
  `dist/index.html` → `dist/404.html`; xóa `public/404.html` (cả local lẫn
  remote). Kiểm thử local: 29/29 PASS, build PASS, phục vụ thử dưới sub-path
  cho home 200. Đã đẩy 4 file sửa lên main qua trình duyệt (15 commit);
  bundle mới đã live (index-Bskxhb2c.js, khác bundle cũ).
- Kiểm thử hiển thị lại sau khi sửa (14:42): danh mục hiện thẳng ở URL,
  đủ poster (cả 3 phim), trang chi tiết mở đúng (poster + synopsis + nút
  LIÊN HỆ ADMIN). Lần tải lạnh đầu tiên vẫn thoáng hiện trang 404 cũ do
  cache trình duyệt, tải lại là hết — không phải lỗi code (tab mới tải thẳng
  đúng ngay).

FILES CHANGED:
- Toàn bộ source đã lên GitHub (xem repo)

DEPLOYMENT STATUS:
- LIVE: https://helent93.github.io/telegram-vietsub-catalog/ (bản sửa đã deploy)

NEXT ACTION:
- Giao URL demo cho Helen kiểm tra trên Telegram (đã giao 14:38; bản sửa
  live 14:42)
- Phase 4: Bot Telegram (Helen đang đăng nhập Telegram Web trên trình duyệt
  để Muse tạo bot qua BotFather — 0đ; cần token + username bot)
- Phase 3: Cloudflare Workers + D1 API (cần quyền Cloudflare)

USER ACTION REQUIRED:
- Đăng nhập Telegram Web trên trình duyệt (đang mở sẵn) để Muse tạo bot
- Quyền Cloudflare (khi tới Phase 3/7 đầy đủ)

NEXT ACTION:
- Phase 3: Cloudflare Workers + D1 API (cần Helen cấp quyền Cloudflare);
  đổi `loadMovies()` sang VITE_API_BASE_URL, không sửa component
- Phase 4: Bot Telegram (cần Helen tạo bot qua BotFather, cung cấp token qua
  secret manager + username bot)

USER ACTION REQUIRED:
- Chưa cần ở round này. Khi tới Phase 4/7 sẽ cần: Bot Token + username bot,
  quyền Cloudflare (Pages/Workers/D1).
