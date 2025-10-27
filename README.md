# Sygnal Site Engine (SSE) - Core Library

[![npm version](https://badge.fury.io/js/%40sygnal%2Fsse.svg)](https://www.npmjs.com/package/@sygnal/sse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**@sygnal/sse** is the core utility library for building dynamic, enhanced Webflow projects using the Sygnal Site Engine (SSE) framework. It provides client-side JavaScript utilities for script loading, route dispatching, debugging, and DOM manipulation.

## 🚀 Quick Start

### Installation

```bash
npm install @sygnal/sse
```

### Basic Usage

```javascript
import { initSSE, Page, Debug } from '@sygnal/sse';

// Initialize SSE with your base URL
initSSE('https://cdn.jsdelivr.net/npm/@sygnal/sse@latest');

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

- **Dynamic Script & CSS Loading** - Load external resources programmatically
- **Route-Based Module Execution** - Organize code by page/route with wildcard support
- **Development/Production Modes** - Seamlessly switch between dev and prod environments
- **Debug Utilities** - Conditional logging with localStorage persistence
- **DOM Utilities** - Helper functions for element manipulation and traversal
- **Request Utilities** - Query parameter extraction and response header access
- **TypeScript Support** - Fully typed with comprehensive type definitions

## 📚 Core Modules

### Page Utilities

Static utility methods for page-level operations:

```javascript
import { Page } from '@sygnal/sse';

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

Organize your code by page or route with automatic execution:

```javascript
import { RouteDispatcher } from '@sygnal/sse';

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

// Create dispatcher and register routes
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
import { ScriptElement, ScriptConfig } from '@sygnal/sse';

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
import { Debug } from '@sygnal/sse';

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
import { Request } from '@sygnal/sse';

// Get query parameter from current URL
const userId = Request.getQueryParam('user_id');

// Get parameter from specific URL
const category = Request.getQueryParam('category', 'https://example.com?category=books');
```

### Initialization

Initialize the SSE engine with base URL configuration:

```javascript
import { initSSE } from '@sygnal/sse';

// Initialize with CDN base URL
initSSE('https://cdn.jsdelivr.net/npm/@sygnal/sse@0.3.0');

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
│   ├── routeDispatcher.ts    # Route-based module execution
│   ├── script.ts             # ScriptElement and configuration
│   ├── debug.ts              # Debug utilities
│   └── request.ts            # Request utilities
├── dist/                     # Compiled output (JS + .d.ts)
├── package.json
├── tsconfig.json
├── LICENSE                   # MIT License
└── README.md
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
- **Output:** `dist/`

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

- [npm Package](https://www.npmjs.com/package/@sygnal/sse)
- [GitHub Repository](https://github.com/sygnaltech/sse-core)
- [SSE Template](https://github.com/sygnaltech/sse-template)
- [Documentation](https://engine.sygnal.com)
- [Issue Tracker](https://github.com/sygnaltech/sse-core/issues)

---

**Built with ❤️ by [Sygnal Technology Group](https://www.sygnal.com)**
