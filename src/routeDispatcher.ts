
/* SPDX-License-Identifier: MIT
 * Copyright (C) 2024 Sygnal Technology Group
 */

/*
 * Sygnal
 * Route Dispatcher
 * 
 */

//import { Site } from "../site";


 

export interface IModule {

    setup(): void;
    
    exec(): void; 
  
}

  
type RouteHandler = () => void;
type RouteHandlerClass = { new (): IModule };


export interface Routes {
    [path: string]: RouteHandlerClass;
}

export class RouteDispatcher {

    routes!: Routes;
    _SiteClass: RouteHandlerClass;

    // Store instances to preserve state between setup() and exec()
    private siteInstance: IModule | null = null;
    private pageInstance: IModule | null = null;

    constructor(SiteClass: RouteHandlerClass) {
        this._SiteClass = SiteClass;
    }

    matchRoute(path: string): RouteHandlerClass | null {
        for (const route in this.routes) {
            if (route.endsWith('*')) {
                // If the route ends with *, treat it as a wildcard
                const baseRoute = route.slice(0, -1); // Remove the * from the end
                if (path.startsWith(baseRoute)) {
                    return this.routes[route];
                }
            } else if (route === path) {
                // Exact match
                return this.routes[route];
            }
        }
        return null; // No matching route found
    }
    
    setupRoute() {

        // Create and store site instance
        this.siteInstance = new this._SiteClass();
        this.siteInstance.setup();

        // Create and store page instance
        const path = window.location.pathname;
        const HandlerClass = this.matchRoute(path);
        if (HandlerClass) {
            this.pageInstance = new HandlerClass();
            this.pageInstance.setup();
        }
    }

    execRoute() {

        // Reuse stored site instance
        if (this.siteInstance) {
            this.siteInstance.exec();
        }

        // Reuse stored page instance
        if (this.pageInstance) {
            this.pageInstance.exec();
        }
    }
    
}