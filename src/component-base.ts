
/* SPDX-License-Identifier: MIT
 * Copyright (C) 2024 Sygnal Technology Group
 */

import { IModule } from './routeDispatcher';
import { WebflowPageInfo } from './page-base';

/**
 * Component-specific context information
 */
export interface ComponentContext {
  /** The root element of this component */
  element: HTMLElement;

  /** Component name from data-component attribute */
  name: string | null;

  /** Component ID from data-component-id attribute (if present) */
  id: string | null;

  /** All data attributes on the component element */
  dataAttributes: DOMStringMap;

  /** Page-level Webflow context */
  pageInfo: WebflowPageInfo;
}

/**
 * Abstract base class for components that implements IModule with automatic
 * context detection. Provides the component element and related context before
 * consumer code runs.
 *
 * @example
 * ```typescript
 * import { ComponentBase, component } from '@sygnal/sse-core';
 *
 * @component('navigation')
 * export class Navigation extends ComponentBase {
 *   protected onPrepare(): void {
 *     console.log('Component element:', this.element);
 *     console.log('Component name:', this.context.name);
 *   }
 *
 *   protected async onLoad(): Promise<void> {
 *     // Your component logic here
 *     this.element.addEventListener('click', () => {
 *       console.log('Clicked!');
 *     });
 *   }
 * }
 * ```
 */
export abstract class ComponentBase implements IModule {

  /**
   * The HTMLElement this component is bound to.
   * Provided by the framework during construction.
   */
  protected element: HTMLElement;

  /**
   * Component context information.
   * Automatically populated during construction.
   */
  protected context: ComponentContext;

  /**
   * @param element The HTMLElement this component is attached to
   */
  constructor(element: HTMLElement) {
    this.element = element;
    this.context = this.detectComponentContext(element);
  }

  /**
   * Detects and extracts component-specific context from the element and page.
   *
   * @param element The component's root element
   * @returns ComponentContext object with all detected context
   */
  private detectComponentContext(element: HTMLElement): ComponentContext {
    const html = document.documentElement;
    const url = new URL(window.location.href);

    return {
      element: element,
      name: element.getAttribute('data-component'),
      id: element.getAttribute('data-component-id'),
      dataAttributes: element.dataset,
      pageInfo: {
        path: window.location.pathname,
        pageId: html.getAttribute('data-wf-page'),
        siteId: html.getAttribute('data-wf-site'),
        collectionId: html.getAttribute('data-wf-collection'),
        itemId: html.getAttribute('data-wf-item'),
        itemSlug: this.extractItemSlug(),
        queryParams: url.searchParams,
        hash: window.location.hash,
        url: window.location.href,
      }
    };
  }

  /**
   * Attempts to extract the collection item slug from the URL path.
   * This is a best-effort extraction based on common Webflow URL patterns.
   *
   * @returns The item slug or null if not detected
   */
  private extractItemSlug(): string | null {
    const pathParts = window.location.pathname.split('/').filter(p => p);

    // If we have a collection item ID, the last path segment is typically the slug
    if (document.documentElement.hasAttribute('data-wf-item') && pathParts.length > 0) {
      return pathParts[pathParts.length - 1];
    }

    return null;
  }

  /**
   * Framework lifecycle method - called synchronously during component setup.
   * Runs framework detection first, then calls onPrepare() for consumer code.
   */
  setup(): void {
    this.onPrepare();
  }

  /**
   * Framework lifecycle method - called asynchronously after DOM ready.
   * Runs framework detection first, then calls onLoad() for consumer code.
   */
  async exec(): Promise<void> {
    await this.onLoad();
  }

  /**
   * Override this method in your component class for synchronous preparation logic.
   * Called during page load in the <head>, before DOM is ready.
   * The element and context are already available.
   */
  protected onPrepare(): void {
    // Optional override - default implementation does nothing
  }

  /**
   * Override this method in your component class for asynchronous initialization logic.
   * Called after DOM is fully loaded and ready.
   * The element and context are already available.
   * This method must be implemented by subclasses.
   */
  protected abstract onLoad(): Promise<void>;
}
