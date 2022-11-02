import { DBManager, Set } from "../dbManager";
import { RouteManager } from "../../routeManager";
import { ObjectManager } from "./objectManager";

/**
 * Object Manager for invitations
 */
export class InvitationManager extends ObjectManager {

    constructor(_id) {
        super(DBManager.objectTypes.INVITATION, _id);
    }

    fields = {
        INVITETYPE: "inviteType",
        INVITEMETHOD: "inviteMethod",
        INVITEDAT: "invitedAt",
        INVITEELOCATION: "inviteeLocation",
        INVITERLOCATION: "inviterLocation",
        USED: "used",
        TARGET: "target",
    }

    getEmptyData() {
        const empty = {
            inviteType: null,       // {InviteType} Which invite type this is (friends, groups, chip-ins)
            inviteMethod: null,     // {InviteMethod} Which invite method was used
            invitedAt: null,        // {date} When this user invitation was created
            inviteeAttrs: {         // {map} Attributes associated with invitee
                location: null,     // --- {geoPoint} Location of the invitee when they accept the invitation
            },
            inviterAttrs: {         // {map} Attributes associated with inviter
                location: null,     // --- {geoPoint} Location of the inviter when they create the invitation
            },
            used: false,            // {boolean} Whether or not this invitation was used
            target: null,           // {string} id of document that this invite points to
        }
        return empty;
    }

    handleAdd(change, data) {
        switch (change.field) {
            case this.fields.INVITETYPE:
            case this.fields.INVITEMETHOD:
            case this.fields.INVITEDAT:
            case this.fields.INVITEELOCATION:
            case this.fields.INVITERLOCATION:
            case this.fields.USED:
            case this.fields.TARGET:
                super.logInvalidChangeType(change);
                return data;
            default:
                super.logInvalidChangeField(change);
                return data;
        }
    }

    handleRemove(change, data) {
        switch (change.field) {
            case this.fields.INVITETYPE:
            case this.fields.INVITEMETHOD:
            case this.fields.INVITEDAT:
            case this.fields.INVITEELOCATION:
            case this.fields.INVITERLOCATION:
            case this.fields.USED:
            case this.fields.TARGET:
                super.logInvalidChangeType(change);
                return data;
            default:
                super.logInvalidChangeField(change);
                return data;
        }
    }

    handleSet(change, data) {
        switch (change.field) {
            case this.fields.INVITETYPE:
                const jsonInviteType = change.value.toJson();
                data.inviteType = jsonInviteType;
                return data;
            case this.fields.INVITEMETHOD:
                data.inviteMethod = change.value;
                return data;
            case this.fields.INVITEDAT:
                data.invitedAt = change.value;
                return data;
            case this.fields.INVITEELOCATION:
                data.inviteeAttrs.location = change.value;
                return data;
            case this.fields.INVITERLOCATION:
                data.inviterAttrs.location = change.value;
                return data;
            case this.fields.USED:
                data.used = change.value;
                return data;
            case this.fields.TARGET:
                data.target = change.value;
                return data;
            default:
                super.logInvalidChangeField(change);
                return data;
        }
    }

    async handleGet(field) {
        return new Promise(async (resolve, reject) => {
            if (!this.fetched) {
                await super.fetchData();
            }
            switch(field) {
                case this.fields.INVITETYPE:
                    const jsonInviteType = this.data.inviteType;
                    resolve(new InviteType(jsonInviteType.type, jsonInviteType.target));
                    break;
                case this.fields.INVITEMETHOD:
                    const jsonInviteMethod = this.data.inviteMethod;
                    let inviteMethod = null;
                    switch (jsonInviteMethod.method) {
                        case InviteMethod.QRCODE:
                            inviteMethod = new QRInvite(jsonInviteMethod.targetId);
                            break;
                        case InviteMethod.LINK:
                            inviteMethod = new LinkInvite(jsonInviteMethod.targetId);
                            break;
                        case InviteMethod.CODE:
                            inviteMethod = new LinkInvite(jsonInviteMethod.targetId);
                            break;
                        default:
                            inviteMethod = null;
                    }
                    resolve(inviteMethod);
                    break;
                case this.fields.INVITEDAT:
                    resolve(this.data.invitedAt);
                    break;
                case this.fields.INVITEELOCATION:
                    resolve(this.data.inviteeAttrs.location);
                    break;
                case this.fields.INVITERLOCATION:
                    resolve(this.data.inviterAttrs.location);
                    break;
                case this.fields.USED:
                    resolve(this.data.used);
                    break;
                case this.fields.TARGET:
                    resolve(this.data.target);
                    break;
                default:
                    super.logInvalidGetField(field);
                    resolve(null);
                    break;
            }
        })
    }

    // ================= Get Operations ================= //
    async getInviteType() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.INVITETYPE).then((val) => {
                resolve(val);
            })
        })
    }

    async getInviteMethod() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.INVITEMETHOD).then((val) => {
                resolve(val);
            })
        })
    }

    async getInvitedAt() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.INVITEDAT).then((val) => {
                resolve(val);
            })
        })
    }

    async getInviteeLocation() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.INVITEELOCATION).then((val) => {
                resolve(val);
            })
        })
    }

    async getInviterLocation() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.INVITERLOCATION).then((val) => {
                resolve(val);
            })
        })
    }

    async getUsed() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.USED).then((val) => {
                resolve(val);
            })
        })
    }

    async getTarget() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.TARGET).then((val) => {
                resolve(val);
            })
        })
    }

    // ================= Set Operations ================= //
    setInviteType(newInviteType) {
        const inviteTypeChange = new Set(this.fields.INVITETYPE, newInviteType);
        super.addChange(inviteTypeChange);
    }

    setInviteMethod(newInviteMethod) {
        const jsonInviteMethod = newInviteMethod.toJson();
        const inviteMethodChange = new Set(this.fields.INVITEMETHOD, jsonInviteMethod);
        super.addChange(inviteMethodChange);
    }
    
    setInvitedAt(newInvitedAt) {
        const invitedAtChange = new Set(this.fields.INVITEDAT, newInvitedAt);
        super.addChange(invitedAtChange);
    }
    
    setInviteeLocation(newInviteeLocation) {
        const inviteeLocationChange = new Set(this.fields.INVITEELOCATION, newInviteeLocation);
        super.addChange(inviteeLocationChange);
    }

    setInviterLocation(newInviterLocation) {
        const inviterLocationChange = new Set(this.fields.INVITERLOCATION, newInviterLocation);
        super.addChange(inviterLocationChange);
    }

    setUsed(newUsed) {
        const usedChange = new Set(this.fields.USED, newUsed);
        super.addChange(usedChange);
    }
    
    setTarget(newTarget) {
        const targetChange = new Set(this.fields.TARGET, newTarget);
        super.addChange(targetChange);
    }
    // ================= Add Operations ================= //

    // ================= Remove Operations ================= //

    // ================= Misc. Operations ================= //
    /**
     * Go to url that this invite references
     */
    goTo() {
        RouteManager.redirect(`/invite?type=${this.inviteType.type}&id=${this.documentId}`);
    }

    /**
     * Check if this invitation exists on DB and has passed in ID + Type
     * @param {string} id id of invitation
     * @param {string} type invitation type 
     * @returns a promise resolved a string (either "valid" or "invalid")
     */
    async validate(id, type) {
        return new Promise(async (resolve, reject) => {
            await this.fetchData();
            if (!this.data) {
                resolve("invalid");
            }
            if (id !== this.documentId) {
                resolve("invalid");
            }
            if (type !== this.inviteType) {
                resolve("invalid");
            }
            resolve("valid");
        })
    }
}

export class InviteMethod {
    constructor(_inviteMethod, _targetId) {
        this.method = _inviteMethod;
        this.targetId = _targetId;
    }

    static methods = {
        QRCODE: "qrCode",
        CODE: "numericalCode",
        LINK: "link",
    }

    toJson() {
        return {
            method: this.method,
            targetId: this.targetId
        }
    }
}

export class LinkInvite extends InviteMethod {
    constructor(_targetId) {
        super(InviteMethod.methods.LINK, _targetId);
    }

    getGroupLink() {
        return `${RouteManager.getHostName()}/invite?type=group&id=${this.targetId}`
    }

    getFriendLink() {
        return `${RouteManager.getHostName()}/invite?type=friend&id=${this.targetId}`
    }

    getUserLink() {
        return `${RouteManager.getHostName()}/invite?type=user&id=${this.targetId}`
    }
}

export class QRInvite extends InviteMethod {
    constructor(_targetId) {
        super(InviteMethod.methods.QRCODE, _targetId);
    }

    getGroupQR() {
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${RouteManager.getHostName()}/invite?type=group&id=${this.targetId}`
    }

    getFriendQR() {
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${RouteManager.getHostName()}/invite?type=friend&id=${this.targetId}`
    }

    getUserQR() {
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${RouteManager.getHostName()}/invite?type=user&id=${this.targetId}`
    }
}

export class CodeInvite extends InviteMethod {
    constructor(_targetId) {
        super(InviteMethod.methods.CODE, _targetId);
    }
}

export class InviteType {
    constructor(_inviteType, _inviteTarget) {
        this.type = _inviteType;
        this.target = _inviteTarget;
    }

    static types = {
        FRIEND: "friend",
        GROUP: "group",
        USER: "user",
    }

    toJson() {
        return {
            type: this.type,
            target: this.target
        }
    }
}