const ISRAELI_PHONE_REGEX = /^0[2-9]\d{7,8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate Israeli phone number format
 * Accepts: 050-1234567, 0501234567, 02-1234567
 */
export function isValidIsraeliPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return ISRAELI_PHONE_REGEX.test(cleaned);
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}
