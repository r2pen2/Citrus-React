import { DBManager, Add, Remove, Set } from "../dbManager";
import { ObjectManager } from "./objectManager";
import { SessionManager } from "../../sessionManager";

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
        GROUP: "group",
        RELATIONS: "relations",
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
            group: null,            // {string} id of group that this transaction belongs to (if any)
            relations: [],          // {array <- transactionRelation} All relations referenced in this transaction
        }
        return empty;
    }

    handleAdd(change, data) {
        switch(change.field) {
            case this.fields.USERS:
                const jsonUser = change.value.toJson();
                let foundUser = false;
                for (const transactionUser of data.users) {
                    if (transactionUser.id === jsonUser.id) {
                        foundUser = true;
                    }
                }
                if (!foundUser) {
                    this.data.users.push(jsonUser);
                }
                return data;
            case this.fields.RELATIONS:
                const jsonRelation = change.value.toJson();
                let foundRelation = false;
                for (const transactionRelation of data.relations) {
                    if (transactionRelation.id === jsonRelation.id) {
                        foundRelation = true;
                    }
                }
                if (!foundRelation) {
                    this.data.relations.push(jsonRelation);
                }
                return data;
            case this.fields.ACTIVE:
            case this.fields.EMOJI:
            case this.fields.CREATEDAT:
            case this.fields.CREATEDBY:
            case this.fields.TITLE:
            case this.fields.TOTAL:
            case this.fields.GROUP:
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
                // The "change.value" should just be a user's id, so we can handle all of this in JSON
                data.users = data.users.filter(user => user.id !== change.value);
                return data;
            case this.fields.ACTIVE:
            case this.fields.EMOJI:
            case this.fields.CREATEDAT:
            case this.fields.CREATEDBY:
            case this.fields.TITLE:
            case this.fields.TOTAL:
            case this.fields.GROUP:
            case this.fields.RELATIONS:
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
            case this.fields.GROUP:
                data.group = change.value;
                return data;
            case this.fields.USERS:
            case this.fields.RELATIONS:
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
                case this.fields.GROUP:
                    resolve(this.data.group);
                    break;
                case this.fields.RELATIONS:
                    resolve(this.data.relations);
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
                // Process list of users (in JSON format) and spit out a list of transactionUser objects
                let transactionUsers = [];
                for (const jsonUser of val) {
                    transactionUsers.push(new TransactionUser(jsonUser.id, jsonUser))
                }
                resolve(transactionUsers);
            })
        })
    }

    async getGroup() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.GROUP).then((val) => {
                resolve(val);
            })
        })
    }

    async getRelations() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.RELATIONS).then((val) => {
                // Process list of relations (in JSON format) and spit out a list of TransactionRelation objects
                let transactionRelations = [];
                for (const jsonRelation of val) {
                    transactionRelations.push(new TransactionRelation(jsonRelation.from.id, jsonRelation.to.id, jsonRelation.amount, jsonRelation.id, jsonRelation.from, jsonRelation.to, jsonRelation.transaction));
                }
                resolve(transactionRelations);
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
    
    setTotal(newTotal) {
        const totalChange = new Set(this.fields.TOTAL, newTotal);
        super.addChange(totalChange);
    }
    
    setGroup(newGroup) {
        const groupChange = new Set(this.fields.GROUP, newGroup);
        super.addChange(groupChange);
    }

    // ================= Add Operations ================= //
    
    addUser(userId) {
        const userAddition = new Add(this.fields.USERS, userId);
        super.addChange(userAddition);
    }
    
    addRelation(relation) {
        const relationAddition = new Add(this.fields.RELATIONS, relation);
        super.addChange(relationAddition);
    }

    // ================= Remove Operations ================= //
    
    removeUser(userId) {
        const userRemoval = new Remove(this.fields.USERS, userId);
        super.addChange(userRemoval);
    }
    
    removeRelationById(relationId) {
        const relationRemoval = new Remove(this.fields.RELATIONS, relationId);
        super.addChange(relationRemoval);
    }

    // ================= Sub-Object Functions ================= //

    /**
     * Get group manager for this transaction
     */
    async getGroupManager() {
        return new Promise(async (resolve, reject) => {
            const group = await this.getGroup();
            resolve(DBManager.getGroupManager(group));
        })
    }

    /**
     * Get a certain user in this transaction
     * @param userId id of user to lookup
     */
    async getUser(userId) {
        return new Promise(async (resolve, reject) => {
            const allUsers = await this.getUsers();
            let retVal = null;
            for (const u of allUsers) {
                if (u.id === userId) {
                    retVal = u;
                }
            }
            resolve(retVal);
        })
    }

    /**
     * Add this transaction to every user in its USER array
     * @returns a promise resolved with either true or false when the pushes are complete
     */
    async addToAllUsers() {
        return new Promise(async (resolve, reject) => {
            const transactionUsers = await this.getUsers();
            for (const transactionUser of transactionUsers) {
                // Get a user manager and add the transaction
                const transactionUserManager = SessionManager.getUserManagerById(transactionUser.id);
                transactionUserManager.addTransaction(this.getDocumentId());
                // Push changes to userManager
                const pushSuccessful = await transactionUserManager.push();
                // Make sure pushes to userManager worked
                if (!pushSuccessful) {
                    this.debugger.logWithPrefix("Error: User manager failed to push to database");
                    resolve(false);
                } else {
                    // Push was successful
                    // Check if this was the currentUser and update localStorage accordingly
                    SessionManager.updateCurrentUserManager(transactionUserManager);
                }
            }
            // If we made it this far, we succeeded
            resolve(true);
        })
    }

    /**
     * Remove this transaction from every user in its USER array
     * @returns a promise resolved with either true or false when the pushes are complete
     */
    async removeFromAllUsers() {
        return new Promise(async (resolve, reject) => {
            const transactionUsers = await this.getUsers();
            for (const transactionUser of transactionUsers) {
                // Get a user manager and remove the transaction
                const transactionUserManager = SessionManager.getUserManagerById(transactionUser.id);
                transactionUserManager.removeTransaction(this.getDocumentId());
                // Push changes to userManager
                const pushSuccessful = await transactionUserManager.push();
                // Make sure pushes to userManager worked
                if (!pushSuccessful) {
                    this.debugger.logWithPrefix("Error: User manager failed to push to database");
                    resolve(false);
                } else {
                    // Push was successful
                    // Check if this was the currentUser and update localStorage accordingly
                    SessionManager.updateCurrentUserManager(transactionUserManager);
                }
            }
            // If we made it this far, we succeeded
            resolve(true);
        })
    }

    /**
     * Remove this transaction from every user in its USER array
     * @returns a promise resolved with either true or false when the pushes are complete
     */
    async delete() {
        return new Promise(async (resolve, reject) => {
            const usersDeleted = this.removeFromAllUsers();
            if (usersDeleted) {
                this.deleteDocument();
            }
            // If we made it this far, we succeeded
            resolve(true);
        })
    }
}

/**
 * An object representing data relevant to a single user in transaction.
 * Stores the user's ID, their initialBalance, their currentBalance, whether or not they've settled
 * this transaction, and any TransactionRelations that they're a part of in this transaction.
 */
export class TransactionUser {
    /**
     * Create an object representing data relevant to a single user in a transaction
     * @param {string} _id id of user 
     * @param {Object} data and existing data (only used if we're creating this object from DB)
     */
    constructor(_id, data) {
        this.id = _id;
        this.initialBalance = data ? data.initialBalance : null;
        this.currentBalance = data ? data.currentBalance : null;
        this.settled = data ? data.settled : null;
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
     * Directly set this transaction user's settled value
     * @param {boolean} bool new settled value
     */
    setSettled(bool) {
        this.settled = bool;
    }

    /**
     * Check whether or not this user is settled in this transaction
     * @param {boolean} bool settled value
     */
    getSettled() {
        return this.settled;
    }

    /**
     * Turn this custom object into JSON that can be stored in the database
     * @returns Json representation of TransactionUser
     */
    toJson() {
        return {
            id: this.id,
            initialBalance: this.initialBalance,
            currentBalance: this.currentBalance,
            settled: this.settled,
        }
    }
}

/**
 * A one-directional relationship between a user that owes money and the user to whom the money is owed
 */
export class TransactionRelation {
    /**
     * Create a one-directional relationship between a user that owes money and the user to whom the money is owed
     * @param {string} _fromUserId id of user who owes money 
     * @param {string} _toUserId id of user who is owed money
     * @param {number} _amount amount that fromUser owes toUser
     * @param {string} _id id of this TransactionRelation (null to create a new one)
     * @param {Object} _fromData any possible existing data for fromUser (displayName and pfpUrl)
     * @param {Object} _toData any possible existing data for toUser (displayName and pfpUrl)
     * @param {Object} _toData any possible existing data for transaction (id, total, and title)
     */
    constructor(_fromUserId, _toUserId, _amount, _id, _fromData, _toData, _transactionData) {
        this.id = _id ? _id : DBManager.generateId(16);
        this.from = {
            id: _fromUserId,
            displayName: _fromData ? _fromData.displayName : null,
            pfpUrl: _fromData ? _fromData.pfpUrl : null,
        };
        this.to = {
            id: _toUserId,
            displayName: _toData ? _toData.displayName : null,
            pfpUrl: _toData ? _toData.pfpUrl: null,
        };
        this.amount = _amount;
        this.transaction = _transactionData ? _transactionData : { 
            id: null, 
            amount: null,
            title: null
        }
    }

    setTransactionId(id) {
        const newTransaction = this.transaction;
        newTransaction.id = id;
        this.transaction = newTransaction;
    }

    setTransactionTitle(title) {
        const newTransaction = this.transaction;
        newTransaction.title = title;
        this.transaction = newTransaction;
    }

    setTransactionAmount(amt) {
        const newTransaction = this.transaction;
        newTransaction.amount = amt;
        this.transaction = newTransaction;
    }

    setAmount(amt) {
        this.amount = amt;
    }

    /**
     * Turn this custom object into JSON that can be stored in the database
     * @returns Json representation of TransactionRelation
     */
    toJson() {
        return {
            id: this.id,
            from: this.from,
            to: this.to,
            amount: this.amount,
            transaction: this.transaction
        }
    }

    /**
     * Set photo reference for "from" user
     * @param {string} url pfpUrl of "from" user
     */
    setFromPfpUrl(url) {
        this.from.pfpUrl = url;
    }

    /**
     * Set photo reference for "to" user
     * @param {string} url pfpUrl of "to" user
     */
    setToPfpUrl(url) {
        this.to.pfpUrl = url;
    }

    /**
     * Set displayName for "from" user
     * @param {string} name displayName of "from" user
     */
    setFromDisplayName(name) {
        this.from.displayName = name;
    }

    /**
     * Set displayName for "to" user
     * @param {string} name displayName of "to" user
     */
    setToDisplayName(name) {
        this.to.displayName = name;
    }
}