/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        cursive: ['Pacifico', 'cursive'],
      },
      colors: {
        accent: '#EF0314',
        accentDark: '#E63535',
        light: '#FFF',
        dark: '#141414',
      },
      animation: {
        blurToClear100: 'blurToClear 0.1s ease-out',
        blurToClear200: 'blurToClear 0.2s ease-out',
        blurToClear300: 'blurToClear 0.3s ease-out',
        blurToClear400: 'blurToClear 0.4s ease-out',
        blurToClear500: 'blurToClear 0.5s ease-out',
        blurToClear600: 'blurToClear 0.6s ease-out',
        blurToClear700: 'blurToClear 0.7s ease-out',
        blurToClear800: 'blurToClear 0.8s ease-out',
        blurToClear900: 'blurToClear 0.9s ease-out',
        blurToClear1000: 'blurToClear 1s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
};
