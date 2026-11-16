import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getMovieBySlug } from '../lib/api';
import { formatEpisodes, formatPrice, statusLabel } from '../lib/format';
import {
  getWebApp,
  hapticLight,
  openExternalLink,
  openTelegramLink,
} from '../lib/telegram';
import { useMovies } from '../lib/useMovies';

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-500/20 text-emerald-300',
  ongoing: 'bg-sky-500/20 text-sky-300',
  subtitling: 'bg-amber-500/20 text-amber-300',
};

export default function MovieDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { movies, loading, error, reload } = useMovies();
  const [notice, setNotice] = useState<string | null>(null);

  const movie = slug ? getMovieBySlug(movies, slug) : undefined;
  // Liên hệ admin trực tiếp (tài khoản của chị). Giữ bot deep link làm
  // fallback khi chưa cấu hình admin (bot cần backend mới trả lời /start).
  const adminUsername = (
    import.meta.env.VITE_ADMIN_USERNAME as string | undefined
  )
    ?.replace(/^@/, '')
    .trim();
  const botUsername = (import.meta.env.VITE_BOT_USERNAME as string | undefined)
    ?.replace(/^@/, '')
    .trim();

  // Nút Back của Telegram WebApp -> quay lại trang chủ.
  useEffect(() => {
    const app = getWebApp();
    if (!app) return;
    const onBack = () => navigate('/');
    app.BackButton.show();
    app.BackButton.onClick(onBack);
    return () => {
      app.BackButton.offClick(onBack);
      app.BackButton.hide();
    };
  }, [navigate]);

  const handleWatchFree = () => {
    hapticLight();
    if (movie?.public_url) {
      openExternalLink(movie.public_url);
    } else {
      setNotice(
        'Phim này chưa gắn link xem. Vui lòng liên hệ admin để được hướng dẫn.',
      );
    }
  };

  const handleContactAdmin = () => {
    hapticLight();
    if (adminUsername) {
      openTelegramLink(`https://t.me/${adminUsername}`);
    } else if (botUsername && movie) {
      openTelegramLink(
        `https://t.me/${botUsername}?start=movie_${movie.id}`,
      );
    } else {
      setNotice(
        'Chưa cấu hình tài khoản admin. Vui lòng thử lại sau.',
      );
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl pb-10">
      <div className="px-4 pt-4 sm:px-6">
        <Link
          to="/"
          className="text-sm font-medium text-violet-300 hover:text-violet-200"
        >
          ← Quay lại danh mục
        </Link>
      </div>

      {loading && (
        <div className="mt-8 px-4 sm:px-6" role="status" aria-label="Đang tải">
          <div className="animate-pulse">
            <div className="aspect-[2/3] w-44 rounded-xl bg-slate-700/60 sm:w-56" />
            <div className="mt-4 h-5 w-2/3 rounded bg-slate-700/60" />
            <div className="mt-2 h-4 w-1/2 rounded bg-slate-700/60" />
          </div>
          <p className="mt-4 text-sm text-slate-400">Đang tải thông tin phim…</p>
        </div>
      )}

      {error && !loading && (
        <div className="mx-4 mt-8 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          <p className="font-semibold">Không tải được thông tin phim</p>
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

      {!loading && !error && !movie && (
        <div className="mx-4 mt-8 rounded-xl border border-white/10 bg-slate-800/60 p-6 text-center">
          <p className="text-3xl">🎬</p>
          <p className="mt-2 text-sm font-semibold text-white">
            Không tìm thấy phim này
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Phim có thể đã bị ẩn hoặc đường dẫn không đúng.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white"
          >
            Về trang chủ
          </Link>
        </div>
      )}

      {!loading && !error && movie && (
        <article className="px-4 pt-4 sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row">
            <img
              src={movie.poster_url}
              alt={`Poster phim ${movie.title_vi}`}
              className="aspect-[2/3] w-44 shrink-0 rounded-xl object-cover ring-1 ring-white/10 sm:w-56"
            />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-tight text-white">
                {movie.is_adult && (
                  <span className="mr-2 rounded-md bg-rose-600 px-1.5 py-0.5 align-middle text-sm font-bold text-white">
                    18+
                  </span>
                )}
                {movie.title_vi}
              </h1>
              {movie.title_original && (
                <p className="mt-1 text-sm italic text-slate-400">
                  {movie.title_original}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[movie.status] ?? 'bg-slate-500/20 text-slate-300'}`}
                >
                  {statusLabel(movie.status)}
                </span>
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex gap-2">
                  <dt className="w-28 shrink-0 text-slate-400">Số tập</dt>
                  <dd className="font-medium text-white">
                    {formatEpisodes(movie.episode_released, movie.episode_total)}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-28 shrink-0 text-slate-400">Số mùa</dt>
                  <dd className="font-medium text-white">
                    {movie.seasons} mùa
                  </dd>
                </div>
                {movie.leads && (
                  <div className="flex gap-2">
                    <dt className="w-28 shrink-0 text-slate-400">
                      Nhân vật chính
                    </dt>
                    <dd className="font-medium text-white">{movie.leads}</dd>
                  </div>
                )}
                <div className="flex gap-2">
                  <dt className="w-28 shrink-0 text-slate-400">Giá tham khảo</dt>
                  <dd className="font-medium text-white">
                    {movie.access_type === 'free'
                      ? 'Miễn phí'
                      : `${formatPrice(movie.display_price_vnd)}${movie.price_note ?? ''}`}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <section className="mt-6">
            <h2 className="text-base font-bold text-white">Giới thiệu</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {movie.synopsis}
            </p>
          </section>

          {notice && (
            <div
              className="mt-5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200"
              role="status"
            >
              {notice}
            </div>
          )}

          <div className="mt-6">
            {movie.access_type === 'free' ? (
              <button
                type="button"
                onClick={handleWatchFree}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-500"
              >
                ▶ XEM PHIM NGAY
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContactAdmin}
                className="w-full rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-violet-500"
              >
                💬 LIÊN HỆ ADMIN
              </button>
            )}
            {movie.access_type === 'paid' && (
              <p className="mt-2 text-center text-xs text-slate-400">
                Mã phim: {movie.id} — gửi mã này cho admin để được tư vấn nhanh
                hơn.
              </p>
            )}
          </div>
        </article>
      )}
    </div>
  );
}
