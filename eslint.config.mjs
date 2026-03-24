import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.expo/',
      '.turbo/',
      'ios/',
      'android/',
      '**/dist/',
      '**/build/',
      '**/*.config.js',
      '**/*.config.ts',
      '**/*.config.mjs',
      '**/babel.config.js',
      '**/metro.config.js',
      '**/tailwind.config.*',
      '**/postcss.config.*',
      '**/vite.config.*',
      '**/nativewind-env.d.ts',
      '**/expo-env.d.ts',
    ],
  },

  // Base JS rules
  eslint.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React Hooks rules
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },

  // DocField custom rules
  {
    rules: {
      // TypeScript strict — no any
      '@typescript-eslint/no-explicit-any': 'error',

      // Unused vars — allow underscore prefix
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // No console.log in production code
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Require strict equality
      eqeqeq: ['error', 'always'],

      // No var — use const/let
      'no-var': 'error',

      // Prefer const
      'prefer-const': 'error',
    },
  },

  // Prettier must be last — disables formatting rules
  eslintConfigPrettier
);
