import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bowl: {
          background: "#080A0F",
          card: "#111827",
          cardHover: "#161E2E",
          border: "#263142",
          text: "#F9FAFB",
          muted: "#9CA3AF",
          purple: "#7C3AED",
          cyan: "#06B6D4",
          success: "#A3E635"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 80px rgba(124, 58, 237, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
