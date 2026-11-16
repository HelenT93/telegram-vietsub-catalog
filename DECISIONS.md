# DECISIONS — Telegram Vietsub Movie Catalog

Các quyết định kỹ thuật đã chốt trong quá trình làm. Ghi lý do để lần sau khỏi
quyết lại.

## D1. Data layer JSON trước, API sau (2026-11-16)

- **Quyết định:** Phase 2 dùng `public/data/movies.json` fetch lúc runtime qua
  `loadMovies()` trong `src/lib/api.ts`. Phase 3 đổi `loadMovies()` sang gọi
  `VITE_API_BASE_URL/api/movies` (Workers/D1), hợp đồng trả về vẫn `Movie[]`.
- **Lý do:** Frontend MVP chạy được ngay không cần backend/auth; component không
  hardcode danh mục, không cần sửa khi đổi nguồn dữ liệu. Đúng yêu cầu "không
  hardcode danh mục phim" và "tăng phim không sửa code".

## D2. BrowserRouter thay vì HashRouter (2026-11-16)

- **Quyết định:** Dùng `BrowserRouter`, route `/movie/:slug` đúng như Master
  Prompt. Thêm `public/404.html` (bản sao `index.html`) làm SPA fallback cho
  static host như GitHub Pages.
- **Lý do:** URL sạch, đúng spec. Cloudflare Pages có SPA fallback sẵn; GitHub
  Pages cần 404.html. Đã kiểm chứng `vite preview` trả 200 cho cả `/` và
  `/movie/:slug` lẫn route không tồn tại.

## D3. Tailwind CSS v4 + @tailwindcss/vite (2026-11-16)

- **Quyết định:** Dùng Tailwind v4 (plugin Vite), không dùng v3 + PostCSS.
- **Lý do:** Vite template mới nhất cài sẵn v4; config tối giản (`@import
  "tailwindcss"`), không cần tailwind.config.js.

## D4. Vitest config qua `vitest/config` (2026-11-16)

- **Quyết định:** `vite.config.ts` import `defineConfig` từ `vitest/config`
  thay vì `vite`, để thêm được khóa `test` mà `tsc -b` vẫn pass.
- **Lý do:** Lỗi build `TS2769: 'test' does not exist in type 'UserConfigExport'`
  khi import từ `vite`. Đây là cách chuẩn của Vitest.

## D5. Poster AI thay vì ảnh thật (2026-11-16)

- **Quyết định:** 3 poster minh họa tạo bằng image generation (1280×1920,
  đúng tỉ lệ 2:3), không dùng ảnh phim thật, không dùng ảnh diễn viên thật.
- **Lý do:** Seed data phải hư cấu hoàn toàn — không giả mạo dữ liệu phim thật.
  Nếu image generation lỗi, fallback là poster gradient CSS (không chặn build).

## D6. Không bịa public channel URL (2026-11-16)

- **Quyết định:** Seed phim miễn phí để `public_url: null`. Nút "XEM PHIM NGAY"
  khi không có URL sẽ hiện thông báo demo, không mở link giả.
- **Lý do:** Master Prompt cấm đưa link chưa xác minh; demo không được tạo ấn
  tượng có channel thật.

## D7. Deep link admin qua VITE_BOT_USERNAME, không hardcode (2026-11-16)

- **Quyết định:** Nút "LIÊN HỆ ADMIN" mở
  `https://t.me/<VITE_BOT_USERNAME>?start=movie_<id>` khi biến env có giá trị;
  khi trống thì hiện thông báo hướng dẫn thay vì link chết.
- **Lý do:** Bot chưa tồn tại ở Phase 2; không hardcode username chưa có.

## D8. Telegram SDK qua CDN + graceful fallback (2026-11-16)

- **Quyết định:** Nạp `https://telegram.org/js/telegram-web-app.js` trong
  `index.html`; mọi hàm trong `src/lib/telegram.ts` đều kiểm tra
  `window.Telegram?.WebApp` trước khi gọi.
- **Lý do:** App phải chạy đầy đủ trong trình duyệt thường (dev/preview/demo
  web) và chỉ kích hoạt tính năng Telegram khi thực sự mở trong Telegram.
  Ngoài Telegram hiện banner "Mở trong Telegram để có trải nghiệm đầy đủ".

## D9. Chưa cài Playwright trong round này (2026-11-16)

- **Quyết định:** Phase 6 round này chỉ làm Vitest unit + build + preview/curl.
  Playwright E2E để Phase 6 đầy đủ sau khi có bot + deploy.
- **Lý do:** Theo chỉ đạo task; E2E trên Telegram WebView thật cần môi trường
  đã deploy, chưa có ở Phase 2.

## D10. Không dùng Cloudflare/gh CLI trong round này (2026-11-16)

- **Quyết định:** Không cài Wrangler, không dùng `gh` CLI (chưa đăng nhập).
  Push GitHub qua connector `/opt/hatch/bin/github` (create_repository,
  push_files).
- **Lý do:** Theo preflight đã kiểm chứng; deploy Cloudflare cần auth của Helen
  (Phase 7).
