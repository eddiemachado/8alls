module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    // Web platform - CSS variables
    css: {
      transformGroup: 'css',
      buildPath: 'dist/web/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables',
        options: {
          outputReferences: true
        }
      }]
    },

    // Web platform - JavaScript/TypeScript
    js: {
      transformGroup: 'js',
      buildPath: 'dist/web/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/module-flat'
      }, {
        destination: 'tokens.d.ts',
        format: 'typescript/module-declarations'
      }]
    },

    // iOS platform - Swift (using built-in iOS format)
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'dist/ios/',
      files: [{
        destination: 'DesignTokens.swift',
        format: 'ios-swift/class.swift',
        options: {
          className: 'DesignSystem',
          accessControl: 'public'
        }
      }]
    }
  }
};
