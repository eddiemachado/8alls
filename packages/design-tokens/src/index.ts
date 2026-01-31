/**
 * 8alls Design System
 * 
 * A comprehensive design token system for building consistent,
 * beautiful applications across the 8alls productivity suite.
 * 
 * @packageDocumentation
 */

export * from './tokens/colors';
export * from './tokens/typography';
export * from './tokens/spacing';
export * from './tokens/animation';
export * from './css-variables';
export * from './global-styles';

// Re-export everything under a single namespace for convenience
import * as colors from './tokens/colors';
import * as typography from './tokens/typography';
import * as spacing from './tokens/spacing';
import * as animation from './tokens/animation';

export const tokens = {
  colors: colors.colors,
  typography: typography.typography,
  textStyles: typography.textStyles,
  spacing: spacing.spacing,
  semanticSpacing: spacing.semanticSpacing,
  radius: spacing.radius,
  shadows: spacing.shadows,
  zIndex: spacing.zIndex,
  animation: animation.animation,
  keyframes: animation.keyframes,
};

// Default theme preset
export const theme = {
  mode: 'light' as 'light' | 'dark',
  colors: colors.colors,
  typography: typography.typography,
  spacing: spacing.spacing,
  radius: spacing.radius,
  shadows: spacing.shadows,
};

export type Theme = typeof theme;
