/**
 * Parse a zh-TW locale date string into a Date object
 * Format example: "2024/5/9 下午 1:30:00"
 * @param {string} dateStr 
 * @returns {Date}
 */
function parseDateTime(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') throw new Error('Invalid date string');

  // Regex to match: 2024/5/9 下午 1:30:00
  const regex = /(\d+)\/(\d+)\/(\d+)\s+(上午|下午)\s+(\d+):(\d+):(\d+)/;
  const match = dateStr.match(regex);

  if (!match) {
    // Try a simpler format fallback if needed
    const fallback = new Date(dateStr);
    if (!isNaN(fallback.getTime())) return fallback;
    throw new Error(`Failed to parse date: ${dateStr}`);
  }

  let [_, year, month, day, period, hour, minute, second] = match;
  year = parseInt(year);
  month = parseInt(month) - 1; // JS months are 0-indexed
  day = parseInt(day);
  hour = parseInt(hour);
  minute = parseInt(minute);
  second = parseInt(second);

  if (period === '下午' && hour < 12) hour += 12;
  if (period === '上午' && hour === 12) hour = 0;

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Calculate duration between two date strings
 * @param {string} startStr 
 * @param {string} endStr 
 * @returns {string} e.g. "1 小時 30 分鐘 0 秒"
 */
function calculateDuration(startStr, endStr) {
  const startDate = parseDateTime(startStr);
  const endDate = parseDateTime(endStr);
  
  const diffMs = endDate - startDate;
  if (diffMs < 0) return '0 小時 0 分鐘 0 秒';

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours} 小時 ${minutes} 分鐘 ${seconds} 秒`;
}

module.exports = {
  parseDateTime,
  calculateDuration,
};
