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
  status: MovieStatus;
  access_type: AccessType;
  /** Giá tham khảo (VND). Chỉ có ý nghĩa khi access_type = 'paid'. */
  display_price_vnd: number | null;
  is_featured: boolean;
  /** URL channel công khai — chỉ dùng cho phim miễn phí. Phim trả phí KHÔNG có URL ở đây. */
  public_url: string | null;
  published_at: string;
  updated_at: string;
}

export type SortKey = 'updated' | 'title' | 'episodes';
