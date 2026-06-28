import {
  colorTokens,
  durationTokens,
  radiusTokens,
  shadowTokens,
  spacingTokens,
  typographyTokens,
  zIndexTokens,
} from "./design-tokens";

/**
 * Semantic color tokens for the default dark Aether AI theme.
 */
export const semanticColors = {
  background: colorTokens.neutral[950],
  surface: colorTokens.neutral[900],
  primary: colorTokens.blue[500],
  secondary: colorTokens.cyan[500],
  success: colorTokens.green[500],
  warning: colorTokens.amber[500],
  error: colorTokens.red[500],
  text: colorTokens.neutral[50],
  border: colorTokens.neutral[700],
} as const;

/**
 * The application defaults to dark mode unless a future theme controller
 * explicitly selects another mode.
 */
export const defaultTheme = "dark" as const;

/**
 * Framework-ready theme object for Tailwind and future design-system consumers.
 */
export const theme = {
  mode: defaultTheme,
  colors: semanticColors,
  typography: typographyTokens,
  radius: radiusTokens,
  shadows: shadowTokens,
  spacing: spacingTokens,
  zIndex: zIndexTokens,
  durations: durationTokens,
} as const;

export type ThemeMode = typeof defaultTheme;
export type SemanticColorName = keyof typeof semanticColors;
export type AetherTheme = typeof theme;
