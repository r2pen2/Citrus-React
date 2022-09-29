const emojiIds = {
    TEST: "test"
}

const inviteMethods = {
    QRCODE: "qrCode",
    CODE: "numericalCode",
    LINK: "link",
}

const inviteTypes = {
    FRIEND: "friend",
    GROUP: "group",
    CHIPIN: "chipIn",
}

export class Emoji {
    constructor(_emojiId) {
        this.id = _emojiId;
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