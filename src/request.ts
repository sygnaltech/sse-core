

export class Request {

    // Utility function to get a query parameter value by name
    static getQueryParam(name: string): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    
}