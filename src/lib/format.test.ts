import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatEpisodes,
  formatPrice,
  formatSeasons,
  normalizeSearchText,
  statusLabel,
} from './format';

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

describe('formatSeasons', () => {
  it('1 mùa hiển thị "Mùa 1", nhiều mùa hiển thị "N mùa"', () => {
    expect(formatSeasons(1)).toBe('Mùa 1');
    expect(formatSeasons(2)).toBe('2 mùa');
    expect(formatSeasons(4)).toBe('4 mùa');
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
