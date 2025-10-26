/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter var"', 'Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          DEFAULT: '#0056b3',
          dark: '#003f7f'
        },
        accent: '#ffc107'
      }
    }
  },
  plugins: []
};
