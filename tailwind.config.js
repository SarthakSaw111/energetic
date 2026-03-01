/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF6B35",
          "orange-light": "#FF8F65",
          "orange-dark": "#E55A25",
          purple: "#6C35DE",
          "purple-light": "#8B5CF6",
          "purple-dark": "#5521B5",
        },
        dark: {
          900: "#0A0A0F",
          800: "#12121A",
          700: "#1A1A25",
          600: "#222233",
          500: "#2D2D3F",
          400: "#3D3D52",
          300: "#5A5A78",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "fire-pulse": "firePulse 1.5s ease-in-out infinite",
        "xp-fill": "xpFill 1s ease-out forwards",
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "bounce-in": "bounceIn 0.5s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        firePulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
        },
        xpFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--xp-width)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(255, 107, 53, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(255, 107, 53, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
