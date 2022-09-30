export class Debugger {
    /**
     * Debugger that can be turned on and off by using setDebugMode()
     */
    constructor() {
        this.debugMode = true;
    }

    /**
     * Set value of debug mode
     * @param {boolean} bool new debug mode value
     */
    setDebugMode(bool) {
        console.log("Debug mode is now " + (this.debugMode ? "on" : "off"));
        this.debugMode = bool;
    }

    /**
     * Log a message if debug mode is on
     * @param {string} message message to console.log()
     */
    log(message) {
        if (this.debugMode) {
            console.log(message);
        }
    }
}