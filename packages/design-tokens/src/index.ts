/**
 * 8alls Design System
 *
 * A comprehensive design token system for building consistent,
 * beautiful applications across the 8alls productivity suite.
 *
 * This package uses JSON design tokens as the single source of truth.
 * Platform-specific outputs are auto-generated:
 *
 * - Web: Use `dist/web/variables.css` for CSS variables
 * - Web: Use `dist/web/tokens.js` for JavaScript/TypeScript imports
 * - iOS: Use `dist/ios/DesignTokens.swift` for Swift constants
 *
 * @example Web (CSS)
 * ```typescript
 * import '@8alls/design-tokens/dist/web/variables.css';
 * ```
 *
 * @example Web (JS/TS)
 * ```typescript
 * import tokens from '@8alls/design-tokens/dist/web/tokens';
 * const primaryColor = tokens.color.primary['500'].value;
 * ```
 *
 * @packageDocumentation
 */

// This package now uses JSON tokens (tokens/*.json) as the source of truth.
// All platform-specific outputs are generated at build time.
//
// To use the tokens, import from the generated files:
// - dist/web/variables.css (CSS custom properties)
// - dist/web/tokens.js (JavaScript module)
// - dist/web/tokens.d.ts (TypeScript types)
// - dist/ios/DesignTokens.swift (Swift constants)

export const version = '1.0.0';
export const tokenSource = 'JSON (tokens/*.json)';
export const platforms = ['web', 'ios'] as const;
