const { calculateDuration, parseDateTime } = require('../lib/utils/timeUtils');

describe('Time Utilities', () => {
  test('should parse zh-TW date string correctly', () => {
    const dateStr = '2024/5/9 下午 1:30:00';
    const date = parseDateTime(dateStr);
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(4); // May is 4
    expect(date.getDate()).toBe(9);
  });

  test('should calculate duration correctly for same day', () => {
    const start = '2024/5/9 下午 1:00:00';
    const end = '2024/5/9 下午 2:30:45';
    const duration = calculateDuration(start, end);
    expect(duration).toBe('1 小時 30 分鐘 45 秒');
  });

  test('should calculate duration correctly for cross-day', () => {
    const start = '2024/5/9 下午 11:30:00';
    const end = '2024/5/10 上午 1:00:00';
    const duration = calculateDuration(start, end);
    expect(duration).toBe('1 小時 30 分鐘 0 秒');
  });

  test('should handle zero duration', () => {
    const time = '2024/5/9 下午 1:00:00';
    const duration = calculateDuration(time, time);
    expect(duration).toBe('0 小時 0 分鐘 0 秒');
  });

  test('should handle invalid date formats gracefully', () => {
    expect(() => calculateDuration('invalid', 'date')).toThrow();
  });
});
