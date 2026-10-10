/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e5ede5',
          200: '#ccdcce',
          300: '#a7c3a9',
          400: '#7fa483',
          500: '#5e8663',
          600: '#486b4d',
          700: '#3a543e',
          800: '#314434',
          900: '#29382c',
        },
        sand: {
          50: '#faf8f5',
          100: '#f4eee4',
          200: '#e7dcce',
          300: '#d7c4af',
          400: '#c4a68b',
          500: '#b48f72',
          600: '#a57a62',
          700: '#896251',
          800: '#705145',
          900: '#5c433b',
        },
        zen: {
          dark: '#121714',
          surface: '#1a211d',
          card: '#222b26',
          border: '#2e3a34',
          accent: '#7fa483',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Merriweather', 'serif'],
      },
      animation: {
        'breathe-in-out': 'breathe 16s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '25%': { transform: 'scale(1.45)', opacity: '1' },
          '50%': { transform: 'scale(1.45)', opacity: '1' },
          '75%': { transform: 'scale(1)', opacity: '0.85' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
