# Examples

This directory contains usage examples for the GrapesJS Custom Code Monaco Editor plugin.

## Files

### 1. `basic-usage.html`
Demonstrates the simplest way to use the plugin with minimal configuration. Monaco Editor loads automatically with default settings.

**Features shown:**
- Zero-config setup
- Automatic Monaco Editor loading
- Basic error handling

### 2. `advanced-config.html`
Shows all available configuration options and how to customize every aspect of the plugin.

**Features shown:**
- Custom block configuration
- Advanced Monaco Editor options
- Custom modal and toolbar settings
- Event listeners
- Custom placeholders and content

### 3. `custom-cdn.html`
Demonstrates how to load Monaco Editor from a custom CDN or specific version.

**Features shown:**
- Custom Monaco Editor version
- Alternative CDN (jsdelivr)
- Theme and language customization

## Running the Examples

1. Make sure the plugin is built:
   ```bash
   npm run build
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Navigate to any example:
   - http://localhost:8080/examples/basic-usage.html
   - http://localhost:8080/examples/advanced-config.html
   - http://localhost:8080/examples/custom-cdn.html

## Usage Tips

- The plugin automatically loads Monaco Editor from CDN
- No need to manually include Monaco Editor scripts
- All configuration is done through the plugin options
- Monaco Editor will show a loading indicator while initializing
- Error handling is built-in for network issues

## Customization

You can customize:
- Monaco Editor theme and language
- Block appearance and category
- Modal title and buttons
- Toolbar integration
- Loading CDN and version
- Custom content and placeholders