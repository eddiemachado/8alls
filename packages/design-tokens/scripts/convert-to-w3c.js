#!/usr/bin/env node
/**
 * Convert Style Dictionary format to W3C Design Tokens format
 * Changes: "value" → "$value", adds "$type"
 */

const fs = require('fs');
const path = require('path');

function convertToken(token, type) {
  if (token.value !== undefined) {
    const converted = {
      $value: token.value,
      $type: type
    };
    if (token.description) converted.$description = token.description;
    return converted;
  }
  return token;
}

function convertGroup(obj, type) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') {
      if (value.value !== undefined) {
        // This is a token
        result[key] = convertToken(value, type);
      } else {
        // This is a group
        result[key] = convertGroup(value, type);
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}

// Convert colors.json
const colorsPath = path.join(__dirname, '../tokens/colors.json');
const colors = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
colors.color.$type = 'color';
delete colors.color.semantic; // Will re-add
const semantic = JSON.parse(fs.readFileSync(colorsPath, 'utf8')).color.semantic;

for (const [key, value] of Object.entries(colors.color)) {
  if (key !== '$type') {
    colors.color[key] = convertGroup(value, 'color');
  }
}

// Re-add semantic
colors.color.semantic = convertGroup(semantic, 'color');

fs.writeFileSync(colorsPath, JSON.stringify(colors, null, 2) + '\n', 'utf8');
console.log('✅ Updated colors.json');

// Convert spacing.json
const spacingPath = path.join(__dirname, '../tokens/spacing.json');
const spacing = JSON.parse(fs.readFileSync(spacingPath, 'utf8'));

const result = {};
result.spacing = { $type: 'dimension', ...convertGroup(spacing.spacing, 'dimension') };
result.radius = { $type: 'dimension', ...convertGroup(spacing.radius, 'dimension') };
result.shadow = { $type: 'shadow', ...convertGroup(spacing.shadow, 'shadow') };
result.zIndex = { $type: 'number', ...convertGroup(spacing.zIndex, 'number') };

fs.writeFileSync(spacingPath, JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log('✅ Updated spacing.json');

// Convert typography.json
const typoPath = path.join(__dirname, '../tokens/typography.json');
const typo = JSON.parse(fs.readFileSync(typoPath, 'utf8'));

const typoResult = { font: {} };
typoResult.font.family = { $type: 'fontFamily', ...convertGroup(typo.font.family, 'fontFamily') };
typoResult.font.size = { $type: 'dimension', ...convertGroup(typo.font.size, 'dimension') };
typoResult.font.weight = { $type: 'fontWeight', ...convertGroup(typo.font.weight, 'fontWeight') };
typoResult.font.lineHeight = { $type: 'number', ...convertGroup(typo.font.lineHeight, 'number') };
typoResult.font.letterSpacing = { $type: 'dimension', ...convertGroup(typo.font.letterSpacing, 'dimension') };

fs.writeFileSync(typoPath, JSON.stringify(typoResult, null, 2) + '\n', 'utf8');
console.log('✅ Updated typography.json');

// Convert animation.json
const animPath = path.join(__dirname, '../tokens/animation.json');
const anim = JSON.parse(fs.readFileSync(animPath, 'utf8'));

const animResult = { animation: {} };
animResult.animation.duration = { $type: 'duration', ...convertGroup(anim.animation.duration, 'duration') };
animResult.animation.easing = { $type: 'cubicBezier', ...convertGroup(anim.animation.easing, 'cubicBezier') };

fs.writeFileSync(animPath, JSON.stringify(animResult, null, 2) + '\n', 'utf8');
console.log('✅ Updated animation.json');

console.log('\n🎉 All tokens converted to W3C format!');
