interface ScriptConfig {
    /** The type of the script, e.g., "text/javascript". */
    type?: string;
    /** The id of the script. */
    id?: string;
    /** Whether the script should be loaded asynchronously. */
    async?: boolean;
    /** Whether the script should be deferred. */
    defer?: boolean;
    /** Custom attributes to add to the script element. */
    customAttributes?: {
        [key: string]: string;
    };
}
declare class ScriptElement extends HTMLScriptElement {
    constructor(src: string, config?: ScriptConfig);
    appendTo(target?: 'head' | 'body'): void;
    prependTo(target?: 'head' | 'body'): void;
}
export { ScriptElement, ScriptConfig };
