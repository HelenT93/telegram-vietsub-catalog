import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { initTelegram } from './lib/telegram';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:slug" element={<MovieDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
