# Sygnal Site Engine (SSE) - Core Library

[![npm version](https://badge.fury.io/js/%40sygnal%2Fsse-core.svg)](https://www.npmjs.com/package/@sygnal/sse-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**@sygnal/sse-core** is the core utility library for building dynamic, enhanced Webflow projects using the Sygnal Site Engine (SSE) framework. It provides client-side JavaScript utilities for script loading, route dispatching, debugging, and DOM manipulation.

## 🚀 Quick Start

### Installation

```bash
npm install @sygnal/sse-core
```

### Basic Usage

```javascript
import { initSSE, Page, Debug } from '@sygnal/sse-core';

// Initialize SSE with your base URL
initSSE('https://cdn.jsdelivr.net/npm/@sygnal/sse-core@latest');

// Enable debug mode
Debug.enabled = true;
Debug.debug('SSE initialized!');

// Load a script dynamically
Page.loadScript('https://example.com/script.js');
```

## 📦 Template Repository

To quickly start a new Webflow project with SSE, use our template repository:

**[sygnaltech/sse-template](https://github.com/sygnaltech/sse-template)** - A ready-to-use template for building Webflow projects with SSE framework integration.

## 🎯 Key Features

- **Decorator-Based Auto-Registration** - Use `@page` and `@component` decorators for automatic discovery
- **Component Management** - Track and retrieve component instances across your application
- **Dynamic Script & CSS Loading** - Load external resources programmatically
- **Route-Based Module Execution** - Organize code by page/route with wildcard support
- **Extensible Component Initialization** - Flexible component initialization with customizable options
- **Development/Production Modes** - Seamlessly switch between dev and prod environments
- **Debug Utilities** - Conditional logging with localStorage persistence
- **DOM Utilities** - Helper functions for element manipulation and traversal
- **Request Utilities** - Query parameter extraction and response header access
- **TypeScript Support** - Fully typed with comprehensive type definitions

## 📚 Core Modules

### Base Classes (Recommended)

**NEW:** SSE provides base classes with automatic Webflow context detection and intuitive lifecycle methods:

```typescript
import { PageBase, ComponentBase, page, component } from '@sygnal/sse-core';

// Page with automatic Webflow context
@page('/')
export class HomePage extends PageBase {
  protected onPrepare(): void {
    // Called during <head> load (synchronous)
    console.log('Page ID:', this.pageInfo.pageId);
    console.log('Collection:', this.pageInfo.collectionId);
  }

  protected async onLoad(): Promise<void> {
    // Called after DOM ready (asynchronous)
    console.log('Page path:', this.pageInfo.path);
    console.log('Query params:', this.pageInfo.queryParams);
  }
}

// Component with element and context
@component('navigation')
export class Navigation extends ComponentBase {
  protected onPrepare(): void {
    // Called during <head> load
    console.log('Component:', this.context.name);
    console.log('Element:', this.element);
  }

  protected async onLoad(): Promise<void> {
    // Called after DOM ready
    this.element.addEventListener('click', () => {
      console.log('Data attrs:', this.context.dataAttributes);
    });
  }
}
```

**Available Context:**

Pages get `pageInfo`:
- `path`, `url`, `hash`, `queryParams`
- `pageId`, `siteId` (Webflow IDs)
- `collectionId`, `itemId`, `itemSlug` (for CMS pages)

Components get `context`:
- `element` - The component's HTMLElement
- `name`, `id` - From data attributes
- `dataAttributes` - All data-* attributes
- `pageInfo` - Full page context

### Decorator System

Automatically register pages and components using TypeScript decorators:

```typescript
import { IModule, page, component } from '@sygnal/sse-core';

// Traditional approach: Implement IModule directly
@page('/')
export class HomePage implements IModule {
  setup() {
    console.log('Home page setup');
  }

  async exec() {
    console.log('Home page executing');
  }
}

// Register a page with wildcard route
@page('/blog/*')
export class BlogPage implements IModule {
  async exec() {
    const slug = window.location.pathname.replace('/blog/', '');
    console.log('Blog post:', slug);
  }
}

// Register multiple routes on one page
@page('/about')
@page('/about-us')
@page('/team')
export class AboutPage implements IModule {
  async exec() {
    console.log('About page loaded');
  }
}

// Register a component
@component('my-component')
export class MyComponent implements IModule {
  constructor(private elem: HTMLElement) {}

  setup() {
    console.log('Component setup on:', this.elem);
  }

  async exec() {
    console.log('Component executing');
  }
}
```

**Note:** You can use either approach - extend base classes for automatic context, or implement `IModule` directly for full control.

**Registry Utilities:**

```typescript
import { getAllPages, getRegistryStats, getComponent } from '@sygnal/sse-core';

// Get all registered pages as a routes object
const routes = getAllPages(); // { '/': HomePage, '/blog/*': BlogPage, ... }

// Get registry statistics
const stats = getRegistryStats();
console.log(`${stats.pages} pages, ${stats.components} components`);

// Get a specific component constructor
const ComponentClass = getComponent('my-component');
```

### Component Management

Track and retrieve component instances across your application:

```typescript
import { ComponentManager } from '@sygnal/sse-core';

const manager = new ComponentManager();

// Register component instances
manager.registerComponent('navigation', navInstance);
manager.registerComponent('navigation', mobileNavInstance);

// Retrieve all instances of a type
const navComponents = manager.getComponentsByType<Navigation>('navigation');

// Get all registered component types
const types = manager.getComponentTypes(); // ['navigation', 'slider', 'modal']

// Get total count
const count = manager.getTotalCount();

// Clear all instances
manager.clear();
```

### Component Initialization

Automatically discover and initialize components in the DOM:

```typescript
import { initializeComponents } from '@sygnal/sse-core';

// Basic initialization (uses defaults)
initializeComponents();

// Advanced initialization with options
initializeComponents({
  selector: '[data-component]',           // Custom selector
  attributeName: 'data-component',        // Custom attribute name
  componentManager: customManager,        // Custom ComponentManager instance
  logSummary: true,                       // Log initialization summary

  // Custom callbacks
  onComponentInit: (name, instance, element) => {
    console.log(`Initialized ${name} on`, element);
  },

  onError: (error, componentName, element) => {
    console.error(`Error in ${componentName}:`, error);
  },

  onUnknownComponent: (componentName, element) => {
    console.warn(`Unknown component: ${componentName}`);
  }
});
```

**HTML Usage:**

```html
<div data-component="my-component">
  <!-- Component content -->
</div>

<nav data-component="navigation">
  <!-- Navigation content -->
</nav>
```

### Page Utilities

Static utility methods for page-level operations:

```javascript
import { Page } from '@sygnal/sse-core';

// Load scripts
Page.Head.loadScript('https://example.com/script.js');
Page.Body.loadScript('https://example.com/body-script.js');

// Load CSS
Page.loadCSS('https://example.com/styles.css');
Page.loadEngineCSS('custom-styles');

// Modify page title
Page.prependToTitle('New Prefix - ');

// DOM traversal
const ancestor = Page.findAncestorWithAttribute(element, 'data-component');
const value = Page.getAncestorAttributeValue(element, 'data-id');

// Unit conversion
const pixels = Page.convertToPixels('2rem'); // Converts rem/em/vh/vw/% to pixels

// Script detection
const scriptUrl = Page.getCurrentScriptUrl();
const baseUrl = Page.getCurrentScriptBaseUrl();

// Fetch utilities
const headers = await Page.getResponseHeaders('https://api.example.com');
```

### Route Dispatcher

Organize your code by page or route with automatic execution. Works seamlessly with the decorator system:

```typescript
import { RouteDispatcher, getAllPages } from '@sygnal/sse-core';
import { Site } from './site';

// Use with decorator-registered pages
const dispatcher = new RouteDispatcher(Site);
dispatcher.routes = getAllPages(); // Auto-populated from @page decorators

// Setup and execute the matching route
dispatcher.setupRoute();
dispatcher.execRoute();
```

**Manual Route Registration (alternative):**

```typescript
import { RouteDispatcher } from '@sygnal/sse-core';

// Define a route module
class ProductsPage {
  constructor() {
    console.log('Products page module created');
  }

  setup() {
    // Setup code runs once when route is matched
    console.log('Setting up products page');
  }

  exec() {
    // Exec runs after setup
    console.log('Executing products page logic');
  }
}

// Create dispatcher and register routes manually
const dispatcher = new RouteDispatcher();
dispatcher.routes = {
  '/': HomePage,
  '/products': ProductsPage,
  '/products/*': ProductDetailsPage, // Wildcard support
  '/blog/*': BlogPostPage
};

// Execute the matching route
dispatcher.exec();
```

### Script Element

Advanced script loading with configuration options:

```javascript
import { ScriptElement, ScriptConfig } from '@sygnal/sse-core';

const config = new ScriptConfig({
  type: 'module',
  async: true,
  id: 'my-script',
  customAttributes: { 'data-version': '1.0' }
});

const script = new ScriptElement('https://example.com/module.js', config);
script.appendTo(document.head);
```

### Debug Utilities

Conditional logging with persistence:

```javascript
import { Debug } from '@sygnal/sse-core';

// Enable debug mode
Debug.enabled = true;

// Enable persistent debugging (survives page reloads)
Debug.persistentDebug = true;

// Log messages (only when debug is enabled)
Debug.debug('This is a debug message', { data: 'example' });

// Group related logs
Debug.group('API Calls');
Debug.debug('Fetching user data...');
Debug.debug('Response received');
Debug.groupEnd();
```

### Request Utilities

Extract query parameters from URLs:

```javascript
import { Request } from '@sygnal/sse-core';

// Get query parameter from current URL
const userId = Request.getQueryParam('user_id');

// Get parameter from specific URL
const category = Request.getQueryParam('category', 'https://example.com?category=books');
```

### Initialization

Initialize the SSE engine with base URL configuration:

```javascript
import { initSSE } from '@sygnal/sse-core';

// Initialize with CDN base URL
initSSE('https://cdn.jsdelivr.net/npm/@sygnal/sse-core@0.3.0');

// Access globally
console.log(window.SSE.baseUrl);
```

## 🔧 Engine Modes

SSE supports two execution modes that can be toggled for development:

### Production Mode (Default)
- Loads optimized, production-ready scripts
- Standard execution flow

### Development Mode
- Activated via `?engine.mode=dev` query parameter
- Loads scripts from `dev-src` attributes instead of `src`
- Loads development-specific CSS from `dev-href` attributes
- Persists mode selection in cookies

**Usage:**
```html
<!-- Script loads from src in prod, dev-src in dev mode -->
<script src="https://cdn.example.com/prod.js"
        dev-src="http://localhost:3000/dev.js"></script>

<!-- CSS loads from href in prod, dev-href in dev mode -->
<link rel="stylesheet"
      href="https://cdn.example.com/styles.css"
      dev-href="http://localhost:3000/styles.css">
```

Toggle modes via query parameter:
- Production: `?engine.mode=prod`
- Development: `?engine.mode=dev`

## 🏗️ Project Structure

```
sse-core/
├── src/
│   ├── index.ts              # Main entry point and exports
│   ├── init.ts               # SSE initialization
│   ├── page.ts               # Page utility class
│   ├── page-base.ts          # Base class for pages with context
│   ├── component-base.ts     # Base class for components with context
│   ├── routeDispatcher.ts    # Route-based module execution
│   ├── registry.ts           # Decorator system (@page, @component)
│   ├── component-manager.ts  # Component instance tracking
│   ├── component-init.ts     # Component initialization logic
│   ├── types.ts              # Framework type definitions
│   ├── script.ts             # ScriptElement and configuration
│   ├── debug.ts              # Debug utilities
│   └── request.ts            # Request utilities
├── dist/                     # Compiled output (JS + .d.ts)
├── package.json
├── tsconfig.json
├── LICENSE                   # MIT License
├── README.md
└── AGENTS.md                 # Architecture documentation for AI agents
```

## 🛠️ Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

### TypeScript Configuration

The project compiles to ES6 modules with the following settings:
- **Target:** ES6
- **Module:** ES6
- **Source Maps:** Enabled
- **Strict Mode:** Enabled
- **Experimental Decorators:** Enabled (required for `@page` and `@component`)
- **Output:** `dist/`

**Note:** Projects using SSE must enable experimental decorators in their `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 📖 Documentation

For complete documentation, examples, and guides, visit:

**[https://engine.sygnal.com](https://engine.sygnal.com)**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Michael Wells**
- Email: mike@sygnal.com
- Website: [https://www.sygnal.com](https://www.sygnal.com)
- GitHub: [@sygnaltech](https://github.com/sygnaltech)

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/@sygnal/sse-core)
- [GitHub Repository](https://github.com/sygnaltech/sse-core)
- [SSE Template](https://github.com/sygnaltech/sse-template)
- [Documentation](https://engine.sygnal.com)
- [Issue Tracker](https://github.com/sygnaltech/sse-core/issues)

---

**Built with ❤️ by [Sygnal Technology Group](https://www.sygnal.com)**
