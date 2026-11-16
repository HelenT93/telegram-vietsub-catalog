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
- **Push bị chặn (mới):** `push_files` trả 403 "Resource not accessible by
  integration" khi tạo git tree, dù đã được phê duyệt — token GitHub App (Muse)
  chưa được cài trên repo mới này. Cần Helen mở link cài đặt App và thêm
  `telegram-vietsub-catalog` vào danh sách repo (đã gửi link 14:21), rồi thử
  lại push. Code local đã commit thêm: `25a566e` (Vite base
  `/telegram-vietsub-catalog/` + workflow `.github/workflows/deploy.yml` cho
  GitHub Pages; test 25/25 PASS, build PASS, asset trong dist đã đúng base).
- Lưu ý: `push_files` chỉ nhận file UTF-8 — 3 poster `.webp` (binary) sẽ phải
  up riêng bằng `create_or_update_file` (base64) sau khi repo tồn tại.

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
- Chưa deploy production. Build local đã xác minh. Demo URL công khai do parent
  xử lý riêng (bật GitHub Pages) — không thuộc phạm vi task này.

NEXT ACTION:
- Phase 3: Cloudflare Workers + D1 API (cần Helen cấp quyền Cloudflare);
  đổi `loadMovies()` sang VITE_API_BASE_URL, không sửa component
- Phase 4: Bot Telegram (cần Helen tạo bot qua BotFather, cung cấp token qua
  secret manager + username bot)

USER ACTION REQUIRED:
- Chưa cần ở round này. Khi tới Phase 4/7 sẽ cần: Bot Token + username bot,
  quyền Cloudflare (Pages/Workers/D1).
