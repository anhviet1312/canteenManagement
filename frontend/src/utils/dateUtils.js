/**
 * Utility chuyển đổi thời gian máy chủ (GMT 0 / UTC) sang múi giờ Việt Nam (GMT+7 / Asia/Ho_Chi_Minh).
 * Cho phép Backend giữ nguyên giờ chuẩn Server, trong khi Frontend luôn hiển thị chuẩn GMT+7.
 */

export const formatToGMT7 = (dateInput) => {
  if (!dateInput) return '';
  try {
    let date;
    if (typeof dateInput === 'string') {
      const trimmed = dateInput.trim();
      // If it's already just a short time string like "11:40"
      if (!trimmed.includes('-') && trimmed.includes(':')) {
        return trimmed;
      }
      if (trimmed.includes(' ') && !trimmed.includes('T')) {
        date = new Date(trimmed.replace(' ', 'T') + 'Z');
      } else if (trimmed.includes('T')) {
        date = new Date(trimmed.endsWith('Z') ? trimmed : trimmed + 'Z');
      } else {
        date = new Date(trimmed);
      }
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return String(dateInput);

    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(date);
    const getPart = (type) => parts.find(p => p.type === type)?.value || '';

    return `${getPart('year')}-${getPart('month')}-${getPart('day')} ${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;
  } catch {
    return String(dateInput);
  }
};

/**
 * Lấy chuỗi ngày YYYY-MM-DD theo giờ Việt Nam (GMT+7)
 */
export const getVNDateString = (daysOffset = 0) => {
  const d = new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(d);
};

/**
 * Lấy chuỗi giờ HH:mm:ss theo giờ Việt Nam (GMT+7)
 */
export const getVNCurrentTimeString = () => {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
};
