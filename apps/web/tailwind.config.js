const { COLORS } = require('../../packages/ui/src/theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: COLORS.primary,
        cream: COLORS.cream,
        gold: COLORS.gold,
        neutral: COLORS.neutral,
        success: COLORS.success,
        danger: COLORS.danger,
        warning: COLORS.warning,
        info: COLORS.info,
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
      fontFamily: {
        rubik: ['Rubik', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(20, 19, 17, 0.04)',
        md: '0 2px 8px rgba(20, 19, 17, 0.06)',
        lg: '0 8px 24px rgba(20, 19, 17, 0.08)',
        xl: '0 16px 48px rgba(20, 19, 17, 0.12)',
      },
    },
  },
  plugins: [],
};
