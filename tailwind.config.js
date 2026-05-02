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
          200: '#a8b87a',
          400: '#7a9448',
          500: '#606C38',
          700: '#606C38',
          900: '#283618',
        },
        amber: {
          400: '#DDA15E',
          700: '#BC6C25',
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
