import { Debugger, controllerObjects } from "./debugger";

const routeDebugger = new Debugger(controllerObjects.ROUTEMANAGER);

export class RouteManager {

    /**
     * Redirect user and log in debugger
     * @param {string} destination window.location to send user to
     */
    static redirect(destination) {
        routeDebugger.logWithPrefix("Redirecting user to " + destination);
        window.location = destination;
    }
}