import { DBManager, Add, Remove, Set } from "../dbManager";
import { ObjectManager } from "./objectManager";
import { TransactionRelation } from "./transactionManager";
import { SessionManager } from "../../sessionManager";

/**
 * Object Manager for users
 */
export class UserManager extends ObjectManager {
    
    // Optional data param for loading currentUserManager from localstorage
    constructor(_id, _data) {
        super(DBManager.objectTypes.USER, _id);
        if (_data) {
            this.data = _data;
            this.fetched = true;
        }
    }
    
    fields = {
        BADGES: "badges",
        BOOKMARKS: "bookmarks",
        FRIENDS: "friends",
        GROUPS: "groups",
        TRANSACTIONS: "transactions",
        LOCATION: "location",
        CREATEDAT: "createdAt",
        EMAILVERIFIED: "emailVerified",
        LASTLOGINAT: "lastLoginAt",
        DISPLAYNAME: "displayName",
        EMAIL: "email",
        PHONENUMBER: "phoneNumber",
        PROFILEPICTUREURL: "profilePictureUrl",
        SETTINGS: "settings",
        RELATIONS: "relations",
    }

    getEmptyData() {
        const empty = {
            badges: [],                     // {array} IDs of badges that the user has earned
            bookmarks: [],                  // {array} IDs of bookmarks that the user has created
            friends: [],                    // {array} IDs of friends the user has added
            groups: [],                     // {array} IDs of groups the user is in
            transactions: [],               // {array} IDs of transactions the user is involved in
            metadata: {                     // {map} Metadata associated with user
                location: null,             // --- {geoPoint} Last login location of user
                createdAt: null,            // --- {date} When the user was created
                emailVerified: null,        // --- {boolean} Whether or not the user is email verified
                lastLoginAt: null,          // --- {date} Timestamp of last login
            },  
            personalData: {                 // {map} Personal data associated with user
                displayName: null,          // --- {string} User's display name
                email: null,                // --- {string} User's email address
                phoneNumber: null,          // --- {PhoneNumber} User's phone number
                profilePictureUrl: null,    // --- {string} URL of user's profile photo
            },
            settings: {                     // {map} User's current settings
                darkMode: null,             // --- {boolean} Whether the user is in darkMode or not
                language: null,             // --- {string <- languageId} User's language choice
            },
            relations: [],                  // {array} List of active TransactionRelations for user
        }
        return empty;
    }

    handleAdd(change, data) {
        switch(change.field) {
            case this.fields.BADGES:
                if (!data.badges.includes(change.value)) {    
                    data.badges.push(change.value);
                }
                return data;
            case this.fields.BOOKMARKS:
                if (!data.bookmarks.includes(change.value)) {    
                    data.bookmarks.push(change.value);
                }
                return data;
            case this.fields.FRIENDS:
                if (!data.friends.includes(change.value)) {    
                    data.friends.push(change.value);
                }
                return data;
            case this.fields.GROUPS:
                if (!data.groups.includes(change.value)) {    
                    data.groups.push(change.value);
                }
                return data;
            case this.fields.TRANSACTIONS:
                if (!data.transactions.includes(change.value)) {    
                    data.transactions.push(change.value);
                }
                return data;
            case this.fields.RELATIONS:
                if (!data.relations.includes(change.value)) { 
                    data.relations.push(change.value.toJson());
                }
                return data;
            case this.fields.LOCATION:
            case this.fields.CREATEDAT:
            case this.fields.EMAILVERIFIED:
            case this.fields.LASTLOGINAT:
            case this.fields.DISPLAYNAME:
            case this.fields.EMAIL:
            case this.fields.PHONENUMBER:
            case this.fields.PROFILEPICTUREURL:
            case this.fields.SETTINGS:
                super.logInvalidChangeType(change);
                return data;
            default:
                super.logInvalidChangeField(change);
                return data;
        }
    }

    handleRemove(change, data) {
        switch(change.field) {
            case this.fields.BADGES:
                data.badges = data.badges.filter(badge => badge !== change.value);
                return data;
            case this.fields.BOOKMARKS:
                data.bookmarks = data.bookmarks.filter(bookmark => bookmark !== change.value);
                return data;
            case this.fields.FRIENDS:
                data.friends = data.friends.filter(friend => friend !== change.value);
                return data;
            case this.fields.GROUPS:
                data.groups = data.groups.filter(group => group !== change.value);
                return data;
            case this.fields.TRANSACTIONS:
                // Delete transaction ID from array
                data.transactions = data.transactions.filter(transaction => transaction !== change.value);
                // Remove relations related to this transaction
                this.removeRelationsByTransaction(change.value);
                return data;
            case this.fields.RELATIONS:
                data.relations = data.relations.filter(relation => relation.id !== change.value);
                return data;
            case this.fields.LOCATION:
            case this.fields.CREATEDAT:
            case this.fields.EMAILVERIFIED:
            case this.fields.LASTLOGINAT:
            case this.fields.DISPLAYNAME:
            case this.fields.EMAIL:
            case this.fields.PHONENUMBER:
            case this.fields.PROFILEPICTUREURL:
            case this.fields.SETTINGS:
                super.logInvalidChangeType(change);
                return data;
            default:
                super.logInvalidChangeField(change);
                return data;
        }
    }

    handleSet(change, data) {
        switch(change.field) {
            case this.fields.LOCATION:
                data.metadata.location = change.value;
                return data;
            case this.fields.CREATEDAT:
                data.metadata.createdAt = change.value;
                return data;
            case this.fields.EMAILVERIFIED:
                data.metadata.emailVerified = change.value;
                return data;
            case this.fields.LASTLOGINAT:
                data.metadata.lastLoginAt = change.value;
                return data;
            case this.fields.DISPLAYNAME:
                data.personalData.displayName = change.value;
                return data;
            case this.fields.EMAIL:
                data.personalData.email = change.value;
                return data;
            case this.fields.PHONENUMBER:
                data.personalData.phoneNumber = change.value;
                return data;
            case this.fields.PROFILEPICTUREURL:
                data.personalData.profilePictureUrl = change.value;
                return data;
            case this.fields.SETTINGS:
                data.settings = change.value;
                return data;
            case this.fields.BADGES:
            case this.fields.BOOKMARKS:
            case this.fields.FRIENDS:
            case this.fields.GROUPS:
            case this.fields.TRANSACTIONS:
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
            if (!this.fetched || !this.data) {
                await super.fetchData();
            }
            switch(field) {
                case this.fields.LOCATION:
                    resolve(this.data.metadata.location);
                    break;
                case this.fields.CREATEDAT:
                    resolve(this.data.metadata.createdAt);
                    break;
                case this.fields.EMAILVERIFIED:
                    resolve(this.data.metadata.emailVerified);
                    break;
                case this.fields.LASTLOGINAT:
                    resolve(this.data.metadata.lastLoginAt);
                    break;
                case this.fields.DISPLAYNAME:
                    resolve(this.data.personalData.displayName);
                    break;
                case this.fields.EMAIL:
                    resolve(this.data.personalData.email);
                    break;
                case this.fields.PHONENUMBER:
                    resolve(this.data.personalData.phoneNumber);
                    break;
                case this.fields.PROFILEPICTUREURL:
                    if (this.data.personalData.profilePictureUrl) {
                        resolve(this.data.personalData.profilePictureUrl);
                        break;
                    } else {
                        resolve("https://robohash.org/" + this.documentId);
                        break;
                    }
                case this.fields.SETTINGS:
                    resolve(this.data.settings);
                    break;
                case this.fields.BADGES:
                    resolve(this.data.badges);
                    break;
                case this.fields.BOOKMARKS:
                    resolve(this.data.bookmarks);
                    break;
                case this.fields.FRIENDS:
                    resolve(this.data.friends);
                    break;
                case this.fields.GROUPS:
                    resolve(this.data.groups);
                    break;
                case this.fields.TRANSACTIONS:
                    resolve(this.data.transactions);
                    break;
                case this.fields.RELATIONS:
                    let relationArray = [];
                    for (const jsonRelation of this.data.relations) {
                        const rel = new TransactionRelation(jsonRelation.from.id, jsonRelation.to.id, jsonRelation.amount, jsonRelation.id, jsonRelation.from, jsonRelation.to, jsonRelation.transaction);
                        relationArray.push(rel)
                    }
                    resolve(relationArray);
                    break;
                default:
                    super.logInvalidGetField(field);
                    resolve(null);
                    break;
            }
        })
    }

    // ================= Get Operations ================= //
    async getBadges() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.BADGES).then((val) => {
                resolve(val);
            })
        })
    }

    async getBookmarks() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.BOOKMARKS).then((val) => {
                resolve(val);
            })
        })
    }

    async getFriends() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.FRIENDS).then((val) => {
                resolve(val);
            })
        })
    }

    async getGroups() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.GROUPS).then((val) => {
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

    async getLocation() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.LOCATION).then((val) => {
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

    async getEmailVerified() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.EMAILVERIFIED).then((val) => {
                resolve(val);
            })
        })
    }

    async getLastLoginAt() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.LASTLOGINAT).then((val) => {
                resolve(val);
            })
        })
    }

    async getDisplayName() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.DISPLAYNAME).then((val) => {
                resolve(val);
            })
        })
    }

    async getEmail() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.EMAIL).then((val) => {
                resolve(val);
            })
        })
    }

    async getPhoneNumber() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.PHONENUMBER).then((val) => {
                resolve(val);
            })
        })
    }

    async getPhotoUrl() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.PROFILEPICTUREURL).then((val) => {
                resolve(val);
            })
        })
    }

    async getSettings() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.SETTINGS).then((val) => {
                resolve(val);
            })
        })
    }

    async getRelations() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.RELATIONS).then((val) => {
                resolve(val);
            })
        })
    }

    async getRelation(relationId) {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.RELATIONS).then((val) => {
                for (const r of val) {
                    if (r.id === relationId) {
                        resolve(r);
                    }
                }
            })
        })
    }

    async getSimplifiedRelations() {
        return new Promise(async (resolve, reject) => {
            this.handleGet(this.fields.RELATIONS).then((val) => {
                // get all positive and negative relations
                let positiveRelations = [];
                let negativeRelations = [];
                for (const relation of val) {
                    if (relation.to.id === SessionManager.getUserId()) {
                        positiveRelations.push(relation);
                    } else {
                        negativeRelations.push(relation);
                    }
                }
                let finalRelations = new Map();
                // Combine relations!
                for (const positiveRelation of positiveRelations) {
                    if (finalRelations.has(positiveRelation.from.id)) {
                        // We have a relation with this person already
                        let existingRelation = finalRelations.get(positiveRelation.from.id);
                        const newRelation = new TransactionRelation(existingRelation.from.id, existingRelation.to.id, existingRelation.amount + positiveRelation.amount, null, existingRelation.from, existingRelation.to, existingRelation.transaction);
                        finalRelations.set(positiveRelation.from.id, newRelation);
                    } else {
                        // We haven't seen this person already
                        const newRelation = new TransactionRelation(positiveRelation.from.id, positiveRelation.to.id, positiveRelation.amount, null, positiveRelation.from, positiveRelation.to, positiveRelation.transaction);
                        finalRelations.set(positiveRelation.from.id, newRelation);
                    }
                }
                for (const negativeRelation of negativeRelations) {
                    if (finalRelations.has(negativeRelation.to.id)) {
                        // We have a relation with this person already
                        let existingRelation = finalRelations.get(negativeRelation.to.id);
                        const newRelation = new TransactionRelation(existingRelation.from.id, existingRelation.to.id, existingRelation.amount - negativeRelation.amount, null, existingRelation.from, existingRelation.to, existingRelation.transaction);
                        finalRelations.set(negativeRelation.to.id, newRelation);
                    } else {
                        // We haven't seen this person already
                        const newRelation = new TransactionRelation(negativeRelation.from.id, negativeRelation.to.id, negativeRelation.amount, null, negativeRelation.from, negativeRelation.to, negativeRelation.transaction);
                        finalRelations.set(negativeRelation.to.id, newRelation);
                    }
                }
                let finalRelationArray = [];
                for (const key of finalRelations) {
                    let relation = key[1];
                    if (relation.amount !== 0) {
                        if (relation.amount < 0) {
                            // If amount is negative, make a new TransactionRelation with to and from users swapped and amount inverse
                            finalRelationArray.push(new TransactionRelation(relation.to.id, relation.from.id, relation.amount * -1, null, relation.to, relation.from, relation.transaction));
                        } else {
                            finalRelationArray.push(relation);
                        }
                    }
                }
                resolve(finalRelationArray);
            })
        })
    }

    // ================= Set Operations ================= //
    setLocation(newLocation) {
        const locationChange = new Set(this.fields.LOCATION, newLocation);
        super.addChange(locationChange);
    }
    
    setCreatedAt(newCreatedAt) {
        const createdAtChange = new Set(this.fields.CREATEDAT, newCreatedAt);
        super.addChange(createdAtChange);
    }
    
    setEmailVerified(newEmailVerified) {
        const emailVerifiedChange = new Set(this.fields.EMAILVERIFIED, newEmailVerified);
        super.addChange(emailVerifiedChange);
    }
    
    setLastLoginAt(newLastLoginAt) {
        const loginAtChange = new Set(this.fields.LASTLOGINAT, newLastLoginAt);
        super.addChange(loginAtChange);
    }

    setDisplayName(newDisplayName) {
        const displayNameChange = new Set(this.fields.DISPLAYNAME, newDisplayName);
        super.addChange(displayNameChange);
    }
    
    setEmail(newEmail) {
        const emailChange = new Set(this.fields.EMAIL, newEmail);
        super.addChange(emailChange);
    }

    setPhoneNumber(newPhoneNumber) {
        const phoneNumberChange = new Set(this.fields.PHONENUMBER, newPhoneNumber);
        super.addChange(phoneNumberChange);
    }
    
    setPhotoUrl(newProfilePictureUrl) {
        const photoUrlChange = new Set(this.fields.PROFILEPICTUREURL, newProfilePictureUrl);
        super.addChange(photoUrlChange);
    }
    
    setSettings(newSettings) {
        const settingsChange = new Set(this.fields.SETTINGS, newSettings);
        super.addChange(settingsChange);
    }

    // ================= Add Operations ================= //
    addBadge(badgeId) {
        const badgeAddition = new Add(this.fields.BADGES, badgeId);
        super.addChange(badgeAddition);
    }

    addBookmark(bookmarkId) {
        const bookmarkAddition = new Add(this.fields.BOOKMARKS, bookmarkId);
        super.addChange(bookmarkAddition);
    }
    
    addFriend(friendId) {
        const friendAddition = new Add(this.fields.FRIENDS, friendId);
        super.addChange(friendAddition);
    }
    
    addGroup(groupId) {
        const groupAddition = new Add(this.fields.GROUPS, groupId);
        super.addChange(groupAddition);
    }

    addTransaction(transactionId) {
        const transactionAddition = new Add(this.fields.TRANSACTIONS, transactionId);
        super.addChange(transactionAddition);
    }

    addRelation(relation) {
        const relationAddition = new Add(this.fields.RELATIONS, relation);
        super.addChange(relationAddition);
    }

    async addRelationsFromTransaction(transactionManager) {
        // We're going to assume that this transactionManager has data loaded into it already
        const transactionRelations = await transactionManager.getRelations();
        const transactionTitle = await transactionManager.getTitle();
        const transactionId = await transactionManager.getDocumentId();
        const transactionAmount = await transactionManager.getTotal();
        for (const relation of transactionRelations) {
            if (relation.to.id === this.getDocumentId() || relation.from.id === this.getDocumentId()) {
                // This user is involved in this relation
                // Set relation details to include transaction
                relation.setTransactionTitle(transactionTitle);
                relation.setTransactionId(transactionId);
                relation.setTransactionAmount(transactionAmount);
                this.addRelation(relation);
            }
        }    
    }

    // ================= Remove Operations ================= //
    removeBadge(badgeId) {
        const badgeRemoval = new Remove(this.fields.BADGES, badgeId);
        super.addChange(badgeRemoval);
    }

    removeBookmark(bookmarkId) {
        const bookmarkRemoval = new Remove(this.fields.BOOKMARKS, bookmarkId);
        super.addChange(bookmarkRemoval);
    }
    
    removeFriend(friendId) {
        const friendRemoval = new Remove(this.fields.FRIENDS, friendId);
        super.addChange(friendRemoval);
    }
    
    removeGroup(groupId) {
        const groupRemoval = new Remove(this.fields.GROUPS, groupId);
        super.addChange(groupRemoval);
    }

    removeTransaction(transactionId) {
        const transactionRemoval = new Remove(this.fields.TRANSACTIONS, transactionId);
        super.addChange(transactionRemoval);
    }

    removeRelation(relation) {
        const relationRemoval = new Remove(this.fields.RELATIONS, relation.id);
        super.addChange(relationRemoval);
    }

    removeRelationsByTransaction(transactionId) {
        // We're assuming data is fetched on this object
        for (const relation of this.data.relations) {
            if (relation.transaction.id === transactionId) {
                const relationRemoval = new Remove(this.fields.RELATIONS, relation.id);
                super.addChange(relationRemoval);
            }
        }
    }

    // ================= Misc. Methods ================= //
    /**
     * Get a user's initials by displayName
     * @returns User's initials
     */
    async getInitials() {
        return new Promise(async (resolve, reject) => {
            const fullName = await this.getDisplayName()
            if (fullName) {
                resolve(fullName.charAt(0))
            } else {
                resolve("?");
            }
        })
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