/* SPDX-License-Identifier: MIT
 * Copyright (C) 2024 Sygnal Technology Group
 */

import { Page } from './page';

// Core exports
export * from './page';
export * from './debug';
export * from './init';
export * from './routeDispatcher';

// Base classes
export * from './page-base';
export * from './component-base';

// Decorator system
export * from './registry';
export * from './types';

// Component management
export * from './component-manager';
export * from './component-init';

// FIX System (Functional Interactions) - re-export shared package
export {
  TriggerBase,
  type TriggerData,
  ActionBase,
  EventBase,
  FIXRegistry,
  trigger,
  action,
  EventRegistry,
  EventDefault,
  EventSequential,
  initializeFIX,
  registerProgrammaticAction,
  registerActionType,
  registerTriggerType,
  FIXDebug
} from '@sygnal/fix';

interface SSEGlobalDataType {
    baseUrl?: string;  
} 

declare global {
    interface Window {

        // Extend the Window interface to include fsAttributes
        SSE: SSEGlobalDataType;

    }
}

export function initSSE() {
    
    // Ensure global SSE object is initialized
    if (!window.SSE) {
        window.SSE = {};
    }

    // Save script base URL
    // for easy inclusion of CSS and libs later
    window.SSE.baseUrl = Page.getCurrentScriptBaseUrl(); 

}
