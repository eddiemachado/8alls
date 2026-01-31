/**
 * 8alls Design System - CSS Variables
 * 
 * Generate CSS custom properties from design tokens.
 * Use this to create a global CSS file or inject into your app.
 */

import { colors } from './tokens/colors';
import { typography } from './tokens/typography';
import { spacing, radius, shadows } from './tokens/spacing';
import { animation } from './tokens/animation';

/**
 * Generate CSS custom properties string for light mode
 */
export function generateLightModeCSSVars(): string {
  return `
:root {
  /* Colors - Primary */
  --color-primary-50: ${colors.primary[50]};
  --color-primary-100: ${colors.primary[100]};
  --color-primary-200: ${colors.primary[200]};
  --color-primary-300: ${colors.primary[300]};
  --color-primary-400: ${colors.primary[400]};
  --color-primary-500: ${colors.primary[500]};
  --color-primary-600: ${colors.primary[600]};
  --color-primary-700: ${colors.primary[700]};
  --color-primary-800: ${colors.primary[800]};
  --color-primary-900: ${colors.primary[900]};
  --color-primary-950: ${colors.primary[950]};

  /* Colors - Secondary */
  --color-secondary-50: ${colors.secondary[50]};
  --color-secondary-100: ${colors.secondary[100]};
  --color-secondary-200: ${colors.secondary[200]};
  --color-secondary-300: ${colors.secondary[300]};
  --color-secondary-400: ${colors.secondary[400]};
  --color-secondary-500: ${colors.secondary[500]};
  --color-secondary-600: ${colors.secondary[600]};
  --color-secondary-700: ${colors.secondary[700]};
  --color-secondary-800: ${colors.secondary[800]};
  --color-secondary-900: ${colors.secondary[900]};

  /* Colors - Semantic */
  --color-success: ${colors.success.DEFAULT};
  --color-error: ${colors.error.DEFAULT};
  --color-warning: ${colors.warning.DEFAULT};
  --color-info: ${colors.info.DEFAULT};

  /* Colors - Background */
  --color-bg-primary: ${colors.light.background.primary};
  --color-bg-secondary: ${colors.light.background.secondary};
  --color-bg-tertiary: ${colors.light.background.tertiary};
  --color-bg-elevated: ${colors.light.background.elevated};

  /* Colors - Text */
  --color-text-primary: ${colors.light.text.primary};
  --color-text-secondary: ${colors.light.text.secondary};
  --color-text-tertiary: ${colors.light.text.tertiary};
  --color-text-disabled: ${colors.light.text.disabled};
  --color-text-inverse: ${colors.light.text.inverse};

  /* Colors - Border */
  --color-border-primary: ${colors.light.border.primary};
  --color-border-secondary: ${colors.light.border.secondary};
  --color-border-focus: ${colors.light.border.focus};

  /* Typography */
  --font-sans: ${typography.fonts.sans};
  --font-mono: ${typography.fonts.mono};
  --font-display: ${typography.fonts.display};

  /* Spacing */
  --spacing-0: ${spacing[0]};
  --spacing-1: ${spacing[1]};
  --spacing-2: ${spacing[2]};
  --spacing-3: ${spacing[3]};
  --spacing-4: ${spacing[4]};
  --spacing-5: ${spacing[5]};
  --spacing-6: ${spacing[6]};
  --spacing-8: ${spacing[8]};
  --spacing-10: ${spacing[10]};
  --spacing-12: ${spacing[12]};
  --spacing-16: ${spacing[16]};
  --spacing-20: ${spacing[20]};
  --spacing-24: ${spacing[24]};

  /* Border Radius */
  --radius-sm: ${radius.sm};
  --radius-base: ${radius.base};
  --radius-md: ${radius.md};
  --radius-lg: ${radius.lg};
  --radius-xl: ${radius.xl};
  --radius-2xl: ${radius['2xl']};
  --radius-full: ${radius.full};

  /* Shadows */
  --shadow-sm: ${shadows.sm};
  --shadow-base: ${shadows.base};
  --shadow-md: ${shadows.md};
  --shadow-lg: ${shadows.lg};
  --shadow-xl: ${shadows.xl};

  /* Animation */
  --duration-fast: ${animation.duration.fast};
  --duration-normal: ${animation.duration.normal};
  --duration-slow: ${animation.duration.slow};
  --ease-in-out: ${animation.easing.easeInOut};
  --transition-colors: ${animation.transition.colors};
  --transition-all: ${animation.transition.all};
}
`.trim();
}

/**
 * Generate CSS custom properties string for dark mode
 */
export function generateDarkModeCSSVars(): string {
  return `
[data-theme="dark"] {
  /* Colors - Background */
  --color-bg-primary: ${colors.dark.background.primary};
  --color-bg-secondary: ${colors.dark.background.secondary};
  --color-bg-tertiary: ${colors.dark.background.tertiary};
  --color-bg-elevated: ${colors.dark.background.elevated};

  /* Colors - Text */
  --color-text-primary: ${colors.dark.text.primary};
  --color-text-secondary: ${colors.dark.text.secondary};
  --color-text-tertiary: ${colors.dark.text.tertiary};
  --color-text-disabled: ${colors.dark.text.disabled};
  --color-text-inverse: ${colors.dark.text.inverse};

  /* Colors - Border */
  --color-border-primary: ${colors.dark.border.primary};
  --color-border-secondary: ${colors.dark.border.secondary};
  --color-border-focus: ${colors.dark.border.focus};
}
`.trim();
}

/**
 * Generate complete CSS variables for both light and dark modes
 */
export function generateAllCSSVars(): string {
  return `${generateLightModeCSSVars()}

${generateDarkModeCSSVars()}`;
}

/**
 * CSS custom properties as a JavaScript object (for CSS-in-JS)
 */
export const cssVars = {
  light: {
    colorPrimary: 'var(--color-primary-500)',
    colorBgPrimary: 'var(--color-bg-primary)',
    colorBgSecondary: 'var(--color-bg-secondary)',
    colorTextPrimary: 'var(--color-text-primary)',
    colorTextSecondary: 'var(--color-text-secondary)',
    colorBorderPrimary: 'var(--color-border-primary)',
    fontSans: 'var(--font-sans)',
    spacing4: 'var(--spacing-4)',
    spacing8: 'var(--spacing-8)',
    radiusMd: 'var(--radius-md)',
    shadowMd: 'var(--shadow-md)',
    transitionAll: 'var(--transition-all)',
  },
};
