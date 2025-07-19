/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Space Grotesk', 'Noto Sans', 'sans-serif'],
      },
      colors: {
        'primary-dark': '#0c151d',
        'primary-blue': '#4577a1',
        'gray-light': '#e6eef4',
        'gray-border': '#cdddea',
        'slate-bg': '#f8fafc',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      letterSpacing: {
        'tight-custom': '-0.015em',
      },
    },
  },
  plugins: [],
}