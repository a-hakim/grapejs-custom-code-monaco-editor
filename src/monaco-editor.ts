// Monaco Editor types - using global monaco object from CDN
declare global {
  interface Window {
    monaco: any;
  }
}

export interface MonacoEditorOptions {
  theme?: string;
  readOnly?: boolean;
  language?: string;
  minimap?: { enabled: boolean };
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  automaticLayout?: boolean;
  scrollBeyondLastLine?: boolean;
  fontSize?: number;
  tabSize?: number;
  insertSpaces?: boolean;
  [key: string]: any;
}

export class MonacoCodeViewer {
  private editor: any = null;
  private container: HTMLElement;
  private options: MonacoEditorOptions;

  constructor(options: MonacoEditorOptions = {}) {
    this.options = {
      theme: 'vs-dark',
      readOnly: false,
      language: 'html',
      minimap: { enabled: false },
      lineNumbers: 'on',
      wordWrap: 'on',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      fontSize: 14,
      tabSize: 2,
      insertSpaces: true,
      ...options
    };
    
    this.container = this.createContainer();
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '400px';
    container.style.border = '1px solid #ddd';
    return container;
  }

  getElement(): HTMLElement {
    return this.container;
  }

  setContent(content: string): void {
    if (this.editor) {
      this.editor.setValue(content || '');
    } else {
      // Store content to set when editor is created
      this.container.setAttribute('data-initial-content', content || '');
    }
  }

  getContent(): string {
    return this.editor ? this.editor.getValue() : '';
  }

  refresh(): void {
    if (!this.editor && this.container.parentElement) {
      this.createEditor();
    }
    
    if (this.editor) {
      this.editor.layout();
    }
  }

  focus(): void {
    if (this.editor) {
      this.editor.focus();
    }
  }

  private createEditor(): void {
    if (this.editor || !this.container.parentElement || typeof window === 'undefined' || !window.monaco) {
      return;
    }

    // Create the editor using global monaco object
    this.editor = window.monaco.editor.create(this.container, {
      value: this.container.getAttribute('data-initial-content') || '',
      ...this.options
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      if (this.editor) {
        this.editor.layout();
      }
    });
    resizeObserver.observe(this.container);

    // Clean up on destroy
    this.container.addEventListener('DOMNodeRemoved', () => {
      this.destroy();
    });
  }



  setLanguage(language: string): void {
    if (this.editor && window.monaco) {
      const model = this.editor.getModel();
      if (model) {
        window.monaco.editor.setModelLanguage(model, language);
      }
    } else {
      this.options.language = language;
    }
  }

  setTheme(theme: string): void {
    if (this.editor && window.monaco) {
      window.monaco.editor.setTheme(theme);
    } else {
      this.options.theme = theme;
    }
  }

  setReadOnly(readOnly: boolean): void {
    if (this.editor) {
      this.editor.updateOptions({ readOnly });
    } else {
      this.options.readOnly = readOnly;
    }
  }

  destroy(): void {
    if (this.editor) {
      this.editor.dispose();
      this.editor = null;
    }
  }
}

// Language mapping from CodeManager to Monaco Editor
export const languageMap: { [key: string]: string } = {
  'htmlmixed': 'html',
  'css': 'css',
  'javascript': 'javascript',
  'typescript': 'typescript',
  'json': 'json',
  'xml': 'xml',
  'markdown': 'markdown',
  'sql': 'sql',
  'php': 'php',
  'python': 'python',
  'java': 'java',
  'csharp': 'csharp',
  'cpp': 'cpp',
  'c': 'c',
  'go': 'go',
  'rust': 'rust',
  'yaml': 'yaml'
};

// Theme mapping from CodeManager to Monaco Editor
export const themeMap: { [key: string]: string } = {
  'hopscotch': 'vs-dark',
  'monokai': 'vs-dark',
  'material': 'vs-dark',
  'dracula': 'vs-dark',
  'default': 'vs',
  'light': 'vs',
  'dark': 'vs-dark',
  'hc-black': 'hc-black'
};