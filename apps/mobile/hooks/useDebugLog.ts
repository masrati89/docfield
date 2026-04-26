import { debugLogger } from '@/lib/debugLogger';

export function useDebugLog() {
  return {
    log: (category: string, message: string, data?: Record<string, unknown>) =>
      debugLogger.log('info', category, message, data),
    warn: (category: string, message: string, data?: Record<string, unknown>) =>
      debugLogger.log('warn', category, message, data),
    error: (
      category: string,
      message: string,
      data?: Record<string, unknown>
    ) => debugLogger.log('error', category, message, data),
    navigation: (to: string, data?: Record<string, unknown>) =>
      debugLogger.log('navigation', 'Navigation', `→ ${to}`, data),
    click: (button: string, data?: Record<string, unknown>) =>
      debugLogger.log('click', 'Click', button, data),
  };
}
