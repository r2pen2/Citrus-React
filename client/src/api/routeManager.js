// API Imports
import { Debugger, controllerObjects } from "./debugger";
import { SessionManager } from "./sessionManager";
import { BrowserManager } from "./browserManager";

// Init debugger with RouteManager prefix
const routeDebugger = new Debugger(controllerObjects.ROUTEMANAGER);

/**
 * RouteManager is a tool for redirecting the user. Includes several abstractions like logging redirects and 
 * handling login status redirects.
 */
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
    static setTitleOrRedirectToLogin(title) {
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
    static setTitleOrRedirectToDashboard(title) {
        const user = SessionManager.getUser();
        if (user) {
            RouteManager.redirect("/dashboard");
        } else {
            BrowserManager.setTitle(title);
        }
    } 
}