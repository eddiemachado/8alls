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

  /* Colors - Extended Palette (OKLCH) */
  --color-santasgray-50: ${colors.santasgray[50]};
  --color-santasgray-100: ${colors.santasgray[100]};
  --color-santasgray-200: ${colors.santasgray[200]};
  --color-santasgray-300: ${colors.santasgray[300]};
  --color-santasgray-400: ${colors.santasgray[400]};
  --color-santasgray-500: ${colors.santasgray[500]};
  --color-santasgray-600: ${colors.santasgray[600]};
  --color-santasgray-700: ${colors.santasgray[700]};
  --color-santasgray-800: ${colors.santasgray[800]};
  --color-santasgray-900: ${colors.santasgray[900]};
  --color-santasgray-950: ${colors.santasgray[950]};

  --color-frenchrose-50: ${colors.frenchrose[50]};
  --color-frenchrose-100: ${colors.frenchrose[100]};
  --color-frenchrose-200: ${colors.frenchrose[200]};
  --color-frenchrose-300: ${colors.frenchrose[300]};
  --color-frenchrose-400: ${colors.frenchrose[400]};
  --color-frenchrose-500: ${colors.frenchrose[500]};
  --color-frenchrose-600: ${colors.frenchrose[600]};
  --color-frenchrose-700: ${colors.frenchrose[700]};
  --color-frenchrose-800: ${colors.frenchrose[800]};
  --color-frenchrose-900: ${colors.frenchrose[900]};
  --color-frenchrose-950: ${colors.frenchrose[950]};

  --color-persimmon-50: ${colors.persimmon[50]};
  --color-persimmon-100: ${colors.persimmon[100]};
  --color-persimmon-200: ${colors.persimmon[200]};
  --color-persimmon-300: ${colors.persimmon[300]};
  --color-persimmon-400: ${colors.persimmon[400]};
  --color-persimmon-500: ${colors.persimmon[500]};
  --color-persimmon-600: ${colors.persimmon[600]};
  --color-persimmon-700: ${colors.persimmon[700]};
  --color-persimmon-800: ${colors.persimmon[800]};
  --color-persimmon-900: ${colors.persimmon[900]};
  --color-persimmon-950: ${colors.persimmon[950]};

  --color-meteor-50: ${colors.meteor[50]};
  --color-meteor-100: ${colors.meteor[100]};
  --color-meteor-200: ${colors.meteor[200]};
  --color-meteor-300: ${colors.meteor[300]};
  --color-meteor-400: ${colors.meteor[400]};
  --color-meteor-500: ${colors.meteor[500]};
  --color-meteor-600: ${colors.meteor[600]};
  --color-meteor-700: ${colors.meteor[700]};
  --color-meteor-800: ${colors.meteor[800]};
  --color-meteor-900: ${colors.meteor[900]};
  --color-meteor-950: ${colors.meteor[950]};

  --color-hokeypokey-50: ${colors.hokeypokey[50]};
  --color-hokeypokey-100: ${colors.hokeypokey[100]};
  --color-hokeypokey-200: ${colors.hokeypokey[200]};
  --color-hokeypokey-300: ${colors.hokeypokey[300]};
  --color-hokeypokey-400: ${colors.hokeypokey[400]};
  --color-hokeypokey-500: ${colors.hokeypokey[500]};
  --color-hokeypokey-600: ${colors.hokeypokey[600]};
  --color-hokeypokey-700: ${colors.hokeypokey[700]};
  --color-hokeypokey-800: ${colors.hokeypokey[800]};
  --color-hokeypokey-900: ${colors.hokeypokey[900]};
  --color-hokeypokey-950: ${colors.hokeypokey[950]};

  --color-limeade-50: ${colors.limeade[50]};
  --color-limeade-100: ${colors.limeade[100]};
  --color-limeade-200: ${colors.limeade[200]};
  --color-limeade-300: ${colors.limeade[300]};
  --color-limeade-400: ${colors.limeade[400]};
  --color-limeade-500: ${colors.limeade[500]};
  --color-limeade-600: ${colors.limeade[600]};
  --color-limeade-700: ${colors.limeade[700]};
  --color-limeade-800: ${colors.limeade[800]};
  --color-limeade-900: ${colors.limeade[900]};
  --color-limeade-950: ${colors.limeade[950]};

  --color-jade-50: ${colors.jade[50]};
  --color-jade-100: ${colors.jade[100]};
  --color-jade-200: ${colors.jade[200]};
  --color-jade-300: ${colors.jade[300]};
  --color-jade-400: ${colors.jade[400]};
  --color-jade-500: ${colors.jade[500]};
  --color-jade-600: ${colors.jade[600]};
  --color-jade-700: ${colors.jade[700]};
  --color-jade-800: ${colors.jade[800]};
  --color-jade-900: ${colors.jade[900]};
  --color-jade-950: ${colors.jade[950]};

  --color-keppel-50: ${colors.keppel[50]};
  --color-keppel-100: ${colors.keppel[100]};
  --color-keppel-200: ${colors.keppel[200]};
  --color-keppel-300: ${colors.keppel[300]};
  --color-keppel-400: ${colors.keppel[400]};
  --color-keppel-500: ${colors.keppel[500]};
  --color-keppel-600: ${colors.keppel[600]};
  --color-keppel-700: ${colors.keppel[700]};
  --color-keppel-800: ${colors.keppel[800]};
  --color-keppel-900: ${colors.keppel[900]};
  --color-keppel-950: ${colors.keppel[950]};

  --color-pacificblue-50: ${colors.pacificblue[50]};
  --color-pacificblue-100: ${colors.pacificblue[100]};
  --color-pacificblue-200: ${colors.pacificblue[200]};
  --color-pacificblue-300: ${colors.pacificblue[300]};
  --color-pacificblue-400: ${colors.pacificblue[400]};
  --color-pacificblue-500: ${colors.pacificblue[500]};
  --color-pacificblue-600: ${colors.pacificblue[600]};
  --color-pacificblue-700: ${colors.pacificblue[700]};
  --color-pacificblue-800: ${colors.pacificblue[800]};
  --color-pacificblue-900: ${colors.pacificblue[900]};
  --color-pacificblue-950: ${colors.pacificblue[950]};

  --color-havelockblue-50: ${colors.havelockblue[50]};
  --color-havelockblue-100: ${colors.havelockblue[100]};
  --color-havelockblue-200: ${colors.havelockblue[200]};
  --color-havelockblue-300: ${colors.havelockblue[300]};
  --color-havelockblue-400: ${colors.havelockblue[400]};
  --color-havelockblue-500: ${colors.havelockblue[500]};
  --color-havelockblue-600: ${colors.havelockblue[600]};
  --color-havelockblue-700: ${colors.havelockblue[700]};
  --color-havelockblue-800: ${colors.havelockblue[800]};
  --color-havelockblue-900: ${colors.havelockblue[900]};
  --color-havelockblue-950: ${colors.havelockblue[950]};

  --color-chetwodeblue-50: ${colors.chetwodeblue[50]};
  --color-chetwodeblue-100: ${colors.chetwodeblue[100]};
  --color-chetwodeblue-200: ${colors.chetwodeblue[200]};
  --color-chetwodeblue-300: ${colors.chetwodeblue[300]};
  --color-chetwodeblue-400: ${colors.chetwodeblue[400]};
  --color-chetwodeblue-500: ${colors.chetwodeblue[500]};
  --color-chetwodeblue-600: ${colors.chetwodeblue[600]};
  --color-chetwodeblue-700: ${colors.chetwodeblue[700]};
  --color-chetwodeblue-800: ${colors.chetwodeblue[800]};
  --color-chetwodeblue-900: ${colors.chetwodeblue[900]};
  --color-chetwodeblue-950: ${colors.chetwodeblue[950]};

  --color-heliotrope-50: ${colors.heliotrope[50]};
  --color-heliotrope-100: ${colors.heliotrope[100]};
  --color-heliotrope-200: ${colors.heliotrope[200]};
  --color-heliotrope-300: ${colors.heliotrope[300]};
  --color-heliotrope-400: ${colors.heliotrope[400]};
  --color-heliotrope-500: ${colors.heliotrope[500]};
  --color-heliotrope-600: ${colors.heliotrope[600]};
  --color-heliotrope-700: ${colors.heliotrope[700]};
  --color-heliotrope-800: ${colors.heliotrope[800]};
  --color-heliotrope-900: ${colors.heliotrope[900]};
  --color-heliotrope-950: ${colors.heliotrope[950]};

  --color-razzledazzlerose-50: ${colors.razzledazzlerose[50]};
  --color-razzledazzlerose-100: ${colors.razzledazzlerose[100]};
  --color-razzledazzlerose-200: ${colors.razzledazzlerose[200]};
  --color-razzledazzlerose-300: ${colors.razzledazzlerose[300]};
  --color-razzledazzlerose-400: ${colors.razzledazzlerose[400]};
  --color-razzledazzlerose-500: ${colors.razzledazzlerose[500]};
  --color-razzledazzlerose-600: ${colors.razzledazzlerose[600]};
  --color-razzledazzlerose-700: ${colors.razzledazzlerose[700]};
  --color-razzledazzlerose-800: ${colors.razzledazzlerose[800]};
  --color-razzledazzlerose-900: ${colors.razzledazzlerose[900]};
  --color-razzledazzlerose-950: ${colors.razzledazzlerose[950]};

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
