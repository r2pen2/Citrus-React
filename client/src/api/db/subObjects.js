// All possible emoji id strings
const emojiIds = {
    BEERMUG: "&#x1F37A",
    CHECKMARK: "&#x2714",
    CLINKINGBEERMUGS: "&#x1F37B",
    COFFEE: "&#x2615",
    COWBOYHATFACE: "&#x1F920",
    MONEYBAG: "&#x1F4B0",
    MONEYWITHWINGS: "&#x1F4B8",
    PEACH: "&#x1F351",
    PIZZA: "&#x1F355",
    SKULL: "&#x1F480",
    ZOMBIE: "&#x1F9DF",
    
}

// All possible invitation method strings
const inviteMethods = {
    QRCODE: "qrCode",
    CODE: "numericalCode",
    LINK: "link",
}

// All possible invitation type strings
const inviteTypes = {
    FRIEND: "friend",
    GROUP: "group",
    CHIPIN: "chipIn",
}

export class Emoji {
    constructor(_emojiId) {
        this.hex = _emojiId;
    }
}

export class UserPhoneNumber {
    constructor(_phoneString) {
        this.phoneString = _phoneString;
    }
}

export class UserEmail {
    constructor(_emailString) {
        this.emailString = _emailString;
    }
}

export class InviteMethod {
    constructor(_inviteMethod) {
        this.method = _inviteMethod;
    }
}

export class InviteType {
    constructor(_inviteType) {
        this.type = _inviteType;
    }

    /**
     * Get collection associated with invitation type
     * @returns {string} invitation collection
     */
    getCollection() {
        switch(this.type) {
            case inviteTypes.FRIEND:
                return "friendInvites";
            case inviteTypes.GROUP:
                return "groupInvites";
            case inviteTypes.CHIPIN:
                return "chipInInvites";
            default:
                return null;
        }
    }
}

export class BookmarkUser {
    constructor(_id) {
        this.id = _id;
        this.balance = null;
    }

    setBalance(bal) {
        this.balance = bal;
    }
}

export class TransactionUser {
    constructor(_id) {
        this.id = _id;
        this.initialBalance = null;
        this.currentBalance = null;
    }

    setInitialBalance(bal) {
        this.initialBalance = bal;
    }
    
    setCurrentBalance(bal) {
        this.currentBalance = bal;
    }

    /**
     * Calculate how much of user's debt has been settled
     * ex) Initial balance of -100, user is paid 60, current balance is now -40, so progress is .6;
     * @returns {number} value representing how much of the debt has been settled
     */
    getProgress() {
        return 1 - (this.currentBalance / this.initialBalance);
    }

    /**
     * The exact opposite of getProgress
     * ex) Initial balance of -100, user is paid 60, current balance is now -40, so remaining progress is .4;
     * @returns {number} value representing how much of the debt has yet to be settled
     */
    getRemainingProgress() {
        return this.currentBalance / this.initialBalance;
    }
}