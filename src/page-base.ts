
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

  /** Webflow domain (from data-wf-domain attribute) */
  domain: string | null;

  /** Webflow page ID (from data-wf-page attribute) */
  pageId: string | null;

  /** Webflow site ID (from data-wf-site attribute) */
  siteId: string | null;

  /** Page language (from lang attribute) */
  lang: string | null;

  /** Collection ID if this is a collection page (from data-wf-collection attribute) */
  collectionId: string | null;

  /** Item ID if this is a collection item page (from data-wf-item attribute) */
  itemId: string | null;

  /** Collection item slug (from data-wf-item-slug attribute) */
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
   * Static reference to the current page instance.
   * Set during setup() phase when the page is activated.
   */
  private static currentPageInstance: PageBase | null = null;

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
   * Get the current active page instance.
   * Available after the page's setup() method has been called.
   *
   * @returns The current PageBase instance, or null if no page is active
   *
   * @example
   * ```typescript
   * // In a component - get base page reference
   * const page = PageBase.getCurrentPage();
   * if (page) {
   *   console.log('Collection ID:', page.pageInfo.collectionId);
   * }
   *
   * // Get specific page type if needed
   * const listingPage = PageBase.getCurrentPage<ListingPage>();
   * if (listingPage) {
   *   listingPage.someCustomMethod();
   * }
   * ```
   */
  static getCurrentPage<T extends PageBase = PageBase>(): T | null {
    return PageBase.currentPageInstance as T | null;
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
      domain: html.getAttribute('data-wf-domain'),
      pageId: html.getAttribute('data-wf-page'),
      siteId: html.getAttribute('data-wf-site'),
      lang: html.getAttribute('lang'),
      collectionId: html.getAttribute('data-wf-collection'),
      itemId: html.getAttribute('data-wf-item'),
      itemSlug: html.getAttribute('data-wf-item-slug'),
      queryParams: url.searchParams,
      hash: window.location.hash,
      url: window.location.href,
    };
  }

  /**
   * Framework lifecycle method - called synchronously during page setup.
   * Registers this page as the current page, then calls onPrepare() for consumer code.
   */
  setup(): void {
    // Register this page as the current active page
    PageBase.currentPageInstance = this;

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
