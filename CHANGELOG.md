# Changelog

## [2.1.0] - 2025-11-18
### Added - FIX System (Functional Interactions)
- **FIX Core Infrastructure** - Complete event-driven interaction system
  - `TriggerBase`, `ActionBase`, `EventBase` - Base classes for FIX components
  - `FIXRegistry` - Central registry for triggers and actions
  - `EventRegistry` - Event management and execution
  - `@trigger()` and `@action()` decorators for auto-registration
- **Standard Triggers**
  - `trigger:click` - Click event trigger (TriggerClick)
- **Standard Actions**
  - `action:click` - Click action (ActionClick)
- **Standard Events**
  - `EventDefault` - Parallel execution (fire-and-forget)
  - `EventSequential` - Sequential execution with async/await support
- **FIX Utilities**
  - `initializeFIX()` - Initialize FIX system and scan DOM
  - `registerProgrammaticAction()` - Register actions without DOM elements
  - `FIXDebug` - Debug utilities for inspecting triggers, actions, events, and stats

### Changed
- Added `moduleResolution: "node"` to tsconfig.json for better module resolution
- Enhanced TypeScript configuration to support FIX decorator system
- Updated main exports to include all FIX components
- Auto-import standard triggers and actions when sse-core is imported

### Migration Notes
- FIX is fully backward compatible - existing SSE-only projects continue to work
- To use FIX in projects:
  1. Import FIX functions: `import { initializeFIX, FIXDebug, FIXRegistry, registerProgrammaticAction } from '@sygnal/sse-core'`
  2. Call `initializeFIX()` after `initializeComponents()` in your initialization code
  3. Standard triggers/actions are automatically available
  4. Create custom actions by extending `ActionBase` and using `@action()` decorator
- See sse-template `docs/02-MIGRATION-FIX.md` for detailed migration guide

## [0.3.0] - 2025-10-27
### Added
- **Decorator System** - `@page` and `@component` decorators for auto-registration
- **Component Manager** - Track and retrieve component instances across application
- **Component Initialization** - Automatic DOM-based component discovery with extensible options
- **Registry Utilities** - `getAllPages()`, `getRegistryStats()`, `getComponent()` functions
- **Framework Types** - Centralized type definitions (ComponentConstructor, PageConstructor, etc.)
- **AGENTS.md** - Architecture documentation for AI agents

### Changed
- Enabled experimental decorators in TypeScript configuration
- Enhanced RouteDispatcher to work with decorator-registered pages
- Separated framework types from template-specific types

### Migration Notes
- Projects using SSE must enable `experimentalDecorators` in tsconfig.json
- Import decorators from `@sygnal/sse-core`: `import { page, component } from '@sygnal/sse-core'`
- Import ComponentManager and initialization utilities from core library

## [0.2.0] - 2024-06-30
### Added
- ScriptElement class
- Page.Head.loadScript
- Page.Body.loadScript
- Script attributes like ID
- Script prepend/append options

### Changed
- Renamed IRouteHandler to IModule



## [0.1.1] - 2024-06-29
### Added
- Global SSE lib path

### Changed
- Cleaned up lib initialization

### Fixed
- Resolved an edge case on the Site.exec() code 

## [0.1.0] - 2024-06-28
### Initial release
