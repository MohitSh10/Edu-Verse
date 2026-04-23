/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter:  ["'Plus Jakarta Sans'", "sans-serif"],
        sora:   ["Sora", "sans-serif"],
        mono:   ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        richblack: {
          5:   "#e8f4fd",
          25:  "#d0e8f7",
          50:  "#b8d8f0",
          100: "#9cbdd8",
          200: "#80a2c0",
          300: "#638aaa",
          400: "#7a9ab8",
          500: "#3d6480",
          600: "#1a3a5c",
          700: "#081e33",
          800: "#061525",
          900: "#020b18",
        },
        richyellow: {
          5:   "#fffbef",
          25:  "#fef3c7",
          50:  "#f5a623",
          100: "#e8951a",
          200: "#d4840f",
          400: "#b5600a",
          900: "rgba(245,166,35,0.12)",
          800: "rgba(245,166,35,0.08)",
        },
        blue: {
          25:  "#e0f7ff",
          50:  "#80e8ff",
          100: "#00d4ff",
          200: "#0099ff",
          300: "#0066cc",
        },
        pink: {
          50:  "#ff4d6d",
          100: "#ff4d6d",
          200: "#ff80a0",
        },
        caribbeangreen: {
          5:   "#e0fff4",
          25:  "#80ffce",
          50:  "#00e5a0",
          100: "#00c882",
          200: "#00a866",
          400: "#006644",
        },
      },
      boxShadow: {
        card:    "0 20px 60px rgba(0,0,0,0.4)",
        glow:    "0 0 40px rgba(245,166,35,0.25)",
        "glow-blue": "0 0 40px rgba(0,212,255,0.2)",
        inner:   "inset 0 0 20px rgba(0,0,0,0.3)",
        "card-hover": "0 30px 80px rgba(0,0,0,0.5), 0 0 30px rgba(245,166,35,0.08)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":   "radial-gradient(at 40% 20%, #0a2040 0px, transparent 50%), radial-gradient(at 80% 0%, #061525 0px, transparent 50%), radial-gradient(at 0% 50%, #020b18 0px, transparent 50%)",
      },
      screens: {
        xs: "420px",
      },
      maxWidth: {
        maxContent: "1280px",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease forwards",
        "float": "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "shimmer": "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};
