import { Page } from './page';
export * from './page';
export * from './debug';
export * from './init';
export * from './routeDispatcher';
export function initSSE() {
    // Ensure global SSE object is initialized
    if (!window.SSE) {
        window.SSE = {};
    }
    // Save script base URL
    // for easy inclusion of CSS and libs later
    window.SSE.baseUrl = Page.getCurrentScriptBaseUrl();
}
//# sourceMappingURL=index.js.map