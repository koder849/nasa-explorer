/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Space Grotesk", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 20px rgba(15, 23, 42, 0.06)",
        focus: "0 0 0 4px rgba(148, 163, 184, 0.3)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
}
