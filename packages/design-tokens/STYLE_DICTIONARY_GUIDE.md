# 8alls Design Tokens with Style Dictionary

## Overview

The 8alls design system generates platform-specific design tokens from a single source of truth (JSON files). This ensures consistency across web, iOS, Android, and other platforms.

- **Web tokens**: Generated via Style Dictionary
- **iOS tokens**: Generated via custom Node.js script ([scripts/generate-swift-tokens.js](./scripts/generate-swift-tokens.js))

## Architecture

```
packages/design-tokens/
├── tokens/                       # Source of truth - JSON token definitions
│   ├── colors.json
│   ├── spacing.json
│   ├── typography.json
│   └── animation.json
├── scripts/
│   └── generate-swift-tokens.js  # Custom Swift token generator
├── dist/                         # Generated platform-specific outputs
│   ├── web/
│   │   ├── variables.css         # CSS custom properties
│   │   ├── tokens.js             # JavaScript module
│   │   └── tokens.d.ts           # TypeScript declarations
│   └── ios/
│       └── DesignTokens.swift    # Swift constants (custom generated)
├── style-dictionary.config.js    # Style Dictionary config (web only)
└── package.json
```

## Token Format

Tokens are defined in JSON using Style Dictionary format:

```json
{
  "color": {
    "primary": {
      "500": { "value": "#6366f1" }
    }
  },
  "spacing": {
    "4": { "value": "1rem" }
  }
}
```

### Token Categories

1. **colors.json** - Color palettes (hex and OKLCH)
2. **spacing.json** - Spacing scale, border radius, shadows, z-index
3. **typography.json** - Font families, sizes, weights, line heights
4. **animation.json** - Animation durations and easing functions

## Building Tokens

### Build All Platforms

```bash
npm run build
```

This generates:
- CSS variables for web (Style Dictionary)
- JavaScript/TypeScript modules for web (Style Dictionary)
- Swift constants for iOS (custom script)

### Build Specific Platforms

```bash
# Web only (CSS + JS via Style Dictionary)
npm run generate:tokens:web

# iOS only (Swift via custom Node.js script)
npm run generate:tokens:ios
```

**Why a custom script for Swift?**
Style Dictionary v4's built-in Swift format has limitations:
- No automatic unit conversion (rem→CGFloat, ms→TimeInterval)
- Incorrect syntax for hex colors
- Limited type safety

Our custom script ([scripts/generate-swift-tokens.js](./scripts/generate-swift-tokens.js)) generates properly typed Swift code with automatic unit conversions and organized extensions.

## Usage

### Web (CSS)

Import the CSS variables in your app:

```typescript
// In your layout.tsx or main entry point
import '@8alls/design-tokens/dist/web/variables.css';
```

Use in CSS:

```css
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}
```

### Web (JavaScript/TypeScript)

```typescript
import tokens from '@8alls/design-tokens/dist/web/tokens';

const primaryColor = tokens.color.primary['500'].value;
// => "#6366f1"
```

### iOS (Swift)

Add the generated Swift file to your Xcode project:

```swift
import SwiftUI

struct MyView: View {
    var body: some View {
        Text("Hello")
            .foregroundColor(Color(hex: Color.Brand.primary500))
            .padding(CGFloat.Spacing.s4)
            .font(.system(size: CGFloat.FontSize.base, weight: .init(Int.FontWeight.medium)))
    }
}
```

The custom generator provides:
- ✅ Automatic unit conversion (rem→points, ms→seconds)
- ✅ Proper Swift types (String, CGFloat, Int, TimeInterval)
- ✅ Organized extensions for clean API
- ✅ Hex color initializer included

See [SWIFT_DESIGN_TOKENS_INTEGRATION.md](../../SWIFT_DESIGN_TOKENS_INTEGRATION.md) for complete Swift documentation.

## OKLCH Color Support

The design system includes OKLCH colors for better perceptual uniformity. These are:
- **Preserved as-is** in CSS output (modern browsers support OKLCH)
- **Kept as strings** in Swift output (needs custom parsing)

### Using OKLCH in Web

```css
.element {
  /* Native OKLCH support in modern browsers */
  color: var(--color-santasgray-500);
  /* => oklch(56.43% 0.0275 254.9) */
}
```

### Using OKLCH in Swift

The Swift output currently exports OKLCH as strings. To use them:

1. **Option 1:** Use a Swift color library that supports OKLCH
2. **Option 2:** Pre-convert OKLCH to RGB/hex for iOS

For now, hex colors work directly:

```swift
// Works out of the box
DesignSystem.colorPrimary500  // => #6366f1

// Requires OKLCH parsing
DesignSystem.colorSantasgray500  // => "oklch(56.43% 0.0275 254.9)"
```

## Customization

### Adding New Tokens

1. Edit the appropriate JSON file in `tokens/`
2. Run `npm run build`
3. Generated files update automatically

Example - Add a new color:

```json
// tokens/colors.json
{
  "color": {
    "brand": {
      "teal": { "value": "#14b8a6" }
    }
  }
}
```

After build:
- CSS: `--color-brand-teal`
- Swift: `DesignSystem.colorBrandTeal`

### Adding New Platforms

Edit `style-dictionary.config.js` to add platforms:

```javascript
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    // Add Android
    android: {
      transformGroup: 'android',
      buildPath: 'dist/android/',
      files: [{
        destination: 'colors.xml',
        format: 'android/colors'
      }]
    }
  }
};
```

## Migration from Old System

The old TypeScript-based tokens (`src/tokens/*.ts`) have been **removed**. JSON tokens are now the only source of truth.

### What Changed

**Before (Old TypeScript system):**
```typescript
import { colors } from '@8alls/design-tokens';
const primary = colors.primary[500]; // "#6366f1"
```

**After (JSON + generated outputs):**
```typescript
// Option 1: Use generated JavaScript module
import tokens from '@8alls/design-tokens/dist/web/tokens';
const primary = tokens.color.primary['500'].value; // "#6366f1"

// Option 2: Use CSS variables (recommended for web)
import '@8alls/design-tokens/dist/web/variables.css';
// Then use: var(--color-primary-500) in your CSS
```

### Migration Path

1. ✅ JSON tokens created from TypeScript tokens
2. ✅ Style Dictionary configured for web + iOS
3. ✅ Removed old TypeScript token files
4. ⏳ Update consuming apps to use generated tokens

## Benefits

✅ **Single source of truth** - Define once, use everywhere
✅ **Platform consistency** - Same values across web, iOS, Android
✅ **Type safety** - Generated TypeScript definitions
✅ **No sync issues** - Automatic generation prevents drift
✅ **Industry standard** - Used by Amazon, Salesforce, Adobe
✅ **Extensible** - Easy to add new platforms or formats

## Troubleshooting

### Build fails with "Can't find config"

Make sure you're running from the design-tokens directory:

```bash
cd packages/design-tokens
npm run build
```

### Swift tokens not generating

Ensure Node.js is installed (v16+):

```bash
node --version
npm run generate:tokens:ios
```

If the custom script fails, check:
- JSON token files exist in `tokens/` directory
- Output directory `dist/ios/` is writable

### OKLCH colors in Swift

Extended palette colors (santasgray, frenchrose, etc.) are OKLCH format strings. For now:
- Primary/secondary/semantic colors use hex (work directly)
- OKLCH colors need custom parsing or conversion

Future enhancement: Add OKLCH → RGB converter library to custom script.

### CSS not updating in app

1. Rebuild tokens: `npm run build`
2. Reinstall package in consuming app
3. Clear build cache if using a bundler

## Resources

- [Style Dictionary Docs](https://amzn.github.io/style-dictionary/)
- [OKLCH Color Space](https://oklch.com/)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/#ok-lab)

## Next Steps

1. ✅ Basic Style Dictionary setup complete
2. ✅ Custom Swift token generator with proper types and conversions
3. ✅ Removed legacy TypeScript tokens - JSON is now the only source of truth
4. ⏳ Create Swift Package for iOS distribution
5. ⏳ Add OKLCH → RGB transformer for Swift
6. ⏳ Add Android platform support
7. ⏳ Set up GitHub Action for auto-generation

---

**Last Updated:** January 31, 2026
**Version:** 1.0.0 (Style Dictionary migration)
