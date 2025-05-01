/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "./themes/**/layouts/**/*.html",
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    container: false, // This disables the container class
    preflight: false, // This disables all base/reset styles
  },
  plugins: [],
}
