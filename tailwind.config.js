/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#fdfcfb',
          100: '#faf6f0',
          200: '#f5efe6',
          300: '#ede4d5',
        },
        taupe: {
          300: '#d4c5b0',
          500: '#b8a898',
          700: '#8a7a6a',
        },
        sage: {
          200: '#c8d5b9',
          400: '#9bb89f',
          500: '#7a9e7e',
          700: '#4a7c59',
          900: '#2f4a37',
        },
        ink: {
          DEFAULT: '#2c2c2c',
          soft:    '#5a5350',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['Nunito', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        pill: '999px',
        card: '4px',
        form: '6px',
      },
    },
  },
  plugins: [],
}
