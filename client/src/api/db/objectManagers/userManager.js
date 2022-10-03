import { dbObjectTypes, Add, Remove, Set } from "../dbManager";
import { ObjectManager } from "./objectManager";
import { Debugger } from "../../debugger";

export class UserManager extends ObjectManager {
    
    constructor(_id) {
        super(dbObjectTypes.USER, _id);
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
                phoneNumber: null,          // --- {PhoneNumber} User's phone number
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
            if (!this.fetched || !this.data) {
                Debugger.log("Need to fetch data before GET");
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