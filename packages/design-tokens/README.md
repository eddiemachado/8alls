# @8alls/design-tokens

The central design system for the 8alls productivity suite. This package provides design tokens (colors, typography, spacing, animations) that ensure consistency across all 8alls applications.

## Installation

```bash
# From the monorepo root
npm install

# The package is automatically linked in the workspace
```

## Usage

### TypeScript/JavaScript

```typescript
import { colors, typography, spacing, tokens } from '@8alls/design-tokens';

// Use individual tokens
const buttonStyle = {
  backgroundColor: colors.primary[500],
  padding: spacing[4],
  fontFamily: typography.fonts.sans,
  borderRadius: '0.5rem',
};

// Or use the tokens namespace
const cardStyle = {
  backgroundColor: tokens.colors.light.background.primary,
  boxShadow: tokens.shadows.md,
};
```

### CSS Variables

Generate CSS custom properties from tokens:

```typescript
import { colors, spacing } from '@8alls/design-tokens';

// Generate CSS variables
const cssVars = `
  :root {
    --color-primary: ${colors.primary[500]};
    --spacing-md: ${spacing[4]};
  }
`;

// Or use inline styles directly
<button style={{
  backgroundColor: colors.primary[500],
  color: '#fff',
  padding: spacing[4],
  borderRadius: '0.5rem',
}}>
  Click me
</button>
```

## Design Tokens

### Colors
- `primary` - Main brand colors (indigo/blue palette)
- `secondary` - Accent colors (purple/magenta palette)
- `success`, `error`, `warning`, `info` - Semantic colors
- `neutral` - Grayscale from white to black
- `light` and `dark` - Mode-specific semantic colors

### Typography
- `fonts` - Font families (sans, mono, display)
- `sizes` - Font sizes from xs to 7xl
- `weights` - Font weights from thin to black
- `lineHeights` - Line height presets
- `letterSpacing` - Letter spacing presets
- `textStyles` - Predefined text styles (h1-h4, body, label, etc.)

### Spacing
- `spacing` - Base spacing scale (0-96)
- `semanticSpacing` - Component padding, gaps, sections
- `radius` - Border radius presets
- `shadows` - Box shadow presets
- `zIndex` - Z-index scale

### Animation
- `duration` - Animation timing durations
- `easing` - Easing functions
- `transition` - Common transition presets
- `keyframes` - Animation keyframes

## Development

```bash
# Build the package
npm run build

# Watch for changes
npm run dev

# Clean build artifacts
npm run clean
```

## Brand Philosophy

The 8alls design system is inspired by precision and clarity - like a perfect 8-ball break. The color palette combines professional sophistication with vibrant accents, suitable for productivity tools that are both powerful and enjoyable to use.
