/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          base: '#07090E',        // Deep Obsidian Black
          surface: '#0E131F',     // Card Surface
          surfaceLight: '#141C2E',// Elevated Card Surface
          border: '#1E293B',      // Crisp dark border
          borderHover: '#334155', // Active border
          accent: '#6366F1',      // Cyber Indigo
          cyan: '#06B6D4',        // Electric Cyan
          emerald: '#10B981',     // Success Green
          purple: '#A855F7',      // Electric Purple
          navy: '#F8FAFC',        // High-contrast primary text
          muted: '#94A3B8',       // Subdued secondary text
          sky: '#0F172A',         // Hero / container dark background
          lavender: '#1E1B4B',    // Highlight pill background
          periwinkle: '#1E293B',  // Container borders
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'theme-card': '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'theme-glow': '0 0 30px rgba(99, 102, 241, 0.2)',
        'cyan-glow': '0 0 25px rgba(6, 182, 212, 0.25)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
