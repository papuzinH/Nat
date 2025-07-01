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
          50: '#fdfcfb',
          100: '#fbf9f7',
          200: '#f6f2ee',
          300: '#f0eae4',
          400: '#e7ddd4',
          500: '#ddd0c4',
          600: '#c6b9ad',
          700: '#a69a8e',
          800: '#857a70',
          900: '#6c635b',
        },
        nude: {
          50: '#fefefe',
          100: '#fdfdfc',
          200: '#faf9f7',
          300: '#f6f4f1',
          400: '#efeae5',
          500: '#e7e0d9',
          600: '#d0cac3',
          700: '#ada8a2',
          800: '#8a8681',
          900: '#716e6a',
        },
      },
      fontFamily: {
        'title': ['Aboreto', 'serif'],
        'body': ['Gayathri', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
