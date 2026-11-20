import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { hapticLight, initTelegram, openTelegramLink } from './lib/telegram';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';

// Link nhóm chat chung + admin (giống nút chào của bot) — để người lớn tuổi
// chỉ cần bấm 1 cái, không phải gõ hay tìm link.
const GROUP_LINK = 'https://t.me/+r8ZHHwuKSqxkNGVl';
const ADMIN_URL = 'https://t.me/nhatlosinhhoa';

/**
 * Thanh nút dính đáy, hiện trên mọi trang: 3 nút to, dễ bấm cho người
 * lớn tuổi — về đầu kho phim, vô nhóm chat chung, liên hệ admin.
 */
function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHome = () => {
    hapticLight();
    if (location.pathname !== '/') {
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Thao tác nhanh"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-3xl gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={handleHome}
          className="min-h-[52px] flex-1 rounded-xl bg-violet-600 px-2 py-2 text-base font-bold leading-tight text-white transition hover:bg-violet-500"
        >
          🎬 Mở Kho Phim
        </button>
        <button
          type="button"
          onClick={() => {
            hapticLight();
            openTelegramLink(GROUP_LINK);
          }}
          className="min-h-[52px] flex-1 rounded-xl bg-sky-600 px-2 py-2 text-base font-bold leading-tight text-white transition hover:bg-sky-500"
        >
          💬 Vô nhóm chat chung
        </button>
        <button
          type="button"
          onClick={() => {
            hapticLight();
            openTelegramLink(ADMIN_URL);
          }}
          className="min-h-[52px] flex-1 rounded-xl bg-amber-500 px-2 py-2 text-base font-bold leading-tight text-slate-900 transition hover:bg-amber-400"
        >
          📩 Liên hệ admin
        </button>
      </div>
    </nav>
  );
}

function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl">🔍</p>
      <h1 className="mt-3 text-xl font-bold text-white">Không tìm thấy trang</h1>
      <p className="mt-1 text-sm text-slate-400">
        Trang bạn mở không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link
        to="/"
        className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white"
      >
        Về trang chủ
      </Link>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:slug" element={<MovieDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomBar />
    </BrowserRouter>
  );
}
