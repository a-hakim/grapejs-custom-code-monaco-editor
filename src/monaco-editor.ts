import MonacoLoader from './monaco-loader';

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
  private monacoLoader: MonacoLoader;
  private pendingContent: string = '';
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

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
    this.monacoLoader = MonacoLoader.getInstance();
    
    // Initialize Monaco Editor asynchronously
    this.initializeMonaco();
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '400px';
    container.style.border = '1px solid #ddd';
    container.style.position = 'relative';
    
    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: Arial, sans-serif;
      color: #666;
      font-size: 14px;
    `;
    loadingDiv.textContent = 'Loading Monaco Editor...';
    loadingDiv.className = 'monaco-loading-indicator';
    container.appendChild(loadingDiv);
    
    return container;
  }

  private async initializeMonaco(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        await this.monacoLoader.load();
        this.isInitialized = true;
        
        // Remove loading indicator
        const loadingIndicator = this.container.querySelector('.monaco-loading-indicator');
        if (loadingIndicator) {
          loadingIndicator.remove();
        }
        
        // Create editor if container is in DOM
        if (this.container.parentElement) {
          this.createEditor();
        }
      } catch (error) {
        console.error('Failed to initialize Monaco Editor:', error);
        
        // Show error message
        const errorDiv = this.container.querySelector('.monaco-loading-indicator');
        if (errorDiv) {
          errorDiv.textContent = 'Failed to load Monaco Editor';
          (errorDiv as HTMLElement).style.color = '#ff6b6b';
        }
      }
    })();

    return this.initializationPromise;
  }

  getElement(): HTMLElement {
    return this.container;
  }

  async setContent(content: string): Promise<void> {
    this.pendingContent = content || '';
    
    if (this.editor) {
      this.editor.setValue(this.pendingContent);
    } else {
      // Store content to set when editor is created
      this.container.setAttribute('data-initial-content', this.pendingContent);
      
      // Wait for Monaco to load and create editor
      await this.initializeMonaco();
      if (this.editor) {
        this.editor.setValue(this.pendingContent);
      }
    }
  }

  getContent(): string {
    return this.editor ? this.editor.getValue() : this.pendingContent;
  }

  async refresh(): Promise<void> {
    await this.initializeMonaco();
    
    if (!this.editor && this.container.parentElement && this.isInitialized) {
      this.createEditor();
    }
    
    if (this.editor) {
      this.editor.layout();
    }
  }

  async focus(): Promise<void> {
    await this.initializeMonaco();
    
    if (this.editor) {
      this.editor.focus();
    }
  }

  private createEditor(): void {
    if (this.editor || !this.container.parentElement || !this.isInitialized || !window.monaco) {
      return;
    }

    // Get initial content
    const initialContent = this.pendingContent || 
                          this.container.getAttribute('data-initial-content') || '';

    // Create the editor using global monaco object
    this.editor = window.monaco.editor.create(this.container, {
      value: initialContent,
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
    const cleanup = () => {
      resizeObserver.disconnect();
      this.destroy();
    };
    
    // Store cleanup function for later use
    (this.container as any)._monacoCleanup = cleanup;
  }

  async setLanguage(language: string): Promise<void> {
    this.options.language = language;
    
    await this.initializeMonaco();
    
    if (this.editor && window.monaco) {
      const model = this.editor.getModel();
      if (model) {
        window.monaco.editor.setModelLanguage(model, language);
      }
    }
  }

  async setTheme(theme: string): Promise<void> {
    this.options.theme = theme;
    
    await this.initializeMonaco();
    
    if (this.editor && window.monaco) {
      window.monaco.editor.setTheme(theme);
    }
  }

  async setReadOnly(readOnly: boolean): Promise<void> {
    this.options.readOnly = readOnly;
    
    await this.initializeMonaco();
    
    if (this.editor) {
      this.editor.updateOptions({ readOnly });
    }
  }

  destroy(): void {
    if (this.editor) {
      this.editor.dispose();
      this.editor = null;
    }
    
    // Clean up stored references
    if ((this.container as any)._monacoCleanup) {
      delete (this.container as any)._monacoCleanup;
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