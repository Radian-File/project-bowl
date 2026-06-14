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
        },
        ink: {
          bg: "#0A0A0A",
          surface: "#141414",
          surfaceHover: "#1A1A1A",
          border: "#262626",
          borderStrong: "#3A3A3A",
          text: "#EDEDED",
          muted: "#8A8A8A",
          faint: "#5A5A5A",
          accent: "#D4F25A",
          accentMuted: "#A8C13E"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "Inter", "sans-serif"],
        editorial: ["var(--font-editorial)", "Archivo", "Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 80px rgba(124, 58, 237, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
