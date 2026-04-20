import { REPORT_DEFAULTS } from '../constants/reportDefaults';

/**
 * Merges inspector overrides with system defaults.
 * Returns a fully-populated settings object where every report-text field
 * has a value (either the inspector's override or the system default).
 */
export function mergeWithReportDefaults<T extends Record<string, unknown>>(
  settings: T
): T & typeof REPORT_DEFAULTS {
  const merged = { ...REPORT_DEFAULTS } as Record<string, unknown>;

  for (const [key, value] of Object.entries(settings)) {
    // Only override if the value is not undefined/null/empty-string
    if (value !== undefined && value !== null && value !== '') {
      merged[key] = value;
    }
  }

  return merged as T & typeof REPORT_DEFAULTS;
}
