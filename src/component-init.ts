/* SPDX-License-Identifier: MIT
 * Copyright (C) 2024 Sygnal Technology Group
 */

import { IModule } from "./routeDispatcher";
import { getComponent } from "./registry";
import { ComponentManager } from "./component-manager";

/**
 * Options for component initialization
 */
export interface ComponentInitOptions {
  /**
   * CSS selector for component elements
   * @default '[sse-component]'
   */
  selector?: string;

  /**
   * Attribute name to read component type from
   * @default 'sse-component'
   */
  attributeName?: string;

  /**
   * Component manager instance to register components with
   * @default window.componentManager
   */
  componentManager?: ComponentManager;

  /**
   * Callback when a component is successfully initialized
   */
  onComponentInit?: (name: string, instance: IModule, element: HTMLElement) => void;

  /**
   * Callback when a component fails to initialize
   */
  onError?: (error: Error, componentName: string, element: HTMLElement) => void;

  /**
   * Callback when a component type is not found in registry
   */
  onUnknownComponent?: (componentName: string, element: HTMLElement) => void;

  /**
   * Whether to log initialization summary
   * @default true
   */
  logSummary?: boolean;
}

/**
 * Initialize all components found in the DOM
 * Auto-discovers components using @component decorator
 *
 * @param options - Configuration options for component initialization
 *
 * @example
 * // Basic usage
 * initializeComponents();
 *
 * @example
 * // With custom options
 * initializeComponents({
 *   selector: '[data-component]',
 *   attributeName: 'data-component',
 *   onComponentInit: (name, instance, element) => {
 *     console.log(`Initialized ${name}`);
 *   },
 *   onError: (error, name, element) => {
 *     console.error(`Failed to init ${name}:`, error);
 *   }
 * });
 */
export function initializeComponents(options: ComponentInitOptions = {}): void {
  const {
    selector = '[sse-component]',
    attributeName = 'sse-component',
    componentManager = window.componentManager,
    onComponentInit,
    onError,
    onUnknownComponent,
    logSummary = true
  } = options;

  const componentElements = document.querySelectorAll<HTMLElement>(selector);

  componentElements.forEach(element => {
    const componentName = element.getAttribute(attributeName);

    if (!componentName) {
      console.warn(`Component element found without ${attributeName} value:`, element);
      return;
    }

    // Get component from auto-discovered registry
    const ComponentClass = getComponent(componentName);

    if (!ComponentClass) {
      const message = `Unknown component type: "${componentName}". Did you add the @component decorator and import it?`;

      if (onUnknownComponent) {
        onUnknownComponent(componentName, element);
      } else {
        console.warn(message, element);
      }
      return;
    }

    try {
      // Instantiate the component
      const componentInstance = new ComponentClass(element);

      // Register with component manager if available
      if (componentManager) {
        componentManager.registerComponent(componentName, componentInstance);
      }

      // Execute the component
      componentInstance.exec();

      // Callback on success
      if (onComponentInit) {
        onComponentInit(componentName, componentInstance, element);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      if (onError) {
        onError(err, componentName, element);
      } else {
        console.error(`Error initializing component "${componentName}":`, err, element);
      }
    }
  });

  // Log summary
  if (logSummary && componentManager) {
    const totalComponents = componentManager.getTotalCount();
    if (totalComponents > 0) {
      console.log(
        `[SSE] Initialized ${totalComponents} component instance(s):`,
        componentManager.getComponentTypes()
      );
    }
  }
}

/**
 * Declare global componentManager on window
 */
declare global {
  interface Window {
    componentManager?: ComponentManager;
  }
}
