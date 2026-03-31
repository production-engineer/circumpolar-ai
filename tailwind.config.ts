import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arctic: {
          950: "#050d1a",
          900: "#0a1628",
          800: "#0f2040",
          700: "#1a3a5c",
          600: "#1e4976",
          500: "#2563a8",
          400: "#3b82c4",
          300: "#60a5d4",
          200: "#93c5e8",
          100: "#dbeef7",
        },
        aurora: {
          green: "#4ade80",
          blue: "#38bdf8",
          purple: "#a855f7",
          pink: "#f472b6",
        },
        ice: "#e8f4f8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "aurora": "aurora 8s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        aurora: {
          "0%, 100%": { opacity: "0.4", transform: "scaleX(1)" },
          "50%": { opacity: "0.8", transform: "scaleX(1.05)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
