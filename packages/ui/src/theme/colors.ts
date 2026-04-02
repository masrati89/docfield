// inField Design System — Color Palette
// Source of truth: docs/DESIGN_SYSTEM.md

export const COLORS = {
  // Primary — Forest Green
  primary: {
    50: '#F0F7F4',
    100: '#D1E7DD',
    200: '#A3D1B5',
    300: '#6DB88C',
    400: '#3D9B66',
    500: '#1B7A44',
    600: '#14643A',
    700: '#0F4F2E',
    800: '#0A3B22',
    900: '#062818',
  },

  // Secondary — Warm Cream
  cream: {
    50: '#FEFDFB',
    100: '#FBF8F3',
    200: '#F5EFE6',
    300: '#EBE1D3',
    400: '#D9CBBA',
    500: '#BCA78E',
  },

  // Accent — Burnished Gold
  gold: {
    100: '#FDF4E7',
    300: '#F0C66B',
    500: '#C8952E',
    700: '#8B6514',
  },

  // Neutrals — Warm Gray
  neutral: {
    50: '#FAFAF8',
    100: '#F2F1EE',
    200: '#E5E3DF',
    300: '#D1CEC8',
    400: '#A8A49D',
    500: '#7A766F',
    600: '#5C5852',
    700: '#3D3A36',
    800: '#252420',
    900: '#141311',
  },

  // Semantic — Status Colors
  success: {
    50: '#ECFDF5',
    500: '#10B981',
    700: '#047857',
  },

  danger: {
    50: '#FEF2F2',
    500: '#EF4444',
    700: '#B91C1C',
  },

  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    700: '#B45309',
  },

  info: {
    50: '#EFF6FF',
    500: '#3B82F6',
    700: '#1D4ED8',
  },

  // Absolute
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorToken = typeof COLORS;
