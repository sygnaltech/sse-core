
/* SPDX-License-Identifier: MIT
 * Copyright (C) 2024 Sygnal Technology Group
 */

interface ScriptConfig {

    /** The type of the script, e.g., "text/javascript". */
    type?: string;

    /** The id of the script. */
    id?: string;

    /** Whether the script should be loaded asynchronously. */
    async?: boolean;

    /** Whether the script should be deferred. */
    defer?: boolean;

    /** Custom attributes to add to the script element. */
    customAttributes?: { [key: string]: string };
    
  }
  
  class ScriptElement extends HTMLScriptElement {
    constructor(src: string, config?: ScriptConfig) {
      super();
      this.src = src;
  
      if (config) {
        if (config.type) {
          this.type = config.type;
        }
        if (config.id) {
          this.id = config.id;
        }
        if (config.async !== undefined) {
          this.async = config.async;
        }
        if (config.defer !== undefined) {
          this.defer = config.defer;
        }
        if (config.customAttributes) {
          for (const [key, value] of Object.entries(config.customAttributes)) {
            this.setAttribute(key, value);
          }
        }
      }
    }
  
    // Method to append the script to the document
    appendTo(
        target: 'head' | 'body' = 'body'
    ): void {
        const parent = target === 'head' ? document.head : document.body;
        parent.appendChild(this);
    }

    prependTo(
        target: 'head' | 'body' = 'body'
    ): void {
        const parent = target === 'head' ? document.head : document.body;
        parent.prepend(this);
    }

  }
  
  // Define the custom element if necessary
  customElements.define('custom-script', ScriptElement, { extends: 'script' });
  
  export { ScriptElement, ScriptConfig };
  