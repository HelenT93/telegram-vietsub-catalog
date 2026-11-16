import { useMemo, useState } from 'react';
import MovieCard from '../components/MovieCard';
import MovieRow from '../components/MovieRow';
import {
  filterByGenre,
  getFeatured,
  getFreeMovies,
  getGenres,
  getSubtitlingMovies,
  searchMovies,
  sortMovies,
} from '../lib/api';
import { formatDate } from '../lib/format';
import { isTelegram } from '../lib/telegram';
import type { SortKey } from '../lib/types';
import { useMovies } from '../lib/useMovies';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'updated', label: 'Mới cập nhật' },
  { value: 'title', label: 'Tên A–Z' },
  { value: 'episodes', label: 'Nhiều tập nhất' },
];

export default function Home() {
  const { movies, loading, error, reload } = useMovies();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('all');
  const [sort, setSort] = useState<SortKey>('updated');

  const genres = useMemo(() => getGenres(movies), [movies]);

  const filtered = useMemo(() => {
    const found = searchMovies(movies, query);
    const byGenre = filterByGenre(found, genre);
    return sortMovies(byGenre, sort);
  }, [movies, query, genre, sort]);

  const isSearching = query.trim() !== '' || genre !== 'all';

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl pb-10">
      {/* Banner demo — luôn hiển thị rõ đây là dữ liệu mẫu. */}
      <div className="bg-amber-500/15 px-4 py-2 text-center text-xs font-medium text-amber-300">
        Bản demo — dữ liệu mẫu, chưa phải phim thật
      </div>

      {!isTelegram() && (
        <div className="bg-sky-500/15 px-4 py-2 text-center text-xs text-sky-300">
          Mở trong Telegram để có trải nghiệm đầy đủ
        </div>
      )}

      <header className="px-4 pt-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-2xl">
            🎬
          </span>
          <div>
            <h1 className="text-xl font-bold leading-tight text-white">
              Kho Phim Vietsub
            </h1>
            <p className="text-xs text-slate-400">
              Thư viện phim Vietsub trên Telegram
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="search" className="sr-only">
            Tìm kiếm phim
          </label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm tên phim, thể loại…"
            className="w-full rounded-xl border border-white/10 bg-slate-800/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setGenre('all')}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                genre === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              Tất cả
            </button>
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenre(g)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  genre === g
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <label htmlFor="sort" className="sr-only">
            Sắp xếp
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="shrink-0 rounded-lg border border-white/10 bg-slate-800 px-2 py-1.5 text-xs text-slate-200"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading && (
        <div className="mt-10 px-4" role="status" aria-label="Đang tải">
          <div className="flex gap-3 overflow-hidden">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-36 shrink-0 animate-pulse rounded-xl bg-slate-800 sm:w-44"
              >
                <div className="aspect-[2/3] rounded-t-xl bg-slate-700/60" />
                <div className="space-y-2 p-2.5">
                  <div className="h-3 rounded bg-slate-700/60" />
                  <div className="h-3 w-2/3 rounded bg-slate-700/60" />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-400">Đang tải danh mục phim…</p>
        </div>
      )}

      {error && !loading && (
        <div className="mx-4 mt-8 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          <p className="font-semibold">Không tải được danh mục phim</p>
          <p className="mt-1">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-3 rounded-lg bg-rose-500 px-4 py-2 text-xs font-bold text-white"
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {isSearching ? (
            <section className="mt-6 px-4 sm:px-6" aria-label="Kết quả tìm kiếm">
              <h2 className="text-base font-bold text-white">
                Kết quả ({filtered.length})
              </h2>
              {filtered.length === 0 ? (
                <div className="mt-4 rounded-xl border border-white/10 bg-slate-800/60 p-6 text-center">
                  <p className="text-3xl">🔍</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Không tìm thấy phim nào
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Thử từ khóa khác hoặc chọn thể loại khác.
                  </p>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-3">
                  {filtered.map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <>
              <MovieRow
                title="Phim mới cập nhật"
                movies={sortMovies(movies, 'updated')}
              />
              <MovieRow title="Phim nổi bật" movies={getFeatured(movies)} />
              <MovieRow title="Phim miễn phí" movies={getFreeMovies(movies)} />
              <MovieRow
                title="Phim đang Vietsub"
                movies={getSubtitlingMovies(movies)}
              />
              <section className="mt-6 px-4 sm:px-6" aria-label="Tất cả phim">
                <h2 className="text-base font-bold text-white">Tất cả phim</h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {filtered.map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              </section>
            </>
          )}

          {movies.length === 0 && (
            <div className="mx-4 mt-8 rounded-xl border border-white/10 bg-slate-800/60 p-6 text-center">
              <p className="text-3xl">🎬</p>
              <p className="mt-2 text-sm font-semibold text-white">
                Chưa có phim nào trong thư viện
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Admin sẽ bổ sung phim mới trong thời gian tới.
              </p>
            </div>
          )}
        </>
      )}

      <footer className="mt-10 px-4 text-center text-xs text-slate-500 sm:px-6">
        <p>
          Kho Phim Vietsub (demo) · Cập nhật gần nhất:{' '}
          {movies.length > 0
            ? formatDate(
                sortMovies(movies, 'updated')[0].updated_at,
              )
            : '—'}
        </p>
      </footer>
    </div>
  );
}
