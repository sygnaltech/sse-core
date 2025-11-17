# FIX (Functional Interactions) - Agent Specification

Guidance for extending the FIX system with new triggers and actions.

## Mental model
- FIX links DOM attributes to event handlers. `initializeFIX()` scans the DOM for `trigger:*` and `action:*` attributes and wires them together through the event registry.
- A trigger attaches to a DOM event, composes optional data from `trigger:<type>:data:*` attributes, and calls the FIX event.
- An event fan-outs to registered actions. `EventDefault` calls actions in parallel; `EventSequential` awaits each in order. Custom events can extend `EventBase`.
- An action performs behavior when the event fires. Actions may be DOM-bound (have an element) or programmatic (registered via `registerProgrammaticAction` with `element = null`).
- Decorators (`@trigger`, `@action`) register handler classes on import. Import order matters; add new handlers to `src/fix/triggers/index.ts` or `src/fix/actions/index.ts` so `src/fix/index.ts` pulls them in automatically.

## Attribute contract
- Triggers: `trigger:<type>="event-name"`, e.g. `trigger:click="signup"`.
- Trigger data: `trigger:<type>:data:<key>="value"`, available in `triggerData[<key>]`.
- Actions: `action:<type>="event-name"`. Actions register themselves against the event named in the value.
- The same `event-name` connects triggers and actions. If no event exists yet, `initializeFIX()` creates an `EventDefault` instance.

## How to build a new trigger
1) Create `src/fix/triggers/trigger-<name>.ts`.
2) Extend `TriggerBase` and implement `init()` to attach listeners. Call `this.invoke()` when your DOM condition fires; it gathers data and dispatches the event.
3) Decorate the class with `@trigger('<name>')` from `src/fix/registry`.
4) Add a side-effect import in `src/fix/triggers/index.ts` (so the decorator runs) and export the class if useful for typing.
5) Keep the constructor signature unchanged: `(element: HTMLElement, eventName: string, attributeName: string)`.
6) Respect bubbling/defaults yourself (e.g., if you need `preventDefault()` or `stopPropagation()`).

Minimal example:
```ts
// trigger-visible.ts
import { TriggerBase } from '../base/trigger-base';
import { trigger } from '../registry';

@trigger('visible')
export class TriggerVisible extends TriggerBase {
  init(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) this.invoke();
      });
    });
    observer.observe(this.element);
  }
}
```
HTML usage: `<div trigger:visible="hero-enter" trigger:visible:data:section="hero"></div>`

## How to build a new action
1) Create `src/fix/actions/action-<name>.ts`.
2) Extend `ActionBase`; implement:
   - `init()` for setup (optional).
   - `trigger(triggerElement, triggerData)` for behavior. Return `void` or `Promise<void>`; `EventSequential` will await promises.
3) Decorate with `@action('<name>')`.
4) Add a side-effect import in `src/fix/actions/index.ts` (and export if needed).
5) Handle `this.element` possibly being `null` (programmatic actions use `registerProgrammaticAction` and pass `null`).
6) Keep side effects scoped to the element or the provided data; log responsibly.

Minimal example:
```ts
// action-set-text.ts
import { ActionBase } from '../base/action-base';
import { action } from '../registry';
import type { TriggerData } from '../base/trigger-base';

@action('set-text')
export class ActionSetText extends ActionBase {
  init(): void {}

  trigger(triggerElement: HTMLElement, triggerData: TriggerData): void {
    const text = triggerData.text ?? 'default';
    if (this.element) this.element.textContent = text;
  }
}
```
HTML usage: `<p action:set-text="hero-enter"></p>`

## Wiring events (optional)
- To change event behavior (e.g., sequential execution), register an event before `initializeFIX()`:
```ts
import { EventRegistry } from '../fix/event-registry';
import { EventSequential } from '../fix/events';

EventRegistry.registerEvent('hero-enter', new EventSequential('hero-enter'));
```
- Custom events can extend `EventBase` to add throttling, cancellation, etc.

## Programmatic actions
- For non-DOM actions (API calls, global state), register them at runtime:
```ts
registerProgrammaticAction('set-status', 'hero-enter', class extends ActionBase {
  init(): void {}
  trigger(triggerElement, data): void {
    console.log('Status ->', data.status);
  }
});
```
- These still receive `triggerElement` and `triggerData`.

## Debugging checklist
- After page load, run `FIXDebug.stats()` to confirm handler types and instance counts.
- Use `FIXDebug.triggerTypes()` / `actionTypes()` to confirm your decorator registered.
- Use `FIXDebug.triggers()` / `actions()` to see instances discovered by `initializeFIX()`.

## PR-ready checklist for new handlers
- [ ] Class extends the correct base and implements required methods.
- [ ] Decorated with `@trigger` or `@action`.
- [ ] Imported in the relevant `index.ts` so registration runs.
- [ ] Handles missing/optional element safely.
- [ ] Returns a `Promise` where async work must be awaited.
- [ ] Documented expected HTML attributes and any data keys.
