import { describe, expect, it } from 'vitest';
import { buildAdminContactUrl } from './telegram';

const paidMovie = {
  id: 'vong-nha-xuan-tham',
  title_vi: 'Vọng Nhạ Xuân Thâm',
  display_price_vnd: 20000,
  price_note: null,
  access_type: 'paid' as const,
  seasons: 1,
};

describe('buildAdminContactUrl', () => {
  it('gắn sẵn tên phim, mã phim và giá vào ?text=', () => {
    const url = new URL(buildAdminContactUrl('nhatlosinhhoa', paidMovie));
    expect(url.origin + url.pathname).toBe('https://t.me/nhatlosinhhoa');
    expect(url.searchParams.get('text')).toBe(
      'Chào admin, mình muốn xem phim "Vọng Nhạ Xuân Thâm" (Mã phim: vong-nha-xuan-tham) — Giá tham khảo: 20.000 ₫/bộ.',
    );
  });

  it('giữ hậu tố giá, vd "/mùa"', () => {
    const url = new URL(
      buildAdminContactUrl('nhatlosinhhoa', {
        ...paidMovie,
        id: 'thu-phuc-thai-tu-dien',
        title_vi: 'Thu Phục Thái Tử Điên',
        price_note: '/mùa',
      }),
    );
    expect(url.searchParams.get('text')).toContain('Giá tham khảo: 20.000 ₫/mùa.');
  });

  it('mã hoá đúng tiếng Việt và ký tự đặc biệt trong URL', () => {
    const url = buildAdminContactUrl('nhatlosinhhoa', paidMovie);
    expect(url).not.toContain(' ');
    expect(url).not.toContain('"');
    expect(url).toContain('%'); // có ký tự đã mã hoá
    expect(new URL(url).searchParams.get('text')).toContain(
      'Vọng Nhạ Xuân Thâm',
    );
  });
});
