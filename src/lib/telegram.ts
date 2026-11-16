/**
 * Telegram WebApp SDK wrapper.
 * Chạy an toàn cả trong và ngoài Telegram: mọi hàm đều kiểm tra sự tồn tại
 * của window.Telegram.WebApp trước khi gọi, và có fallback trình duyệt thường.
 */

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
  };
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string | undefined>;
  initDataUnsafe: { user?: { id: number; username?: string } };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function getWebApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp ?? null;
}

export function isTelegram(): boolean {
  return getWebApp() !== null;
}

/** Gọi khi app khởi động: báo Telegram là WebApp đã sẵn sàng + mở rộng tối đa. */
export function initTelegram(): void {
  const app = getWebApp();
  if (!app) return;
  try {
    app.ready();
    app.expand();
  } catch {
    // Bỏ qua lỗi SDK — app vẫn chạy bình thường ngoài Telegram.
  }
}

/** Mở link Telegram nội bộ (t.me/...) bằng cơ chế của Telegram nếu có. */
export function openTelegramLink(url: string): void {
  const app = getWebApp();
  if (app) {
    app.openTelegramLink(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/** Mở link ngoài bằng cơ chế của Telegram nếu có. */
export function openExternalLink(url: string): void {
  const app = getWebApp();
  if (app) {
    app.openLink(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function hapticLight(): void {
  try {
    getWebApp()?.HapticFeedback.impactOccurred('light');
  } catch {
    // Không có HapticFeedback ngoài Telegram — bỏ qua.
  }
}
