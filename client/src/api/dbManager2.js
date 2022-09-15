import { doc, collection, addDoc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { Debugger } from "./debugger";

const dbObjectTypes = {
    BOOKMARK: "bookmark",
    GROUPINVITATION: "groupInvitation",
    GROUP: "group",
    TRANSACTIONATTEMPT: "transactionAttempt",
    TRANSACTION: "transaction",
    USERINVITATION: "userInvatation",
    USER: "user",
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
    constructor(_objectType, _documentId) {
        this.objectType = _objectType;
        this.documentId = _documentId;
        this.data = null;
        this.docRef = doc(firestore, this.getCollection(), _documentId);
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

    /**
    * Fetch data from database by document reference
    * @returns {Object} data from document snapshot
    */
    async fetchData() {
        return new Promise(async (resolve) => {
            const docSnap = await getDoc(this.docRef);
            if (docSnap.exists()) {
                this.data = docSnap.data();
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
                    resolve(docSnap.data());
                } else {
                    dbDebugger.log("No document with this ID exists on DB.");
                    if (fetchAttempts > maxAttempts) {
                        resolve(null);
                    } else {
                        dbDebugger.log("Didn't find data on attempt " + (fetchAttempts + 1));
                        setTimeout(() => {
                            return fetch(fetchAttempts + 1);
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
            dbDebugger.log("getData() returned null! Did you remember to fetchData() first?");
            return this.data;
        }
    }

    // Set document data
    setData(newData) {
        this.data = newData;
    }

    // Send document data to database
    async pushToDatabase() {
        return new Promise(async (resolve) => {
            dbDebugger.log('Pushing changes to: ' + this.toString());
            if (this.documentId) {
                // Document has an ID. Set data and return true
                await setDoc(this.docRef, this.data);
            } else {
                const newDoc = await addDoc(collection(firestore, this.getCollection), this.data);
                this.documentId = newDoc.id;
                this.docRef = newDoc;
                dbDebugger.log('Created new object of type"' + this.objectType + '" with id "' + this.documentId + '"');
            }
            resolve(true);
        })
    }

    // Print no data error and return param;
    logNoDataError(retval) {
        dbDebugger.log("Error! ObjectManager<" + this.objectType + "> failed to return data to child class.");
        return retval;
    }
}

export class BookmarkManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.BOOKMARK, _id);
    }
}

export class GroupInvitationManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.GROUPINVITATION, _id);
    }
}

export class GroupManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.GROUP, _id);
    }
}

export class TransactionAttemptManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.TRANSACTIONATTEMPT, _id);
    }
}

export class TransactionManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.TRANSACTION, _id);
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
                        await userManager.pushToDatabase();
                    }
                }
                // Add transaction to each fronter
                for (const fronter of transactionData.fronters) {
                    const userManager = new UserManager(fronter);
                    let userData = await userManager.fetchData();
                    if (userData) {                    
                        userManager.addTransaction(this.documentId);
                        await userManager.pushToDatabase();
                    }
                }
                await super.pushToDatabase();
                resolve(true);
            });
        } else {
            return super.logNoDataError(false);
        }
    }

    /**
     * Set transaction to active
     * @returns {Boolean} whether or not this operation was successful
     */
    async activate() {
        return new Promise(async (resolve) => {
            let transactionData = super.getData();
            if (transactionData) {
                transactionData.active = true;
                super.setData(transactionData);
                await super.pushToDatabase();
                resolve(true);
            } else {
                resolve(super.logNoDataError(false));
            }
        })
    }

    /**
     * Set transaction to inactive
     * @returns {Boolean} whether or not this operation was successful
     */
    async deactivate() {
        return new Promise(async (resolve) => {
            let transactionData = super.getData();
            if (transactionData) {
                transactionData.active = false;
                super.setData(transactionData);
                await super.pushToDatabase();
                resolve(true);
            } else {
                resolve(super.logNoDataError(false));
            }
        })
    }
}

export class UserInvatationManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.USERINVITATION, _id);
    }
}

export class UserManager extends ObjectManager {
    constructor(_id) {
        super(dbObjectTypes.USER, _id);
    }

    /**
    * Get current user's display name
    * @returns {String} user display name or null
    */
    getDisplayName() {
        let userData = super.getData();
        if (userData) {
            if (userData.personalData.displayName) {            
                return userData.personalData.displayName;
            } else {
                console.log("Error: User had no display name?");
                return null;
            }
        } else {
            super.fetchDataAndRetry(6, 500).then((result) => {
                if (result) {
                    // Result is the data from docSnap
                    if (result.personalData.displayName) {
                        return result.personalData.displayName;
                    } else {
                        console.log("Error: User had no display name?");
                        return null;
                    }
                } else {
                    return super.logNoDataError(false);
                }
            });
        }
    }

    /**
    * Set user's display name
    * @param {String} newDisplayName display name to set on user object
    * @returns {Boolean} true if successful, false otherwise
    */
    async setDisplayName(newDisplayName) {
        return new Promise(async (resolve) => {
            let userData = super.getData();
            if (userData) {
                userData.personalData.displayName = newDisplayName;
                super.setData(userData);
                await super.pushToDatabase();
                resolve(true);
            } else {
                resolve(super.logNoDataError(false));
            }
        })
    }

    /**
    * Get a user's phone number
    * @returns {String} user phone number
    */
    getPhoneNumber() {
        let userData = super.getData();
        if (userData) {
            if (userData.personalData.phoneNumber) {            
                return userData.personalData.phoneNumber;
            } else {
                console.log("Error: User had no phone number?");
                return null;
            }
        }
    }
    
    /**
    * Set user's phone number
    * @param {String} newPhoneNumber phone number to set on user object
    * @returns {Boolean} true if successful, false otherwise
    */
    async setPhoneNumber(newPhoneNumber) {
        return new Promise(async (resolve) => {
            let userData = super.getData();
            if (userData) {
                userData.personalData.phoneNumber = newPhoneNumber;
                super.setData(userData);
                await super.pushToDatabase();
                resolve(true);
            } else {
                resolve(super.logNoDataError(false));
            }
        })
    }

    /**
    * Get current user's photo url
    * @returns {String} user photo url
    */
    getPhotoUrl() {
        let userData = super.getData();
        if (userData) {
            if (userData.personalData.profilePictureUrl) {            
                return userData.personalData.profilePictureUrl;
            } else {
                return "https://robohash.org/" + super.getDocumentId();
            }
        } else {
            super.fetchDataAndRetry(6, 500).then((result) => {
                if (result) {
                    // Result is the data from docSnap
                    if (result.personalData.profilePictureUrl) {
                        return result.personalData.profilePictureUrl;
                    } else {
                        return "https://robohash.org/" + super.getDocumentId();
                    }
                } else {
                    return super.logNoDataError(null);
                }
            });
        }
    }

    /**
    * Adds a transaction to a user's active transaction array
    * @param {String} transactionId id of transaction to add
    * @returns {Boolean} true if successful, false otherwise
    */
    async addTransaction(transactionId) {
        return new Promise(async (resolve) => {
            let userData = super.getData();
            if (userData) {
                if (!userData.transactions.active.includes(transactionId)) {            
                    userData.transactions.active.push(transactionId);
                    super.setData(userData);
                    await super.pushToDatabase();
                    resolve(true)
                } else {
                    resolve(false);
                }
            } else {
                resolve(super.logNoDataError(false));
            }
        });
    }

    /**
     * Removes transaction from inactive and moves it into active
     * @param {String} transactionId id of transaction to activate
     * @returns {Boolean} true if successful, false otherwise
     */
    async activateTransaction(transactionId) {
        return new Promise(async (resolve) => {
            let userData = super.getData();
            if (userData) {
                const remainingArr = userData.transactions.inactive.filter(t => t !== transactionId);
                if (remainingArr.length < userData.transactions.inactive) {
                    userData.transactions.inactive = remainingArr;
                    userData.transactions.active.push(transactionId);
                    super.setData(userData);
                    await super.pushToDatabase();
                    dbDebugger.log("Activated a transaction on user: " + this.documentId);
                    resolve(true);
                }
            } else {
                resolve(super.logNoDataError(false));
            }
        })
    }

    /**
     * Removes transaction from activated and moves it into inactive
     * @param {String} transactionId id of transaction to deactivate
     * @returns {Boolean} true if successful, false otherwise
     */
    async deactivateTransaction(transactionId) {
        return new Promise(async (resolve) => {
            let userData = super.getData();
            if (userData) {
                const remainingArr = userData.transactions.active.filter(t => t !== transactionId);
                if (remainingArr.length < userData.transactions.active) {
                    userData.transactions.active = remainingArr;
                    userData.transactions.inactive.push(transactionId);
                    super.setData(userData);
                    await super.pushToDatabase();
                    dbDebugger.log("Deactivated a transaction on user: " + this.documentId);
                    resolve(true);
                }
            } else {
                resolve(super.logNoDataError(false));
            }
        })
    }
}