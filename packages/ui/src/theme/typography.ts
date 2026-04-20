// inField Design System — Typography
// Hebrew: Rubik | English/Numbers: Inter | Monospace: JetBrains Mono

export const FONT_FAMILIES = {
  hebrew: 'Rubik',
  english: 'Inter',
  monospace: 'JetBrains Mono',
} as const;

export const FONT_SIZES = {
  display: 32,
  h1: 24,
  h2: 20,
  h3: 18,
  input: 16,
  body: 15,
  bodyMedium: 15,
  subtitle: 14,
  caption: 13,
  captionMedium: 13,
  captionSmall: 12,
  small: 10,
  micro: 10,
} as const;

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const LINE_HEIGHTS = {
  display: 1.2,
  h1: 1.3,
  h2: 1.3,
  h3: 1.3,
  body: 1.5,
  subtitle: 1.4,
  caption: 1.4,
  small: 1.3,
} as const;

export const TYPOGRAPHY = {
  display: {
    size: FONT_SIZES.display,
    weight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.display,
  },
  h1: {
    size: FONT_SIZES.h1,
    weight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.h1,
  },
  h2: {
    size: FONT_SIZES.h2,
    weight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.h2,
  },
  h3: {
    size: FONT_SIZES.h3,
    weight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.h3,
  },
  body: {
    size: FONT_SIZES.body,
    weight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.body,
  },
  bodyMedium: {
    size: FONT_SIZES.bodyMedium,
    weight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.body,
  },
  subtitle: {
    size: FONT_SIZES.subtitle,
    weight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.subtitle,
  },
  caption: {
    size: FONT_SIZES.caption,
    weight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.caption,
  },
  captionMedium: {
    size: FONT_SIZES.captionMedium,
    weight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.caption,
  },
  captionSmall: {
    size: FONT_SIZES.captionSmall,
    weight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.caption,
  },
  small: {
    size: FONT_SIZES.small,
    weight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.small,
  },
} as const;
