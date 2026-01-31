# Swift Design Tokens Integration Guide

**For:** Calendar App Team (Swift/iOS)
**Date:** January 31, 2026
**Status:** ✅ Ready to use - Swift tokens are automatically generated with proper types

## Overview

The 8alls design system uses a custom Swift token generator to create platform-specific design tokens from a single JSON source. This means you can use the same colors, spacing, and typography as the web apps in your Swift calendar app.

## ✅ What's Working

The auto-generated Swift file (`dist/ios/DesignTokens.swift`) is production-ready:
- ✅ Properly imports `SwiftUI`
- ✅ Hex color values properly quoted as strings
- ✅ Units automatically converted (rem→CGFloat points, ms→TimeInterval seconds)
- ✅ Proper Swift types (String, CGFloat, Int, TimeInterval)
- ✅ Organized extensions for clean API usage

**No manual conversions needed** - Everything is ready to use out of the box!

## What's Available

Generated Swift constants for:
- ✅ **Colors** - All color palettes (143+ colors including hex and OKLCH)
- ✅ **Spacing** - Full spacing scale (0-96)
- ✅ **Typography** - Font sizes, weights, line heights
- ✅ **Radius** - Border radius values
- ✅ **Shadows** - Shadow presets (as strings)
- ✅ **Animation** - Duration and easing values

## Quick Start

### 1. Get the Generated Swift File

The design tokens are auto-generated at:
```
8alls/packages/design-tokens/dist/ios/DesignTokens.swift
```

Copy this file into your Xcode project.

### 2. Use in Your Code

```swift
import SwiftUI

struct EventCard: View {
    var body: some View {
        VStack(spacing: CGFloat.Spacing.s2) {
            Text("Team Meeting")
                .font(.system(size: CGFloat.FontSize.base))
                .foregroundColor(Color(hex: Color.Brand.primary600))

            Text("10:00 AM - 11:00 AM")
                .font(.system(size: CGFloat.FontSize.sm))
                .foregroundColor(Color(hex: Color.Brand.primary400))
        }
        .padding(CGFloat.Spacing.s4)
        .background(Color(hex: Color.Brand.primary50))
        .cornerRadius(CGFloat.Radius.md)
    }
}
```

### 3. Color Extension (Already Included)

The generated file includes a `Color(hex:)` extension that works with hex colors:

```swift
// Works out of the box
Color(hex: Color.Brand.primary500)  // #6366f1
Color(hex: Color.Secondary.secondary600) // #c026d3
Color(hex: Color.Semantic.success) // #10b981
```

## Token Reference

### Colors

**Primary (Indigo):**
```swift
Color.Brand.primary50   // Lightest
Color.Brand.primary500  // Main brand color
Color.Brand.primary900  // Darkest
```

**Secondary (Purple):**
```swift
Color.Secondary.secondary50
Color.Secondary.secondary500
Color.Secondary.secondary900
```

**Extended OKLCH Palettes (13 palettes available):**
```swift
Color.Santasgray.santasgray500    // Gray tones
Color.Frenchrose.frenchrose500    // Pink/Rose
Color.Persimmon.persimmon500      // Orange
Color.Hokeypokey.hokeypokey500    // Yellow/Gold
Color.Limeade.limeade500          // Green
Color.Jade.jade500                // Teal
Color.Keppel.keppel500            // Cyan
Color.Pacificblue.pacificblue500  // Blue
Color.Havelockblue.havelockblue500  // Sky Blue
Color.Chetwodeblue.chetwodeblue500  // Periwinkle
Color.Heliotrope.heliotrope500      // Purple
Color.Razzledazzlerose.razzledazzlerose500  // Magenta
```

**Semantic Colors:**
```swift
Color.Semantic.success  // #10b981
Color.Semantic.warning  // #f59e0b
Color.Semantic.error    // #ef4444
Color.Semantic.info     // #3b82f6
```

### Spacing

```swift
CGFloat.Spacing.s0   // 0
CGFloat.Spacing.s1   // 4 points
CGFloat.Spacing.s2   // 8 points
CGFloat.Spacing.s4   // 16 points (base)
CGFloat.Spacing.s6   // 24 points
CGFloat.Spacing.s8   // 32 points
// ... up to s96 (384 points)
```

### Typography

```swift
// Font sizes (CGFloat)
CGFloat.FontSize.xs    // 12 points
CGFloat.FontSize.sm    // 14 points
CGFloat.FontSize.base  // 16 points
CGFloat.FontSize.lg    // 18 points

// Font weights (Int)
Int.FontWeight.normal    // 400
Int.FontWeight.medium    // 500
Int.FontWeight.semibold  // 600
Int.FontWeight.bold      // 700

// Line heights (CGFloat)
CGFloat.LineHeight.tight   // 1.25
CGFloat.LineHeight.normal  // 1.5
CGFloat.LineHeight.relaxed // 1.625

// Font families (String)
FontFamily.sans     // "Inter", -apple-system, ...
FontFamily.mono     // "Fira Code", "SF Mono", ...
FontFamily.display  // "Cal Sans", "Inter", ...
```

### Border Radius

```swift
CGFloat.Radius.sm   // 2 points
CGFloat.Radius.md   // 6 points
CGFloat.Radius.lg   // 8 points
CGFloat.Radius.xl   // 12 points
CGFloat.Radius.full // 9999 points (fully rounded)
```

### Animation

```swift
// Durations (TimeInterval in seconds)
TimeInterval.Duration.instant // 0
TimeInterval.Duration.fast    // 0.15
TimeInterval.Duration.normal  // 0.25
TimeInterval.Duration.slow    // 0.35

// Easing functions (String)
Easing.linear    // "linear"
Easing.easeIn    // "cubic-bezier(0.4, 0, 1, 1)"
Easing.easeOut   // "cubic-bezier(0, 0, 0.2, 1)"
Easing.spring    // "cubic-bezier(0.34, 1.56, 0.64, 1)"
```

## Important Notes

### OKLCH Colors

Many extended palette colors use OKLCH format (e.g., `"oklch(56.43% 0.0275 254.9)"`). These are exported as **strings** in Swift.

**Current limitation:** You'll need to handle OKLCH conversion yourself, or stick to hex colors for now.

**Hex colors that work immediately:**
- All primary colors (colorPrimary50-950)
- All secondary colors (colorSecondary50-900)
- All semantic colors (success, warning, error, info)

**OKLCH colors (need conversion):**
- Extended palette colors (santasgray, frenchrose, etc.)

### Updating Tokens

When design tokens are updated in the main repo:

1. Rebuild tokens: `cd packages/design-tokens && npm run build`
2. Copy updated `dist/ios/DesignTokens.swift` to your Xcode project
3. Rebuild your app

## Example: Event Card Component

Replace hardcoded values with design tokens:

**Before:**
```swift
Text("Meeting")
    .foregroundColor(.blue)
    .padding(16)
    .background(Color.blue.opacity(0.1))
    .cornerRadius(8)
```

**After:**
```swift
Text("Meeting")
    .foregroundColor(Color(hex: Color.Brand.primary600))
    .padding(CGFloat.Spacing.s4)
    .background(Color(hex: Color.Brand.primary50))
    .cornerRadius(CGFloat.Radius.md)
```

## Completed Improvements

✅ **Swift generation with custom script** - Bypasses Style Dictionary limitations
✅ **Proper type conversion** - rem → CGFloat points, ms → TimeInterval seconds
✅ **SwiftUI import** - Uses SwiftUI framework
✅ **Quoted string values** - All hex colors properly quoted
✅ **Organized extensions** - Clean, type-safe API structure

## Future Enhancements

### Short-term
- [ ] Create a Swift Package for easier distribution via SPM
- [ ] Add example SwiftUI components using design tokens
- [ ] Document integration with Xcode Asset Catalogs

### Long-term
- [ ] OKLCH → RGB converter for extended colors
- [ ] SwiftUI-native Color types (not just hex strings)
- [ ] Dark mode token variants
- [ ] Semantic color system (background, surface, text, etc.)

## Questions?

- **Token updates:** Design tokens are automatically regenerated when the JSON source changes
- **Custom colors:** Add them to `tokens/colors.json` in the main repo and rebuild
- **iOS-specific tokens:** Can be added to the Style Dictionary config

## Resources

- **Main repo:** `/Users/eddiemachado/Documents/Personal/8alls`
- **Generated Swift file:** `packages/design-tokens/dist/ios/DesignTokens.swift`
- **Token source:** `packages/design-tokens/tokens/*.json`
- **Full documentation:** `packages/design-tokens/STYLE_DICTIONARY_GUIDE.md`

---

**Implementation Steps:**
1. ✅ Copy generated `DesignTokens.swift` to your Xcode project
2. ✅ Use tokens in your SwiftUI views (see examples above)
3. ⏳ Create reusable SwiftUI components with tokens
4. ⏳ Add convenience view modifiers (e.g., `.primaryCard()`, `.brandText()`)
5. ⏳ Consider OKLCH color support if extended palettes are needed
