/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          base: '#FBFBFB',
          sky: '#E8F9FF',
          periwinkle: '#C4D9FF',
          lavender: '#C5BAFF',
          navy: '#1e1b4b',
          indigo: '#4338ca',
          muted: '#6366f1',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'theme-card': '0 4px 20px rgba(196, 217, 255, 0.45)',
        'theme-glow': '0 0 25px rgba(197, 186, 255, 0.7)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
