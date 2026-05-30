import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: { 500: '#10b981', 600: '#059669' },
        warning: { 500: '#f59e0b', 600: '#d97706' },
        danger: { 500: '#ef4444', 600: '#dc2626' },
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0, 0, 0, 0.1)',
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        elevated: '0 10px 40px rgba(0, 0, 0, 0.12)',
      },
      spacing: {
        sidebar: '18rem',
        header: '64px',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}

export default config
