import { normalizeSearchText } from './format';
import type { Movie, SortKey } from './types';

export type { Movie, SortKey };

/**
 * Data layer — Phase 2 dùng file JSON tĩnh tại public/data/movies.json.
 * Phase 3 sẽ đổi `loadMovies()` sang gọi Workers/D1 API (VITE_API_BASE_URL)
 * mà KHÔNG cần sửa component nào: hợp đồng trả về vẫn là Movie[].
 */

export interface MoviesPayload {
  movies: Movie[];
}

function isMovie(value: unknown): value is Movie {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.id === 'string' &&
    typeof m.slug === 'string' &&
    typeof m.title_vi === 'string' &&
    typeof m.poster_url === 'string' &&
    Array.isArray(m.genre) &&
    typeof m.episode_total === 'number' &&
    typeof m.episode_released === 'number' &&
    typeof m.status === 'string' &&
    typeof m.access_type === 'string' &&
    typeof m.updated_at === 'string'
  );
}

export async function loadMovies(): Promise<Movie[]> {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const url = base
    ? `${base.replace(/\/$/, '')}/api/movies`
    : `${import.meta.env.BASE_URL}data/movies.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Không tải được danh mục phim (HTTP ${res.status})`);
  }
  const data: unknown = await res.json();
  const list: unknown = Array.isArray(data)
    ? data
    : (data as MoviesPayload | null)?.movies;
  if (!Array.isArray(list)) {
    throw new Error('Dữ liệu phim không đúng định dạng');
  }
  const movies = list.filter(isMovie);
  if (movies.length === 0 && list.length > 0) {
    throw new Error('Dữ liệu phim không đúng định dạng');
  }
  return movies;
}

export function getMovieBySlug(movies: Movie[], slug: string): Movie | undefined {
  return movies.find((m) => m.slug === slug);
}

/** Tìm theo tên Việt, tên gốc, thể loại — không phân biệt hoa/thường và dấu. */
export function searchMovies(movies: Movie[], query: string): Movie[] {
  const q = normalizeSearchText(query);
  if (!q) return movies;
  return movies.filter((m) => {
    const haystack = normalizeSearchText(
      [m.title_vi, m.title_original, ...m.genre].join(' '),
    );
    return q.split(/\s+/).every((word) => haystack.includes(word));
  });
}

/** Lọc theo thể loại. 'all' = tất cả. */
export function filterByGenre(movies: Movie[], genre: string): Movie[] {
  if (!genre || genre === 'all') return movies;
  return movies.filter((m) => m.genre.includes(genre));
}

/** Sắp xếp: mới nhất (updated_at desc), tên A–Z, nhiều tập nhất. */
export function sortMovies(movies: Movie[], sort: SortKey): Movie[] {
  const copy = [...movies];
  switch (sort) {
    case 'title':
      return copy.sort((a, b) => a.title_vi.localeCompare(b.title_vi, 'vi'));
    case 'episodes':
      return copy.sort((a, b) => b.episode_total - a.episode_total);
    case 'updated':
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
  }
}

/** Tất cả thể loại có trong danh mục, sắp xếp A–Z. */
export function getGenres(movies: Movie[]): string[] {
  return [...new Set(movies.flatMap((m) => m.genre))].sort((a, b) =>
    a.localeCompare(b, 'vi'),
  );
}

export function getFeatured(movies: Movie[]): Movie[] {
  return movies.filter((m) => m.is_featured);
}

export function getFreeMovies(movies: Movie[]): Movie[] {
  return movies.filter((m) => m.access_type === 'free');
}

/** Phim đang Vietsub = chưa đủ số tập đã phát hành. */
export function getSubtitlingMovies(movies: Movie[]): Movie[] {
  return movies.filter((m) => m.episode_released < m.episode_total);
}
