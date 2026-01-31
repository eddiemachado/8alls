# 8alls Design Tokens with Style Dictionary

## Overview

The 8alls design system uses **Style Dictionary** to generate platform-specific design tokens from a single source of truth (JSON files). This ensures consistency across web, iOS, Android, and other platforms.

## Architecture

```
packages/design-tokens/
├── tokens/              # Source of truth - JSON token definitions
│   ├── colors.json
│   ├── spacing.json
│   ├── typography.json
│   └── animation.json
├── dist/                # Generated platform-specific outputs
│   ├── web/
│   │   ├── variables.css       # CSS custom properties
│   │   ├── tokens.js           # JavaScript module
│   │   └── tokens.d.ts         # TypeScript declarations
│   └── ios/
│       └── DesignTokens.swift  # Swift constants
├── style-dictionary.config.js  # Build configuration
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
- CSS variables for web
- JavaScript/TypeScript modules for web
- Swift constants for iOS

### Build Specific Platforms

```bash
# Web only (CSS + JS)
npm run generate:tokens:web

# iOS only (Swift)
npm run generate:tokens:ios
```

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
            .foregroundColor(Color(hex: DesignSystem.colorPrimary500))
            .padding(CGFloat(DesignSystem.spacing4))
    }
}
```

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

The old TypeScript-based tokens (`src/tokens/*.ts`) are being phased out in favor of Style Dictionary.

### What Changed

**Before:**
```typescript
import { colors } from '@8alls/design-tokens';
const primary = colors.primary[500]; // "#6366f1"
```

**After:**
```typescript
import tokens from '@8alls/design-tokens/dist/web/tokens';
const primary = tokens.color.primary['500'].value; // "#6366f1"
```

### Migration Path

1. ✅ JSON tokens created from TypeScript tokens
2. ✅ Style Dictionary configured for web + iOS
3. ⏳ Update consuming apps to use generated tokens
4. ⏳ Remove old TypeScript token files

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

### Swift colors not working

The built-in iOS format has limitations with OKLCH. For now:
- Use hex colors (`colorPrimary500`) directly
- Convert OKLCH colors to hex before using

Future improvement: Custom Style Dictionary transformer for OKLCH → RGB conversion.

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
2. ⏳ Create Swift Package for iOS distribution
3. ⏳ Add OKLCH → RGB transformer for Swift
4. ⏳ Add Android platform support
5. ⏳ Set up GitHub Action for auto-generation
6. ⏳ Deprecate old TypeScript tokens

---

**Last Updated:** January 31, 2026
**Version:** 1.0.0 (Style Dictionary migration)
