#!/usr/bin/env node
/**
 * Ensure $type appears first in groups for better readability
 */

const fs = require('fs');
const path = require('path');

function reorderGroup(obj) {
  const result = {};
  
  // Add $type first if it exists
  if (obj.$type) result.$type = obj.$type;
  
  // Add all other properties
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$type') continue; // Already added
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = reorderGroup(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

const tokenFiles = ['colors.json', 'spacing.json', 'typography.json', 'animation.json'];

for (const file of tokenFiles) {
  const filePath = path.join(__dirname, '../tokens', file);
  const tokens = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const reordered = reorderGroup(tokens);
  fs.writeFileSync(filePath, JSON.stringify(reordered, null, 2) + '\n', 'utf8');
  console.log(`✅ Reordered ${file}`);
}

console.log('\n🎉 All tokens reordered!');
