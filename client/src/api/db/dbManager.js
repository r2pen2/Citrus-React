import { BadgeManager } from "./objectManagers/badgeManager";
import { BookmarkManager } from "./objectManagers/bookmarkManager";
import { GroupManager } from "./objectManagers/groupManager";
import { TransactionAttemptManager } from "./objectManagers/transactionAttemptManager";
import { TransactionManager } from "./objectManagers/transactionManager";
import { UserManager } from "./objectManagers/userManager";
import { InvitationManager } from "./objectManagers/invitationManager";
import { Debugger, controllerObjects } from "../debugger";

const dbDebugger = new Debugger(controllerObjects.DBMANAGER);

export const changeTypes = {
    SET: "set",
    REMOVE: "remove",
    ADD: "add",
};

export const dbObjectTypes = {
    BOOKMARK: "bookmark",
    INVITATION: "invitations",
    GROUP: "group",
    TRANSACTIONATTEMPT: "transactionAttempt",
    TRANSACTION: "transaction",
    USER: "user",
    BADGE: "badge",
};

export class Change {
    constructor(_type, _field, _value) {
        this.type = _type;
        this.field = _field;
        this.value = _value;
    }

    /**
     * Detailed toString function
     * @deprecated This is old and pretty much useless
     * @returns Terribly long representation of this change
     */
    toStringVerbose() {
        return 'Change of type "' + this.type + '" on field "' + this.field + '" with value "' + this.value + '"';
    }

    /**
     * Get a string representation of this change
     * @returns String representation of this change
     */
    toString() {
        return this.type + " field: " + this.field + " val: " + this.value;
    }
}

export class Set extends Change {
    constructor(_field, _newValue) {
        super(changeTypes.SET, _field, _newValue);
    }
}

export class Remove extends Change {
    constructor(_field, _value) {
        super(changeTypes.REMOVE, _field, _value);
    }
}

export class Add extends Change {
    constructor(_field, _newValue) {
        super(changeTypes.ADD, _field, _newValue);
    }
}

export class DBManager {
    /**
    * Generates a random id string of a given length
    * @param {Number} length length of id to be created 
    * @returns {String} generated id
    */
    static generateId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    /**
     * Get object managers of correct type
     */
    static getBookmarkManager(id) {
        dbDebugger.logWithPrefix("Generating bookmark manager...");
        return new BookmarkManager(id);
    }
    static getBadgeManager(id) {
        dbDebugger.logWithPrefix("Generating badge manager...");
        return new BadgeManager(id);
    }
    static getGroupManager(id) {
        dbDebugger.logWithPrefix("Generating group manager...");
        return new GroupManager(id);
    }
    static getInvitationManager(id) {
        dbDebugger.logWithPrefix("Generating invitation manager...");
        return new InvitationManager(id);
    }
    static getTransactionManager(id) {
        dbDebugger.logWithPrefix("Generating transaction manager...");
        return new TransactionManager(id);
    }
    static getTransactionAttemptManager(id) {
        dbDebugger.logWithPrefix("Generating transaciton attempt manager...");
        return new TransactionAttemptManager(id);
    }
    static getUserManager(id) {
        dbDebugger.logWithPrefix("Generating user manager...");
        return new UserManager(id);
    }
}