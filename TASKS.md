# TASKS — Telegram Vietsub Movie Catalog

Checklist theo phase của Master Prompt. Đánh dấu `[x]` khi xong, ghi ngày + bằng
chứng ngắn.

## PHASE 0 – PREFLIGHT

- [x] Kiểm tra công cụ: Node v24.22.1, npm 10.9.4, git 2.43.0 (2026-11-16)
- [x] GitHub đã kết nối (HelenT93 qua connector) — dùng `github` CLI, không dùng `gh`
- [x] Xác nhận giới hạn miễn phí: Vite/React/Tailwind (0đ), repo GitHub Free (0đ)
- [ ] Cloudflare Pages/Workers/D1 — CHƯA có auth, để Phase 7 (cần Helen)
- [ ] Telegram Bot — CHƯA tạo, cần Helen tạo qua BotFather (Phase 4)
- [x] Tạo PROJECT_STATUS.md, TASKS.md, DECISIONS.md

## PHASE 1 – PROJECT INITIALIZATION

- [x] Scaffold Vite + React + TypeScript (strict) + Tailwind v4
- [x] Cấu trúc src/components, src/pages, src/lib
- [x] Cấu hình Vitest (jsdom) + ESLint (oxlint)
- [x] Scripts: dev, build, preview, test, test:watch, lint
- [x] .env.example (VITE_BOT_USERNAME, VITE_API_BASE_URL)
- [x] README.md
- [ ] Tạo repo GitHub `HelenT93/telegram-vietsub-catalog` + push source — **BLOCKED 2026-11-16**: `create_repository` được phê duyệt nhưng GitHub trả 403 "Resource not accessible by integration" (token GitHub App không có quyền tạo repo). Code đã commit local (`9a52ea9`, 35 files). Cần Helen tạo repo trống (public, không README) trên github.com hoặc cấp lại quyền tạo repo cho GitHub App, rồi push lại. Lưu ý: `push_files` chỉ nhận file UTF-8 — 3 poster `.webp` phải up riêng bằng `create_or_update_file` (base64).
- [ ] GitHub Pages / Cloudflare Pages — parent xử lý riêng (demo URL)

## PHASE 2 – FRONTEND MVP

- [x] Home: header, search, genre chips, sort, sections (mới cập nhật / nổi bật / miễn phí / đang Vietsub / tất cả)
- [x] MovieCard 2:3, badge trạng thái, nhãn MIỄN PHÍ / giá
- [x] MovieDetail `/movie/:slug`: poster, synopsis, tập, giá, CTA
- [x] CTA phim miễn phí: mở public_url nếu có, nếu không hiện thông báo demo (không bịa link)
- [x] CTA phim trả phí: deep link `t.me/<bot>?start=movie_<id>` khi có VITE_BOT_USERNAME, nếu không hiện thông báo
- [x] Loading / empty / error states
- [x] Telegram WebApp SDK qua CDN + fallback ngoài Telegram (banner hướng dẫn)
- [x] Banner "Bản demo — dữ liệu mẫu, chưa phải phim thật"
- [x] Seed 3 phim mẫu hư cấu + 3 poster AI 2:3 (1280×1920)
- [x] Responsive mobile-first, dark theme

## PHASE 3 – BACKEND & DATABASE

- [ ] Workers + D1, migration có version
- [ ] API CRUD phim, search + phân trang phía server
- [ ] Xác thực admin bằng initData phía server
- [ ] Quản lý poster + channel metadata
- [ ] Đổi `loadMovies()` sang VITE_API_BASE_URL (không sửa component)

## PHASE 4 – TELEGRAM BOT

- [ ] /start, /help, menu button mở Mini App
- [ ] Deep link `?start=movie_<id>` -> mở đúng phim
- [ ] Webhook HTTPS có xác thực
- [ ] Cần Helen: Bot Token (qua secret manager), username bot

## PHASE 5 – ADMIN DASHBOARD

- [ ] Trang quản trị, allowlist Telegram user ID (kiểm tra phía server)
- [ ] Thêm/sửa/ẩn/xuất bản phim, upload poster, gắn channel
- [ ] Import/export CSV, xem audit log

## PHASE 6 – TESTING

- [x] Vitest unit: search/filter/sort/format/api (25 test, PASS 2026-11-16)
- [x] Production build PASS + preview + curl kiểm tra (home/detail/JSON/poster 200)
- [ ] Playwright E2E — chưa cài trong round này (ghi chú Phase 6)
- [ ] Kiểm thử thủ công trên Telegram iOS/Android — cần bot + deploy xong

## PHASE 7 – DEPLOYMENT

- [ ] Cloudflare Pages (frontend) + Workers (backend) — cần auth của Helen
- [ ] Apply migration D1, cấu hình secrets, webhook bot
- [ ] Smoke test production

## PHASE 8 – HANDOVER

- [ ] Bàn giao repo URL, Mini App URL, Bot URL, admin URL, README, hướng dẫn
- [ ] Kết quả kiểm thử đầy đủ + giới hạn còn tồn tại + chi phí (0đ)
