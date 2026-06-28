import type { Config } from "tailwindcss";

import { theme } from "./src/styles/theme";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: theme.colors.background,
        surface: theme.colors.surface,
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        success: theme.colors.success,
        warning: theme.colors.warning,
        error: theme.colors.error,
        text: theme.colors.text,
        border: theme.colors.border,
        canvas: theme.colors.background,
        ink: theme.colors.text,
        muted: "#9aa6ba",
        line: theme.colors.border,
        accent: theme.colors.primary,
      },
      borderRadius: theme.radius,
      boxShadow: theme.shadows,
      spacing: theme.spacing,
      transitionDuration: theme.durations,
      zIndex: theme.zIndex,
      fontFamily: {
        sans: theme.typography.fontFamily.sans,
        mono: theme.typography.fontFamily.mono,
      },
    },
  },
  plugins: [],
};

export default config;
