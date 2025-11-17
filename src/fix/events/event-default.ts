/**
 * FIX - Functional Interactions
 * Default Event Handler - invokes all registered actions in parallel
 */

import { EventBase } from '../base/event-base';
import type { TriggerData } from '../base/trigger-base';

/**
 * Default event handler that invokes all registered actions in parallel (fire-and-forget)
 */
export class EventDefault extends EventBase {
  /**
   * Invoke the event - triggers all registered actions
   * @param triggerElement The element that triggered this event
   * @param triggerData The data object from the trigger
   */
  invoke(triggerElement: HTMLElement, triggerData: TriggerData): void {
    console.log(`[FIX Event] Event "${this.eventName}" invoked with data:`, triggerData);

    if (this.actions.length === 0) {
      console.warn(`[FIX Event] Event "${this.eventName}" has no registered actions`);
      return;
    }

    // Invoke each registered action (fire-and-forget)
    this.actions.forEach((action, index) => {
      console.log(`[FIX Event] Triggering action ${index + 1}/${this.actions.length}`);
      action.trigger(triggerElement, triggerData);
    });
  }
}
