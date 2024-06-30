class ScriptElement extends HTMLScriptElement {
    constructor(src, config) {
        super();
        this.src = src;
        if (config) {
            if (config.type) {
                this.type = config.type;
            }
            if (config.id) {
                this.id = config.id;
            }
            if (config.async !== undefined) {
                this.async = config.async;
            }
            if (config.defer !== undefined) {
                this.defer = config.defer;
            }
            if (config.customAttributes) {
                for (const [key, value] of Object.entries(config.customAttributes)) {
                    this.setAttribute(key, value);
                }
            }
        }
    }
    // Method to append the script to the document
    appendTo(target = 'body') {
        const parent = target === 'head' ? document.head : document.body;
        parent.appendChild(this);
    }
    prependTo(target = 'body') {
        const parent = target === 'head' ? document.head : document.body;
        parent.prepend(this);
    }
}
// Define the custom element if necessary
customElements.define('custom-script', ScriptElement, { extends: 'script' });
export { ScriptElement };
//# sourceMappingURL=script.js.map