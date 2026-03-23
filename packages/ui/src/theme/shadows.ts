// DocField Design System — Shadows (warm-tinted, never pure black)
// Base color: neutral-900 (#141311)

export const SHADOWS = {
  sm: {
    shadowColor: '#141311',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#141311',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#141311',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  xl: {
    shadowColor: '#141311',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 48,
    elevation: 10,
  },
} as const;

// CSS box-shadow equivalents for web
export const CSS_SHADOWS = {
  sm: '0 1px 2px rgba(20, 19, 17, 0.04)',
  md: '0 2px 8px rgba(20, 19, 17, 0.06)',
  lg: '0 8px 24px rgba(20, 19, 17, 0.08)',
  xl: '0 16px 48px rgba(20, 19, 17, 0.12)',
} as const;
