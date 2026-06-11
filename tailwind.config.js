/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
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
        // Tokens semánticos para estados (badges de orden, blog, stock). Verificados WCAG AA.
        status: {
          pendingBg:    '#f5efe6', pendingFg:    '#7a5a2c',
          awaitingBg:   '#eae6f2', awaitingFg:   '#4a3a72',
          paidBg:       '#e6f0eb', paidFg:       '#3a5f48',
          prepBg:       '#eaf0f5', prepFg:       '#2f5a78',
          shippedBg:    '#f0eaf5', shippedFg:    '#5a347a',
          deliveredBg: '#dbe7df',  deliveredFg: '#234a32',
          cancelledBg: '#f5e6e6',  cancelledFg: '#8a3a2c',
          draftBg:     '#ede8e0',  draftFg:     '#5a5350',
          publishedBg: '#dff0e6',  publishedFg: '#284f30',
          warningBg:   '#fef3e0',  warningFg:   '#7a5a1c',
          dangerBg:    '#fbe9e7',  dangerFg:    '#8a2c1f',
        },
      },
      fontFamily: {
        // Variables inyectadas por next/font/google (ver app/layout.tsx)
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        body:    ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
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
