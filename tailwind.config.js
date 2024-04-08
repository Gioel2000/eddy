/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        cursive: ["Pacifico", "cursive"],
      },
      colors: {
        accent: "#EF0314",
        accentDark: "#E63535",
        light: "#FFF",
        dark: "#111",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require('@tailwindcss/line-clamp')],
};
