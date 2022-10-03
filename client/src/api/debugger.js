import { SessionManager } from "./sessionManager";

export const controllerObjects = {
    ROUTEMANAGER: "routeManager",
    DBMANAGER: "dbManager",
    OBJECTMANAGER: "objectManager",
    OBJECTMANAGERBADGE: "objectManagerBadge",
    OBJECTMANAGERBOOKMARK: "objectManagerBookmark",
    OBJECTMANAGERGROUP: "objectManagerGroup",
    OBJECTMANAGERINVITATION: "objectManagerInvitation",
    OBJECTMANAGERTRANSACTIONATTEMPT: "objectManagerTransactionAttempt",
    OBJECTMANAGERTRANSACTION: "objectManagerTransaction",
    OBJECTMANAGERUSER: "objectManagerUser",
    BROWSERMANAGER: "browserManager",
}

export class Debugger {

    /**
     * Debugger that can be turned on and off by using setDebugMode()
     * Can also be tied to another manager to log with a prefix
     */
    constructor(_controllerObject) {
        this.controllerObject = _controllerObject;
    }

    getControllerPrefix() {
        switch (this.controllerObject) {
            case controllerObjects.ROUTEMANAGER:
                return "[Route Manager]: ";
            case controllerObjects.DBMANAGER:
                return "[DB Manager]: ";
            case controllerObjects.OBJECTMANAGER:
                return "[Object Manager]: ";
            case controllerObjects.OBJECTMANAGERBADGE:
                return "[Object Manager <Badge>]: ";
            case controllerObjects.OBJECTMANAGERBOOKMARK:
                return "[Object Manager <Bookmark>]: ";
            case controllerObjects.OBJECTMANAGERGROUP:
                return "[Object Manager <Group>]: ";
            case controllerObjects.OBJECTMANAGERINVITATION:
                return "[Object Manager <Invitation>]: ";
            case controllerObjects.OBJECTMANAGERTRANSACTION:
                return "[Object Manager <Transaction>]: ";
            case controllerObjects.OBJECTMANAGERTRANSACTIONATTEMPT:
                return "[Object Manager <Transaction Attempt>]: ";
            case controllerObjects.OBJECTMANAGERUSER:
                return "[Object Manager <User>]: ";
            case controllerObjects.BROWSERMANAGER:
                return "[Browser Manager]: ";
            default:
                return "[Undefined Manager]: ";
        }
    }

    /**
     * Set value of debug mode
     * @param {boolean} bool new debug mode value
     */
    static setDebugMode(bool) {
        console.log("Debug mode is now " + (bool ? "on" : "off"));
        SessionManager.setDebugMode(bool);
    }

    /**
     * Log a message if debug mode is on
     * @param {string} message message to console.log()
     */
    static log(message) {
        if (SessionManager.getDebugMode()) {
            console.log(message);
        }
    }

    static logSession() {
        this.log(SessionManager.getJSON())
    }

    /**
     * Log a message with manager prefix if debug mode is on
     * @param {string} message message to console.log() with a prefix
     */
    logWithPrefix(message) {
        console.log(this.getControllerPrefix() + message);
    }
}