/**
 * 8alls Design System - Color Tokens
 * 
 * A cohesive color palette for the 8alls productivity suite.
 * Designed for both light and dark modes.
 */

export const colors = {
  // Primary brand colors - inspired by billiard balls (8-ball black & vibrant accents)
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d7fe',
    300: '#a4b8fc',
    400: '#8192f8',
    500: '#6366f1',  // Main primary
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },

  // Secondary/accent colors
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',  // Main secondary
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },

  // Success states
  success: {
    light: '#10b981',
    DEFAULT: '#059669',
    dark: '#047857',
  },

  // Error states
  error: {
    light: '#f87171',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },

  // Warning states
  warning: {
    light: '#fbbf24',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },

  // Info states
  info: {
    light: '#60a5fa',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },

  // Neutral colors (for text, backgrounds, borders)
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
    1000: '#000000',
  },

  // Semantic colors for light mode
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#fafafa',
      tertiary: '#f5f5f5',
      elevated: '#ffffff',
    },
    text: {
      primary: '#171717',
      secondary: '#525252',
      tertiary: '#737373',
      disabled: '#a3a3a3',
      inverse: '#ffffff',
    },
    border: {
      primary: '#e5e5e5',
      secondary: '#d4d4d4',
      focus: '#6366f1',
    },
  },

  // Semantic colors for dark mode
  dark: {
    background: {
      primary: '#0a0a0a',
      secondary: '#171717',
      tertiary: '#262626',
      elevated: '#171717',
    },
    text: {
      primary: '#fafafa',
      secondary: '#a3a3a3',
      tertiary: '#737373',
      disabled: '#525252',
      inverse: '#0a0a0a',
    },
    border: {
      primary: '#262626',
      secondary: '#404040',
      focus: '#6366f1',
    },
  },
} as const;

// Type exports for TypeScript users
export type ColorScale = typeof colors.primary;
export type SemanticColors = typeof colors.light;
