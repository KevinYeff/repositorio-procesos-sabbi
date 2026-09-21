import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hueso: "#f4f4ed",
        "verde-sabbi": "#79a82d",
        "verde-profundo": "#334f1b",
        "verde-noche": "#223311",
        lima: "#c3ed74",
        morado: "#7562c6",
        lavanda: "#b5b3ff",
        "ink-body": "#566347",
        "ink-caption": "#6b7a5a",
        "border-soft": "#e2e1d6",
      },
      fontFamily: {
        sans: ["'Hanken Grotesk'", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
