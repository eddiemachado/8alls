const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'generate-swift-tokens.js');
let content = fs.readFileSync(scriptPath, 'utf8');

// Replace all for...of loops to filter metadata keys
content = content.replace(
  /for \(const \[([^,]+), ([^\]]+)\] of Object\.entries\(([^)]+)\)\) \{/g,
  (match, key, value, obj) => {
    return `for (const [${key}, ${value}] of Object.entries(${obj}).filter(([k]) => isTokenKey(k))) {`;
  }
);

// Remove the manual '$type' checks we added since we're now filtering in the loop
content = content.replace(/\s+if \([^)]+===\s*'\$type'\) continue; \/\/ Skip W3C metadata\n/g, '');

fs.writeFileSync(scriptPath, content, 'utf8');
console.log('✅ Updated all loops to filter W3C metadata');
