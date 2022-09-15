export class Debugger {
    constructor() {
        this.debugMode = true;
    }

    setDebugMode(bool) {
        console.log("Debug mode is now " + (this.debugMode ? "on" : "off"));
        this.debugMode = bool;
    }

    log(message) {
        if (this.debugMode) {
            console.log(message);
        }
    }
}