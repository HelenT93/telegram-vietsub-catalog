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
  if (movies.length === 0) return null;
  return (
    <section className="mt-6" aria-label={title}>
      <h2 className="px-4 text-base font-bold text-white sm:px-6">{title}</h2>
      <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4 pb-1 sm:px-6">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
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
