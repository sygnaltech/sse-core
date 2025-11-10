
/* SPDX-License-Identifier: MIT
 * Copyright (C) 2024 Sygnal Technology Group
 */

import { IModule } from './routeDispatcher';

/**
 * Webflow page context information
 */
export interface WebflowPageInfo {
  /** Current page path */
  path: string;

  /** Webflow page ID (from data-wf-page attribute) */
  pageId: string | null;

  /** Webflow site ID (from data-wf-site attribute) */
  siteId: string | null;

  /** Collection ID if this is a collection page (from data-wf-collection attribute) */
  collectionId: string | null;

  /** Item ID if this is a collection item page (from data-wf-item attribute) */
  itemId: string | null;

  /** Collection item slug if available */
  itemSlug: string | null;

  /** Query parameters from URL */
  queryParams: URLSearchParams;

  /** Hash fragment from URL */
  hash: string;

  /** Full URL */
  url: string;
}

/**
 * Abstract base class for pages that implements IModule with automatic
 * Webflow context detection. Provides pre-execution logic before consumer code runs.
 *
 * @example
 * ```typescript
 * import { PageBase, page } from '@sygnal/sse-core';
 *
 * @page('/')
 * export class HomePage extends PageBase {
 *   protected onPrepare(): void {
 *     console.log('Page ID:', this.pageInfo.pageId);
 *   }
 *
 *   protected async onLoad(): Promise<void> {
 *     // Your page logic here
 *   }
 * }
 * ```
 */
export abstract class PageBase implements IModule {

  /**
   * Webflow page context information.
   * Automatically populated during construction.
   */
  protected pageInfo: WebflowPageInfo;

  constructor() {
    // Detect Webflow page information on instantiation
    this.pageInfo = this.detectWebflowContext();
  }

  /**
   * Detects and extracts Webflow-specific context from the current page.
   * Reads data attributes from the HTML element and URL information.
   *
   * @returns WebflowPageInfo object with all detected context
   */
  private detectWebflowContext(): WebflowPageInfo {
    const html = document.documentElement;
    const url = new URL(window.location.href);

    return {
      path: window.location.pathname,
      pageId: html.getAttribute('data-wf-page'),
      siteId: html.getAttribute('data-wf-site'),
      collectionId: html.getAttribute('data-wf-collection'),
      itemId: html.getAttribute('data-wf-item'),
      itemSlug: this.extractItemSlug(),
      queryParams: url.searchParams,
      hash: window.location.hash,
      url: window.location.href,
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
   * Framework lifecycle method - called synchronously during page setup.
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
   * Override this method in your page class for synchronous preparation logic.
   * Called during page load in the <head>, before DOM is ready.
   * The pageInfo context is already available.
   */
  protected onPrepare(): void {
    // Optional override - default implementation does nothing
  }

  /**
   * Override this method in your page class for asynchronous initialization logic.
   * Called after DOM is fully loaded and ready.
   * The pageInfo context is already available.
   * This method must be implemented by subclasses.
   */
  protected abstract onLoad(): Promise<void>;
}
