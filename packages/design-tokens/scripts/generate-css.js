/**
 * Script to generate global.css from design tokens
 */
const fs = require('fs');
const path = require('path');

// Import the compiled TypeScript modules
const { generateGlobalStyles } = require('../dist/global-styles');

// Generate the CSS
const css = `/**
 * 8alls Design System - Global Styles
 * Import this CSS file in your app to get all design tokens and base styles.
 */

${generateGlobalStyles()}
`;

// Write to styles/global.css
const outputPath = path.join(__dirname, '../styles/global.css');
fs.writeFileSync(outputPath, css, 'utf8');

console.log('✅ Generated global.css successfully');
