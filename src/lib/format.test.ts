import { describe, expect, it } from 'vitest';
import {
  episodeCountLabel,
  formatDate,
  formatEpisodes,
  formatPrice,
  formatPriceLabel,
  formatSeasons,
  normalizeSearchText,
  seasonLabel,
  statusLabel,
} from './format';

describe('formatPriceLabel', () => {
  it('phim miễn phí -> "Miễn phí"', () => {
    expect(
      formatPriceLabel({
        access_type: 'free',
        display_price_vnd: null,
        price_note: null,
        seasons: 1,
      }),
    ).toBe('Miễn phí');
  });

  it('phim tính theo mùa giữ hậu tố "/mùa"', () => {
    expect(
      formatPriceLabel({
        access_type: 'paid',
        display_price_vnd: 20000,
        price_note: '/mùa',
        seasons: 2,
      }),
    ).toBe('20.000 ₫/mùa');
  });

  it('phim tính theo bộ hiện rõ "/bộ", không để giá trần', () => {
    expect(
      formatPriceLabel({
        access_type: 'paid',
        display_price_vnd: 20000,
        price_note: null,
        seasons: 1,
      }),
    ).toBe('20.000 ₫/bộ');
    expect(
      formatPriceLabel({
        access_type: 'paid',
        display_price_vnd: 50000,
        price_note: null,
        seasons: 1,
      }),
    ).toBe('50.000 ₫/bộ');
  });
});


describe('formatPrice', () => {
  it('định dạng số tiền VND theo chuẩn vi-VN', () => {
    expect(formatPrice(49000)).toBe('49.000 ₫');
    expect(formatPrice(69000)).toBe('69.000 ₫');
    expect(formatPrice(1250000)).toBe('1.250.000 ₫');
  });

  it('trả về "Miễn phí" khi giá bằng 0, null hoặc undefined', () => {
    expect(formatPrice(0)).toBe('Miễn phí');
    expect(formatPrice(null)).toBe('Miễn phí');
    expect(formatPrice(undefined)).toBe('Miễn phí');
  });
});

describe('formatEpisodes', () => {
  it('hiển thị dạng "đã phát/tổng tập"', () => {
    expect(formatEpisodes(12, 16)).toBe('12/16 tập');
    expect(formatEpisodes(24, 24)).toBe('24/24 tập');
  });
});

describe('episodeCountLabel', () => {
  it('phim hoàn thành hiện tổng số tập', () => {
    expect(
      episodeCountLabel({ status: 'completed', episode_total: 250 }),
    ).toBe('250 tập');
    expect(
      episodeCountLabel({ status: 'completed', episode_total: 124 }),
    ).toBe('124 tập');
  });

  it('phim chưa xong chỉ hiện "Đang ra", không hiện số tập', () => {
    expect(
      episodeCountLabel({ status: 'ongoing', episode_total: 151 }),
    ).toBe('Đang ra');
    expect(
      episodeCountLabel({ status: 'subtitling', episode_total: 82 }),
    ).toBe('Đang ra');
  });
});

describe('formatSeasons', () => {
  it('1 mùa hiển thị "Mùa 1", nhiều mùa hiển thị "N mùa"', () => {
    expect(formatSeasons(1)).toBe('Mùa 1');
    expect(formatSeasons(2)).toBe('2 mùa');
    expect(formatSeasons(4)).toBe('4 mùa');
  });
});

describe('seasonLabel', () => {
  it('mục riêng 1 mùa (season_number) hiển thị đúng số mùa đó', () => {
    expect(seasonLabel({ seasons: 1, season_number: 2 })).toBe('Mùa 2');
    expect(seasonLabel({ seasons: 1, season_number: 3 })).toBe('Mùa 3');
  });

  it('không có season_number thì dùng seasons như cũ', () => {
    expect(seasonLabel({ seasons: 1 })).toBe('Mùa 1');
    expect(seasonLabel({ seasons: 3 })).toBe('3 mùa');
  });
});

describe('statusLabel', () => {
  it('dịch trạng thái sang nhãn tiếng Việt', () => {
    expect(statusLabel('completed')).toBe('Hoàn thành');
    expect(statusLabel('ongoing')).toBe('Đang cập nhập');
    expect(statusLabel('subtitling')).toBe('Đang Vietsub');
  });
});

describe('formatDate', () => {
  it('định dạng ISO thành ngày/tháng/năm', () => {
    expect(formatDate('2026-11-16')).toBe('16/11/2026');
  });

  it('trả lại chuỗi gốc khi không parse được', () => {
    expect(formatDate('không-phải-ngày')).toBe('không-phải-ngày');
  });
});

describe('normalizeSearchText', () => {
  it('bỏ dấu và thường hóa để tìm kiếm không phân biệt dấu', () => {
    expect(normalizeSearchText('Mùa Hè Không Trở Lại')).toBe(
      'mua he khong tro lai',
    );
    expect(normalizeSearchText('Đường')).toBe('duong');
  });
});
