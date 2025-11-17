/**
 * FIX - Functional Interactions System
 * Core system for declarative event-driven interactions
 */

// Export base classes
export { TriggerBase, type TriggerData } from './base/trigger-base';
export { ActionBase } from './base/action-base';
export { EventBase } from './base/event-base';

// Export registries
export { FIXRegistry, trigger, action } from './registry';
export { EventRegistry } from './event-registry';

// Export events
export { EventDefault, EventSequential } from './events';

// Export initialization and debug
export {
  initializeFIX,
  registerProgrammaticAction,
  FIXDebug
} from './initializer';

// Auto-import standard triggers and actions
// This ensures they're registered when FIX is imported
import './triggers';
import './actions';
