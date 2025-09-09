import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0,0,0,0.12)'
      }
    },
  },
  plugins: [],
};
export default config;
