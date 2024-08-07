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
import { ScriptElement } from "./script";
export class Page {
    // // Add a new async script to the page
    // // at the end of the body
    // static loadScript(url: string): void {
    //     const script = document.createElement('script');
    //     script.src = url;
    // //    script.async = true;
    //     document.body.appendChild(script);
    // }
    // Add a new CSS file to the page
    static loadCSS(url) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    }
    // Add a new Engine CSS file to the page
    // Expected to be in the /dist/css/ dir 
    static loadEngineCSS(cssFileName) {
        // Get the URL of the currently executing script
        let libPath = window.SSE.baseUrl;
        // const currentScript = document.currentScript as HTMLScriptElement;
        // if (currentScript) {
        // const scriptURL = new URL(currentScript.src);
        // const origin = scriptURL.origin;
        // const path = scriptURL.pathname.substring(0, scriptURL.pathname.lastIndexOf('/'));
        const cssURL = `${libPath}/css/${cssFileName}`;
        this.loadCSS(cssURL);
        // } else {
        //     console.error('Unable to determine the currently executing script.');
        // }
    }
    // Add a new Style element to the page
    static loadStyle(css) {
        const style = document.createElement('style');
        //    link.rel = 'stylesheet';
        //    link.href = url;
        style.innerText = css;
        document.head.appendChild(style);
    }
    // Replace an existing script source
    static replaceScriptSource(element, newSrc) {
        element.src = newSrc;
    }
    // Replace an existing CSS source
    static replaceCSSLink(element, newHref) {
        element.href = newHref;
    }
    // Function to prepend text to the document title in development mode
    static prependToTitle(text) {
        document.title = `${text}${document.title}`;
    }
    // Function to get the current script URL
    static getCurrentScriptUrl() {
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
    static getCurrentScriptBaseUrl() {
        // Get the URL of the currently executing script
        const currentScript = document.currentScript;
        if (currentScript) {
            const scriptURL = new URL(currentScript.src);
            const origin = scriptURL.origin;
            const path = scriptURL.pathname.substring(0, scriptURL.pathname.lastIndexOf('/'));
            const baseURL = `${origin}${path}`;
            return baseURL;
        }
        else {
            console.error('Unable to determine the currently executing script.');
        }
        return undefined;
    }
    static findAncestorWithAttribute(element, attributeName) {
        let currentElement = element;
        while (currentElement) {
            if (currentElement.hasAttribute(attributeName)) {
                return currentElement;
            }
            currentElement = currentElement.parentElement;
        }
        return null;
    }
    static getAncestorAttributeValue(element, attributeName) {
        let currentElement = element;
        while (currentElement) {
            if (currentElement.hasAttribute(attributeName)) {
                return currentElement.getAttribute(attributeName);
            }
            currentElement = currentElement.parentElement;
        }
        return null;
    }
    static hasAncestorWithAttribute(element, attributeName) {
        return this.findAncestorWithAttribute(element, attributeName) !== null;
    }
    static convertToPixels(value, contextElement = document.documentElement) {
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
    static getResponseHeader(headerName, url = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.getResponseHeaders(url);
            if (!headers)
                return undefined;
            if (!headers.has(headerName))
                return undefined;
            return headers.get(headerName) || undefined;
        });
    }
    // Function to check if the reverse proxy header is present
    static getResponseHeaders(url = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
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
}
Page.Head = class {
    /**
     * Appends the specified script to the page &lt;head&gt;.
     * @param src The src url of the script to load.
     * @param config Configuration options for the script element.
     */
    static loadScript(src, config) {
        const script = new ScriptElement(src, config);
        script.appendTo('head');
        // const script = document.createElement('script');
        // script.src = src;
        // document.body.appendChild(script);
    }
};
Page.Body = class {
    /**
     * Appends the specified script to the page &lt;body&gt;.
     * @param src The src url of the script to load.
     * @param config Configuration options for the script element.
     */
    static loadScript(src, config) {
        const script = new ScriptElement(src, config);
        script.appendTo('body');
        // const script = document.createElement('script');
        // script.src = src;
        // document.body.appendChild(script);
    }
};
//# sourceMappingURL=page.js.map