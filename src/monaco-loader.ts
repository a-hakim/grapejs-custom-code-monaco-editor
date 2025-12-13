/**
 * Monaco Editor Loader
 * Dynamically loads Monaco Editor from CDN and initializes it
 */

export interface MonacoLoaderOptions {
  version?: string;
  baseUrl?: string;
}

declare global {
  interface Window {
    monaco: any;
    require: any;
  }
}

export class MonacoLoader {
  private static instance: MonacoLoader;
  private loadPromise: Promise<any> | null = null;
  private isLoaded = false;

  private constructor() {}

  static getInstance(): MonacoLoader {
    if (!MonacoLoader.instance) {
      MonacoLoader.instance = new MonacoLoader();
    }
    return MonacoLoader.instance;
  }

  /**
   * Load Monaco Editor from CDN
   */
  async load(options: MonacoLoaderOptions = {}): Promise<any> {
    if (this.isLoaded && window.monaco) {
      return window.monaco;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    const { version = '0.54.0', baseUrl } = options;
    const monacoBaseUrl = baseUrl || `https://unpkg.com/monaco-editor@${version}/min/vs`;

    this.loadPromise = new Promise((resolve, reject) => {
      // Check if Monaco is already loaded
      if (window.monaco) {
        this.isLoaded = true;
        resolve(window.monaco);
        return;
      }

      const initMonaco = () => {
         // Configure require.js paths
          window.require.config({
            paths: { vs: monacoBaseUrl }
          });

          // Load the Monaco Editor
          window.require(['vs/editor/editor.main'], () => {
            this.isLoaded = true;
            resolve(window.monaco);
          }, (error: any) => {
            reject(new Error(`Failed to load Monaco Editor: ${error}`));
          });
      }

      // Check if AMD loader is already available
      if (window.require) {
        initMonaco();
      } else {
        // Load the AMD loader script first
        this.loadScript(`${monacoBaseUrl}/loader.js`)
          .then(initMonaco)
          .catch(reject);
      }
    });

    return this.loadPromise;
  }

  /**
   * Load a script dynamically
   */
  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      
      document.head.appendChild(script);
    });
  }

  /**
   * Check if Monaco Editor is loaded
   */
  isMonacoLoaded(): boolean {
    return this.isLoaded && !!window.monaco;
  }

  /**
   * Get Monaco instance (if loaded)
   */
  getMonaco(): any {
    return window.monaco;
  }
}

export default MonacoLoader;