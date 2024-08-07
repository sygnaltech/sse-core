

// Determine Webflow breakpoint?

import { ScriptConfig, ScriptElement } from "./script";

export class Page {

    static Head = class {


        /**
         * Appends the specified script to the page &lt;head&gt;.
         * @param src The src url of the script to load.
         * @param config Configuration options for the script element.
         */
        static loadScript(src: string, config?: ScriptConfig): void {

            const script: ScriptElement = new ScriptElement(src, config);
            script.appendTo('head');

            // const script = document.createElement('script');
            // script.src = src;
            // document.body.appendChild(script);
        }

    };

    static Body = class {

        /**
         * Appends the specified script to the page &lt;body&gt;.
         * @param src The src url of the script to load.
         * @param config Configuration options for the script element.
         */
        static loadScript(src: string, config?: ScriptConfig): void {

            const script: ScriptElement = new ScriptElement(src, config);
            script.appendTo('body');

            // const script = document.createElement('script');
            // script.src = src;
            // document.body.appendChild(script);
        }

    };


    
    
        // // Add a new async script to the page
        // // at the end of the body
        // static loadScript(url: string): void {
        //     const script = document.createElement('script');
        //     script.src = url;
        // //    script.async = true;
        //     document.body.appendChild(script);
        // }
    
        // Add a new CSS file to the page
        static loadCSS(url: string): void {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            document.head.appendChild(link);
        }
    
        // Add a new Engine CSS file to the page
        // Expected to be in the /dist/css/ dir 
        static loadEngineCSS(cssFileName: string): void {
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
        static loadStyle(css: string): void {
            const style = document.createElement('style');
        //    link.rel = 'stylesheet';
        //    link.href = url;
            style.innerText = css;
            document.head.appendChild(style);
        }
    
        // Replace an existing script source
        static replaceScriptSource(element: HTMLScriptElement, newSrc: string): void {
            element.src = newSrc;
        }
    
        // Replace an existing CSS source
        static replaceCSSLink(element: HTMLLinkElement, newHref: string): void {
            element.href = newHref;
        }
    
        // Function to prepend text to the document title in development mode
        static prependToTitle(text: string): void {
            document.title = `${text}${document.title}`;
        }
    
        // Function to get the current script URL
        static getCurrentScriptUrl(): string | null {
            // Check if document.currentScript is supported
            if (document.currentScript) {
                // Cast to HTMLScriptElement and get the src attribute
                const currentScript = document.currentScript as HTMLScriptElement;
                return currentScript.src;
            }
            // For browsers that do not support document.currentScript
            console.error("document.currentScript is not supported in this browser.");
            return null;
        }
    
        static getCurrentScriptBaseUrl(): string | undefined {
            // Get the URL of the currently executing script
            const currentScript = document.currentScript as HTMLScriptElement;
            if (currentScript) {
                const scriptURL = new URL(currentScript.src);
                const origin = scriptURL.origin;
                const path = scriptURL.pathname.substring(0, scriptURL.pathname.lastIndexOf('/'));
    
                const baseURL = `${origin}${path}`;
                return baseURL; 
            } else {
                console.error('Unable to determine the currently executing script.');
            }

            return undefined; 
        }

    
        static findAncestorWithAttribute(element: HTMLElement, attributeName: string): HTMLElement | null {
            let currentElement: HTMLElement | null = element;
    
            while (currentElement) {
                if (currentElement.hasAttribute(attributeName)) {
                    return currentElement;
                }
                currentElement = currentElement.parentElement;
            }
    
            return null;
        }
    
        static getAncestorAttributeValue(element: HTMLElement, attributeName: string): string | null {
            let currentElement: HTMLElement | null = element;
    
            while (currentElement) {
                if (currentElement.hasAttribute(attributeName)) {
                    return currentElement.getAttribute(attributeName);
                }
                currentElement = currentElement.parentElement;
            }
    
            return null;
        }
    
        static hasAncestorWithAttribute(element: HTMLElement, attributeName: string): boolean {
            return this.findAncestorWithAttribute(element, attributeName) !== null;
        }
    
        static convertToPixels(value: string, contextElement: HTMLElement = document.documentElement): number {
            // Parse the numeric value and unit, including negative values
            const match = value.match(/^(-?\d+\.?\d*)(rem|em|px|vh|vw|%)$/);
            if (!match) throw new Error('Invalid value format');
    
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
    
        static async getResponseHeader(headerName: string, url: string | undefined = undefined): Promise<string | undefined> {
    
            const headers: Headers | undefined = await this.getResponseHeaders(url);
    
            if(!headers)
                return undefined;
    
            if(!headers.has(headerName)) 
                return undefined;
    
            return headers.get(headerName) || undefined;
    
        }
    
        // Function to check if the reverse proxy header is present
        static async getResponseHeaders(url: string | undefined = undefined): Promise<Headers | undefined> {
            try {
    
                if(!url) {
                    url = window.location.href
                }
    
                const response = await fetch(url, {
                    method: 'HEAD', // Only fetch headers
                });
    
                return response.headers;
    
            } catch (error) {
                console.error('Error checking reverse proxy header:', error);
            }
    
            return undefined;
        }
    
    }
    
    
    