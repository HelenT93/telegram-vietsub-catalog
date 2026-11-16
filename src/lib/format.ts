import type { MovieStatus } from './types';

/** 49000 -> "49.000 ₫"; 0 / null -> "Miễn phí". */
export function formatPrice(vnd: number | null | undefined): string {
  if (!vnd || vnd <= 0) return 'Miễn phí';
  return `${vnd.toLocaleString('vi-VN')} ₫`;
}

/** "12/16 tập". */
export function formatEpisodes(released: number, total: number): string {
  return `${released}/${total} tập`;
}

/** Trạng thái phim -> nhãn tiếng Việt. */
export function statusLabel(status: MovieStatus): string {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'ongoing':
      return 'Đang chiếu';
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
