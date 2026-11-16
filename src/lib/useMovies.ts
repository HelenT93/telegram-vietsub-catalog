import { useEffect, useState } from 'react';
import { loadMovies } from './api';
import type { Movie } from './types';

export interface UseMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/** Tải danh mục phim một lần, kèm trạng thái loading / error để UI xử lý. */
export function useMovies(): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadMovies()
      .then((list) => {
        if (!cancelled) setMovies(list);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Không tải được danh mục phim. Vui lòng thử lại.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return { movies, loading, error, reload: () => setNonce((n) => n + 1) };
}
