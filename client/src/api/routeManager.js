import { Debugger, controllerObjects } from "./debugger";
import { SessionManager } from "./sessionManager";
import { BrowserManager } from "./browserManager";

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

    /**
     * Check if user is logged in and send them to login if not
     * @param {string} title document title
     */
    static redirectToLoginOrSetTitle(title) {
        const user = SessionManager.getUser();
        if (!user) {
            RouteManager.redirect("/login");
        } else {
            BrowserManager.setTitle(title);
        }
    } 

    /**
     * Check if user is logged in and send them to dashboard if so
     * @param {string} title document title
     */
    static redirectToDashboardOrSetTitle(title) {
        const user = SessionManager.getUser();
        if (user) {
            RouteManager.redirect("/dashboard");
        } else {
            BrowserManager.setTitle(title);
        }
    } 
}