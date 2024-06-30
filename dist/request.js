export class Request {
    // Utility function to get a query parameter value by name
    static getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
}
//# sourceMappingURL=request.js.map