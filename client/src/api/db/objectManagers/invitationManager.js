import { DBManager, Set } from "../dbManager";
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
                data.inviteType = change.value;
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
                    resolve(this.data.inviteType);
                    break;
                case this.fields.INVITEMETHOD:
                    resolve(this.data.inviteMethod);
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

    // ================= Set Operations ================= //
    setInviteType(newInviteType) {
        const inviteTypeChange = new Set(this.fields.INVITETYPE, newInviteType);
        super.addChange(inviteTypeChange);
    }

    setInviteMethod(newInviteMethod) {
        const inviteMethodChange = new Set(this.fields.INVITEMETHOD, newInviteMethod);
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

    // ================= Add Operations ================= //

    // ================= Remove Operations ================= //
}


export class InviteMethod {
    constructor(_inviteMethod) {
        this.method = _inviteMethod;
    }

    static methods = {
        QRCODE: "qrCode",
        CODE: "numericalCode",
        LINK: "link",
    }
}

export class InviteType {
    constructor(_inviteType) {
        this.type = _inviteType;
    }

    static types = {
        FRIEND: "friend",
        GROUP: "group",
        CHIPIN: "chipIn",
    }

    /**
     * Get collection associated with invitation type
     * @returns {string} invitation collection
     */
    getCollection() {
        switch(this.type) {
            case InviteType.types.FRIEND:
                return "friendInvites";
            case InviteType.types.GROUP:
                return "groupInvites";
            case InviteType.types.CHIPIN:
                return "chipInInvites";
            default:
                return null;
        }
    }
}