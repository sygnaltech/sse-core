/*
 * Sygnal
 * Route Dispatcher
 *
 */
export class RouteDispatcher {
    constructor(SiteClass) {
        this._SiteClass = SiteClass;
    }
    matchRoute(path) {
        for (const route in this.routes) {
            if (route.endsWith('*')) {
                // If the route ends with *, treat it as a wildcard
                const baseRoute = route.slice(0, -1); // Remove the * from the end
                if (path.startsWith(baseRoute)) {
                    return this.routes[route];
                }
            }
            else if (route === path) {
                // Exact match
                return this.routes[route];
            }
        }
        return null; // No matching route found
    }
    setupRoute() {
        // Pre-init site-level 
        const site = new this._SiteClass();
        site.setup();
        //        (new Site().setup());
        // Pre-init route-level
        const path = window.location.pathname;
        const HandlerClass = this.matchRoute(path);
        if (HandlerClass) {
            const handlerInstance = new HandlerClass();
            handlerInstance.setup();
        }
        else {
            //            console.log('No specific function for this path.');
        }
    }
    execRoute() {
        // Init site-level
        const site = new this._SiteClass();
        site.exec();
        //        (new Site().exec());
        // Init route-level
        const path = window.location.pathname;
        const HandlerClass = this.matchRoute(path);
        if (HandlerClass) {
            const handlerInstance = new HandlerClass();
            handlerInstance.exec();
        }
        else {
            //            console.log('No specific function for this path.');
        }
    }
}
//# sourceMappingURL=routeDispatcher.js.map