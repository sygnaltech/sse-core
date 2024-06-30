import { ScriptConfig } from "./script";
export declare class Page {
    static Head: {
        new (): {};
        /**
         * Appends the specified script to the page &lt;head&gt;.
         * @param src The src url of the script to load.
         * @param config Configuration options for the script element.
         */
        loadScript(src: string, config?: ScriptConfig): void;
    };
    static Body: {
        new (): {};
        /**
         * Appends the specified script to the page &lt;body&gt;.
         * @param src The src url of the script to load.
         * @param config Configuration options for the script element.
         */
        loadScript(src: string, config?: ScriptConfig): void;
    };
    static loadCSS(url: string): void;
    static loadEngineCSS(cssFileName: string): void;
    static loadStyle(css: string): void;
    static replaceScriptSource(element: HTMLScriptElement, newSrc: string): void;
    static replaceCSSLink(element: HTMLLinkElement, newHref: string): void;
    static prependToTitle(text: string): void;
    static getCurrentScriptUrl(): string | null;
    static getCurrentScriptBaseUrl(): string | undefined;
    static findAncestorWithAttribute(element: HTMLElement, attributeName: string): HTMLElement | null;
    static getAncestorAttributeValue(element: HTMLElement, attributeName: string): string | null;
    static hasAncestorWithAttribute(element: HTMLElement, attributeName: string): boolean;
    static convertToPixels(value: string, contextElement?: HTMLElement): number;
    static getResponseHeader(headerName: string, url?: string | undefined): Promise<string | undefined>;
    static getResponseHeaders(url?: string | undefined): Promise<Headers | undefined>;
}
