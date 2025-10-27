# Changelog

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
- Import decorators from `@sygnal/sse`: `import { page, component } from '@sygnal/sse'`
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
