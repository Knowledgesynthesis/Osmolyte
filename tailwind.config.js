/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medical condition color semantics
        'siadh': {
          50: '#eff6ff',
          100: '#dbeafe',
          300: '#93c5fd',
          500: '#3b82f6',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        'csw': {
          50: '#fffbeb',
          100: '#fef3c7',
          300: '#fcd34d',
          500: '#f59e0b',
          700: '#b45309',
          900: '#78350f',
        },
        'di': {
          50: '#fef2f2',
          100: '#fee2e2',
          300: '#fca5a5',
          500: '#ef4444',
          700: '#b91c1c',
          900: '#7f1d1d',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
