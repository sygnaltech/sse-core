"use strict";
// Determine Webflow breakpoint?
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryParam = getQueryParam;
exports.loadScript = loadScript;
exports.loadCSS = loadCSS;
exports.loadEngineCSS = loadEngineCSS;
exports.loadStyle = loadStyle;
exports.replaceScriptSource = replaceScriptSource;
exports.replaceCSSLink = replaceCSSLink;
exports.prependToTitle = prependToTitle;
exports.getCurrentScriptUrl = getCurrentScriptUrl;
exports.findAncestorWithAttribute = findAncestorWithAttribute;
exports.getAncestorAttributeValue = getAncestorAttributeValue;
exports.hasAncestorWithAttribute = hasAncestorWithAttribute;
exports.convertToPixels = convertToPixels;
// Utility function to get a query parameter value by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
// Add a new async script to the page
// at the end of the body
function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    //    script.async = true;
    document.body.appendChild(script);
}
// Add a new CSS file to the page
function loadCSS(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}
// Add a new Engine CSS file to the page
// Expected to be in the /dist/css/ dir 
function loadEngineCSS(cssFileName) {
    // Get the URL of the currently executing script
    const currentScript = document.currentScript;
    if (currentScript) {
        const scriptURL = new URL(currentScript.src);
        const origin = scriptURL.origin;
        const path = scriptURL.pathname.substring(0, scriptURL.pathname.lastIndexOf('/'));
        const cssURL = `${origin}${path}/css/${cssFileName}`;
        loadCSS(cssURL);
    }
    else {
        console.error('Unable to determine the currently executing script.');
    }
}
// Add a new Style element to the page
function loadStyle(css) {
    const style = document.createElement('style');
    //    link.rel = 'stylesheet';
    //    link.href = url;
    style.innerText = css;
    document.head.appendChild(style);
}
// Replace an existing script source
function replaceScriptSource(element, newSrc) {
    element.src = newSrc;
}
// Replace an existing CSS source
function replaceCSSLink(element, newHref) {
    element.href = newHref;
}
// Function to prepend text to the document title in development mode
function prependToTitle(text) {
    document.title = `${text}${document.title}`;
}
// Function to get the current script URL
function getCurrentScriptUrl() {
    // Check if document.currentScript is supported
    if (document.currentScript) {
        // Cast to HTMLScriptElement and get the src attribute
        const currentScript = document.currentScript;
        return currentScript.src;
    }
    // For browsers that do not support document.currentScript
    console.error("document.currentScript is not supported in this browser.");
    return null;
}
function findAncestorWithAttribute(element, attributeName) {
    let currentElement = element;
    while (currentElement) {
        if (currentElement.hasAttribute(attributeName)) {
            return currentElement;
        }
        currentElement = currentElement.parentElement;
    }
    return null;
}
function getAncestorAttributeValue(element, attributeName) {
    let currentElement = element;
    while (currentElement) {
        if (currentElement.hasAttribute(attributeName)) {
            return currentElement.getAttribute(attributeName);
        }
        currentElement = currentElement.parentElement;
    }
    return null;
}
function hasAncestorWithAttribute(element, attributeName) {
    return findAncestorWithAttribute(element, attributeName) !== null;
}
function convertToPixels(value, contextElement = document.documentElement) {
    // Parse the numeric value and unit, including negative values
    const match = value.match(/^(-?\d+\.?\d*)(rem|em|px|vh|vw|%)$/);
    if (!match)
        throw new Error('Invalid value format');
    const [, amountStr, unit] = match;
    const amount = parseFloat(amountStr);
    // Convert based on the unit
    switch (unit) {
        case 'px':
            return amount;
        case 'rem':
            return amount * parseFloat(getComputedStyle(document.documentElement).fontSize);
        case 'em':
            // For 'em', it's relative to the font-size of the context element.
            return amount * parseFloat(getComputedStyle(contextElement).fontSize);
        case 'vh':
            return amount * window.innerHeight / 100;
        case 'vw':
            return amount * window.innerWidth / 100;
        case '%':
            // For %, it's relative to the parent element's size. This can be tricky as it depends on the property (width, height, font-size, etc.).
            // In this example, we'll use it relative to the width of the context element, but you might need to adjust based on your specific use case.
            return amount * contextElement.clientWidth / 100;
        default:
            throw new Error('Unsupported unit');
    }
}
/*
// Example usage:
const pixelValue = convertToPixels("10vh");
console.log(pixelValue);
*/
function getResponseHeader(headerName_1) {
    return __awaiter(this, arguments, void 0, function* (headerName, url = undefined) {
        const headers = yield getResponseHeaders(url);
        if (!headers)
            return undefined;
        if (!headers.has(headerName))
            return undefined;
        return headers.get(headerName) || undefined;
    });
}
// Function to check if the reverse proxy header is present
function getResponseHeaders() {
    return __awaiter(this, arguments, void 0, function* (url = undefined) {
        try {
            if (!url) {
                url = window.location.href;
            }
            const response = yield fetch(url, {
                method: 'HEAD', // Only fetch headers
            });
            return response.headers;
        }
        catch (error) {
            console.error('Error checking reverse proxy header:', error);
        }
        return undefined;
    });
}
