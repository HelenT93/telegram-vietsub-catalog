import type { Movie, MovieStatus } from './types';

/** 49000 -> "49.000 ₫"; 0 / null -> "Miễn phí". */
export function formatPrice(vnd: number | null | undefined): string {
  if (!vnd || vnd <= 0) return 'Miễn phí';
  return `${vnd.toLocaleString('vi-VN')} ₫`;
}

export type PriceFields = Pick<
  Movie,
  'access_type' | 'display_price_vnd' | 'price_note' | 'seasons'
>;

/**
 * Nhãn giá ĐẦY ĐỦ ĐƠN VỊ, dùng ở mọi nơi hiển thị giá (thẻ phim, trang
 * chi tiết, tin nhắn ghi sẵn cho admin): phim miễn phí -> "Miễn phí";
 * phim tính theo mùa -> "20.000 ₫/mùa"; phim tính theo bộ -> "20.000 ₫/bộ".
 * Không bao giờ để giá trần "20.000 ₫" không đơn vị — người xem dễ hiểu
 * lầm 20k là giá cả bộ phim.
 */
export function formatPriceLabel(movie: PriceFields): string {
  if (movie.access_type === 'free') return 'Miễn phí';
  if (!movie.display_price_vnd || movie.display_price_vnd <= 0)
    return 'Miễn phí';
  const note =
    movie.price_note && movie.price_note.trim() !== ''
      ? movie.price_note
      : '/bộ';
  return `${formatPrice(movie.display_price_vnd)}${note}`;
}

/** "12/16 tập". */
export function formatEpisodes(released: number, total: number): string {
  return `${released}/${total} tập`;
}

/** 1 -> "Mùa 1"; 2 -> "2 mùa". */
export function formatSeasons(seasons: number): string {
  return seasons <= 1 ? 'Mùa 1' : `${seasons} mùa`;
}

/** Trạng thái phim -> nhãn tiếng Việt. Chỉ phim hoàn thành mới là "Hoàn thành";
 * phim chưa xong đều là "Đang cập nhập". */
export function statusLabel(status: MovieStatus): string {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'ongoing':
      return 'Đang cập nhập';
    case 'subtitling':
      return 'Đang Vietsub';
    default:
      return status;
  }
}

/** "2026-11-16" -> "16/11/2026". Trả lại chuỗi gốc nếu không parse được. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu: "Mùa Hè" -> "mua he". */
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}
