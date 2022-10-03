import { SessionManager } from "./sessionManager";

export class Debugger {
    /**
     * Debugger that can be turned on and off by using setDebugMode()
     */
    constructor() {
        this.debugMode = SessionManager.getDebugMode();
    }

    /**
     * Set value of debug mode
     * @param {boolean} bool new debug mode value
     */
    static setDebugMode(bool) {
        console.log("Debug mode is now " + (this.debugMode ? "on" : "off"));
        SessionManager.setDebugMode(bool);
        this.debugMode = bool;
    }

    /**
     * Log a message if debug mode is on
     * @param {string} message message to console.log()
     */
    static log(message) {
        if (this.debugMode) {
            console.log(message);
        }
    }
}