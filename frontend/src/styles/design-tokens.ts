/**
 * Primitive design tokens for the Aether AI interface.
 *
 * These values are intentionally framework-neutral so they can be reused by
 * Tailwind, component styling, tests, and future design-system utilities.
 */
export const colorTokens = {
  neutral: {
    50: "#f8fafc",
    100: "#eef2f7",
    200: "#d9e1ec",
    300: "#b9c4d4",
    400: "#8b98aa",
    500: "#647084",
    600: "#465164",
    700: "#30394a",
    800: "#1d2432",
    900: "#111827",
    950: "#070b12",
  },
  blue: {
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
  },
  cyan: {
    400: "#22d3ee",
    500: "#06b6d4",
  },
  green: {
    400: "#4ade80",
    500: "#22c55e",
  },
  amber: {
    400: "#fbbf24",
    500: "#f59e0b",
  },
  red: {
    400: "#f87171",
    500: "#ef4444",
  },
} as const;

/**
 * Typography tokens define the default type stack and scale.
 */
export const typographyTokens = {
  fontFamily: {
    sans: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif",
    ],
    mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.2",
    normal: "1.5",
    relaxed: "1.7",
  },
} as const;

/**
 * Border radius tokens standardize shape across controls and surfaces.
 */
export const radiusTokens = {
  none: "0",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px",
} as const;

/**
 * Shadow tokens provide depth levels for dark-mode surfaces.
 */
export const shadowTokens = {
  sm: "0 1px 2px rgb(0 0 0 / 0.28)",
  md: "0 10px 24px rgb(0 0 0 / 0.28)",
  lg: "0 20px 48px rgb(0 0 0 / 0.32)",
  focus: "0 0 0 3px rgb(96 165 250 / 0.35)",
} as const;

/**
 * Spacing tokens define the base layout rhythm.
 */
export const spacingTokens = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

/**
 * Z-index tokens define predictable stacking layers.
 */
export const zIndexTokens = {
  base: "0",
  dropdown: "1000",
  sticky: "1100",
  overlay: "1200",
  modal: "1300",
  toast: "1400",
  tooltip: "1500",
} as const;

/**
 * Animation duration tokens keep motion timing consistent.
 */
export const durationTokens = {
  instant: "75ms",
  fast: "150ms",
  normal: "250ms",
  slow: "400ms",
  slower: "700ms",
} as const;

/**
 * Complete primitive token export for consumers that need grouped access.
 */
export const designTokens = {
  colors: colorTokens,
  typography: typographyTokens,
  radius: radiusTokens,
  shadows: shadowTokens,
  spacing: spacingTokens,
  zIndex: zIndexTokens,
  durations: durationTokens,
} as const;
