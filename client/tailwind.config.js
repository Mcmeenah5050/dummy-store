/** @type {import('tailwindcss').Config} */
import daisyui  from "daisyui"
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          100: "#D8D2C2",
          200: "#EEEDEB",
        },
      },
    },
  },
  plugins: [daisyui],
};
