/**
 * 8alls Design System - Typography Tokens
 * 
 * Consistent typography across all applications.
 */

export const typography = {
  // Font families
  fonts: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"Fira Code", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    display: '"Cal Sans", "Inter", -apple-system, sans-serif',
  },

  // Font sizes - using a modular scale
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },

  // Font weights
  weights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Predefined text styles for common use cases
export const textStyles = {
  // Display text
  displayLarge: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['7xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  displayMedium: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['5xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  displaySmall: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
  },

  // Headings
  h1: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
  },
  h2: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight,
  },
  h3: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.snug,
  },
  h4: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.snug,
  },

  // Body text
  bodyLarge: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.relaxed,
  },
  body: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
  },
  bodySmall: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
  },

  // Labels and UI text
  label: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.tight,
  },
  caption: {
    fontFamily: typography.fonts.sans,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
  },

  // Code
  code: {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
  },
} as const;
