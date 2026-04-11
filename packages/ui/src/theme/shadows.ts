// inField Design System — Shadows (warm-tinted, never pure black)
// Base color: warm brown rgba(60, 54, 42) per design rule

export const SHADOWS = {
  sm: {
    shadowColor: 'rgba(60,54,42,1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: 'rgba(60,54,42,1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: 'rgba(60,54,42,1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  xl: {
    shadowColor: 'rgba(60,54,42,1)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 48,
    elevation: 10,
  },
} as const;

// CSS box-shadow equivalents for web
export const CSS_SHADOWS = {
  sm: '0 1px 2px rgba(60, 54, 42, 0.04)',
  md: '0 2px 8px rgba(60, 54, 42, 0.06)',
  lg: '0 8px 24px rgba(60, 54, 42, 0.08)',
  xl: '0 16px 48px rgba(60, 54, 42, 0.12)',
} as const;
