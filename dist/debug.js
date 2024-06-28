"use strict";
/*
 * Sygnal Debug
 *
 * Sygnal Technology Group
 * http://sygnal.com
 *
 * Debug Utilities
 *
 * Stack is;
 * r-proxy
 * localstorage
 * chrome tool
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
const DEFAULT_APP_NAME = 'Site';
class Debug {
    // Get or set WFU persistent debug state
    // which is stored in localStorage. 
    get persistentDebug() {
        return Boolean(localStorage.getItem(this._localStorageDebugFlag));
    }
    set persistentDebug(active) {
        if (active) {
            localStorage.setItem(this._localStorageDebugFlag, "true");
            console.debug(`${this._appName} debug enabled (persistent).`);
        }
        else {
            localStorage.removeItem(this._localStorageDebugFlag);
            console.debug(`${this._appName} debug disabled (persistent).`);
        }
    }
    // Enable/disable debugging 
    get enabled() {
        // localStorage is checked for a debug flag, to enable remote debug enabling 
        // Any non-null string value will resolve to TRUE here, including the string "false" 
        var wfuDebugValue = Boolean(localStorage.getItem(this._localStorageDebugFlag));
        // Or this with the current debug state
        // If either is enabled, debugging is on 
        wfuDebugValue = wfuDebugValue || this._enabled;
        return wfuDebugValue;
    }
    set enabled(active) {
        this._enabled = active;
    }
    // Initialize
    constructor(label, appName = DEFAULT_APP_NAME) {
        this._localStorageDebugFlag = 'debug-mode';
        this._appName = DEFAULT_APP_NAME;
        this._enabled = false;
        // Save the label, for console logging
        this._appName = appName;
        this._label = label;
    }
    // Start a console log group
    group(name) {
        if (this.enabled)
            console.group(name);
    }
    // End a console log group
    groupEnd() {
        if (this.enabled)
            console.groupEnd();
    }
    // Log debug data to the console
    debug(...args) {
        if (this.enabled)
            // Unlimited arguments in a JavaScript function
            // https://stackoverflow.com/a/6396066
            console.debug(this._label, ...args);
    }
}
exports.Debug = Debug;
