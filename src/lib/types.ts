export type MovieStatus = 'completed' | 'ongoing' | 'subtitling';
export type AccessType = 'free' | 'paid';

export interface Movie {
  id: string;
  slug: string;
  title_vi: string;
  title_original: string;
  synopsis: string;
  poster_url: string;
  genre: string[];
  episode_total: number;
  episode_released: number;
  /** Số mùa đã ra (kể cả mùa đang ra). Lấy từ hồ sơ tìm phim cùng chị. */
  seasons: number;
  /** Mục này là mùa thứ mấy của bộ phim — chỉ dùng khi mục đại diện cho
   * RIÊNG 1 mùa (vd mục mùa 2 của Trướng có season_number = 2, seasons = 1).
   * Không có trường này thì nhãn mùa lấy từ seasons. */
  season_number?: number;
  /** Cặp nhân vật chính, vd "Tiêu Lệ × Ôn Tục Xuân". Bỏ trống nếu chưa xác minh. */
  leads?: string | null;
  status: MovieStatus;
  access_type: AccessType;
  /** Giá tham khảo (VND). Chỉ có ý nghĩa khi access_type = 'paid'. */
  display_price_vnd: number | null;
  /** Phim có cảnh nóng — hiển thị ký hiệu [18+] trước tên phim.
   * Nguồn: dấu ⚡ trên poster tổng hợp đã duyệt (có cảnh uncut). */
  is_adult?: boolean;
  /** Hậu tố giá, vd "/mùa" khi giá tính theo mùa. Chỉ dùng khi access_type = 'paid'. */
  price_note?: string | null;
  is_featured: boolean;
  /** URL channel công khai — chỉ dùng cho phim miễn phí. Phim trả phí KHÔNG có URL ở đây. */
  public_url: string | null;
  published_at: string;
  updated_at: string;
}

export type SortKey = 'updated' | 'title' | 'episodes';
