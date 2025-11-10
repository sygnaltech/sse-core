# SSE Core v2.0.0 - Documentation Update Checklist

## Primary Changes in v2.0.0

### 1. **Package Rename**
- **Old**: `@sygnal/sse`
- **New**: `@sygnal/sse-core`
- Impact: All import statements and installation instructions

### 2. **New Base Classes with Automatic Context Detection**
- **PageBase**: Abstract base class for pages with automatic Webflow context detection
  - Provides `this.pageInfo` with all Webflow page data (pageId, siteId, collectionId, itemSlug, etc.)
  - Auto-detects: path, url, hash, queryParams, domain, lang, CMS data
  - New lifecycle: `onPrepare()` and `onLoad()` instead of `setup()` and `exec()`

- **ComponentBase**: Abstract base class for components with automatic element context
  - Provides `this.element` (the HTMLElement)
  - Provides `this.context` with component metadata (name, id, dataAttributes)
  - New lifecycle: `onPrepare()` and `onLoad()` instead of `setup()` and `exec()`

### 3. **Singleton Pattern for Page Access**
- Components can now access current page via `PageBase.getCurrentPage()`
- Eliminates need for duplicate context detection in components
- Type-safe with generic support: `PageBase.getCurrentPage<ListingPage>()`

### 4. **Lifecycle Method Naming Change**
- **Old**: `setup()` and `exec()`
- **New**: `onPrepare()` and `onLoad()`
- More intuitive naming aligned with web lifecycle

### 5. **RouteDispatcher Instance Persistence Fix**
- CRITICAL: RouteDispatcher must be created once and reused
- Prevents data loss between `setupRoute()` and `execRoute()`
- Pattern: Create dispatcher once, call both methods on same instance

### 6. **IModule Pattern Still Supported**
- Old `IModule` interface still available for advanced use
- Recommended: Use base classes for automatic context detection
- Legacy code can continue using `implements IModule` pattern

---

## Documentation Repository

**Location**: `D:\Projects\Docs\gitbook-sse-docs`

---

## Documentation Update Worklist

### Phase 1: Repository Structure Analysis
- [x] Read gitbook-sse-docs directory structure
- [x] Identify all markdown files that need updates
- [x] Map file locations to specific changes needed
- [x] Create comprehensive file-by-file update plan

**Repository Structure:**
- Total: 68 markdown files
- Key directories: setup/, usage/, devproxy/, tech-stack/, future/, special/
- Main files: README.md, SUMMARY.md, whats-new.md
- Current note in README.md: "We've recently released SSE2 with some significant improvements to the router"

**Priority Files (Need Immediate Updates):**
1. README.md - Main landing page
2. whats-new.md - Should document v2.0.0 changes
3. setup/quickstart.md - Installation and first steps
4. usage/code-structure.md - Code patterns
5. usage/page-router.md - Route dispatcher
6. usage/components/README.md - Component documentation
7. usage/source-structure-and-key-files/route-dispatcher.md - RouteDispatcher details
8. usage/developing-with-sse.md - Development guide
9. usage/best-practices.md - Best practices
10. the-sse-architecture.md - Architecture overview

### Phase 2: Package Name Updates
- [ ] Update all @sygnal/sse references to @sygnal/sse-core
- [ ] Update installation instructions
- [ ] Update import examples in code blocks
- [ ] Update package.json examples

### Phase 3: PageBase Documentation
- [ ] Document PageBase class and its purpose
- [ ] Document WebflowPageInfo interface
- [ ] Document automatic context detection
- [ ] Document onPrepare() lifecycle method
- [ ] Document onLoad() lifecycle method
- [ ] Provide migration examples from IModule to PageBase
- [ ] Document all available pageInfo properties
- [ ] Add examples for CMS collection pages

### Phase 4: ComponentBase Documentation
- [ ] Document ComponentBase class and its purpose
- [ ] Document ComponentContext interface
- [ ] Document automatic element context detection
- [ ] Document this.element access
- [ ] Document this.context properties
- [ ] Provide migration examples from IModule to ComponentBase
- [ ] Add examples for data attribute access

### Phase 5: Singleton Pattern Documentation
- [ ] Document PageBase.getCurrentPage() method
- [ ] Document accessing page info from components
- [ ] Provide examples of cross-component communication
- [ ] Document type-safe generic usage
- [ ] Add use case examples

### Phase 6: RouteDispatcher Updates
- [ ] Document instance persistence requirement
- [ ] Show correct dispatcher initialization pattern
- [ ] Document setupRoute() and execRoute() usage
- [ ] Add warning about creating multiple instances
- [ ] Update index.ts template examples

### Phase 7: Lifecycle Method Updates
- [ ] Update all setup() references to onPrepare()
- [ ] Update all exec() references to onLoad()
- [ ] Document lifecycle timing (head vs DOM ready)
- [ ] Update all code examples with new naming
- [ ] Add lifecycle flowcharts if present

### Phase 8: Migration Guide
- [ ] Create v1 to v2 migration guide
- [ ] Document breaking changes
- [ ] Provide before/after code examples
- [ ] Document deprecation timeline (if any)
- [ ] Add troubleshooting section

### Phase 9: API Reference Updates
- [ ] Update API documentation for all changed classes
- [ ] Add PageBase API reference
- [ ] Add ComponentBase API reference
- [ ] Update IModule documentation (mark as legacy/advanced)
- [ ] Add type definitions reference

### Phase 10: Example Code Updates
- [ ] Update all example pages to use PageBase
- [ ] Update all example components to use ComponentBase
- [ ] Update quickstart examples
- [ ] Update tutorial examples
- [ ] Verify all code examples are runnable

### Phase 11: Architecture Documentation
- [ ] Update architecture diagrams
- [ ] Document base class pattern
- [ ] Document singleton pattern implementation
- [ ] Update data flow diagrams
- [ ] Document context detection flow

### Phase 12: Best Practices
- [ ] Add best practices for PageBase usage
- [ ] Add best practices for ComponentBase usage
- [ ] Document when to use IModule directly
- [ ] Add performance considerations
- [ ] Add TypeScript tips

---

## Progress Tracking

**Started**: 2025-11-10
**Current Phase**: Phase 2 - Package Name Updates
**Last Updated**: 2025-11-10 (Phase 1 completed)
**Completed By**: [Will be filled in when complete]

### Completed Phases:
- ✅ Phase 1: Repository Structure Analysis (2025-11-10)

---

## Notes for Resume Sessions

When resuming this work:
1. Check which phase is marked as current
2. Review completed checkboxes in that phase
3. Continue from first unchecked item
4. Update "Last Updated" timestamp
5. Mark items as complete with [x] as you go

## Files Modified (Track Here)

This section will be populated as files are updated:

```
[Will be populated during execution]
```

---

## Critical Patterns to Update

### Old Pattern (v1.x)
```typescript
import { IModule, page } from '@sygnal/sse';

@page('/')
export class HomePage implements IModule {
  constructor() {}

  setup(): void {
    // Sync setup
  }

  async exec(): Promise<void> {
    // Async execution
    const pageId = document.documentElement.getAttribute('data-wf-page');
  }
}
```

### New Pattern (v2.0)
```typescript
import { PageBase, page } from '@sygnal/sse-core';

@page('/')
export class HomePage extends PageBase {

  protected onPrepare(): void {
    // Sync setup - automatic context available
    console.log('Page ID:', this.pageInfo.pageId);
  }

  protected async onLoad(): Promise<void> {
    // Async execution - full pageInfo available
    console.log('Collection:', this.pageInfo.collectionId);
    console.log('Item Slug:', this.pageInfo.itemSlug);
  }
}
```

### Component Pattern Change

**Old:**
```typescript
import { IModule, component } from '@sygnal/sse';

@component('my-component')
export class MyComponent implements IModule {
  private elem: HTMLElement;

  constructor(elem: HTMLElement) {
    this.elem = elem;
  }

  setup(): void {}
  async exec(): Promise<void> {
    this.elem.addEventListener('click', () => {});
  }
}
```

**New:**
```typescript
import { ComponentBase, component, PageBase } from '@sygnal/sse-core';

@component('my-component')
export class MyComponent extends ComponentBase {

  protected onPrepare(): void {
    // Element and context automatically available
    console.log('Component:', this.context.name);
  }

  protected async onLoad(): Promise<void> {
    // Access page info via singleton
    const page = PageBase.getCurrentPage();
    if (page) {
      console.log('On page:', page.pageInfo.pageId);
    }

    this.element.addEventListener('click', () => {});
  }
}
```

### RouteDispatcher Pattern Change

**Old (BROKEN):**
```typescript
// This creates TWO different instances!
routeDispatcher().setupRoute();  // Instance A
routeDispatcher().execRoute();   // Instance B - loses state!
```

**New (CORRECT):**
```typescript
// Create ONCE and reuse
const dispatcher = routeDispatcher();
dispatcher.setupRoute();
dispatcher.execRoute();
```
