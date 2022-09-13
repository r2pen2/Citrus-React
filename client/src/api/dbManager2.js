import { doc, collection, addDoc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "./firebase";

const dbObjectTypes = {
    BOOKMARK: "bookmark",
    GROUPINVITATION: "groupInvitation",
    GROUP: "group",
    TRANSACTIONATTEMPT: "transactionAttempt",
    TRANSACTION: "transaction",
    USERINVITATION: "userInvatation",
    USER: "user",
};

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

    getDocumentId() {
        return this.documentId;
    }

    getObjectType() {
        return this.objectType;
    }

    toString() {
        return 'Object manager of type "' + this.objectType + '" with id "' + this.objectId + '"';
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
                console.log("Error: Document snapshot didn't exist!");
                this.data = null;
                resolve(null);
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
                    console.log("No document with this ID exists on DB.");
                    if (fetchAttempts > maxAttempts) {
                        resolve(null);
                    } else {
                        console.log("Didn't find data on attempt " + (fetchAttempts + 1));
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
            console.log("getData() returned null! Did you remember to fetchData() first?");
            return this.data;
        }
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
    * @returns {String} user display name
    */
    async getDisplayName() {
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
                    console.log("getDisplayName() gave up after too many fetch attempts.");
                }
            });
        }
    }
}