import { DBManager, Add, Remove, Set } from "../dbManager";
import { ObjectManager } from "./objectManager";

/**
 * Object Manager for transactions
 */
export class TransactionManager extends ObjectManager {
    constructor(_id) {
        super(DBManager.objectTypes.TRANSACTION, _id);
    }

    fields = {
        ACTIVE: "active",
        EMOJI: "emoji",
        CREATEDAT: "createdAt",
        CREATEDBY: "createdBy",
        FROMBOOKMARK: "fromBookmark",
        TITLE: "title",
        TOTAL: "total",
        USERS: "users",
    }

    getEmptyData() {
        const empty = {
            active: null,           // {boolean} Whether or not this transaction is still active
            emoji: null,            // {Emoji} Emoji representation of transaction 
            createdAt: null,        // {date} Timestamp of transaction creation 
            createdBy: null,        // {string} ID of user that created this transaction
            fromBookmark: null,     // {boolean} Whether or not this transaction was created from a bookmark
            title: null,            // {string} title of transaction
            total: null,            // {number} total value of transaction (all debts added together)
            users: [],              // {array <- transactionUser} All users referenced in this transaction
        }
        return empty;
    }

    handleAdd(change, data) {
        switch(change.field) {
            case this.fields.USERS:
                if (!data.users.includes(change.value)) {    
                    data.users.push(change.value);
                }
                return data;
            case this.fields.ACTIVE:
            case this.fields.EMOJI:
            case this.fields.CREATEDAT:
            case this.fields.CREATEDBY:
            case this.fields.TITLE:
            case this.fields.TOTAL:
                super.logInvalidChangeType(change);
                return data;
            default:
                super.logInvalidChangeField(change);
                return data;
        }
    }

    handleRemove(change, data) {
        switch(change.field) {
            case this.fields.USERS:
                data.users = data.users.filter(user => user !== change.value);
                return data;
            case this.fields.ACTIVE:
            case this.fields.EMOJI:
            case this.fields.CREATEDAT:
            case this.fields.CREATEDBY:
            case this.fields.TITLE:
            case this.fields.TOTAL:
                super.logInvalidChangeType(change);
                return data;
            default:
                super.logInvalidChangeField(change);
                return data;
        }
    }

    handleSet(change, data) {
        switch(change.field) {
            case this.fields.ACTIVE:
                data.active = change.value;
                return data;
            case this.fields.EMOJI:
                data.emoji = change.value;
                return data;
            case this.fields.CREATEDAT:
                data.createdAt = change.value;
                return data;
            case this.fields.CREATEDBY:
                data.createdBy = change.value;
                return data;
            case this.fields.TITLE:
                data.title = change.value;
                return data;
            case this.fields.TOTAL:
                data.total = change.value;
                return data;
            case this.fields.USERS:
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
                case this.fields.ACTIVE:
                    resolve(this.data.active);
                    break;
                case this.fields.EMOJI:
                    resolve(this.data.emoji);
                    break;
                case this.fields.CREATEDAT:
                    resolve(this.data.createdAt);
                    break;
                case this.fields.CREATEDBY:
                    resolve(this.data.createdBy);
                    break;
                case this.fields.TITLE:
                    resolve(this.data.title);
                    break;
                case this.fields.TOTAL:
                    resolve(this.data.total);
                    break;
                case this.fields.USERS:
                    resolve(this.data.users);
                    break;
                default:
                    super.logInvalidGetField(field);
                    resolve(null);
                    break;
            }
        })
    }

    // ================= Get Operations ================= //

    async getActive() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.ACTIVE).then((val) => {
                resolve(val);
            })
        })
    }

    async getEmoji() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.EMOJI).then((val) => {
                resolve(val);
            })
        })
    }

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

    async getTitle() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.TITLE).then((val) => {
                resolve(val);
            })
        })
    }

    async getTotal() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.TOTAL).then((val) => {
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
    
    // ================= Set Operations ================= //

    setActive(newActive) {
        const activeChange = new Set(this.fields.ACTIVE, newActive);
        super.addChange(activeChange);
    }

    setEmoji(newEmoji) {
        const emojiChange = new Set(this.fields.EMOJI, newEmoji);
        super.addChange(emojiChange);
    }

    setCreatedAt(newCreatedAt) {
        const createdAtChange = new Set(this.fields.CREATEDAT, newCreatedAt);
        super.addChange(createdAtChange);
    }
    
    setCreatedBy(newCreatedBy) {
        const createdByChange = new Set(this.fields.CREATEDBY, newCreatedBy);
        super.addChange(createdByChange);
    }
    
    setTitle(newTitle) {
        const titleChange = new Set(this.fields.TITLE, newTitle);
        super.addChange(titleChange);
    }

    // ================= Add Operations ================= //
    
    addUser(userId) {
        const userAddition = new Add(this.fields.USERS, userId);
        super.addChange(userAddition);
    }

    // ================= Remove Operations ================= //
    
    removeUser(userId) {
        const userRemoval = new Remove(this.fields.USERS, userId);
        super.addChange(userRemoval);
    }

    // ================= Sub-Object Functions ================= //

    /**
     * Get user's view of transaciton
     * @param {string} userId userId to create context for
     * @returns TransactionContext object
     */
    async getContext(userId) {
        return new Promise(async (resolve, reject) => {

            // Get user's role
            const fronters = await this.getFronters();
            const payers = await this.getPayers();
            let currentUser = null;
            let role = null;

            for (const fronter of fronters) {
                if (fronter.id === userId) {
                    role = TransactionUser.roles.FRONTER;
                    currentUser = fronter;
                }
            }
            for (const payer of payers) {
                if (payer.id === userId) {
                    role = TransactionUser.roles.PAYER;
                    currentUser = payer;
                }
            }
            if (!role) {
                this.debugger.logWithPrefix("Failed to get context for user because they're neither a fronter nor a payer.");
                resolve(null);
            }
            resolve(new TransactionContext(currentUser, fronters, payers));
        })
    }

    createFronter(userId) {
        return new TransactionUser(userId, TransactionUser.roles.FRONTER);
    }

    createPayer(userId) {
        return new TransactionUser(userId, TransactionUser.roles.PAYER);
    }

    async getFronters() {
        const transactionUsers = await this.getUsers();
        let transactionFronters = [];
        for (const user of transactionUsers) {
            if (user.role === TransactionUser.roles.FRONTER) {
                transactionFronters.push(user);
            }
        }
        return transactionFronters
    }

    async getPayers() {
        const transactionUsers = await this.getUsers();
        let transactionPayers = [];
        for (const user of transactionUsers) {
            if (user.role === TransactionUser.roles.PAYER) {
                transactionPayers.push(user);
            }
        }
        return transactionPayers
    }
}

export class TransactionUser {
    constructor(_id, _role) {
        this.id = _id;
        this.initialBalance = null;
        this.currentBalance = null;
        this.role = _role;
        this.settled = null;
        this.relations = [];
    }

    static roles = {
        FRONTER: "fronter",
        PAYER: "payer",
    }

    /**
     * Set inital balance of transaction user
     * @param {number} bal new initial balance
     */
    setInitialBalance(bal) {
        this.initialBalance = bal;
    }
    
    /**
     * Update transaction user's current balance
     * @param {number} bal new balance
     */
    setCurrentBalance(bal) {
        this.currentBalance = bal;
    }

    /**
     * Checks whether or not this user should be settled in a transaction
     */
    checkSettled() {
        if (this.isPayer()) {
            if (this.currentBalance >= 0) {
                this.settled = true;
            }
        }
        if (this.isFronter()) {
            if (this.currentBalance <= 0) {
                this.settled = true;
            }
        }
    }

    /**
     * Directly set this transaction user's settled value
     * @param {boolean} bool new settled value
     */
    setSettled(bool) {
        this.settled = bool;
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

    /**
     * Boolean if transaction user is a fronter
     */
    isFronter() {
        return (this.role === TransactionUser.roles.FRONTER);
    }

    /**
     * Boolean if transaction user is a payer
     */
    isPayer() {
        return (this.role === TransactionUser.roles.PAYER);
    }

    addRelation(relation) {
        this.relations.push(relation);
    }

    removeRelation(relation) {
        this.relations = this.relations.filter(r => r.id !== relation.id);
    }

    getRelation(relationId) {
        for (const r of this.relations) {
            if (r.id === relationId) {
                return r;
            }
        }
    }
}

export class TransactionRelation {
    constructor(_fromUser, _toUser, _amount) {
        this.id = DBManager.generateId(16);
        this.from = _fromUser;
        this.to = _toUser;
        this.amount = _amount;
    }
}


/**
 * Current user's view of transaction
 */
class TransactionContext {
    constructor(_user, _fronters, _payers) {
        this.user = _user; 
        this.fronters = _fronters;
        this.payers = _payers;
    }
}