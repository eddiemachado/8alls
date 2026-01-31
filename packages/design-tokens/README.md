# @8alls/design-tokens

The central design system for the 8alls productivity suite. This package provides design tokens (colors, typography, spacing, animations) that ensure consistency across all 8alls applications.

**🎨 Now powered by Style Dictionary** - Generate platform-specific tokens from a single JSON source for web, iOS, Android, and more.

## Installation

```bash
# From the monorepo root
npm install

# The package is automatically linked in the workspace
```

## Usage

### Web (CSS Variables) - **Recommended**

Import the pre-generated CSS variables:

```typescript
// In your app layout or entry point
import '@8alls/design-tokens/dist/web/variables.css';
```

Use in your CSS/SCSS:

```css
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  font-family: var(--font-family-sans);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
```

### Web (JavaScript/TypeScript)

```typescript
import tokens from '@8alls/design-tokens/dist/web/tokens';

// Access token values
const primaryColor = tokens.color.primary['500'].value; // "#6366f1"
const baseSpacing = tokens.spacing['4'].value; // "1rem"
```

### iOS (Swift)

```swift
import SwiftUI

struct MyView: View {
    var body: some View {
        Text("Hello")
            .foregroundColor(Color(hex: Color.Brand.primary500))
            .padding(CGFloat.Spacing.s4)
    }
}
```

See [SWIFT_DESIGN_TOKENS_INTEGRATION.md](../../SWIFT_DESIGN_TOKENS_INTEGRATION.md) for complete Swift integration guide.

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

## Token Source

Design tokens are defined in JSON format in the `tokens/` directory:

```
tokens/
├── colors.json      # Color palettes (hex + OKLCH)
├── spacing.json     # Spacing, radius, shadows, z-index
├── typography.json  # Fonts, sizes, weights
└── animation.json   # Durations, easing functions
```

These JSON files are the **single source of truth**. Platform-specific outputs (CSS, TypeScript, Swift) are auto-generated using [Style Dictionary](https://amzn.github.io/style-dictionary/).

## Development

```bash
# Build all platforms (web + iOS)
npm run build

# Build web only (CSS + JS via Style Dictionary)
npm run generate:tokens:web

# Build iOS only (Swift via custom script)
npm run generate:tokens:ios

# Watch TypeScript changes
npm run dev

# Clean build artifacts
npm run clean
```

**Note:** Web tokens use Style Dictionary, iOS tokens use a custom Node.js script ([scripts/generate-swift-tokens.js](./scripts/generate-swift-tokens.js)) for proper type conversion and Swift syntax.

### Adding New Tokens

1. Edit the appropriate JSON file in `tokens/`
2. Run `npm run build`
3. Generated platform files update automatically

### Platform Support

- ✅ **Web**: CSS variables + TypeScript (via Style Dictionary)
- ✅ **iOS**: Swift constants with proper types (via custom generator)
- ⏳ **Android**: Planned
- ⏳ **React Native**: Planned

See [STYLE_DICTIONARY_GUIDE.md](./STYLE_DICTIONARY_GUIDE.md) for Style Dictionary details and [SWIFT_DESIGN_TOKENS_INTEGRATION.md](../../SWIFT_DESIGN_TOKENS_INTEGRATION.md) for Swift usage.

## Brand Philosophy

The 8alls design system is inspired by precision and clarity - like a perfect 8-ball break. The color palette combines professional sophistication with vibrant accents, suitable for productivity tools that are both powerful and enjoyable to use.
