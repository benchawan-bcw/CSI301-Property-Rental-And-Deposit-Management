/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          light: '#8AD6D1',
          DEFAULT: '#8AD6D1',
        },
        teal: {
          dark: '#359FA0',
          DEFAULT: '#359FA0',
        },
        cream: {
          warm: '#FFF0C5',
          DEFAULT: '#FFF0C5',
        },
        coral: {
          vibrant: '#FF8C52',
          DEFAULT: '#FF8C52',
        }
      }
    },
  },
  plugins: [],
}