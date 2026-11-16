import { Link } from 'react-router-dom';
import { formatEpisodes, formatPrice, statusLabel } from '../lib/format';
import { hapticLight } from '../lib/telegram';
import type { Movie } from '../lib/types';

const STATUS_STYLES: Record<Movie['status'], string> = {
  completed: 'bg-emerald-500/20 text-emerald-300',
  ongoing: 'bg-sky-500/20 text-sky-300',
  subtitling: 'bg-amber-500/20 text-amber-300',
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const free = movie.access_type === 'free';
  return (
    <Link
      to={`/movie/${movie.slug}`}
      onClick={hapticLight}
      className="group block w-36 shrink-0 overflow-hidden rounded-xl bg-slate-800/60 ring-1 ring-white/10 transition hover:ring-white/30 sm:w-44"
      aria-label={`${movie.title_vi} — ${formatEpisodes(movie.episode_released, movie.episode_total)}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
        <img
          src={movie.poster_url}
          alt={`Poster phim ${movie.title_vi}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[movie.status]}`}
        >
          {statusLabel(movie.status)}
        </span>
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
            free ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}
        >
          {free ? 'MIỄN PHÍ' : formatPrice(movie.display_price_vnd)}
        </span>
      </div>
      <div className="p-2.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-white">
          {movie.title_vi}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
          {movie.genre.join(' · ')}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-300">
          {formatEpisodes(movie.episode_released, movie.episode_total)}
        </p>
      </div>
    </Link>
  );
}
