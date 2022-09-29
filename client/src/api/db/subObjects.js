const emojiIds = {
    TEST: "test"
}

const inviteMethods = {
    QRCODE: "qrCode",
    CODE: "numericalCode",
    LINK: "link",
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