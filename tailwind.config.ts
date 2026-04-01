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
        aurora: "#00c471",
        "aurora-muted": "#60bb83",
        midnight: "#0a121f",
        navy: "#162235",
        "navy-light": "#2e3b50",
        "warm-white": "#faf8f5",
        "ice-light": "#d3e8f7",
        stone: "#f2eee7",
        "stone-dark": "#e3ddd3",
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
