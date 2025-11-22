import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0f172a",
          light: "#1e293b",
          lighter: "#1f2937"
        },
        accent: {
          DEFAULT: "#ec4899",
          soft: "#f472b6"
        }
      }
    }
  },
  plugins: []
};

export default config;
