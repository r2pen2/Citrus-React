import { doc, collection, addDoc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { Debugger, controllerObjects } from "../../debugger";

import { changeTypes, dbObjectTypes } from "../dbManager";

/**
 * ObjectManager is an abstract class used to standardize higher-level oprations of database objects
 * @todo This should probably be turned into a typescript file in the future, but that would be a lot of work.
 */
export class ObjectManager {

    constructor(_objectType, _documentId, _data) {
        this.objectType = _objectType;
        this.documentId = _documentId;
        this.data = null;
        this.docRef = doc(firestore, this.getCollection(), _documentId);
        this.error = false;
        this.fetched = false;
        this.changes = [];
        this.debugger = this.getDebugger();
    }

    getDebugger() {
        switch (this.objectType) {
            case dbObjectTypes.BOOKMARK:
                return new Debugger(controllerObjects.OBJECTMANAGERBOOKMARK);
            case dbObjectTypes.GROUP:
                return new Debugger(controllerObjects.OBJECTMANAGERGROUP);
            case dbObjectTypes.TRANSACTIONATTEMPT:
                return new Debugger(controllerObjects.OBJECTMANAGERTRANSACTIONATTEMPT);
            case dbObjectTypes.TRANSACTION:
                return new Debugger(controllerObjects.OBJECTMANAGERTRANSACTION);
            case dbObjectTypes.INVITATION:
                // Invitations have different collections depending on their type
                return new Debugger(controllerObjects.OBJECTMANAGERINVITATION);
            case dbObjectTypes.USER:
                return new Debugger(controllerObjects.OBJECTMANAGERUSER);
            case dbObjectTypes.BADGE:
                return new Debugger(controllerObjects.OBJECTMANAGERBADGE);
            default:
                return null;
        }
    }

    addChange(change) {
        this.changed = true;
        this.changes.push(change);
    }

    async applyChanges() {
        return new Promise(async (resolve, reject) => {
            if (!this.fetched) {
                this.debugger.logWithPrefix("Fetching data to apply changes...");
                await this.fetchData();
                this.debugger.logWithPrefix("Fetch complete!");
            }
            if (this.data) {
                for (const change of this.changes) {
                    this.debugger.logWithPrefix("Making change: " + change.toString());
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
                            this.debugger.logWithPrefix("Invalid change type when trying to apply changes!");
                            break;
                    }
                }
                resolve(true);
            } else {
                this.debugger.logWithPrefix("Applying changes failed because data was null!");
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
            case dbObjectTypes.GROUP:
                return "groups";
            case dbObjectTypes.TRANSACTIONATTEMPT:
                return "transactionAttempts";
            case dbObjectTypes.TRANSACTION:
                return "transactions";
            case dbObjectTypes.INVITATION:
                // Invitations have different collections depending on their type
                return this.data.inviteType.getCollection();
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
        this.debugger.logWithPrefix(this.data);
    }

    logChangeFail(change) {
        this.debugger.logWithPrefix(change.toString + ' failed to apply because field does not accept this kind of change!');
    }

    logInvalidChangeField(change) {
        this.debugger.logWithPrefix(change.toString + ' failed to apply because the field was not recognized!');
    }

    logInvalidGetField(field) {
        this.debugger.logWithPrefix('"' + field + '" is not a valid field!');
    }

    async documentExists() {
        return new Promise(async (resolve, reject) => {
            const docSnap = await getDoc(this.docRef);
            if (docSnap.exists()) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    /**
    * Fetch data from database by document reference
    * @returns {Object} data from document snapshot
    */
    async fetchData() {
        this.debugger.logWithPrefix("Fetching object data...");
        return new Promise(async (resolve) => {
            const docSnap = await getDoc(this.docRef);
            if (docSnap.exists()) {
                this.data = docSnap.data();
                this.fetched = true;
                resolve(docSnap.data());
            } else {
                this.debugger.logWithPrefix("Document snapshot didn't exist! Setting empty data...");
                this.data = this.getEmptyData();
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
                    this.debugger.logWithPrefix("No document with this ID exists on DB.");
                    if (fetchAttempts > maxAttempts) {
                        resolve(null);
                    } else {
                        this.debugger.logWithPrefix("Didn't find data on attempt " + (fetchAttempts + 1));
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
                this.debugger.logWithPrefix("We need to fetch data first... Fetching!");
                return this.fetchData();
            } else {
                this.debugger.logWithPrefix("getData() returned null AFTER fetching!");
            }
        }
    }

    /**
     * Push changes on this object to the DB
     * @returns whether or not push was successful
     */
    async push() {
        if (!this.error) {
            // Assuming everything was OK, we push
            return new Promise(async (resolve) => {
                if (this.changed) {
                    if (this.documentId) {
                        // Document has an ID. Set data and return true
                        this.debugger.logWithPrefix('Applying changes to: ' + this.toString());
                        await this.applyChanges();                    
                        this.debugger.logWithPrefix('Pushing changes to: ' + this.toString());
                        await setDoc(this.docRef, this.data);
                    } else {
                        await this.applyChanges();
                        const newDoc = await addDoc(collection(firestore, this.getCollection), this.data);
                        this.documentId = newDoc.id;
                        this.docRef = newDoc;
                        this.debugger.logWithPrefix('Created new object of type"' + this.objectType + '" with id "' + this.documentId + '"');
                    }
                } else {
                    this.debugger.logWithPrefix("No changes were made to: " + this.toString());
                }
                resolve(true);
            })
        } else {
            // Don't push if there was an error
            this.debugger.logWithPrefix("Error detected in objectManager: " + this.toString());
            this.debugger.logWithPrefix("Changes will not be pushed!");
        }
    }

    // Print no data error and return param;
    logNoDataError(retval) {
        this.debugger.logWithPrefix("Error! Failed to return data to subclass.");
        this.error = true;
        return retval;
    }

    equals(objectManager) {
        const matchingTypes = objectManager.getObjectType() === this.getObjectType();
        const matchingIds = objectManager.getObjectId() === this.getObjectId();
        return matchingTypes && matchingIds;
    }
}