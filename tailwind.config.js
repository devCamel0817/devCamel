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
        // === NEW (Phase 1) ===
        paper: 'var(--color-paper)',
        'paper-2': 'var(--color-paper-2)',
        'paper-3': 'var(--color-paper-3)',
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        'ink-mute': 'var(--color-ink-mute)',
        camel: 'var(--color-camel)',
        'camel-light': 'var(--color-camel-light)',
        'camel-deep': 'var(--color-camel-deep)',
        tape: 'var(--color-tape)',
        'mac-red': 'var(--color-mac-red)',
        'mac-yellow': 'var(--color-mac-yellow)',
        'mac-green': 'var(--color-mac-green)',
        line: 'var(--color-line)',
        'line-strong': 'var(--color-line-strong)',
        // === LEGACY (호환) ===
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
        hand: [
          'Caveat',
          'cursive',
        ],
      },
    },
  },
  plugins: [],
};
