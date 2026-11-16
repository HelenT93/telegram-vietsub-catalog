import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  filterByGenre,
  getFreeMovies,
  getGenres,
  getMovieBySlug,
  getSubtitlingMovies,
  loadMovies,
  searchMovies,
  sortMovies,
} from './api';
import type { Movie } from './types';

const SAMPLE: Movie[] = [
  {
    id: 't-001',
    slug: 'mua-he-khong-tro-lai',
    title_vi: 'Mùa Hè Không Trở Lại',
    title_original: 'The Summer That Never Returned',
    synopsis: 'Một mùa hè dang dở.',
    poster_url: '/posters/a.webp',
    genre: ['Tình cảm', 'Thanh xuân'],
    episode_total: 24,
    episode_released: 24,
    status: 'completed',
    access_type: 'free',
    display_price_vnd: null,
    is_featured: true,
    public_url: null,
    published_at: '2026-10-20',
    updated_at: '2026-11-14',
  },
  {
    id: 't-002',
    slug: 'quan-ca-phe-cuoi-pho',
    title_vi: 'Quán Cà Phê Cuối Phố',
    title_original: 'The Last Café on the Street',
    synopsis: 'Một quán cà phê sắp bị giải tỏa.',
    poster_url: '/posters/b.webp',
    genre: ['Đời thường', 'Lãng mạn'],
    episode_total: 16,
    episode_released: 12,
    status: 'ongoing',
    access_type: 'paid',
    display_price_vnd: 49000,
    is_featured: false,
    public_url: null,
    published_at: '2026-11-02',
    updated_at: '2026-11-15',
  },
  {
    id: 't-003',
    slug: 'hanh-tinh-lang-quen',
    title_vi: 'Hành Tinh Lãng Quên',
    title_original: 'The Forgotten Planet',
    synopsis: 'Phi hành gia tỉnh dậy một mình.',
    poster_url: '/posters/c.webp',
    genre: ['Khoa học viễn tưởng', 'Phiêu lưu'],
    episode_total: 12,
    episode_released: 8,
    status: 'subtitling',
    access_type: 'paid',
    display_price_vnd: 69000,
    is_featured: true,
    public_url: null,
    published_at: '2026-11-08',
    updated_at: '2026-11-16',
  },
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('searchMovies', () => {
  it('tìm theo tên Việt không phân biệt dấu và hoa/thường', () => {
    const found = searchMovies(SAMPLE, 'mua he');
    expect(found.map((m) => m.slug)).toEqual(['mua-he-khong-tro-lai']);
  });

  it('tìm theo thể loại', () => {
    const found = searchMovies(SAMPLE, 'vien tuong');
    expect(found.map((m) => m.slug)).toEqual(['hanh-tinh-lang-quen']);
  });

  it('tìm theo tên gốc tiếng Anh', () => {
    const found = searchMovies(SAMPLE, 'forgotten planet');
    expect(found.map((m) => m.slug)).toEqual(['hanh-tinh-lang-quen']);
  });

  it('truy vấn rỗng trả về toàn bộ danh mục', () => {
    expect(searchMovies(SAMPLE, '   ')).toHaveLength(3);
  });

  it('không có kết quả khi từ khóa không khớp', () => {
    expect(searchMovies(SAMPLE, 'zombie')).toHaveLength(0);
  });
});

describe('filterByGenre', () => {
  it('"all" trả về toàn bộ', () => {
    expect(filterByGenre(SAMPLE, 'all')).toHaveLength(3);
  });

  it('chỉ trả về phim có thể loại đó', () => {
    const found = filterByGenre(SAMPLE, 'Lãng mạn');
    expect(found.map((m) => m.slug)).toEqual(['quan-ca-phe-cuoi-pho']);
  });
});

describe('sortMovies', () => {
  it('mặc định mới nhất lên đầu (updated_at giảm dần)', () => {
    const sorted = sortMovies(SAMPLE, 'updated');
    expect(sorted.map((m) => m.slug)).toEqual([
      'hanh-tinh-lang-quen',
      'quan-ca-phe-cuoi-pho',
      'mua-he-khong-tro-lai',
    ]);
  });

  it('sắp xếp tên A–Z', () => {
    const sorted = sortMovies(SAMPLE, 'title');
    expect(sorted.map((m) => m.slug)).toEqual([
      'hanh-tinh-lang-quen',
      'mua-he-khong-tro-lai',
      'quan-ca-phe-cuoi-pho',
    ]);
  });

  it('sắp xếp nhiều tập nhất lên đầu', () => {
    const sorted = sortMovies(SAMPLE, 'episodes');
    expect(sorted.map((m) => m.slug)).toEqual([
      'mua-he-khong-tro-lai',
      'quan-ca-phe-cuoi-pho',
      'hanh-tinh-lang-quen',
    ]);
  });
});

describe('getMovieBySlug', () => {
  it('tìm đúng phim theo slug', () => {
    expect(getMovieBySlug(SAMPLE, 'quan-ca-phe-cuoi-pho')?.id).toBe('t-002');
  });

  it('trả về undefined khi slug không tồn tại', () => {
    expect(getMovieBySlug(SAMPLE, 'khong-co')).toBeUndefined();
  });
});

describe('section helpers', () => {
  it('getFreeMovies chỉ lấy phim miễn phí', () => {
    expect(getFreeMovies(SAMPLE).map((m) => m.slug)).toEqual([
      'mua-he-khong-tro-lai',
    ]);
  });

  it('getSubtitlingMovies lấy phim chưa đủ tập', () => {
    expect(getSubtitlingMovies(SAMPLE).map((m) => m.slug)).toEqual([
      'quan-ca-phe-cuoi-pho',
      'hanh-tinh-lang-quen',
    ]);
  });

  it('getGenres trả về danh sách thể loại duy nhất, A–Z', () => {
    expect(getGenres(SAMPLE)).toEqual([
      'Đời thường',
      'Khoa học viễn tưởng',
      'Lãng mạn',
      'Phiêu lưu',
      'Thanh xuân',
      'Tình cảm',
    ]);
  });
});

describe('loadMovies', () => {
  it('tải và validate danh sách phim từ JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ movies: SAMPLE }),
      }),
    );
    const movies = await loadMovies();
    expect(movies).toHaveLength(3);
    expect(movies[0].title_vi).toBe('Mùa Hè Không Trở Lại');
  });

  it('ném lỗi khi HTTP không thành công', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );
    await expect(loadMovies()).rejects.toThrow('HTTP 500');
  });

  it('ném lỗi khi dữ liệu sai định dạng', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ wrong: true }),
      }),
    );
    await expect(loadMovies()).rejects.toThrow('không đúng định dạng');
  });
});
