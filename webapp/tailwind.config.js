/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
        backgroundColor: {
            "dark-mode": "#171717",
            "light-mode": "#3498db",
        },
    },
  },
  plugins: [],
}

