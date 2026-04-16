/**
 * tailwind.config.js - CSS 변수 기반 테마 색상 프리셋 확장
 */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
        secondary: 'var(--color-secondary)',
        'secondary-light': 'var(--color-secondary-light)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        'surface-900': 'var(--color-surface-900)',
        'surface-800': 'var(--color-surface-800)',
        'surface-700': 'var(--color-surface-700)',
        'surface-600': 'var(--color-surface-600)',
        'surface-500': 'var(--color-surface-500)',
        'surface-400': 'var(--color-surface-400)',
        'glass': 'var(--color-glass)',
        'glass-border': 'var(--color-glass-border)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
