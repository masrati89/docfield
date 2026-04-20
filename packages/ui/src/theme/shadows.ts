// inField Design System — Shadows (warm-tinted, never pure black)
// Base color: warm brown rgba(60, 54, 42) per design rule

export const SHADOWS = {
  sm: {
    shadowColor: 'rgba(60,54,42,1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: 'rgba(60,54,42,1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: 'rgba(60,54,42,1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  up: {
    shadowColor: 'rgba(60,54,42,1)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;

// CSS box-shadow equivalents for web
export const CSS_SHADOWS = {
  sm: '0 1px 3px rgba(60, 54, 42, 0.06)',
  md: '0 2px 8px rgba(60, 54, 42, 0.08)',
  lg: '0 4px 16px rgba(60, 54, 42, 0.10)',
  up: '0 -4px 20px rgba(60, 54, 42, 0.12)',
} as const;
