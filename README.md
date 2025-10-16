# GrapesJS Custom Code with Monaco Editor

This plugin adds the possibility to embed custom code using the powerful Monaco Editor (the same editor that powers VS Code).

<p align="center"><img src="https://user-images.githubusercontent.com/11614725/43289377-15322c5e-912b-11e8-9a29-cc2dc45af48a.gif" alt="GrapesJS Custom Code" align="center"/></p>

## 🎉 New in this version: Monaco Editor Integration

This enhanced version replaces the default CodeMirror editor with Monaco Editor, providing:

- ✨ **Rich Syntax Highlighting** - Support for HTML, CSS, JavaScript, TypeScript, and many more languages
- 🔍 **IntelliSense** - Intelligent code completion, parameter info, quick info, and member lists
- 🎨 **Themes** - Multiple built-in themes (VS Dark, VS Light, High Contrast)
- 📏 **Advanced Editing** - Multi-cursor support, find and replace, code folding, and more
- 🚀 **Performance** - Optimized for large files and better rendering performance
- 📱 **Accessibility** - Better screen reader support and keyboard navigation

> Requires GrapesJS v0.14.25 or higher


## Summary

* Plugin name: `grapejs-custom-code-monaco-editor`
* Components
  * `custom-code`
* Blocks
  * `custom-code`
* Commands
  * `custom-code:open-modal`




## Options

|Option|Description|Default|
|-|-|-
| `blockCustomCode` | Object to extend the default custom code block, eg. `{ label: 'Custom Code', category: 'Extra', ... }`. Pass a falsy value to avoid adding the block | `{}` |
| `propsCustomCode` | Object to extend the default custom code properties, eg. `{ name: 'Custom Code', components: '<span>Initial content</span>' ... }` | `{}` |
| `toolbarBtnCustomCode` | Object to extend the default component's toolbar button for the code, eg. `{ label: '</>', attributes: { title: 'Open custom code' } }`. Pass a falsy value to avoid adding the button | `{}` |
| `placeholderScript` | Content to show when the custom code contains `<script>` | [Check the source](https://github.com/GrapesJS/components-custom-code/blob/master/src/index.ts) |
| `modalTitle` | Title for the modal | `Insert your code` |
| `codeViewOptions` | **Legacy:** Additional options for backward compatibility | `{}` |
| `monacoOptions` | **New:** Monaco Editor specific options (see below) | `{ theme: 'vs-dark', language: 'html', ... }` |
| `buttonLabel` | Label for the default save button | `Save` |
| `commandCustomCode` | Object to extend the default custom code command, eg. `{ getPreContent: () => '<div>Paste here</div>' }` [Check the source](https://github.com/GrapesJS/components-custom-code/blob/master/src/commands.ts) to see all available methods | `{}` |

### Monaco Editor Options

The `monacoOptions` object accepts all Monaco Editor configuration options:

|Option|Description|Default|
|-|-|-
| `theme` | Editor theme: `'vs'`, `'vs-dark'`, `'hc-black'` | `'vs-dark'` |
| `language` | Language mode: `'html'`, `'css'`, `'javascript'`, `'typescript'`, etc. | `'html'` |
| `readOnly` | Whether the editor is read-only | `false` |
| `minimap.enabled` | Show/hide minimap | `false` |
| `lineNumbers` | Show line numbers: `'on'`, `'off'`, `'relative'`, `'interval'` | `'on'` |
| `wordWrap` | Word wrap: `'on'`, `'off'`, `'wordWrapColumn'`, `'bounded'` | `'on'` |
| `fontSize` | Font size in pixels | `14` |
| `tabSize` | Tab size in spaces | `2` |
| `automaticLayout` | Automatically resize editor | `true` |
| `scrollBeyondLastLine` | Allow scrolling beyond last line | `false` |

For complete Monaco Editor options, see the [Monaco Editor API documentation](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html).





## Download

* CDN
  * `https://unpkg.com/grapejs-custom-code-monaco-editor`
* NPM
  * `npm i grapejs-custom-code-monaco-editor`
* GIT
  * `git clone https://github.com/GrapesJS/components-custom-code.git`





## Usage

### CDN Usage (with Monaco Editor)

```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/monaco-editor@0.44.0/min/vs/loader.js"></script>
<script src="path/to/grapejs-custom-code-monaco-editor.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  // Configure Monaco Editor
  require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.44.0/min/vs' }});
  
  require(['vs/editor/editor.main'], function() {
    var editor = grapesjs.init({
        container : '#gjs',
        ...
        plugins: ['grapejs-custom-code-monaco-editor'],
        pluginsOpts: {
          'grapejs-custom-code-monaco-editor': {
            modalTitle: 'Edit Code with Monaco Editor',
            monacoOptions: {
              theme: 'vs-dark',
              language: 'html',
              readOnly: false,
              minimap: { enabled: true },
              lineNumbers: 'on',
              wordWrap: 'on',
              fontSize: 14,
              tabSize: 2
            }
          }
        }
    });
  });
</script>
```

### ES6/Module Usage

```jsx
import GrapesJS from 'grapejs';
import customCodePlugin from 'grapejs-custom-code-monaco-editor';
import * as monaco from 'monaco-editor';

// Configure Monaco Editor (if using webpack/bundler)
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return './json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.js';
    }
    return './editor.worker.js';
  }
};

GrapesJS.init({
 container : '#gjs',
 ...
 plugins: [
   customCodePlugin
 ],
 pluginsOpts: {
   [customCodePlugin]: {
     modalTitle: 'Edit Code with Monaco Editor',
     monacoOptions: {
       theme: 'vs-dark',
       language: 'html',
       readOnly: false,
       minimap: { enabled: true },
       lineNumbers: 'on',
       wordWrap: 'on',
       fontSize: 14,
       tabSize: 2,
       automaticLayout: true,
       scrollBeyondLastLine: false
     }
   }
 }
});
```





## Development

Clone the repository

```sh
$ git clone https://github.com/GrapesJS/components-custom-code.git
$ cd grapejs-custom-code-monaco-editor
```

Install dependencies

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```





## License

BSD 3-Clause
