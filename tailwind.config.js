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
        green: {
          50: '#f5fdf9',
          100: '#eafcf0',
          200: '#d8f9e6',
          300: '#bff4d2',
          400: '#8de8b3',
          500: '#5ad99a',
          600: '#4ac17f',
          700: '#3a9c66',
          800: '#2b7750',
          900: '#1d523b',
        },
        brown: {
          50: '#fdfaf7',
          100: '#fbf5f0',
          200: '#f6e9e1',
          300: '#f0ddd2',
          400: '#e7cfc0',
          500: '#ddc1a8',
          600: '#c6a88d',
          700: '#a68e72',
          800: '#856b58',
          900: '#6c4a3e',
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
