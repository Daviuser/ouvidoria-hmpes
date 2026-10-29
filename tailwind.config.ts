import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#f0f9ec", 100: "#dcf1d2", 500: "#4a9b2a", 600: "#3a8420", 700: "#2f6b1b", 800: "#27561a" },
        navy: { 700: "#2b3a4a", 800: "#1f2d3b", 900: "#16212c" },
        alert: { 600: "#c62828" },
      },
    },
  },
  plugins: [],
};
export default config;
