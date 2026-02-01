#!/usr/bin/env node
/**
 * Custom Swift Token Generator
 * Generates properly typed Swift code from JSON design tokens
 */

const fs = require('fs');
const path = require('path');

// Helper: Convert rem/px to points
function toPoints(value) {
  if (typeof value !== 'string') return value;
  const numValue = parseFloat(value);
  if (value.includes('rem')) return numValue * 16; // 1rem = 16px
  if (value.includes('px')) return numValue;
  return numValue || 0;
}

// Helper: Convert ms to seconds
function toSeconds(value) {
  if (typeof value !== 'string') return value;
  const numValue = parseFloat(value);
  if (value.includes('ms')) return numValue / 1000; // Convert to seconds
  return numValue || 0;
}

// Helper: Format color name for Swift (remove hyphens, camelCase)
function formatColorName(name) {
  return name.replace(/-/g, '');
}

// Helper: Format spacing/radius name
function formatName(name) {
  return name.replace(/-/g, '_');
}

// Helper: Filter out W3C metadata keys (starting with $)
function isTokenKey(key) {
  return !key.startsWith('$');
}

function generateSwift() {
  console.log('🔨 Generating Swift design tokens...');

  // Load token files
  const tokensDir = path.join(__dirname, '../tokens');
  const colors = JSON.parse(fs.readFileSync(path.join(tokensDir, 'colors.json'), 'utf8'));
  const spacing = JSON.parse(fs.readFileSync(path.join(tokensDir, 'spacing.json'), 'utf8'));
  const typography = JSON.parse(fs.readFileSync(path.join(tokensDir, 'typography.json'), 'utf8'));
  const animation = JSON.parse(fs.readFileSync(path.join(tokensDir, 'animation.json'), 'utf8'));

  let output = `//
// DesignTokens.swift
// Auto-generated from JSON design tokens
// DO NOT EDIT DIRECTLY - Edit tokens/*.json instead
//

import SwiftUI

// MARK: - Colors

public extension Color {
    struct Brand {
`;

  // Generate primary colors
  if (colors.color && colors.color.primary) {
    for (const [shade, token] of Object.entries(colors.color.primary).filter(([k]) => isTokenKey(k))) {      const hex = token.$value;
      output += `        public static let primary${shade} = "${hex}"\n`;
    }
  }

  output += `    }

    struct Secondary {
`;

  // Generate secondary colors
  if (colors.color && colors.color.secondary) {
    for (const [shade, token] of Object.entries(colors.color.secondary).filter(([k]) => isTokenKey(k))) {      const hex = token.$value;
      output += `        public static let secondary${shade} = "${hex}"\n`;
    }
  }

  output += `    }

    struct Semantic {
`;

  // Generate semantic colors
  if (colors.color && colors.color.semantic) {
    for (const [name, token] of Object.entries(colors.color.semantic).filter(([k]) => isTokenKey(k))) {
      output += `        public static let ${name} = "${token.$value}"\n`;
    }
  }

  output += `    }
`;

  // Generate extended color palettes (OKLCH colors - kept as strings for now)
  const extendedPalettes = [
    'santasgray', 'frenchrose', 'persimmon', 'meteor', 'hokeypokey',
    'limeade', 'jade', 'keppel', 'pacificblue', 'havelockblue',
    'chetwodeblue', 'heliotrope', 'razzledazzlerose'
  ];

  for (const palette of extendedPalettes) {
    if (colors.color && colors.color[palette]) {
      const paletteName = palette.charAt(0).toUpperCase() + palette.slice(1);
      output += `
    struct ${paletteName} {
`;
      for (const [shade, token] of Object.entries(colors.color[palette]).filter(([k]) => isTokenKey(k))) {
        output += `        public static let ${palette}${shade} = "${token.$value}"\n`;
      }
      output += `    }
`;
    }
  }

  output += `}

// MARK: - Spacing

public extension CGFloat {
    struct Spacing {
`;

  // Generate spacing with unit conversion
  if (spacing.spacing) {
    for (const [name, token] of Object.entries(spacing.spacing).filter(([k]) => isTokenKey(k))) {
      const points = toPoints(token.$value);
      const varName = formatName(name);
      output += `        public static let s${varName}: CGFloat = ${points}\n`;
    }
  }

  output += `    }

    struct Radius {
`;

  // Generate radius values
  if (spacing.radius) {
    for (const [name, token] of Object.entries(spacing.radius).filter(([k]) => isTokenKey(k))) {
      const points = toPoints(token.$value);
      const varName = formatName(name);
      output += `        public static let ${varName}: CGFloat = ${points}\n`;
    }
  }

  output += `    }
}

// MARK: - Typography

public extension CGFloat {
    struct FontSize {
`;

  // Generate font sizes
  if (typography.font && typography.font.size) {
    for (const [name, token] of Object.entries(typography.font.size).filter(([k]) => isTokenKey(k))) {
      const points = toPoints(token.$value);
      const varName = formatName(name);
      output += `        public static let ${varName}: CGFloat = ${points}\n`;
    }
  }

  output += `    }

    struct LineHeight {
`;

  // Generate line heights
  if (typography.font && typography.font.lineHeight) {
    for (const [name, token] of Object.entries(typography.font.lineHeight).filter(([k]) => isTokenKey(k))) {
      const value = parseFloat(token.$value);
      const varName = formatName(name);
      output += `        public static let ${varName}: CGFloat = ${value}\n`;
    }
  }

  output += `    }
}

public extension Int {
    struct FontWeight {
`;

  // Generate font weights as Int
  if (typography.font && typography.font.weight) {
    for (const [name, token] of Object.entries(typography.font.weight).filter(([k]) => isTokenKey(k))) {
      const weight = parseInt(token.$value);
      const varName = formatName(name);
      output += `        public static let ${varName}: Int = ${weight}\n`;
    }
  }

  output += `    }
}

public struct FontFamily {
`;

  // Generate font families as strings
  if (typography.font && typography.font.family) {
    for (const [name, token] of Object.entries(typography.font.family).filter(([k]) => isTokenKey(k))) {
      const varName = formatName(name);
      // Escape internal quotes for Swift string literals
      const escapedValue = token.$value.replace(/"/g, '\\"');
      output += `    public static let ${varName} = "${escapedValue}"\n`;
    }
  }

  output += `}

// MARK: - Animation

public extension TimeInterval {
    struct Duration {
`;

  // Generate animation durations with ms → seconds conversion
  if (animation.animation && animation.animation.duration) {
    for (const [name, token] of Object.entries(animation.animation.duration).filter(([k]) => isTokenKey(k))) {
      const seconds = toSeconds(token.$value);
      const varName = formatName(name);
      output += `        public static let ${varName}: TimeInterval = ${seconds}\n`;
    }
  }

  output += `    }
}

public struct Easing {
`;

  // Generate easing functions as strings
  if (animation.animation && animation.animation.easing) {
    for (const [name, token] of Object.entries(animation.animation.easing).filter(([k]) => isTokenKey(k))) {
      const varName = formatName(name);
      output += `    public static let ${varName} = "${token.$value}"\n`;
    }
  }

  output += `}

// MARK: - Shadows

public struct Shadow {
`;

  // Generate shadows as strings
  if (spacing.shadow) {
    for (const [name, token] of Object.entries(spacing.shadow).filter(([k]) => isTokenKey(k))) {
      const varName = formatName(name);
      output += `    public static let ${varName} = "${token.$value}"\n`;
    }
  }

  output += `}

// MARK: - Z-Index

public extension Int {
    struct ZIndex {
`;

  // Generate z-index values
  if (spacing.zIndex) {
    for (const [name, token] of Object.entries(spacing.zIndex).filter(([k]) => isTokenKey(k))) {
      const value = parseInt(token.$value);
      const varName = formatName(name);
      output += `        public static let ${varName}: Int = ${value}\n`;
    }
  }

  output += `    }
}

// MARK: - Color Extension for Hex Support

public extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RRGGBB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // RRGGBBAA (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
`;

  // Write to file
  const outputDir = path.join(__dirname, '../dist/ios');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'DesignTokens.swift'), output, 'utf8');

  console.log('✅ Generated dist/ios/DesignTokens.swift');
  console.log('   - Colors: hex strings with proper quotes');
  console.log('   - Spacing: CGFloat with rem→points conversion');
  console.log('   - Typography: CGFloat sizes, Int weights');
  console.log('   - Animation: TimeInterval with ms→seconds conversion');
}

// Run the generator
try {
  generateSwift();
} catch (error) {
  console.error('❌ Error generating Swift tokens:', error);
  process.exit(1);
}
