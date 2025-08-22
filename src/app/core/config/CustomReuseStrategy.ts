import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
    shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
        // Add your logic here to determine whether the route should be reused
        return future.routeConfig === current.routeConfig;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        // Add your logic here to retrieve a stored route
        return null;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        // Add your logic here to determine whether a route should be attached
        return false;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // Add your logic here to determine whether a route should be detached
        return false;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        // Add your logic here to store a route
    }
}