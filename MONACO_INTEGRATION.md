# Monaco Editor Integration Guide

## Overview

This document explains the integration of Monaco Editor into the GrapesJS Custom Code plugin, replacing the previous CodeManager implementation while maintaining all existing functionality and capabilities.

## What's New

### Monaco Editor Features
- **Rich Syntax Highlighting**: Support for HTML, CSS, JavaScript, TypeScript, JSON, and many more languages
- **IntelliSense**: Intelligent code completion, parameter info, and quick info
- **Advanced Editing**: Multi-cursor support, find and replace, code folding, bracket matching
- **Themes**: Multiple built-in themes (VS Code Dark, Light, High Contrast)
- **Performance**: Optimized for large files and better rendering performance
- **Accessibility**: Enhanced screen reader support and keyboard navigation

### Backward Compatibility

The plugin maintains full backward compatibility:
- All existing `codeViewOptions` are automatically mapped to Monaco Editor equivalents
- Legacy theme names (e.g., 'hopscotch') are automatically converted to Monaco themes
- Legacy language names (e.g., 'htmlmixed') are automatically converted to Monaco languages
- All plugin methods and events continue to work as before

## Configuration

### Basic Configuration

```javascript
{
  'grapesjs-custom-code': {
    monacoOptions: {
      theme: 'vs-dark',        // vs, vs-dark, hc-black
      language: 'html',        // html, css, javascript, typescript, etc.
      readOnly: false,         // Enable/disable editing
      minimap: { enabled: true }, // Show/hide minimap
      lineNumbers: 'on',       // on, off, relative, interval
      wordWrap: 'on',          // on, off, wordWrapColumn, bounded
      fontSize: 14,            // Font size in pixels
      tabSize: 2,              // Tab size in spaces
      automaticLayout: true,   // Auto-resize editor
      scrollBeyondLastLine: false,
      folding: true,           // Enable code folding
      find: {                  // Find/replace options
        seedSearchStringFromSelection: 'selection',
        autoFindInSelection: 'never'
      }
    }
  }
}
```

### Advanced Configuration

```javascript
{
  'grapesjs-custom-code': {
    modalTitle: 'Edit Code with Monaco Editor',
    buttonLabel: 'Save Changes',
    monacoOptions: {
      theme: 'vs-dark',
      language: 'html',
      readOnly: false,
      
      // Editor appearance
      minimap: { enabled: true },
      lineNumbers: 'on',
      lineDecorationsWidth: 20,
      lineNumbersMinChars: 3,
      renderWhitespace: 'selection',
      
      // Editor behavior
      wordWrap: 'on',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      selectOnLineNumbers: true,
      roundedSelection: false,
      
      // Typography
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      fontWeight: 'normal',
      tabSize: 2,
      insertSpaces: true,
      
      // Advanced features
      folding: true,
      foldingStrategy: 'auto',
      showFoldingControls: 'mouseover',
      matchBrackets: 'always',
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoSurround: 'languageDefined',
      
      // Find/Replace
      find: {
        seedSearchStringFromSelection: 'selection',
        autoFindInSelection: 'never'
      }
    }
  }
}
```

## Language Support

Monaco Editor supports many languages out of the box:

```javascript
const supportedLanguages = [
  'html', 'css', 'javascript', 'typescript', 'json', 'xml',
  'markdown', 'sql', 'php', 'python', 'java', 'csharp',
  'cpp', 'c', 'go', 'rust', 'yaml', 'dockerfile', 'shell'
];
```

### Language Mapping

Legacy CodeManager language names are automatically mapped:

```javascript
const languageMapping = {
  'htmlmixed': 'html',
  'css': 'css',
  'javascript': 'javascript',
  'typescript': 'typescript',
  // ... more mappings
};
```

## Theme Support

### Available Themes

```javascript
const availableThemes = [
  'vs',          // Light theme
  'vs-dark',     // Dark theme (default)
  'hc-black'     // High contrast theme
];
```

### Theme Mapping

Legacy CodeManager themes are automatically mapped:

```javascript
const themeMapping = {
  'hopscotch': 'vs-dark',
  'monokai': 'vs-dark',
  'material': 'vs-dark',
  'dracula': 'vs-dark',
  'default': 'vs',
  'light': 'vs',
  'dark': 'vs-dark'
};
```

## Integration Steps

### 1. Include Monaco Editor

#### CDN Method (Recommended)
```html
<script src="https://unpkg.com/monaco-editor@0.44.0/min/vs/loader.js"></script>
<script>
require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.44.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
  // Initialize GrapesJS with plugin
});
</script>
```

#### NPM Method
```bash
npm install monaco-editor
```

### 2. Configure Plugin

```javascript
grapesjs.init({
  plugins: ['grapesjs-custom-code'],
  pluginsOpts: {
    'grapesjs-custom-code': {
      monacoOptions: {
        // Your Monaco Editor configuration
      }
    }
  }
});
```

## API Reference

### MonacoCodeViewer Class

The `MonacoCodeViewer` class wraps Monaco Editor functionality:

```typescript
class MonacoCodeViewer {
  constructor(options: MonacoEditorOptions)
  
  // Core methods
  getElement(): HTMLElement
  setContent(content: string): void
  getContent(): string
  refresh(): void
  focus(): void
  
  // Configuration methods
  setLanguage(language: string): void
  setTheme(theme: string): void
  setReadOnly(readOnly: boolean): void
  
  // Lifecycle
  destroy(): void
}
```

### Method Usage

```javascript
// Get the Monaco Editor instance
const codeViewer = command.getCodeViewer();

// Set content
codeViewer.setContent('<div>Hello World</div>');

// Get content
const code = codeViewer.getContent();

// Change language
codeViewer.setLanguage('css');

// Change theme
codeViewer.setTheme('vs-dark');

// Focus editor
codeViewer.focus();
```

## Migration from CodeManager

### Automatic Migration

The plugin automatically handles migration:

1. **Legacy Options**: `codeViewOptions` are automatically mapped to Monaco options
2. **Language Names**: CodeManager languages are converted to Monaco languages
3. **Theme Names**: CodeManager themes are converted to Monaco themes
4. **API Compatibility**: All existing methods continue to work

### Manual Migration

If you want to explicitly use Monaco options:

**Before (CodeManager):**
```javascript
codeViewOptions: {
  codeName: 'htmlmixed',
  theme: 'hopscotch',
  readOnly: 0
}
```

**After (Monaco Editor):**
```javascript
monacoOptions: {
  language: 'html',
  theme: 'vs-dark',
  readOnly: false
}
```

## Troubleshooting

### Common Issues

1. **Monaco Editor not loaded**: Ensure Monaco Editor is loaded before initializing GrapesJS
2. **Theme not applying**: Check if the theme name is valid ('vs', 'vs-dark', 'hc-black')
3. **Language not highlighting**: Verify the language is supported by Monaco Editor
4. **Editor not resizing**: Ensure `automaticLayout: true` is set in options

### Debug Information

Enable debug logging to troubleshoot issues:

```javascript
// Check if Monaco is available
console.log('Monaco available:', typeof window.monaco !== 'undefined');

// Check editor instance
const codeViewer = command.getCodeViewer();
console.log('Editor instance:', codeViewer);

// Check configuration
console.log('Monaco options:', options.monacoOptions);
```

## Performance Considerations

### Optimization Tips

1. **Lazy Loading**: Monaco Editor is only created when the modal is opened
2. **Automatic Layout**: Enabled by default for responsive behavior
3. **Minimap**: Disabled by default for better performance on smaller screens
4. **Worker Configuration**: Properly configured for syntax highlighting performance

### Memory Management

The plugin automatically handles cleanup:
- Editor instances are disposed when components are destroyed
- Event listeners are properly removed
- ResizeObserver is cleaned up on destroy

## Examples

See `demo.html` for a complete working example with advanced configuration and styling.

## Support

For issues related to Monaco Editor integration, please check:
1. Monaco Editor configuration options
2. Browser compatibility
3. Network connectivity for CDN resources
4. Console errors for debugging information