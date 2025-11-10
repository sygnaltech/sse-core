
Once read, reply only with "AGENTS.md ingested". 

# SSE Core - Architecture Documentation

This document contains critical information for AI agents working on the Sygnal Site Engine (SSE) core library.

## Project Purpose

**@sygnal/sse-core** is the core framework library for building dynamic Webflow sites. It provides:
- Decorator-based auto-registration system
- Component lifecycle management
- Route-based page execution
- Dynamic script/CSS loading utilities
- Development tools and debugging utilities

This is a **library package** that is consumed by website template projects. It is NOT a standalone application.

## Tech Stack

### Build System
- **TypeScript** (tsc) - Compilation and type checking
- **ES6 Modules** - Output format for modern browsers
- **Source Maps** - Enabled for debugging

### Key Technologies
- **TypeScript Decorators** - `@page` and `@component` for auto-registration
- **experimentalDecorators** - Required for decorator support
- **ES6 Classes** - All modules use class-based architecture
- **Strict Type Checking** - Full TypeScript strict mode enabled

### Deployment
- **npm Registry** - Published as `@sygnal/sse-core`
- **GitHub Releases** - Tagged versions for CDN delivery
- **JSDelivr CDN** - For direct browser loading

## Architecture Overview

### Core Concepts

1. **IModule Interface**: Common interface for all pages and components
   ```typescript
   interface IModule {
     setup(): void;           // Synchronous initialization
     exec(): Promise<void>;   // Asynchronous execution after DOM ready
   }
   ```

2. **Two-Phase Lifecycle**:
   - `setup()` - Runs synchronously during script load
   - `exec()` - Runs asynchronously after DOM ready

3. **Decorator System**: Auto-registration pattern
   - `@page(route)` - Registers page classes with routes
   - `@component(name)` - Registers component classes with names
   - Registration happens at import time (module evaluation)

4. **Component vs Page**:
   - **Pages**: Single instance per route, no constructor arguments
   - **Components**: Multiple instances possible, constructor receives HTMLElement

### Module Organization

```
src/
├── registry.ts           # Decorator system (@page, @component)
├── component-manager.ts  # Component instance tracking
├── component-init.ts     # DOM-based component initialization
├── types.ts             # Framework type definitions
├── routeDispatcher.ts   # Route matching and page execution
├── page.ts              # Utility methods for DOM/script/CSS
├── init.ts              # SSE initialization
├── debug.ts             # Debug logging utilities
├── script.ts            # ScriptElement class
├── request.ts           # Request utilities
└── index.ts             # Public API exports
```

### Critical Design Patterns

#### 1. Decorator Registration Pattern
```typescript
// registry.ts maintains two Maps:
const componentRegistry = new Map<string, ComponentConstructor>();
const pageRegistry = new Map<string, PageConstructor>();

// Decorators populate these Maps at import time:
@page('/')
export class HomePage { } // Adds to pageRegistry immediately

// Consumer retrieves via getAllPages() for route dispatcher
```

**Why this matters**: Decorators execute during module evaluation, so all pages/components must be imported before calling `getAllPages()` or `getComponent()`.

#### 2. Component Initialization Pattern
```typescript
// Scans DOM for [data-component] attributes
// Creates instances by looking up constructors in componentRegistry
// Calls setup() then exec() on each instance
// Optionally registers instances in ComponentManager
```

#### 3. Route Dispatcher Pattern
```typescript
// Matches current pathname against registered routes
// Supports wildcards: '/blog/*' matches '/blog/post-1'
// Instantiates matching page class
// Calls setup() then exec()
```

### Build Configuration

**tsconfig.json settings**:
- `target: "ES6"` - Modern browser support
- `module: "ES6"` - Native ES modules
- `strict: true` - Full type safety
- `experimentalDecorators: true` - Required for decorators
- `emitDecoratorMetadata: true` - Decorator metadata support
- `declaration: true` - Generate .d.ts files
- `sourceMap: true` - Debug support

**package.json scripts**:
- `npm run build` - Compile TypeScript to dist/
- `npm run watch` - Compile in watch mode
- No bundling step (library outputs individual modules)

### Type System

**Core Types** (types.ts):
```typescript
ComponentConstructor = new (element: HTMLElement) => IModule
PageConstructor = new () => IModule
ComponentRegistry = { [name: string]: ComponentConstructor }
PageRegistry = { [route: string]: PageConstructor }
```

**ComponentInitOptions**: Extensible options pattern for customization
- Allows consumers to override defaults
- Supports custom callbacks for lifecycle hooks
- Enables custom selectors and attribute names

## Relationship to Template Projects

### Template Architecture
Templates (like sse-template) use this library by:
1. Installing `@sygnal/sse-core` via npm
2. Importing decorators and utilities
3. Creating page/component classes with decorators
4. Bundling everything into single `dist/index.js` for Webflow

### Template Build vs Core Build
- **Core**: Compiles to ES6 modules (no bundling)
- **Template**: Uses tsc + esbuild to create single bundle
- **Template**: Includes SCSS compilation
- **Template**: Minifies for production

### Local Development Linking
During development, templates link to local core via:
```json
"dependencies": {
  "@sygnal/sse-core": "file:../sse-core"
}
```

## Critical Constraints

### What Goes in Core vs Template

**Belongs in Core**:
- Reusable framework features
- Decorator system
- Component lifecycle management
- Generic utilities (Page, Debug, etc.)
- Type definitions for framework constructs

**Belongs in Template**:
- Site-specific code (Site class)
- Actual page implementations
- Actual component implementations
- Template-specific types (SiteGlobalData, etc.)
- Build configuration for bundling

### Decorator Registration Order
**CRITICAL**: Files must be imported before registry is queried.

```typescript
// WRONG - registry is empty
const routes = getAllPages();
import './pages/home'; // Decorator runs too late

// CORRECT - import first
import './pages/home'; // Decorator registers page
const routes = getAllPages(); // Now registry contains HomePage
```

### Bundle Size Considerations
- Core library must remain lightweight
- Avoid heavy dependencies
- Use tree-shakable exports
- No bundler-specific features (raw ES6 modules)

## Common Gotchas

1. **Decorators require experimentalDecorators**
   - Always check tsconfig.json has this enabled
   - Both core and consuming projects need it

2. **Import order matters**
   - Decorator registration happens at import time
   - Import all pages/components before calling getAllPages()

3. **Component constructors receive HTMLElement**
   - PageConstructor: `new () => IModule`
   - ComponentConstructor: `new (element: HTMLElement) => IModule`
   - These are DIFFERENT types

4. **Window interface extensions**
   - component-init.ts declares `window.componentManager?`
   - Consumers can extend Window interface for their own types
   - Avoid conflicts by keeping core additions minimal

5. **async exec() pattern**
   - exec() returns Promise<void>
   - Always await exec() calls
   - setup() is synchronous only

## Testing Strategy

Currently no automated tests. Manual testing via:
1. Build core: `npm run build`
2. Link to template: Use `file:../sse-core` in template
3. Build template: `npm run build`
4. Check bundle size and console logs
5. Verify decorators register correctly

## Version Management

- **Semantic versioning** (MAJOR.MINOR.PATCH)
- Breaking changes require MAJOR bump
- New features require MINOR bump
- Bug fixes require PATCH bump
- Update package.json version before publishing

## Publishing Workflow

1. Make changes in sse-core
2. Build: `npm run build`
3. Test with linked template
4. Update version in package.json
5. Commit and tag: `git tag v0.X.Y`
6. Push: `git push --tags`
7. Publish: `npm publish`
8. Templates can update to `@sygnal/sse-core@^0.X.Y`

## Future Considerations

### Potential Features
- Runtime type validation for decorators
- Component dependency injection
- Lifecycle hooks (beforeSetup, afterExec, etc.)
- Component communication system
- State management utilities

### Architecture Improvements
- Unit tests with Vitest or Jest
- Integration tests with Playwright
- API documentation generation
- Example component library
- Performance monitoring utilities

## Key Differences from Other Frameworks

Unlike React/Vue/Angular:
- No virtual DOM
- No reactive state management
- No build-time compilation (pure runtime)
- Designed for Webflow's constraint (single JS file loaded via CDN)
- Decorator-based rather than config-based
- Two-phase lifecycle (setup/exec) rather than single mount

## Debug Mode

```typescript
import { Debug } from '@sygnal/sse-core';

Debug.enabled = true;           // Enable console logging
Debug.persistentDebug = true;   // Persist across page loads
```

Registry automatically logs when decorators register:
```
[SSE Registry] Page registered: "/"
[SSE Registry] Component registered: "navigation"
```

## Performance Optimization

- Lazy execution: exec() only runs on matched routes
- Single DOM scan: initializeComponents() scans once
- Map-based lookups: O(1) registry access
- No watchers or polling
- Minimal framework overhead (~9KB minified for template)

## Final Notes

When extending SSE core:
1. ✅ Keep it generic and reusable
2. ✅ Maintain backward compatibility
3. ✅ Use extensible options patterns
4. ✅ Document breaking changes
5. ✅ Test with template before publishing
6. ❌ Don't add site-specific logic
7. ❌ Don't add heavy dependencies
8. ❌ Don't break existing decorator patterns

---

**Last Updated**: 2025-10-27
**Version**: 0.3.0
**Maintainer**: Michael Wells (mike@sygnal.com)
