/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'background-color' : '#F6FFF8',
        'text-colour' : '#2D2A32',
        'primary' : '#6B9080',
        'secondary' : '#A4C3B2',
        'dark' : '#455d52',
        'Accent' : '#8FC0A9'
      }
    },
  },
  plugins: [],
}