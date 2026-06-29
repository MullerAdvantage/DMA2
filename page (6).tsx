import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0E2A47',
          light: '#163660',
          dark: '#091c30',
          50: '#e8eef5',
        },
        gold: {
          DEFAULT: '#C8A04B',
          light: '#d4b06a',
          dark: '#a8832e',
        },
        surface: '#F7F8FA',
        border: '#E2E6EC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
