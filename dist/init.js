"use strict";
/*
 * Loader
 * Main entry point
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_cookie_1 = __importDefault(require("js-cookie"));
const core_1 = require("./core");
function initEngine() {
    console.log("Init engine.");
    // Process any engine mode commands 
    const engineModeCommand = (0, core_1.getQueryParam)('engine.mode');
    switch (engineModeCommand) {
        case 'dev':
            js_cookie_1.default.set('siteEngineMode', 'dev', { expires: 7 });
            break;
        case 'prod':
            js_cookie_1.default.remove('siteEngineMode');
            break;
        default:
            // Do nothing, keep existing engine state 
            break;
    }
    // Get current engine mode
    const engineMode = js_cookie_1.default.get('siteEngineMode') || "prod";
    /**
     * ENGINE MODE
     */
    switch (engineMode) {
        case 'dev':
            invokeDebugMode();
            break;
        case 'prod':
        default:
            const scriptUrl = (0, core_1.getCurrentScriptUrl)();
            if (scriptUrl) {
                const engineScriptUrl = scriptUrl.replace('init.js', 'index.js');
                (0, core_1.loadScript)(engineScriptUrl);
                break;
            }
    }
}
initEngine();
function invokeDebugMode() {
    // Prepend to the document title
    (0, core_1.prependToTitle)("🅳🅴🆅 ➜ ");
    // Handle scripts
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        const devSrc = script.getAttribute('dev-src');
        if (devSrc) {
            (0, core_1.loadScript)(devSrc);
        }
    });
    // Handle CSS
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        const devHref = link.getAttribute('dev-src');
        if (devHref) {
            (0, core_1.replaceCSSLink)(link, devHref);
        }
    });
    // // Load additional scripts and CSS based on the mode
    // if (debugMode) {
    //     loadScript('https://cdn.jsdelivr.net/your-library/debug/library.js');
    //     loadCSS('https://cdn.jsdelivr.net/your-library/debug/styles.css');
    // } else {
    //     loadScript('https://cdn.jsdelivr.net/your-library/prod/library.js');
    //     loadCSS('https://cdn.jsdelivr.net/your-library/prod/styles.css');
    // }
}
//});
