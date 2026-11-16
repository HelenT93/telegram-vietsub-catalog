import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '../lib/types';

export default function MovieRow({
  title,
  movies,
  emptyText,
}: {
  title: string;
  movies: Movie[];
  emptyText?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 4);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [movies]);

  if (movies.length === 0) return null;

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const arrow =
    'absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-900/90 text-lg font-bold text-white shadow-lg transition hover:bg-violet-600';

  return (
    <section className="mt-6" aria-label={title}>
      <h2 className="px-4 text-base font-bold text-white sm:px-6">{title}</h2>
      <div className="relative">
        <div
          ref={trackRef}
          className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4 pb-1 sm:px-6"
        >
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
        {canLeft && (
          <button
            type="button"
            aria-label="Cuộn sang trái"
            onClick={() => scrollBy(-1)}
            className={`${arrow} left-1 sm:left-2`}
          >
            ‹
          </button>
        )}
        {canRight && (
          <button
            type="button"
            aria-label="Cuộn sang phải"
            onClick={() => scrollBy(1)}
            className={`${arrow} right-1 sm:right-2`}
          >
            ›
          </button>
        )}
      </div>
      {emptyText ? <p className="hidden">{emptyText}</p> : null}
    </section>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="px-4 text-base font-bold text-white sm:px-6">{children}</h2>
  );
}
