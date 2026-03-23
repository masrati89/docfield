/**
 * Format Israeli phone number for display
 * '0501234567' → '050-123-4567'
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
  }

  return phone;
}

/**
 * Format date for display
 * Hebrew: '21 במרץ 2026'
 * English: 'March 21, 2026'
 */
export function formatDate(
  date: Date | string,
  locale: 'he' | 'en' = 'he',
): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  const localeString = locale === 'he' ? 'he-IL' : 'en-US';

  return dateObject.toLocaleDateString(localeString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time for display
 * Hebrew: '21 במרץ 2026, 14:30'
 */
export function formatDateTime(
  date: Date | string,
  locale: 'he' | 'en' = 'he',
): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  const localeString = locale === 'he' ? 'he-IL' : 'en-US';

  return dateObject.toLocaleString(localeString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format currency in Israeli Shekels
 * 1500 → '₪1,500'
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
