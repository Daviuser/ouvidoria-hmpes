import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        // Azul institucional (nomes mantidos para preservar as classes existentes)
        brand: { 50: "#eef5ff", 100: "#dce9ff", 200: "#bcd4ff", 500: "#2f6fdb", 600: "#1d5bc4", 700: "#1a4ca3", 800: "#173f85", 900: "#12315f" },
        navy: { 700: "#2b3a4f", 800: "#1b2a41", 900: "#0f1b2e" },
        accent: { 50: "#ecfdf8", 100: "#d1faec", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e" },
        alert: { 50: "#fef2f2", 600: "#c62828", 700: "#a61f1f" },
        surface: "#f4f7fb",
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.125rem" },
      boxShadow: {
        soft: "0 1px 2px rgb(15 27 46 / 0.04), 0 4px 16px -4px rgb(15 27 46 / 0.08)",
        lift: "0 2px 4px rgb(15 27 46 / 0.04), 0 12px 28px -8px rgb(15 27 46 / 0.16)",
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.92)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "menu-in": { "0%": { opacity: "0", transform: "translateY(-6px) scale(0.98)" }, "100%": { opacity: "1", transform: "translateY(0) scale(1)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "menu-in": "menu-in 0.18s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
