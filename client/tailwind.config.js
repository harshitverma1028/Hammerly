/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        ink: "#191510",
        parchment: "#F7F2E9",
        brass: "#B08D57",
        brassdark: "#8A6D3F",
        forest: "#1F3A2E",
        wine: "#6E1E27",
      },
    },
  },
  plugins: [],
};
