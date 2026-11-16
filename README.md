# Telegram Vietsub Movie Catalog — Kho Phim Vietsub

Telegram Mini App hiển thị thư viện phim Vietsub dạng poster: tìm kiếm, lọc theo
thể loại, xem chi tiết từng phim, điều hướng phim miễn phí tới channel công khai
và phim trả phí tới admin qua deep link Telegram.

> **Bản demo (Phase 0–2).** Dữ liệu là 3 phim mẫu hư cấu, poster AI minh họa.
> Chưa có bot Telegram, chưa có backend, chưa triển khai production. Xem
> `PROJECT_STATUS.md` để biết trạng thái từng phase.

## Tech stack

- Frontend: React 19 + TypeScript (strict) + Vite 8 + Tailwind CSS v4
- Routing: react-router-dom (`/` trang chủ, `/movie/:slug` chi tiết)
- Telegram: Telegram WebApp SDK (CDN) với fallback chạy ngoài Telegram
- Test: Vitest + jsdom
- Dữ liệu (Phase 2): `public/data/movies.json` — Phase 3 sẽ thay bằng
  Cloudflare Workers + D1 API mà không sửa component (xem `DECISIONS.md`)

## Chạy local

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest (25 test)
npm run build      # production build -> dist/
npm run preview    # phục vụ bản build, mặc định http://localhost:4173
npm run lint       # oxlint
```

## Biến môi trường

Sao chép `.env.example` thành `.env` (không commit `.env`):

| Biến | Mô tả |
| --- | --- |
| `VITE_BOT_USERNAME` | Tên bot Telegram (không có @) cho deep link liên hệ admin. Để trống ở bản demo — nút "LIÊN HỆ ADMIN" hiển thị hướng dẫn thay vì link chết. |
| `VITE_API_BASE_URL` | Base URL API phim (Phase 3). Để trống = dùng `public/data/movies.json`. |

## Cấu trúc

```
src/
  lib/
    types.ts      # Kiểu Movie, SortKey
    api.ts        # Data layer: loadMovies, search/filter/sort, section helpers
    format.ts     # formatPrice, formatEpisodes, statusLabel, formatDate
    telegram.ts   # Wrapper Telegram WebApp SDK (an toàn ngoài Telegram)
    useMovies.ts  # Hook tải danh mục + trạng thái loading/error
  components/
    MovieCard.tsx # Card poster 2:3, badge trạng thái, nhãn FREE/giá
    MovieRow.tsx  # Hàng phim cuộn ngang theo section
  pages/
    Home.tsx        # Tìm kiếm, lọc thể loại, sắp xếp, các section
    MovieDetail.tsx # Chi tiết phim + CTA xem / liên hệ admin
public/
  data/movies.json  # Seed 3 phim mẫu hư cấu
  posters/          # Poster AI minh họa (2:3)
  404.html          # SPA fallback cho static host (GitHub Pages)
```

## Thêm phim mới (bản demo)

Sửa `public/data/movies.json` theo schema trong `src/lib/types.ts`, thêm poster
vào `public/posters/`. Không cần sửa code. Từ Phase 3, phim được quản lý qua
Admin Dashboard + API thay vì file JSON.

## Quy tắc bảo mật

- Không có Bot Token, secret hay private channel URL trong repo này.
- Phim trả phí không có `public_url`; `public_url` chỉ dùng cho phim miễn phí.
- Admin chỉ được xác thực phía backend (Phase 3–5), không chỉ kiểm tra ở frontend.

## Roadmap

- Phase 0–2 (xong): scaffold, frontend MVP, test, build.
- Phase 3: Workers + D1 API, CRUD, phân trang, migration có version.
- Phase 4: Bot Telegram (/start, menu button, deep link `movie_<id>`).
- Phase 5: Admin Dashboard (xác thực initData phía server, CSV import/export).
- Phase 6: Playwright E2E + kiểm thử thủ công trên Telegram iOS/Android.
- Phase 7: Deploy Cloudflare Pages + Workers, cấu hình webhook, smoke test.
- Phase 8: Bàn giao (bot URL, Mini App URL, hướng dẫn vận hành).
