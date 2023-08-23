/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  content: [],
  theme: {
    extend: {
      colors: {
        "bg-nav": "#18181c",
        "bg-black": "#000",
        "bg-white": "#fff",
      },
      screen: {},
    },
  },
  plugins: [],
};
