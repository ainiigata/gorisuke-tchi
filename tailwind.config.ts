import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d0d1a',
        accent: '#a88fd0',
      },
      fontFamily: {
        mono: ['ui-monospace', 'monospace'],
      },
    },
  },
} satisfies Config
