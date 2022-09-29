import { doc, collection, addDoc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { Debugger } from "../debugger";
import { Add, Remove, Set, changeTypes } from "./changes";
import { emojiIds, Emoji, UserPhoneNumber, UserEmail, inviteMethods, InviteMethod } from "./subObjects";

const dbObjectTypes = {
    BOOKMARK: "bookmark",
    GROUPINVITATION: "groupInvitation",
    GROUP: "group",
    TRANSACTIONATTEMPT: "transactionAttempt",
    TRANSACTION: "transaction",
    USERINVITATION: "userInvatation",
    USER: "user",
    BADGE: "badge",
};

const dbDebugger = new Debugger();

/**
* Generates a random id string of a given length
* @param {Number} length length of id to be created 
* @returns {String} generated id
*/
function generateId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

export class ObjectManager {
    constructor(_objectType, _documentId, _data) {
        this.objectType = _objectType;
        this.documentId = _documentId;
        this.data = null;
        this.docRef = doc(firestore, this.getCollection(), _documentId);
        this.children = [];
        this.error = false;
        this.fetched = false;
        this.changes = [];
    }

    addChange(change) {
        this.changed = true;
        this.changes.push(change);
    }

    async applyChanges() {
        return new Promise(async (resolve, reject) => {
            if (!this.fetched) {
                dbDebugger.log("Fetching data to apply changes...");
                await this.fetchData();
                dbDebugger.log("Fetch complete!");
            }
            if (this.data) {
                this.data = this.formatData();
                for (const change of this.changes) {
                    switch(change.type) {
                        case changeTypes.ADD:
                            this.data = this.handleAdd(change, this.data);
                            break;
                        case changeTypes.REMOVE:
                            this.data = this.handleRemove(change, this.data);
                            break;
                        case changeTypes.SET:
                            this.data = this.handleSet(change, this.data);
                            break;
                        default:
                            dbDebugger.log("Invalid change type when trying to apply changes!");
                            break;
                    }
                }
                resolve(true);
            } else {
                dbDebugger.log("Applying changes failed because data was null!");
                resolve(false);
            }
        })
    }

    /**
     * Get firestore collection for current object type
     * @returns {String} firestore collection for object type
     */
    getCollection() {
        switch(this.objectType) {
            case dbObjectTypes.BOOKMARK:
                return "bookmarks";
            case dbObjectTypes.GROUPINVITATION:
                return "groupInvitations";
            case dbObjectTypes.GROUP:
                return "groups";
            case dbObjectTypes.TRANSACTIONATTEMPT:
                return "transactionAttempts";
            case dbObjectTypes.TRANSACTION:
                return "transactions";
            case dbObjectTypes.USERINVITATION:
                return "userInvatations";
            case dbObjectTypes.USER:
                return "users";
            case dbObjectTypes.BADGE:
                return "badges";
            default:
                return null;
        }
    }

    /**
     * Get this ObjectManager's document id
     * @returns {String} id of this ObjectManager's firestore document
     */
    getDocumentId() {
        return this.documentId;
    }

    /**
     * Get this ObjectManager's type
     * @returns {String} object type
     */
    getObjectType() {
        return this.objectType;
    }

    /**
     * Get a string representation of this ObjectManager
     * @returns {String} string representation of the object
     */
    toString() {
        return 'Object manager of type "' + this.objectType + '" with id "' + this.documentId + '"';
    }
    
    /**
     * Log the objectManager's data
     */
    logData() {
        console.log(this.data);
    }

    logChangeFail(change) {
        dbDebugger.log(change.toString + ' failed to apply on object "' + this.objectType + '" because field does not accept this kind of change!');
    }

    logInvalidChangeField(change) {
        dbDebugger.log(change.toString + ' failed to apply on object "' + this.objectType + '" because the field was not recognized!');
    }

    logInvalidGetField(field) {
        dbDebugger.log('"' + field + '" is not a valid field on object "' + this.objectType + '"!');
    }

    getChildren() {
        return this.children;
    }

    /**
    * Fetch data from database by document reference
    * @returns {Object} data from document snapshot
    */
    async fetchData() {
        return new Promise(async (resolve) => {
            const docSnap = await getDoc(this.docRef);
            if (docSnap.exists()) {
                this.data = docSnap.data();
                this.fetched = true;
                resolve(docSnap.data());
            } else {
                dbDebugger.log("Error: Document snapshot didn't exist!");
                this.data = null;
                resolve(false);
            }
        })
    }

    /**
     * Fetch data several times until either timeout or document exists
     * @param {Number} maxAttempts number of times to try fetching data
     * @param {Number} delay delay in milliseconds between attempts
     */
    async fetchDataAndRetry(maxAttempts, delay) {
        async function fetchRecursive(fetchAttempts) {
            return new Promise(async (resolve) => {
                const docSnap = await getDoc(this.docRef);
                if (docSnap.exists()) {
                    this.data = docSnap.data();
                    this.fetched = true;
                    resolve(docSnap.data());
                } else {
                    dbDebugger.log("No document with this ID exists on DB.");
                    if (fetchAttempts > maxAttempts) {
                        resolve(null);
                    } else {
                        dbDebugger.log("Didn't find data on attempt " + (fetchAttempts + 1));
                        setTimeout(() => {
                            resolve(fetchRecursive(fetchAttempts + 1));
                        }, delay);
                    }
                }
            })
        }
        fetchRecursive(0).then((result) => {
            return result;
        });
    }

    /**
     * Get data from ObjectManager.
     * @returns {Object} data
     */
    getData() {
        if (this.data) {
            return this.data;
        } else {
            if (!this.fetched) {
                dbDebugger.log("We need to fetch data first... Fetching!");
                return this.fetchData();
            } else {
                dbDebugger.log("getData() returned null AFTER fetching!");
            }
        }
    }

    // Set document data
    setData(newData) {
        this.data = newData;
    }

    // Send only the top (this) to database
    async pushSingle() {
        if (!this.error) {
            // Assuming everything was OK, we push
            return new Promise(async (resolve) => {
                if (this.changed) {
                    if (this.documentId) {
                        // Document has an ID. Set data and return true
                        dbDebugger.log('Applying changes to: ' + this.toString());
                        await this.applyChanges();                    
                        dbDebugger.log('Pushing changes to: ' + this.toString());
                        await setDoc(this.docRef, this.data);
                    } else {
                        await this.applyChanges();
                        const newDoc = await addDoc(collection(firestore, this.getCollection), this.data);
                        this.documentId = newDoc.id;
                        this.docRef = newDoc;
                        dbDebugger.log('Created new object of type"' + this.objectType + '" with id "' + this.documentId + '"');
                    }
                } else {
                    dbDebugger.log("No changes were made to: " + this.toString());
                }
                resolve(true);
            })
        } else {
            // Don't push if there was an error
            dbDebugger.log("Error detected in objectManager: " + this.toString());
            dbDebugger.log("Changes will not be pushed!");
        }
    }

    // Send this, children, and children of children to the database
    async push() {
        return new Promise(async (resolve) => {
            let selfPushed = await this.pushSingle();
            if (selfPushed) {
                for (const childManager of this.children) {
                    await childManager.push();
                }
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    // Print no data error and return param;
    logNoDataError(retval) {
        dbDebugger.log("Error! ObjectManager<" + this.objectType + "> failed to return data to child class.");
        this.error = true;
        return retval;
    }

    equals(objectManager) {
        const matchingTypes = objectManager.getObjectType() === this.getObjectType();
        const matchingIds = objectManager.getObjectId() === this.getObjectId();
        return matchingTypes && matchingIds;
    }

    addChild(objectManager) {
        this.children.push(objectManager);
    }

    removeChild(objectManager) {
        const newChildren = this.children.filter(child => !child.equals(objectManager));
        this.children = newChildren;
    }
}


export class BadgeManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.BADGE, _id);
    }

    setEmptyData() {

        const empty = {
            title: null,            // {string} Badge title 
            description: null,      // {string} Badge description 
            emoji: null,            // {string <- emojiId} Emoji representation of badge 
        }
        super.setData(empty);
    }

    handleAdd() {
        
    }
}

export class BookmarkManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.BOOKMARK, _id);
    }

    setEmptyData() {

        // Template for a bookmark user -- Will be implemented soon
        const bookmarkUser = {
            userId: null,           // {string} ID of user involved in bookmark 
            initialBalance: null,   // {number} Initial balance of user (ex. +100, -100) 
        }

        const empty = {
            barterEmoji: null,      // {string <- emojiId} Emoji representation of transaction 
            createdAt: null,        // {date} Timestamp of bookmark creation 
            createdBy: null,        // {string} ID of user that created this bookmark
            title: null,            // {string} title of bookmark
            total: null,            // {number} total value of bookmark (all debts added together)
            users: [],              // {array <- bookmarkUser} All users referenced in this bookmark
        }
        super.setData(empty);
    }

    handleAdd() {
        
    }
}

export class GroupInvitationManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.GROUPINVITATION, _id);
    }

    setEmptyData() {

        const empty = {
            inviteMethod: null,     // {object <- inviteMethod} Which invite method was used
            invitedAt: null,        // {date} When this invitation was created
            inviteeAttrs: {         // {map} Attributes associated with invitee
                location: null,     // --- {geoPoint} Location of the invitee when they accept the invitation
            },
            inviterAttrs: {         // {map} Attributes associated with the inviter
                location: null,     // --- {geoPoint} Location of the inviter when they create the invitation
            },
        }
        super.setData(empty);
    }

    handleAdd() {
        
    }
}

export class GroupManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.GROUP, _id);
    }

    setEmptyData() {

        const empty = {
            createdAt: null,    // {date} When the group was created
            createdBy: null,    // {string} ID of user that created the group
            name: null,         // {string} Name of the group
            transactions: [],   // {array <- string} IDs of every transaction associated with this group
            users: [],          // {array <- string} IDs of every user in this group
        }
        super.setData(empty);
    }

    handleAdd() {
        
    }
}

export class TransactionAttemptManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.TRANSACTIONATTEMPT, _id);
    }

    setEmptyData() {

        const empty = {
            createdAt: null,        // {date} When this transaction attempt was created
            creatorAttrs: {         // {map} Attributes associated with the creator
                location: null,     // --- {geoPoint} Location of the creator
            },
            isBookmark: null,       // {boolean} Whether or not the attempt turned into a bookmark
            isIndividual: null,     // {boolean} Whether or not it was an indivitual transaction (or a group transaction)
            isStandard: null,       // {boolean} Whether or not the attempt was through standard pathway or shortcut
            isTransaction: null,    // {boolean} Whether or not this attempt turned into a full transaction
            usedSuggestion: null,   // {boolean} Whether or not they used a suggested group/individual (null if cancelled before this stage)
        }
        super.setData(empty);
    }

    handleAdd() {
        
    }
}

export class TransactionManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.TRANSACTION, _id);
    }

    setEmptyData() {

        // Template for a transaction user -- Will be implemented soon
        const transactionUser = {
            userId: null,           // {string} ID of user
            initialBalance: null,   // {number} Balance of user upon transaction creation
            currentBalalce: null,   // {number} Current balance of user in this transaction
        }

        const empty = {
            active: null,           // {boolean} Whether or not this transaction is still active
            barterEmoji: null,      // {string <- emojiId} Emoji representation of transaction 
            createdAt: null,        // {date} Timestamp of transaction creation 
            createdBy: null,        // {string} ID of user that created this transaction
            fromBookmark: null,     // {boolean} Whether or not this transaction was created from a bookmark
            title: null,            // {string} title of transaction
            total: null,            // {number} total value of transaction (all debts added together)
            users: [],              // {array <- transactionUser} All users referenced in this transaction
        }
        super.setData(empty);
    }

    handleAdd() {
        
    }

    /**
     * Add a transaction to all user's active lists
     * @returns {Boolean} whether or not this operation was successful
     */
    async addToAllUsers() {
        let transactionData = super.getData();
        if (transactionData) {
            return new Promise(async (resolve) => {
                // Add transaction to each payer
                for (const payer of transactionData.payers) {
                        const userManager = new UserManager(payer);
                        let userData = await userManager.fetchData();
                        if (userData) {                    
                            userManager.addTransaction(this.documentId);
                            super.addChild(userManager);
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                }
                // Add transaction to each fronter
                for (const fronter of transactionData.fronters) {
                    const userManager = new UserManager(fronter);
                    let userData = await userManager.fetchData();
                    if (userData) {                    
                        userManager.addTransaction(this.documentId);
                        super.addChild(userManager);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
                resolve(true);
            });
        } else {
            return super.logNoDataError(false);
        }
    }
    
    /**
     * Add this transaction to a user by ID
     * @param {String} userId userId of person to add transaction on
     * @returns True if success, false otherwise
     */
    async addToUser(userId) {
        let transactionData = super.getData();
        if (transactionData) {
            return new Promise(async (resolve) => {
                const userManager = new UserManager(userId);
                let userData = await userManager.fetchData();
                if (userData) {
                    userManager.addTransaction(this.documentId);
                    super.addChild(userManager);
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        }
    }

    /**
     * Set transaction to active
     * @returns {Boolean} whether or not this operation was successful
     */
    activate() {
        let transactionData = super.getData();
        if (transactionData) {
            transactionData.active = true;
            super.setData(transactionData);
            return true;
        } else {
            return super.logNoDataError(false);
        }
    }

    /**
     * Set transaction to inactive
     * @returns {Boolean} whether or not this operation was successful
     */
    deactivate() {
        let transactionData = super.getData();
        if (transactionData) {
            transactionData.active = false;
            super.setData(transactionData);
            return true;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Get active status
    getActive() {
        let transactionData = super.getData();
        if (transactionData) {
            return transactionData.active;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Set createdAt dateTime
    setCreatedAt(date) {
        let transactionData = super.getData();
        if (transactionData) {
            transactionData.createdAt = date;
            super.setData(transactionData);
            return true;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Get createdAt
    getCreatedAt() {
        let transactionData = super.getData();
        if (transactionData) {
            return transactionData.createdAt;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Set barterEmoji string
    setBarterEmoji(barterEmoji) {
        let transactionData = super.getData();
        if (transactionData) {
            transactionData.barterEmoji = barterEmoji;
            super.setData(transactionData);
            return true;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Get barterEmoji
    getBarterEmoji() {
        let transactionData = super.getData();
        if (transactionData) {
            return transactionData.barterEmoji;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Set createdBy string
    setCreatedBy(creator) {
        let transactionData = super.getData();
        if (transactionData) {
            transactionData.createdBy = creator;
            super.setData(transactionData);
            return true;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Get total
    getCreatedBy() {
        let transactionData = super.getData();
        if (transactionData) {
            return transactionData.createdBy;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Set fromBookmark boolean
    setFromBookmark(boolean) {
        let transactionData = super.getData();
        if (transactionData) {
            transactionData.fromBookmark = boolean;
            super.setData(transactionData);
            return true;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Get fromBookmark
    getFromBookmark() {
        let transactionData = super.getData();
        if (transactionData) {
            return transactionData.fromBookmark;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Set title string
    setTitle(title) {
        let transactionData = super.getData();
        if (transactionData) {
            transactionData.title = title;
            super.setData(transactionData);
            return true;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Get total
    getTitle() {
        let transactionData = super.getData();
        if (transactionData) {
            return transactionData.title;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Set total number
    setTotal(total) {
        let transactionData = super.getData();
        if (transactionData) {
            transactionData.total = total;
            super.setData(transactionData);
            return true;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Get total
    getTotal() {
        let transactionData = super.getData();
        if (transactionData) {
            return transactionData.total;
        } else {
            return super.logNoDataError(false);
        }
    }

    // add a fronter
    addFronter(fronterId, fronterWeight) {
        let transactionData = super.getData();
        if (transactionData) {
            transactionData.fronters.push({userId: fronterId, weight: fronterWeight});
            super.setData(transactionData);
            return true;
        } else {
            return super.logNoDataError(false);
        }
    }

    // get all fronters
    getFronters() {
        let transactionData = super.getData();
        if (transactionData) {
            return transactionData.fronters;
        } else {
            return super.logNoDataError(false);
        }
    }

    // add a fronter
    addPayer(payerId, payerWeight) {
        let transactionData = super.getData();
        if (transactionData) {
            transactionData.payers.push({userId: payerId, weight: payerWeight});
            super.setData(transactionData);
            return true;
        } else {
            return super.logNoDataError(false);
        }
    }

    // get all payers
    getPayers() {
        let transactionData = super.getData();
        if (transactionData) {
            return transactionData.payers;
        } else {
            return super.logNoDataError(false);
        }
    }

    // Validate that fronter weights add up to 1
    fronterWeightsValid() {
        let totalWeight = 0;
        let transactionData = super.getData();
        for (const fronter of transactionData.fronters) {
            totalWeight += fronter.weight;
        }
        return totalWeight === 1;
    }

    // Validate that payer weights add up to 1
    payerWeightsValid() {
        let totalWeight = 0;
        let transactionData = super.getData();
        for (const payer of transactionData.payers) {
            totalWeight += payer.weight;
        }
        return totalWeight === 1;
    }
}

export class UserInvatationManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.USERINVITATION, _id);
    }

    fields = {
        INVITEMETHOD: "inviteMethod",
        INVITEDAT: "invitedAt",
        INVITEELOCATION: "inviteeLocation",
        INVITERLOCATION: "inviterLocation",
    }

    setEmptyData() {
        const empty = {
            inviteMethod: null,     // {object <- inviteMethod} Which invite method was used
            invitedAt: null,        // {date} When this user invitation was created
            inviteeAttrs: {         // {map} Attributes associated with invitee
                location: null,     // --- {geoPoint} Location of the invitee when they accept the invitation
            },
            inviterAttrs: {         // {map} Attributes associated with inviter
                location: null,     // --- {geoPoint} Location of the inviter when they create the invitation
            },
        }
        super.setData(empty);
    }

    handleAdd(change, data) {
        switch (change.field) {
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
}

export class UserManager extends ObjectManager {
    
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
    }
    
    constructor(_id) {
        super(dbObjectTypes.USER, _id);
    }

    setEmptyData() {

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
                phoneNumber: null,          // --- {object <- phoneNumber} User's phone number
                profilePictureUrl: null,    // --- {string} URL of user's prophile photo
            },
            settings: {                     // {map} User's current settings
                darkMode: null,             // --- {boolean} Whether the user is in darkMode or not
                language: null,             // --- {string <- languageId} User's language choice
            },
        }
        super.setData(empty);
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
                data.transactions = data.transactions.filter(transaction => transaction !== change.value);
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
}