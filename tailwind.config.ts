import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#6E1F2A',
          50: '#FBF2F3',
          100: '#F3DFE1',
          200: '#E2B8BD',
          300: '#C98890',
          400: '#A2515C',
          500: '#6E1F2A',
          600: '#5F1A24',
          700: '#4A141C',
          800: '#380F15',
          900: '#280A0F',
        },
        cream: '#F7F3EA',
        warmwhite: '#FCFBF7',
        gold: {
          DEFAULT: '#C8A96B',
          light: '#DCC694',
          dark: '#A98A4E',
        },
        ink: '#292526',
        muted: '#6B6561',
        line: '#E7E0D3',
      },
      fontFamily: {
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(41,37,38,0.04), 0 8px 24px -12px rgba(41,37,38,0.18)',
        lift: '0 2px 4px rgba(41,37,38,0.05), 0 20px 40px -20px rgba(41,37,38,0.28)',
      },
      borderRadius: {
        card: '0.5rem',
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slow-zoom': {
          from: { transform: 'scale(1.06)' },
          to: { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'slow-zoom': 'slow-zoom 1.6s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
