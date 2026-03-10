import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#D4A843",
        "gold-light": "#E8C875",
        navy: "#0f1b3d",
        "navy-2": "#1a2d5e",
        "navy-3": "#253a6e",
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Source Serif 4", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
