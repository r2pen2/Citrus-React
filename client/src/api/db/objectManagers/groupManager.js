import { DBManager, Add, Remove, Set } from "../dbManager";
import { ObjectManager } from "./objectManager";

/**
 * Object Manager for groups
 */
export class GroupManager extends ObjectManager {

    constructor(_id) {
        super(DBManager.objectTypes.GROUP, _id);
    }

    fields = {
        CREATEDAT: "createdAt",
        CREATEDBY: "createdBy",
        NAME: "name",
        DESCRIPTION: "description",
        TRANSACTIONS: "transactions",
        USERS: "users",
        INVITATIONS: "invitations",
    }

    getEmptyData() {
        const empty = {
            createdAt: null,    // {date} When the group was created
            createdBy: null,    // {string} ID of user that created the group
            name: null,         // {string} Name of the group
            description: null,         // {string} Description of the group
            transactions: [],   // {array <- string} IDs of every transaction associated with this group
            users: [],          // {array <- string} IDs of every user in this group
            invitations: [],          // {array <- string} IDs of every invitation to this group
        }
        return empty;
    }

    handleAdd(change, data) {
        switch(change.field) {
            case this.fields.TRANSACTIONS:
                if (!data.transactions.includes(change.value)) {    
                    data.transactions.push(change.value);
                }
                return data;
            case this.fields.USERS:
                if (!data.users.includes(change.value)) {    
                    data.users.push(change.value);
                }
                return data;
            case this.fields.INVITATIONS:
                if (!data.invitations.includes(change.value)) {    
                    data.invitations.push(change.value);
                }
                return data;
            case this.fields.CREATEDAT:
            case this.fields.CREATEDBY:
            case this.fields.NAME:
            case this.fields.DESCRIPTION:
                super.logInvalidChangeType(change);
                return data;
            default:
                super.logInvalidChangeField(change);
                return data;
        }
    }

    handleRemove(change, data) {
        switch(change.field) {
            case this.fields.TRANSACTIONS:
                data.transactions = data.transactions.filter(transaction => transaction !== change.value);
                return data;
            case this.fields.USERS:
                data.users = data.users.filter(user => user !== change.value);
                return data;
            case this.fields.INVITATIONS:
                data.invitations = data.invitations.filter(invitation => invitation !== change.value);
                return data;
            case this.fields.CREATEDAT:
            case this.fields.CREATEDBY:
            case this.fields.NAME:
            case this.fields.DESCRIPTION:
                super.logInvalidChangeType(change);
                return data;
            default:
                super.logInvalidChangeField(change);
                return data;
        }
    }

    handleSet(change, data) {
        switch(change.field) {
            case this.fields.CREATEDAT:
                data.createdAt = change.value;
                return data;
            case this.fields.CREATEDBY:
                data.createdBy = change.value;
                return data;
            case this.fields.NAME:
                data.name = change.value;
                return data;
            case this.fields.DESCRIPTION:
                data.description = change.value;
                return data;
            case this.fields.TRANSACTIONS:
            case this.fields.USERS:
            case this.fields.INVITATIONS:
                super.logInvalidChangeType(change);
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
                case this.fields.CREATEDAT:
                    resolve(this.data.createdAt);
                    break;
                case this.fields.CREATEDBY:
                    resolve(this.data.createdBy);
                    break;
                case this.fields.NAME:
                    resolve(this.data.name);
                    break;
                case this.fields.DESCRIPTION:
                    resolve(this.data.description);
                    break;
                case this.fields.TRANSACTIONS:
                    resolve(this.data.transactions);
                    break;
                case this.fields.USERS:
                    resolve(this.data.users);
                    break;
                case this.fields.INVITATIONS:
                    resolve(this.data.invitations);
                    break;
                default:
                    super.logInvalidGetField(field);
                    resolve(null);
                    break;
            }
        })
    }

    // ================= Get Operations ================= //
    async getCreatedAt() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.CREATEDAT).then((val) => {
                resolve(val);
            })
        })
    }

    async getCreatedBy() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.CREATEDBY).then((val) => {
                resolve(val);
            })
        })
    }

    async getName() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.NAME).then((val) => {
                resolve(val);
            })
        })
    }

    async getDescription() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.DESCRIPTION).then((val) => {
                resolve(val);
            })
        })
    }

    async getTransactions() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.TRANSACTIONS).then((val) => {
                resolve(val);
            })
        })
    }

    async getUsers() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.USERS).then((val) => {
                resolve(val);
            })
        })
    }

    async getInvitations() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.INVITATIONS).then((val) => {
                resolve(val);
            })
        })
    }
    
    // ================= Set Operations ================= //
    setCreatedAt(newCreatedAt) {
        const createdAtChange = new Set(this.fields.CREATEDAT, newCreatedAt);
        super.addChange(createdAtChange);
    }
    
    setCreatedBy(newCreatedBy) {
        const createdByChange = new Set(this.fields.CREATEDBY, newCreatedBy);
        super.addChange(createdByChange);
    }
    
    setName(newName) {
        const nameChange = new Set(this.fields.NAME, newName);
        super.addChange(nameChange);
    }

    setDescription(newDescription) {
        const descriptionChange = new Set(this.fields.DESCRIPTION, newDescription);
        super.addChange(descriptionChange);
    }

    // ================= Add Operations ================= //
    addTransaction(transactionId) {
        const transactionAddition = new Add(this.fields.TRANSACTIONS, transactionId);
        super.addChange(transactionAddition);
    }

    addUser(userId) {
        const userAddition = new Add(this.fields.USERS, userId);
        super.addChange(userAddition);
    }

    addInvitation(invitationId) {
        const invitationAddition = new Add(this.fields.INVITATIONS, invitationId);
        super.addChange(invitationAddition);
    }

    // ================= Remove Operations ================= //
    removeTransaction(transactionId) {
        const transactionRemoval = new Remove(this.fields.TRANSACTIONS, transactionId);
        super.addChange(transactionRemoval);
    }

    removeUser(userId) {
        const userRemoval = new Remove(this.fields.USERS, userId);
        super.addChange(userRemoval);
    }

    removeInvitation(invitationId) {
        const invitationRemoval = new Remove(this.fields.INVITATIONS, invitationId);
        super.addChange(invitationRemoval);
    }
}