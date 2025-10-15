import type { Editor, Component } from 'grapesjs';
import { PluginOptions } from '.';
import { commandNameCustomCode, keyCustomCode } from './utils';
import { MonacoCodeViewer, languageMap, themeMap } from './monaco-editor';

type ContentTypes = HTMLElement | string | undefined;

export default (editor: Editor, opts: PluginOptions = {}) => {
  const { modalTitle, codeViewOptions, monacoOptions, commandCustomCode } = opts;

  const appendToContent = (target: HTMLElement, content?: ContentTypes) => {
    if (content instanceof HTMLElement) {
        target.appendChild(content);
    } else if (content) {
        target.insertAdjacentHTML('beforeend', content);
    }
  }

  // Add the custom code command
  editor.Commands.add(commandNameCustomCode, {
    keyCustomCode,
    target: null as null | Component,
    codeViewer: null as MonacoCodeViewer | null,

    run(editor, s, opts = {}) {
      const target = opts.target || editor.getSelected();
      this.target = target;

      if (target?.get('editable')) {
        this.showCustomCode(target, opts);
      }
    },

    stop(editor) {
      editor.Modal.close();
    },

    /**
     * Method which tells how to show the custom code
     * @param  {Component} target
     */
    showCustomCode(target: Component, options: any) {
      const title = options.title || modalTitle;
      const code = target.get(keyCustomCode) || '';
      const content = this.getContent();
      editor.Modal
        .open({ title, content })
        .onceClose(() => editor.stopCommand(commandNameCustomCode));
      
      // Set content after modal is opened to ensure DOM is ready
      setTimeout(() => {
        this.getCodeViewer().setContent(code);
      }, 0);
    },

    /**
     * Custom pre-content. Can be a simple string or an HTMLElement
     */
    getPreContent() {},

    /**
     * Custom post-content. Can be a simple string or an HTMLElement
     */
    getPostContent() {},

    /**
     * Get all the content for the custom code
     * @return {HTMLElement}
     */
    getContent() {
      const codeViewer = this.getCodeViewer();
      const content = document.createElement('div');
      const pfx = editor.getConfig('stylePrefix');
      content.className = `${pfx}custom-code`;
      appendToContent(content, this.getPreContent() as ContentTypes);
      content.appendChild(codeViewer.getElement());
      appendToContent(content, this.getPostContent() as ContentTypes);
      appendToContent(content, this.getContentActions());
      
      // Refresh and focus after DOM is ready
      setTimeout(() => {
        codeViewer.refresh();
        codeViewer.focus();
      }, 100);

      return content;
    },

    /**
     * Get the actions content. Can be a simple string or an HTMLElement
     * @return {HTMLElement|String}
     */
    getContentActions() {
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      const pfx = editor.getConfig('stylePrefix');
      btn.innerHTML = opts.buttonLabel!;
      btn.className = `${pfx}btn-prim ${pfx}btn-import__custom-code`;
      btn.onclick = () => this.handleSave();

      return btn;
    },

    /**
     * Handle the main save task
     */
    handleSave() {
      const { target } = this;
      if (target) {
        const code = this.getCodeViewer().getContent();
        target.set(keyCustomCode, code);
        editor.Modal.close();
      }
    },

    /**
     * Return the Monaco code viewer instance
     * @return {MonacoCodeViewer}
     */
    getCodeViewer(): MonacoCodeViewer {
      if (!this.codeViewer) {
        // Map legacy codeViewOptions to Monaco options
        const legacyOptions = codeViewOptions || {};
        const language = languageMap[legacyOptions.codeName || 'htmlmixed'] || 'html';
        const theme = themeMap[legacyOptions.theme || 'hopscotch'] || 'vs-dark';
        const readOnly = legacyOptions.readOnly === 1 || legacyOptions.readOnly === true;

        const monacoConfig = {
          language,
          theme,
          readOnly,
          ...monacoOptions,
          ...legacyOptions
        };

        this.codeViewer = new MonacoCodeViewer(monacoConfig);
      }
      return this.codeViewer;
    },

    ...commandCustomCode,
  });
};
