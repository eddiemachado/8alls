/**
 * 8alls Design System - Global Styles
 * 
 * Base styles and CSS reset for 8alls applications.
 */

import { generateAllCSSVars } from './css-variables';
import { typography } from './tokens/typography';

/**
 * Generate complete global stylesheet
 */
export function generateGlobalStyles(): string {
  return `
${generateAllCSSVars()}

/* CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--font-sans);
  font-size: ${typography.sizes.base};
  line-height: ${typography.lineHeights.normal};
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  min-height: 100vh;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: ${typography.weights.semibold};
  line-height: ${typography.lineHeights.tight};
  color: var(--color-text-primary);
}

h1 { font-size: ${typography.sizes['3xl']}; }
h2 { font-size: ${typography.sizes['2xl']}; }
h3 { font-size: ${typography.sizes.xl}; }
h4 { font-size: ${typography.sizes.lg}; }

p {
  margin-bottom: var(--spacing-4);
}

a {
  color: var(--color-primary-600);
  text-decoration: none;
  transition: var(--transition-colors);
}

a:hover {
  color: var(--color-primary-700);
}

code {
  font-family: var(--font-mono);
  font-size: ${typography.sizes.sm};
  background-color: var(--color-bg-secondary);
  padding: 0.125rem 0.25rem;
  border-radius: var(--radius-sm);
}

/* Form elements */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
}

/* Focus styles */
*:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border-secondary);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

/* Selection */
::selection {
  background-color: var(--color-primary-200);
  color: var(--color-text-primary);
}

[data-theme="dark"] ::selection {
  background-color: var(--color-primary-800);
  color: var(--color-text-primary);
}
`.trim();
}

/**
 * Write global styles to a CSS file
 */
export function writeGlobalStylesFile(): string {
  return generateGlobalStyles();
}
