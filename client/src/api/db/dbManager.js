import { BadgeManager } from "./objectManagers/badgeManager";
import { BookmarkManager } from "./objectManagers/bookmarkManager";
import { GroupManager } from "./objectManagers/groupManager";
import { TransactionAttemptManager } from "./objectManagers/transactionAttemptManager";
import { TransactionManager } from "./objectManagers/transactionManager";
import { UserManager } from "./objectManagers/userManager";
import { InvitationManager } from "./objectManagers/invitationManager";
import { Debugger } from "../debugger";

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

    toString() {
        return 'Change of type "' + this.type + '" on field "' + this.field + '" with value "' + this.value + '"';
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

    static getObjectManager(objectType, objectId) {
        Debugger.log("Generating object manager for: " + objectType);
        switch (objectType) {
            case dbObjectTypes.BOOKMARK:
                return new BookmarkManager(objectId);
            case dbObjectTypes.BADGE:
                return new BadgeManager(objectId);
            case dbObjectTypes.GROUP:
                return new GroupManager(objectId);
            case dbObjectTypes.INVITATION:
                return new InvitationManager(objectId);
            case dbObjectTypes.TRANSACTION:
                return new TransactionManager(objectId);
            case dbObjectTypes.TRANSACTIONATTEMPT:
                return new TransactionAttemptManager(objectId);
            case dbObjectTypes.USER:
                return new UserManager(objectId);
            default:
                Debugger.log("DBManager was asked to return the manager for an invalid object type!");
                break;
        }
    }
}