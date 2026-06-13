import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{mdx,md}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f7f4",
          100: "#e8ebe4",
          200: "#d4d9cc",
          300: "#b5bfab",
          400: "#95a48a",
          500: "#7c9070",
          600: "#647a59",
          700: "#516249",
          800: "#434f3d",
          900: "#394234",
        },
        surface: {
          DEFAULT: "#faf8f5",
          card: "#ffffff",
          muted: "#f3f0eb",
        },
        ink: {
          DEFAULT: "#2c2825",
          muted: "#6b6560",
          faint: "#9a948d",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(44, 40, 37, 0.08)",
        lift: "0 12px 40px -8px rgba(44, 40, 37, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
