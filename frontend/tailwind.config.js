/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          50: "#f8fbff",
          100: "#edf2ff",
          200: "#cfd9f2",
          300: "#a6b4d6",
          400: "#7e8db4",
          500: "#5c698e",
          600: "#3d4765",
          700: "#283147",
          800: "#151a2c",
          900: "#090c18",
          950: "#03050c",
        },
        ion: {
          50: "#f4f1ff",
          100: "#ebe7ff",
          200: "#cfc3ff",
          300: "#b59eff",
          400: "#9a79ff",
          500: "#815cf0",
          600: "#6542c4",
          700: "#4a2f95",
        },
        chrome: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5f5",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 15px 35px rgba(129, 92, 240, 0.35)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.04)",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
}
