const { getCurrentTime } = require('../lib/common/date');

describe('Date Utilities', () => {
  test('getCurrentTime returns a string', () => {
    const time = getCurrentTime();
    expect(typeof time).toBe('string');
  });

  test('getCurrentTime follows the expected format', () => {
    const time = getCurrentTime();
    // Check if it contains year-like numbers or specific characters
    // The format from toLocaleString('zh-TW') is usually like "2023/5/9 上午 10:00:00"
    expect(time).toMatch(/\d{4}.*\d{1,2}.*\d{1,2}/);
  });
});
