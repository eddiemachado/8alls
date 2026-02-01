#!/usr/bin/env node
/**
 * Optimize W3C tokens by removing redundant $type from child tokens
 * when it matches the parent group $type
 */

const fs = require('fs');
const path = require('path');

function optimizeGroup(obj, parentType) {
  const result = {};
  const groupType = obj.$type || parentType;
  
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$type') {
      result[key] = value;
      continue;
    }
    
    if (value && typeof value === 'object') {
      if (value.$value !== undefined) {
        // This is a token - remove $type if it matches parent
        if (value.$type === groupType) {
          result[key] = { $value: value.$value };
          if (value.$description) result[key].$description = value.$description;
        } else {
          result[key] = value;
        }
      } else {
        // This is a group
        result[key] = optimizeGroup(value, groupType);
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

// Optimize all token files
const tokenFiles = ['colors.json', 'spacing.json', 'typography.json', 'animation.json'];

for (const file of tokenFiles) {
  const filePath = path.join(__dirname, '../tokens', file);
  const tokens = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const optimized = optimizeGroup(tokens);
  fs.writeFileSync(filePath, JSON.stringify(optimized, null, 2) + '\n', 'utf8');
  console.log(`✅ Optimized ${file}`);
}

console.log('\n🎉 All tokens optimized!');
